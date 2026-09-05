package com.ledgercore.service;

import com.ledgercore.dto.transaction.CreateTransactionRequest;
import com.ledgercore.dto.transaction.EntryRequest;
import com.ledgercore.dto.transaction.ReversalResponse;
import com.ledgercore.dto.transaction.TransactionResponse;
import com.ledgercore.exception.InvalidTransactionException;
import com.ledgercore.model.*;
import com.ledgercore.repository.AccountRepository;
import com.ledgercore.repository.LedgerEntryRepository;
import com.ledgercore.repository.TransactionRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.math.BigDecimal;
import java.time.Instant;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class TransactionServiceTest {

    @Mock
    private TransactionRepository transactionRepository;

    @Mock
    private LedgerEntryRepository ledgerEntryRepository;

    @Mock
    private AccountRepository accountRepository;

    @Mock
    private AccountService accountService;

    @InjectMocks
    private TransactionService transactionService;

    private Account cashAccount;
    private Account expenseAccount;

    @BeforeEach
    void setUp() {
        cashAccount = Account.builder()
                .id("acc-cash")
                .accountNumber("ACC-2024-001")
                .name("Cash")
                .type(AccountType.ASSET)
                .category(AccountCategory.CURRENT_ASSET)
                .currency("USD")
                .balance(new BigDecimal("1000.00"))
                .isActive(true)
                .build();

        expenseAccount = Account.builder()
                .id("acc-expense")
                .accountNumber("ACC-2024-006")
                .name("Office Supplies")
                .type(AccountType.EXPENSE)
                .category(AccountCategory.OFFICE_SUPPLIES)
                .currency("USD")
                .balance(new BigDecimal("0.00"))
                .isActive(true)
                .build();
    }

    @Test
    void createTransaction_ValidDoubleEntry_Success() {
        CreateTransactionRequest request = CreateTransactionRequest.builder()
                .description("Office Supplies Purchase")
                .currency("USD")
                .reference("INV-001")
                .entries(List.of(
                        EntryRequest.builder()
                                .accountId("acc-expense")
                                .type(EntryType.DEBIT)
                                .amount(new BigDecimal("150.00"))
                                .build(),
                        EntryRequest.builder()
                                .accountId("acc-cash")
                                .type(EntryType.CREDIT)
                                .amount(new BigDecimal("150.00"))
                                .build()
                ))
                .build();

        when(accountService.findAccountByIdentifier("acc-expense")).thenReturn(expenseAccount);
        when(accountService.findAccountByIdentifier("acc-cash")).thenReturn(cashAccount);
        when(ledgerEntryRepository.save(any(LedgerEntry.class))).thenAnswer(i -> i.getArgument(0));
        when(transactionRepository.save(any(Transaction.class))).thenAnswer(i -> {
            Transaction txn = i.getArgument(0);
            txn.setId("txn-doc-1");
            return txn;
        });

        TransactionResponse response = transactionService.createTransaction(request);

        assertNotNull(response);
        assertEquals("Office Supplies Purchase", response.getDescription());
        assertEquals(new BigDecimal("150.00"), response.getTotalAmount());
        assertEquals("USD", response.getCurrency());
        assertEquals(TransactionStatus.POSTED, response.getStatus());
        assertEquals(2, response.getEntries().size());

        // Cash (Asset): Credit decreases balance (1000.00 - 150.00 = 850.00)
        assertEquals(new BigDecimal("850.00"), cashAccount.getBalance());
        // Expense (Expense): Debit increases balance (0.00 + 150.00 = 150.00)
        assertEquals(new BigDecimal("150.00"), expenseAccount.getBalance());
    }

    @Test
    void createTransaction_DebitCreditMismatch_ThrowsException() {
        CreateTransactionRequest request = CreateTransactionRequest.builder()
                .description("Invalid Transaction")
                .currency("USD")
                .entries(List.of(
                        EntryRequest.builder()
                                .accountId("acc-expense")
                                .type(EntryType.DEBIT)
                                .amount(new BigDecimal("150.00"))
                                .build(),
                        EntryRequest.builder()
                                .accountId("acc-cash")
                                .type(EntryType.CREDIT)
                                .amount(new BigDecimal("100.00"))
                                .build()
                ))
                .build();

        assertThrows(InvalidTransactionException.class, () -> transactionService.createTransaction(request));
    }

    @Test
    void createTransaction_LessThanTwoEntries_ThrowsException() {
        CreateTransactionRequest request = CreateTransactionRequest.builder()
                .description("Single entry")
                .currency("USD")
                .entries(List.of(
                        EntryRequest.builder()
                                .accountId("acc-expense")
                                .type(EntryType.DEBIT)
                                .amount(new BigDecimal("150.00"))
                                .build()
                ))
                .build();

        assertThrows(InvalidTransactionException.class, () -> transactionService.createTransaction(request));
    }

    @Test
    void createTransaction_InactiveAccount_ThrowsException() {
        cashAccount.setActive(false);
        CreateTransactionRequest request = CreateTransactionRequest.builder()
                .description("Inactive test")
                .currency("USD")
                .entries(List.of(
                        EntryRequest.builder().accountId("acc-expense").type(EntryType.DEBIT).amount(new BigDecimal("50.00")).build(),
                        EntryRequest.builder().accountId("acc-cash").type(EntryType.CREDIT).amount(new BigDecimal("50.00")).build()
                ))
                .build();

        when(accountService.findAccountByIdentifier("acc-expense")).thenReturn(expenseAccount);
        when(accountService.findAccountByIdentifier("acc-cash")).thenReturn(cashAccount);

        assertThrows(InvalidTransactionException.class, () -> transactionService.createTransaction(request));
    }

    @Test
    void createTransaction_CurrencyMismatch_ThrowsException() {
        cashAccount.setCurrency("EUR");
        CreateTransactionRequest request = CreateTransactionRequest.builder()
                .description("Currency mismatch")
                .currency("USD")
                .entries(List.of(
                        EntryRequest.builder().accountId("acc-expense").type(EntryType.DEBIT).amount(new BigDecimal("50.00")).build(),
                        EntryRequest.builder().accountId("acc-cash").type(EntryType.CREDIT).amount(new BigDecimal("50.00")).build()
                ))
                .build();

        when(accountService.findAccountByIdentifier("acc-expense")).thenReturn(expenseAccount);
        when(accountService.findAccountByIdentifier("acc-cash")).thenReturn(cashAccount);

        assertThrows(InvalidTransactionException.class, () -> transactionService.createTransaction(request));
    }

    @Test
    void reverseTransaction_Success() {
        String txnId = "TXN-123";
        Transaction originalTxn = Transaction.builder()
                .transactionId(txnId)
                .description("Original Rent")
                .currency("USD")
                .totalAmount(new BigDecimal("500.00"))
                .status(TransactionStatus.POSTED)
                .build();

        LedgerEntry entry1 = LedgerEntry.builder()
                .entryId("ENT-1")
                .transactionId(txnId)
                .accountId("acc-expense")
                .entryType(EntryType.DEBIT)
                .amount(new BigDecimal("500.00"))
                .currency("USD")
                .build();

        LedgerEntry entry2 = LedgerEntry.builder()
                .entryId("ENT-2")
                .transactionId(txnId)
                .accountId("acc-cash")
                .entryType(EntryType.CREDIT)
                .amount(new BigDecimal("500.00"))
                .currency("USD")
                .build();

        when(transactionRepository.findByTransactionId(txnId)).thenReturn(Optional.of(originalTxn));
        when(ledgerEntryRepository.findByTransactionIdOrderByCreatedAtAsc(txnId)).thenReturn(List.of(entry1, entry2));
        when(accountRepository.findById("acc-expense")).thenReturn(Optional.of(expenseAccount));
        when(accountRepository.findById("acc-cash")).thenReturn(Optional.of(cashAccount));

        ReversalResponse response = transactionService.reverseTransaction(txnId);

        assertNotNull(response);
        assertEquals(txnId, response.getOriginalTransactionId());
        assertEquals(TransactionStatus.REVERSED, response.getStatus());
        assertTrue(response.getReversalTransactionId().startsWith("TXN-rev-"));
        assertEquals(TransactionStatus.REVERSED, originalTxn.getStatus());
    }
}
