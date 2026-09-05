package com.ledgercore.service;

import com.ledgercore.dto.transaction.*;
import com.ledgercore.exception.ApiException;
import com.ledgercore.model.Account;
import com.ledgercore.model.EntryType;
import com.ledgercore.model.LedgerEntry;
import com.ledgercore.model.Transaction;
import com.ledgercore.repository.AccountRepository;
import com.ledgercore.repository.LedgerEntryRepository;
import com.ledgercore.repository.TransactionRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.apache.commons.csv.CSVFormat;
import org.apache.commons.csv.CSVParser;
import org.apache.commons.csv.CSVPrinter;
import org.apache.commons.csv.CSVRecord;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.*;
import java.math.BigDecimal;
import java.nio.charset.StandardCharsets;
import java.util.*;

@Slf4j
@Service
@RequiredArgsConstructor
public class CsvService {

    private final TransactionService transactionService;
    private final TransactionRepository transactionRepository;
    private final LedgerEntryRepository ledgerEntryRepository;
    private final AccountRepository accountRepository;

    public ImportSummaryResponse importTransactionsCsv(MultipartFile file) {
        if (file.isEmpty()) {
            throw new ApiException("CSV file is empty", org.springframework.http.HttpStatus.BAD_REQUEST, "EMPTY_FILE");
        }

        int totalRows = 0;
        int successful = 0;
        int failed = 0;
        List<ImportErrorDetail> errors = new ArrayList<>();

        try (BufferedReader reader = new BufferedReader(new InputStreamReader(file.getInputStream(), StandardCharsets.UTF_8));
             CSVParser csvParser = new CSVParser(reader, CSVFormat.DEFAULT
                     .builder()
                     .setHeader()
                     .setSkipHeaderRecord(true)
                     .setIgnoreHeaderCase(true)
                     .setTrim(true)
                     .build())) {

            int rowNumber = 1; // 1-based data row index (row 1 after header)

            for (CSVRecord record : csvParser) {
                rowNumber++;
                totalRows++;

                try {
                    String description = record.get("description");
                    String currency = record.get("currency");
                    String debitAccount = record.get("debit_account");
                    String debitAmountStr = record.get("debit_amount");
                    String creditAccount = record.get("credit_account");
                    String creditAmountStr = record.get("credit_amount");

                    if (description == null || description.isBlank() || currency == null || currency.isBlank()) {
                        throw new IllegalArgumentException("Description and currency are required");
                    }

                    BigDecimal debitAmount = new BigDecimal(debitAmountStr);
                    BigDecimal creditAmount = new BigDecimal(creditAmountStr);

                    if (debitAmount.compareTo(creditAmount) != 0) {
                        errors.add(ImportErrorDetail.builder()
                                .row(rowNumber)
                                .error("DEBIT_CREDIT_MISMATCH")
                                .detail(String.format("Debits (%s) != Credits (%s)", debitAmount, creditAmount))
                                .build());
                        failed++;
                        continue;
                    }

                    // Check accounts exist
                    Account debitAcc = accountRepository.findByAccountNumber(debitAccount)
                            .or(() -> accountRepository.findById(debitAccount))
                            .orElse(null);

                    if (debitAcc == null) {
                        errors.add(ImportErrorDetail.builder()
                                .row(rowNumber)
                                .error("ACCOUNT_NOT_FOUND")
                                .detail(debitAccount + " does not exist")
                                .build());
                        failed++;
                        continue;
                    }

                    Account creditAcc = accountRepository.findByAccountNumber(creditAccount)
                            .or(() -> accountRepository.findById(creditAccount))
                            .orElse(null);

                    if (creditAcc == null) {
                        errors.add(ImportErrorDetail.builder()
                                .row(rowNumber)
                                .error("ACCOUNT_NOT_FOUND")
                                .detail(creditAccount + " does not exist")
                                .build());
                        failed++;
                        continue;
                    }

                    CreateTransactionRequest request = CreateTransactionRequest.builder()
                            .description(description)
                            .currency(currency)
                            .reference("CSV-IMPORT-ROW-" + rowNumber)
                            .entries(List.of(
                                    EntryRequest.builder()
                                            .accountId(debitAcc.getId())
                                            .type(EntryType.DEBIT)
                                            .amount(debitAmount)
                                            .build(),
                                    EntryRequest.builder()
                                            .accountId(creditAcc.getId())
                                            .type(EntryType.CREDIT)
                                            .amount(creditAmount)
                                            .build()
                            ))
                            .build();

                    transactionService.createTransaction(request);
                    successful++;

                } catch (Exception e) {
                    failed++;
                    errors.add(ImportErrorDetail.builder()
                            .row(rowNumber)
                            .error("INVALID_ROW")
                            .detail(e.getMessage())
                            .build());
                }
            }

        } catch (IOException e) {
            throw new ApiException("Failed to parse CSV file: " + e.getMessage(), org.springframework.http.HttpStatus.BAD_REQUEST, "CSV_PARSE_ERROR");
        }

        return ImportSummaryResponse.builder()
                .totalRows(totalRows)
                .successful(successful)
                .failed(failed)
                .errors(errors)
                .build();
    }

    public byte[] exportTransactionsCsv() {
        ByteArrayOutputStream out = new ByteArrayOutputStream();
        try (CSVPrinter printer = new CSVPrinter(new OutputStreamWriter(out, StandardCharsets.UTF_8),
                CSVFormat.DEFAULT.builder().setHeader(
                        "TransactionId",
                        "CreatedAt",
                        "Description",
                        "Currency",
                        "Status",
                        "Reference",
                        "EntryId",
                        "AccountNumber",
                        "AccountName",
                        "EntryType",
                        "Amount",
                        "RunningBalance"
                ).build())) {

            List<Transaction> transactions = transactionRepository.findAll();
            Map<String, Account> accountCache = new HashMap<>();

            for (Transaction txn : transactions) {
                List<LedgerEntry> entries = ledgerEntryRepository.findByTransactionIdOrderByCreatedAtAsc(txn.getTransactionId());
                for (LedgerEntry entry : entries) {
                    Account account = accountCache.computeIfAbsent(entry.getAccountId(), id -> accountRepository.findById(id).orElse(null));
                    printer.printRecord(
                            txn.getTransactionId(),
                            txn.getCreatedAt(),
                            txn.getDescription(),
                            txn.getCurrency(),
                            txn.getStatus(),
                            txn.getReference() != null ? txn.getReference() : "",
                            entry.getEntryId(),
                            account != null ? account.getAccountNumber() : entry.getAccountId(),
                            account != null ? account.getName() : "",
                            entry.getEntryType(),
                            entry.getAmount(),
                            entry.getRunningBalance()
                    );
                }
            }
            printer.flush();
        } catch (IOException e) {
            throw new ApiException("Failed to generate CSV export", org.springframework.http.HttpStatus.INTERNAL_SERVER_ERROR, "CSV_EXPORT_ERROR");
        }
        return out.toByteArray();
    }
}
