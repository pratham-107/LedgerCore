package com.ledgercore.service;

import com.ledgercore.dto.account.AccountBalanceResponse;
import com.ledgercore.dto.account.AccountResponse;
import com.ledgercore.dto.account.CreateAccountRequest;
import com.ledgercore.dto.account.UpdateAccountRequest;
import com.ledgercore.dto.common.PagedResponse;
import com.ledgercore.exception.AccountNotFoundException;
import com.ledgercore.model.Account;
import com.ledgercore.model.AccountCategory;
import com.ledgercore.model.AccountType;
import com.ledgercore.model.LedgerEntry;
import com.ledgercore.repository.AccountRepository;
import com.ledgercore.repository.LedgerEntryRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;

import java.math.BigDecimal;
import java.time.Instant;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class AccountServiceTest {

    @Mock
    private AccountRepository accountRepository;

    @Mock
    private LedgerEntryRepository ledgerEntryRepository;

    @InjectMocks
    private AccountService accountService;

    private Account sampleAccount;

    @BeforeEach
    void setUp() {
        sampleAccount = Account.builder()
                .id("acc-123")
                .accountNumber("ACC-2024-001")
                .name("Cash Account")
                .type(AccountType.ASSET)
                .category(AccountCategory.CURRENT_ASSET)
                .currency("USD")
                .balance(new BigDecimal("1000.00"))
                .isActive(true)
                .createdAt(Instant.now())
                .build();
    }

    @Test
    void createAccount_GeneratesAccountNumberAndSaves() {
        CreateAccountRequest request = CreateAccountRequest.builder()
                .name("Cash Account")
                .type(AccountType.ASSET)
                .category(AccountCategory.CURRENT_ASSET)
                .currency("USD")
                .openingBalance(new BigDecimal("1000.00"))
                .build();

        when(accountRepository.countByAccountNumberStartingWith(anyString())).thenReturn(0L);
        when(accountRepository.existsByAccountNumber(anyString())).thenReturn(false);
        when(accountRepository.save(any(Account.class))).thenAnswer(i -> {
            Account acc = i.getArgument(0);
            acc.setId("acc-123");
            return acc;
        });

        AccountResponse response = accountService.createAccount(request);

        assertNotNull(response);
        assertEquals("Cash Account", response.getName());
        assertEquals(AccountType.ASSET, response.getType());
        assertEquals(new BigDecimal("1000.00"), response.getBalance());
        assertTrue(response.getAccountNumber().startsWith("ACC-"));
    }

    @Test
    void getAccount_ById_Success() {
        when(accountRepository.findById("acc-123")).thenReturn(Optional.of(sampleAccount));

        AccountResponse response = accountService.getAccount("acc-123");

        assertNotNull(response);
        assertEquals("acc-123", response.getAccountId());
        assertEquals("ACC-2024-001", response.getAccountNumber());
    }

    @Test
    void getAccount_NotFound_ThrowsException() {
        when(accountRepository.findById("acc-999")).thenReturn(Optional.empty());
        when(accountRepository.findByAccountNumber("acc-999")).thenReturn(Optional.empty());

        assertThrows(AccountNotFoundException.class, () -> accountService.getAccount("acc-999"));
    }

    @Test
    void getAccountBalance_ReturnsBalanceAndCount() {
        when(accountRepository.findById("acc-123")).thenReturn(Optional.of(sampleAccount));
        when(ledgerEntryRepository.countByAccountId("acc-123")).thenReturn(5L);
        when(ledgerEntryRepository.findFirstByAccountIdOrderByCreatedAtDesc("acc-123"))
                .thenReturn(Optional.of(LedgerEntry.builder().createdAt(Instant.now()).build()));

        AccountBalanceResponse response = accountService.getAccountBalance("acc-123");

        assertNotNull(response);
        assertEquals("acc-123", response.getAccountId());
        assertEquals(new BigDecimal("1000.00"), response.getCurrentBalance());
        assertEquals(5L, response.getTransactionCount());
    }

    @Test
    void listAccounts_ReturnsPagedResponse() {
        when(accountRepository.findByIsActive(eq(true), any(Pageable.class)))
                .thenReturn(new PageImpl<>(List.of(sampleAccount)));

        PagedResponse<AccountResponse> response = accountService.listAccounts(0, 10, null, true);

        assertNotNull(response);
        assertEquals(1, response.getContent().size());
        assertEquals("ACC-2024-001", response.getContent().get(0).getAccountNumber());
    }

    @Test
    void updateAccount_UpdatesFields() {
        when(accountRepository.findById("acc-123")).thenReturn(Optional.of(sampleAccount));
        when(accountRepository.save(any(Account.class))).thenReturn(sampleAccount);

        UpdateAccountRequest request = UpdateAccountRequest.builder()
                .name("Updated Cash Account")
                .isActive(false)
                .build();

        AccountResponse response = accountService.updateAccount("acc-123", request);

        assertNotNull(response);
        verify(accountRepository).save(sampleAccount);
        assertEquals("Updated Cash Account", sampleAccount.getName());
        assertFalse(sampleAccount.isActive());
    }
}
