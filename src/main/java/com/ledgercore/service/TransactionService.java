package com.ledgercore.service;

import com.ledgercore.dto.transaction.*;
import com.ledgercore.exception.ApiException;
import com.ledgercore.exception.InvalidTransactionException;
import com.ledgercore.model.*;
import com.ledgercore.repository.AccountRepository;
import com.ledgercore.repository.LedgerEntryRepository;
import com.ledgercore.repository.TransactionRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.Instant;
import java.util.*;

@Slf4j
@Service
@RequiredArgsConstructor
public class TransactionService {

    private final TransactionRepository transactionRepository;
    private final LedgerEntryRepository ledgerEntryRepository;
    private final AccountRepository accountRepository;
    private final AccountService accountService;

    @Transactional
    public TransactionResponse createTransaction(CreateTransactionRequest request) {
        // 1. Validate minimum entries
        if (request.getEntries() == null || request.getEntries().size() < 2) {
            throw new InvalidTransactionException("A transaction must contain at least 2 entries (debit and credit)");
        }

        // 2. Validate zero-sum (Sum of debits must equal sum of credits)
        BigDecimal totalDebits = BigDecimal.ZERO;
        BigDecimal totalCredits = BigDecimal.ZERO;

        for (EntryRequest entry : request.getEntries()) {
            if (entry.getAmount() == null || entry.getAmount().compareTo(BigDecimal.ZERO) <= 0) {
                throw new InvalidTransactionException("Entry amount must be strictly greater than 0");
            }
            if (entry.getType() == EntryType.DEBIT) {
                totalDebits = totalDebits.add(entry.getAmount());
            } else if (entry.getType() == EntryType.CREDIT) {
                totalCredits = totalCredits.add(entry.getAmount());
            }
        }

        totalDebits = totalDebits.setScale(2, RoundingMode.HALF_UP);
        totalCredits = totalCredits.setScale(2, RoundingMode.HALF_UP);

        if (totalDebits.compareTo(totalCredits) != 0) {
            Map<String, Object> details = new HashMap<>();
            details.put("debitTotal", totalDebits);
            details.put("creditTotal", totalCredits);
            throw new InvalidTransactionException(
                    String.format("Sum of debits (%s) does not equal sum of credits (%s)", totalDebits, totalCredits),
                    details
            );
        }

        String txnCurrency = request.getCurrency().toUpperCase().trim();
        String currentUserId = getCurrentUserId();
        String transactionId = "TXN-" + UUID.randomUUID();

        // 3. Pre-fetch and validate accounts
        Map<String, Account> accountMap = new HashMap<>();
        for (EntryRequest entry : request.getEntries()) {
            Account account = accountService.findAccountByIdentifier(entry.getAccountId());
            if (!account.isActive()) {
                throw new InvalidTransactionException("Account is inactive: " + account.getAccountNumber());
            }
            if (!account.getCurrency().equalsIgnoreCase(txnCurrency)) {
                throw new InvalidTransactionException(
                        String.format("Account %s currency (%s) does not match transaction currency (%s)",
                                account.getAccountNumber(), account.getCurrency(), txnCurrency)
                );
            }
            accountMap.put(entry.getAccountId(), account);
        }

        // 4. Update balances and create ledger entries
        List<LedgerEntry> ledgerEntries = new ArrayList<>();
        List<EntryResponse> entryResponses = new ArrayList<>();
        int entryIndex = 1;

        for (EntryRequest entryReq : request.getEntries()) {
            Account account = accountMap.get(entryReq.getAccountId());
            BigDecimal amount = entryReq.getAmount().setScale(2, RoundingMode.HALF_UP);

            BigDecimal newBalance = calculateNewBalance(account.getBalance(), account.getType(), entryReq.getType(), amount);
            account.setBalance(newBalance);
            accountRepository.save(account);

            String entryId = String.format("ENT-%03d-%s", entryIndex++, UUID.randomUUID().toString().substring(0, 8));

            LedgerEntry ledgerEntry = LedgerEntry.builder()
                    .entryId(entryId)
                    .transactionId(transactionId)
                    .accountId(account.getId())
                    .entryType(entryReq.getType())
                    .amount(amount)
                    .currency(txnCurrency)
                    .runningBalance(newBalance)
                    .createdAt(Instant.now())
                    .build();

            LedgerEntry savedEntry = ledgerEntryRepository.save(ledgerEntry);
            ledgerEntries.add(savedEntry);

            entryResponses.add(EntryResponse.builder()
                    .entryId(savedEntry.getEntryId())
                    .accountId(account.getId())
                    .accountNumber(account.getAccountNumber())
                    .accountName(account.getName())
                    .type(savedEntry.getEntryType())
                    .amount(savedEntry.getAmount())
                    .runningBalance(savedEntry.getRunningBalance())
                    .build());
        }

        // 5. Create Transaction entity
        Transaction transaction = Transaction.builder()
                .transactionId(transactionId)
                .description(request.getDescription().trim())
                .currency(txnCurrency)
                .exchangeRate(request.getExchangeRate() != null ? request.getExchangeRate() : BigDecimal.ONE)
                .totalAmount(totalDebits)
                .status(TransactionStatus.POSTED)
                .reference(request.getReference())
                .createdBy(currentUserId)
                .createdAt(Instant.now())
                .build();

        Transaction savedTxn = transactionRepository.save(transaction);
        log.info("Posted transaction [{}] with total amount {} {}", transactionId, totalDebits, txnCurrency);

        return TransactionResponse.builder()
                .transactionId(savedTxn.getTransactionId())
                .description(savedTxn.getDescription())
                .totalAmount(savedTxn.getTotalAmount())
                .currency(savedTxn.getCurrency())
                .exchangeRate(savedTxn.getExchangeRate())
                .status(savedTxn.getStatus())
                .reference(savedTxn.getReference())
                .entries(entryResponses)
                .createdBy(savedTxn.getCreatedBy())
                .createdAt(savedTxn.getCreatedAt())
                .build();
    }

    public TransactionResponse getTransaction(String transactionId) {
        Transaction transaction = transactionRepository.findByTransactionId(transactionId)
                .orElseThrow(() -> new ApiException("Transaction not found: " + transactionId, HttpStatus.NOT_FOUND, "TRANSACTION_NOT_FOUND"));

        List<LedgerEntry> entries = ledgerEntryRepository.findByTransactionIdOrderByCreatedAtAsc(transactionId);
        List<EntryResponse> entryResponses = mapEntries(entries);

        return mapToResponse(transaction, entryResponses);
    }

    public Page<TransactionResponse> listTransactions(int page, int size, TransactionStatus status) {
        Pageable pageable = PageRequest.of(page, size, Sort.by(Sort.Direction.DESC, "createdAt"));
        Page<Transaction> txnPage;

        if (status != null) {
            txnPage = transactionRepository.findByStatus(status, pageable);
        } else {
            txnPage = transactionRepository.findAll(pageable);
        }

        return txnPage.map(txn -> {
            List<LedgerEntry> entries = ledgerEntryRepository.findByTransactionIdOrderByCreatedAtAsc(txn.getTransactionId());
            return mapToResponse(txn, mapEntries(entries));
        });
    }

    @Transactional
    public ReversalResponse reverseTransaction(String transactionId) {
        Transaction original = transactionRepository.findByTransactionId(transactionId)
                .orElseThrow(() -> new ApiException("Transaction not found: " + transactionId, HttpStatus.NOT_FOUND, "TRANSACTION_NOT_FOUND"));

        if (original.getStatus() == TransactionStatus.REVERSED) {
            throw new InvalidTransactionException("Transaction is already reversed: " + transactionId);
        }

        List<LedgerEntry> originalEntries = ledgerEntryRepository.findByTransactionIdOrderByCreatedAtAsc(transactionId);
        if (originalEntries.isEmpty()) {
            throw new ApiException("No ledger entries found for transaction: " + transactionId, HttpStatus.INTERNAL_SERVER_ERROR, "INTERNAL_ERROR");
        }

        String reversalTxnId = "TXN-rev-" + UUID.randomUUID().toString().substring(0, 8);
        String currentUserId = getCurrentUserId();
        Instant now = Instant.now();

        // Create inverse entries
        for (LedgerEntry origEntry : originalEntries) {
            Account account = accountRepository.findById(origEntry.getAccountId())
                    .orElseThrow(() -> new ApiException("Account not found: " + origEntry.getAccountId(), HttpStatus.NOT_FOUND, "ACCOUNT_NOT_FOUND"));

            EntryType inverseType = origEntry.getEntryType() == EntryType.DEBIT ? EntryType.CREDIT : EntryType.DEBIT;
            BigDecimal newBalance = calculateNewBalance(account.getBalance(), account.getType(), inverseType, origEntry.getAmount());
            account.setBalance(newBalance);
            accountRepository.save(account);

            LedgerEntry reversalEntry = LedgerEntry.builder()
                    .entryId("ENT-rev-" + UUID.randomUUID().toString().substring(0, 8))
                    .transactionId(reversalTxnId)
                    .accountId(account.getId())
                    .entryType(inverseType)
                    .amount(origEntry.getAmount())
                    .currency(origEntry.getCurrency())
                    .runningBalance(newBalance)
                    .createdAt(now)
                    .build();

            ledgerEntryRepository.save(reversalEntry);
        }

        // Create reversal transaction record
        Transaction reversalTxn = Transaction.builder()
                .transactionId(reversalTxnId)
                .description("Reversal of " + original.getTransactionId() + ": " + original.getDescription())
                .currency(original.getCurrency())
                .exchangeRate(original.getExchangeRate())
                .totalAmount(original.getTotalAmount())
                .status(TransactionStatus.POSTED)
                .reference("REV-" + original.getTransactionId())
                .createdBy(currentUserId)
                .createdAt(now)
                .build();

        transactionRepository.save(reversalTxn);

        // Update original transaction
        original.setStatus(TransactionStatus.REVERSED);
        original.setReversedBy(currentUserId);
        original.setReversalTransactionId(reversalTxnId);
        original.setReversedAt(now);
        transactionRepository.save(original);

        log.info("Reversed transaction [{}] with reversal transaction [{}]", transactionId, reversalTxnId);

        return ReversalResponse.builder()
                .originalTransactionId(original.getTransactionId())
                .reversalTransactionId(reversalTxnId)
                .status(TransactionStatus.REVERSED)
                .reversedAt(now)
                .build();
    }

    private BigDecimal calculateNewBalance(BigDecimal currentBalance, AccountType type, EntryType entryType, BigDecimal amount) {
        BigDecimal balance = currentBalance != null ? currentBalance : BigDecimal.ZERO;
        if (type.isNormalDebit()) {
            // ASSET / EXPENSE: debit adds, credit subtracts
            return entryType == EntryType.DEBIT ? balance.add(amount) : balance.subtract(amount);
        } else {
            // LIABILITY / EQUITY / REVENUE: credit adds, debit subtracts
            return entryType == EntryType.CREDIT ? balance.add(amount) : balance.subtract(amount);
        }
    }

    private List<EntryResponse> mapEntries(List<LedgerEntry> entries) {
        List<EntryResponse> list = new ArrayList<>();
        for (LedgerEntry e : entries) {
            Account acc = accountRepository.findById(e.getAccountId()).orElse(null);
            list.add(EntryResponse.builder()
                    .entryId(e.getEntryId())
                    .accountId(e.getAccountId())
                    .accountNumber(acc != null ? acc.getAccountNumber() : null)
                    .accountName(acc != null ? acc.getName() : null)
                    .type(e.getEntryType())
                    .amount(e.getAmount())
                    .runningBalance(e.getRunningBalance())
                    .build());
        }
        return list;
    }

    private TransactionResponse mapToResponse(Transaction txn, List<EntryResponse> entries) {
        return TransactionResponse.builder()
                .transactionId(txn.getTransactionId())
                .description(txn.getDescription())
                .totalAmount(txn.getTotalAmount())
                .currency(txn.getCurrency())
                .exchangeRate(txn.getExchangeRate())
                .status(txn.getStatus())
                .reference(txn.getReference())
                .entries(entries)
                .createdBy(txn.getCreatedBy())
                .createdAt(txn.getCreatedAt())
                .reversedBy(txn.getReversedBy())
                .reversalTransactionId(txn.getReversalTransactionId())
                .reversedAt(txn.getReversedAt())
                .build();
    }

    private String getCurrentUserId() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        if (auth != null && auth.getName() != null) {
            return auth.getName();
        }
        return "system";
    }
}
