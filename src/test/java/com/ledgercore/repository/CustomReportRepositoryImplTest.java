package com.ledgercore.repository;

import com.ledgercore.dto.report.BalanceSheetResponse;
import com.ledgercore.model.Account;
import com.ledgercore.model.AccountCategory;
import com.ledgercore.model.AccountType;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.data.mongodb.core.MongoTemplate;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class CustomReportRepositoryImplTest {

    @Mock
    private AccountRepository accountRepository;

    @Mock
    private MongoTemplate mongoTemplate;

    @InjectMocks
    private CustomReportRepositoryImpl reportRepository;

    private Account asset;
    private Account liability;
    private Account equity;
    private Account revenue;
    private Account expense;

    @BeforeEach
    void setUp() {
        asset = Account.builder()
                .accountNumber("ACC-ASSET")
                .name("Cash")
                .type(AccountType.ASSET)
                .category(AccountCategory.CURRENT_ASSET)
                .balance(new BigDecimal("77691.01"))
                .build();
        liability = Account.builder()
                .accountNumber("ACC-LIAB")
                .name("Accounts Payable")
                .type(AccountType.LIABILITY)
                .category(AccountCategory.CURRENT_LIABILITY)
                .balance(new BigDecimal("20000"))
                .build();
        equity = Account.builder()
                .accountNumber("ACC-EQ")
                .name("Common Stock")
                .type(AccountType.EQUITY)
                .category(AccountCategory.EQUITY)
                .balance(new BigDecimal("55000"))
                .build();
        revenue = Account.builder()
                .accountNumber("ACC-REV")
                .name("Sales Revenue")
                .type(AccountType.REVENUE)
                .category(AccountCategory.PRODUCT_SALES)
                .balance(new BigDecimal("5000"))
                .build();
        expense = Account.builder()
                .accountNumber("ACC-EXP")
                .name("Office Supplies")
                .type(AccountType.EXPENSE)
                .category(AccountCategory.OFFICE_SUPPLIES)
                .balance(new BigDecimal("2308.99"))
                .build();
    }

    @Test
    void generateBalanceSheet_includesNetIncomeInEquityAndBalances() {
        when(accountRepository.findAll()).thenReturn(List.of(asset, liability, equity, revenue, expense));

        BalanceSheetResponse result = reportRepository.generateBalanceSheet(LocalDate.of(2026, 9, 5));

        assertEquals(new BigDecimal("77691.01"), result.getAssets().getTotal());
        assertEquals(new BigDecimal("20000.00"), result.getLiabilities().getTotal());
        assertEquals(new BigDecimal("57691.01"), result.getEquity());
        assertTrue(result.isBalanced());
    }

    @Test
    void generateBalanceSheet_marksUnbalancedWhenAssetHasNoOffset() {
        Account extraAsset = Account.builder()
                .accountNumber("ACC-EXTRA")
                .name("Equipment")
                .type(AccountType.ASSET)
                .category(AccountCategory.FIXED_ASSET)
                .balance(new BigDecimal("12000"))
                .build();
        when(accountRepository.findAll()).thenReturn(List.of(asset, extraAsset, liability, equity, revenue, expense));

        BalanceSheetResponse result = reportRepository.generateBalanceSheet(LocalDate.of(2026, 9, 5));

        assertFalse(result.isBalanced());
    }

    @Test
    void generateBalanceSheet_withoutPnlAccounts_balancesOnEquityAndLiabilityOnly() {
        Account cashOnly = Account.builder()
                .accountNumber("ACC-ASSET")
                .name("Cash")
                .type(AccountType.ASSET)
                .category(AccountCategory.CURRENT_ASSET)
                .balance(new BigDecimal("75000"))
                .build();
        when(accountRepository.findAll()).thenReturn(List.of(cashOnly, liability, equity));

        BalanceSheetResponse result = reportRepository.generateBalanceSheet(LocalDate.of(2026, 9, 5));

        assertEquals(new BigDecimal("55000.00"), result.getEquity());
        assertTrue(result.isBalanced());
    }
}