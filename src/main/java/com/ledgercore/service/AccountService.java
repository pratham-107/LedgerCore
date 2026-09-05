package com.ledgercore.service;

import com.ledgercore.dto.account.AccountBalanceResponse;
import com.ledgercore.dto.account.AccountResponse;
import com.ledgercore.dto.account.CreateAccountRequest;
import com.ledgercore.dto.account.UpdateAccountRequest;
import com.ledgercore.dto.common.PagedResponse;
import com.ledgercore.exception.AccountNotFoundException;
import com.ledgercore.model.Account;
import com.ledgercore.model.AccountType;
import com.ledgercore.model.LedgerEntry;
import com.ledgercore.repository.AccountRepository;
import com.ledgercore.repository.LedgerEntryRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.Instant;
import java.time.Year;
import java.util.Optional;

@Slf4j
@Service
@RequiredArgsConstructor
public class AccountService {

    private final AccountRepository accountRepository;
    private final LedgerEntryRepository ledgerEntryRepository;

    @Transactional
    public AccountResponse createAccount(CreateAccountRequest request) {
        String accountNumber = generateAccountNumber();

        BigDecimal initialBalance = request.getOpeningBalance() != null ? request.getOpeningBalance() : BigDecimal.ZERO;

        Account account = Account.builder()
                .accountNumber(accountNumber)
                .name(request.getName().trim())
                .type(request.getType())
                .category(request.getCategory())
                .currency(request.getCurrency().toUpperCase().trim())
                .balance(initialBalance)
                .isActive(true)
                .build();

        Account saved = accountRepository.save(account);
        log.info("Created account [{}] - {}", saved.getAccountNumber(), saved.getName());
        return mapToResponse(saved);
    }

    public AccountResponse getAccount(String identifier) {
        Account account = findAccountByIdentifier(identifier);
        return mapToResponse(account);
    }

    public PagedResponse<AccountResponse> listAccounts(int page, int size, AccountType type, Boolean active) {
        Pageable pageable = PageRequest.of(page, size, Sort.by(Sort.Direction.ASC, "accountNumber"));
        boolean isActive = active != null ? active : true;

        Page<Account> accountPage;
        if (type != null) {
            accountPage = accountRepository.findByTypeAndIsActive(type, isActive, pageable);
        } else {
            accountPage = accountRepository.findByIsActive(isActive, pageable);
        }

        return PagedResponse.of(accountPage.map(this::mapToResponse));
    }

    public AccountBalanceResponse getAccountBalance(String identifier) {
        Account account = findAccountByIdentifier(identifier);
        long count = ledgerEntryRepository.countByAccountId(account.getId());
        Optional<LedgerEntry> lastEntry = ledgerEntryRepository.findFirstByAccountIdOrderByCreatedAtDesc(account.getId());
        Instant lastDate = lastEntry.map(LedgerEntry::getCreatedAt).orElse(account.getUpdatedAt() != null ? account.getUpdatedAt() : account.getCreatedAt());

        return AccountBalanceResponse.builder()
                .accountId(account.getId())
                .currentBalance(account.getBalance())
                .currency(account.getCurrency())
                .lastTransactionDate(lastDate)
                .transactionCount(count)
                .build();
    }

    @Transactional
    public AccountResponse updateAccount(String identifier, UpdateAccountRequest request) {
        Account account = findAccountByIdentifier(identifier);

        if (request.getName() != null && !request.getName().isBlank()) {
            account.setName(request.getName().trim());
        }
        if (request.getCategory() != null) {
            account.setCategory(request.getCategory());
        }
        if (request.getIsActive() != null) {
            account.setActive(request.getIsActive());
        }

        Account updated = accountRepository.save(account);
        log.info("Updated account [{}]", updated.getAccountNumber());
        return mapToResponse(updated);
    }

    public Account findAccountByIdentifier(String identifier) {
        return accountRepository.findById(identifier)
                .or(() -> accountRepository.findByAccountNumber(identifier))
                .orElseThrow(() -> new AccountNotFoundException(identifier));
    }

    private synchronized String generateAccountNumber() {
        int year = Year.now().getValue();
        String prefix = "ACC-" + year + "-";
        long count = accountRepository.countByAccountNumberStartingWith(prefix) + 1;
        String candidate = String.format("%s%03d", prefix, count);
        while (accountRepository.existsByAccountNumber(candidate)) {
            count++;
            candidate = String.format("%s%03d", prefix, count);
        }
        return candidate;
    }

    public AccountResponse mapToResponse(Account account) {
        return AccountResponse.builder()
                .accountId(account.getId())
                .accountNumber(account.getAccountNumber())
                .name(account.getName())
                .type(account.getType())
                .category(account.getCategory())
                .currency(account.getCurrency())
                .balance(account.getBalance())
                .isActive(account.isActive())
                .createdAt(account.getCreatedAt())
                .updatedAt(account.getUpdatedAt())
                .build();
    }
}
