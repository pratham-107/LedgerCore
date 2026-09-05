package com.ledgercore.controller;

import com.ledgercore.dto.common.PagedResponse;
import com.ledgercore.dto.transaction.*;
import com.ledgercore.model.TransactionStatus;
import com.ledgercore.service.CsvService;
import com.ledgercore.service.TransactionService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

@RestController
@RequestMapping("/api/v1/transactions")
@RequiredArgsConstructor
@Tag(name = "Transactions", description = "Double-entry transaction creation, reversals, and CSV import/export")
@SecurityRequirement(name = "bearerAuth")
public class TransactionController {

    private final TransactionService transactionService;
    private final CsvService csvService;

    @PostMapping
    @PreAuthorize("hasAnyRole('ADMIN', 'ACCOUNTANT')")
    @Operation(summary = "Create transaction", description = "Creates an atomic double-entry transaction. Roles: ADMIN, ACCOUNTANT")
    public ResponseEntity<TransactionResponse> createTransaction(@Valid @RequestBody CreateTransactionRequest request) {
        TransactionResponse response = transactionService.createTransaction(request);
        return new ResponseEntity<>(response, HttpStatus.CREATED);
    }

    @GetMapping
    @Operation(summary = "List transactions", description = "List transactions with pagination and optional status filter. Roles: ALL")
    public ResponseEntity<PagedResponse<TransactionResponse>> listTransactions(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size,
            @RequestParam(required = false) TransactionStatus status) {
        Page<TransactionResponse> responsePage = transactionService.listTransactions(page, size, status);
        return ResponseEntity.ok(PagedResponse.of(responsePage));
    }

    @GetMapping("/{id}")
    @Operation(summary = "Get transaction details", description = "Retrieve a transaction and its ledger entries. Roles: ALL")
    public ResponseEntity<TransactionResponse> getTransaction(@PathVariable String id) {
        TransactionResponse response = transactionService.getTransaction(id);
        return ResponseEntity.ok(response);
    }

    @PostMapping("/{id}/reverse")
    @PreAuthorize("hasAnyRole('ADMIN', 'ACCOUNTANT')")
    @Operation(summary = "Reverse transaction", description = "Reverses a posted transaction by creating inverse entries. Roles: ADMIN, ACCOUNTANT")
    public ResponseEntity<ReversalResponse> reverseTransaction(@PathVariable String id) {
        ReversalResponse response = transactionService.reverseTransaction(id);
        return new ResponseEntity<>(response, HttpStatus.CREATED);
    }

    @PostMapping(value = "/import", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    @PreAuthorize("hasAnyRole('ADMIN', 'ACCOUNTANT')")
    @Operation(summary = "Bulk import from CSV", description = "Upload and process transactions in CSV format. Roles: ADMIN, ACCOUNTANT")
    public ResponseEntity<ImportSummaryResponse> importCsv(@RequestParam("file") MultipartFile file) {
        ImportSummaryResponse response = csvService.importTransactionsCsv(file);
        return ResponseEntity.ok(response);
    }

    @GetMapping(value = "/export", produces = "text/csv")
    @Operation(summary = "Export transactions to CSV", description = "Download full transaction history in CSV format. Roles: ALL")
    public ResponseEntity<byte[]> exportCsv() {
        byte[] csvData = csvService.exportTransactionsCsv();
        return ResponseEntity.ok()
                .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=transactions_export.csv")
                .contentType(MediaType.parseMediaType("text/csv"))
                .body(csvData);
    }
}
