package com.ledgercore.service;

import com.ledgercore.dto.transaction.ImportSummaryResponse;
import com.ledgercore.model.Account;
import com.ledgercore.model.AccountType;
import com.ledgercore.repository.AccountRepository;
import com.ledgercore.repository.LedgerEntryRepository;
import com.ledgercore.repository.TransactionRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.mock.web.MockMultipartFile;

import java.math.BigDecimal;
import java.nio.charset.StandardCharsets;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class CsvServiceTest {

    @Mock
    private TransactionService transactionService;

    @Mock
    private TransactionRepository transactionRepository;

    @Mock
    private LedgerEntryRepository ledgerEntryRepository;

    @Mock
    private AccountRepository accountRepository;

    @InjectMocks
    private CsvService csvService;

    private Account acc1;
    private Account acc2;

    @BeforeEach
    void setUp() {
        acc1 = Account.builder().id("acc-1").accountNumber("ACC-001").currency("USD").balance(new BigDecimal("1000")).build();
        acc2 = Account.builder().id("acc-2").accountNumber("ACC-002").currency("USD").balance(new BigDecimal("500")).build();
    }

    @Test
    void importTransactionsCsv_ProcessesValidAndInvalidRows() {
        String csvContent = "description,currency,debit_account,debit_amount,credit_account,credit_amount\n" +
                "Office Supplies,USD,ACC-001,150.00,ACC-002,150.00\n" +
                "Invalid Mismatch,USD,ACC-001,100.00,ACC-002,200.00\n" +
                "Missing Account,USD,ACC-999,50.00,ACC-002,50.00\n";

        MockMultipartFile file = new MockMultipartFile(
                "file", "transactions.csv", "text/csv", csvContent.getBytes(StandardCharsets.UTF_8)
        );

        when(accountRepository.findByAccountNumber("ACC-001")).thenReturn(Optional.of(acc1));
        when(accountRepository.findByAccountNumber("ACC-002")).thenReturn(Optional.of(acc2));
        when(accountRepository.findByAccountNumber("ACC-999")).thenReturn(Optional.empty());
        when(accountRepository.findById("ACC-999")).thenReturn(Optional.empty());

        ImportSummaryResponse summary = csvService.importTransactionsCsv(file);

        assertNotNull(summary);
        assertEquals(3, summary.getTotalRows());
        assertEquals(1, summary.getSuccessful());
        assertEquals(2, summary.getFailed());
        assertEquals(2, summary.getErrors().size());
        assertEquals("DEBIT_CREDIT_MISMATCH", summary.getErrors().get(0).getError());
        assertEquals("ACCOUNT_NOT_FOUND", summary.getErrors().get(1).getError());

        verify(transactionService, times(1)).createTransaction(any());
    }

    @Test
    void exportTransactionsCsv_GeneratesValidCsv() {
        byte[] csvBytes = csvService.exportTransactionsCsv();
        assertNotNull(csvBytes);
        assertTrue(csvBytes.length > 0);
        String output = new String(csvBytes, StandardCharsets.UTF_8);
        assertTrue(output.contains("TransactionId,CreatedAt,Description,Currency,Status"));
    }
}
