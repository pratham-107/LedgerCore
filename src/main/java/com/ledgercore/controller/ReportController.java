package com.ledgercore.controller;

import com.ledgercore.dto.report.BalanceSheetResponse;
import com.ledgercore.dto.report.CategorySpendingResponse;
import com.ledgercore.dto.report.PnlReportResponse;
import com.ledgercore.service.ReportService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.time.LocalDate;

@RestController
@RequestMapping("/api/v1/reports")
@RequiredArgsConstructor
@Tag(name = "Reports", description = "Financial reporting pipelines for P&L, Balance Sheet, and Category Breakdown")
@SecurityRequirement(name = "bearerAuth")
public class ReportController {

    private final ReportService reportService;

    @GetMapping("/pnl")
    @Operation(summary = "Monthly Profit & Loss", description = "Calculates monthly P&L statement including revenue, expenses, net income and margin.")
    public ResponseEntity<PnlReportResponse> getPnl(
            @RequestParam int year,
            @RequestParam int month,
            @RequestParam(required = false) String currency) {
        PnlReportResponse response = reportService.getPnlReport(year, month, currency);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/balance-sheet")
    @Operation(summary = "Balance Sheet", description = "Generates balance sheet as of a specific date with Assets = Liabilities + Equity validation.")
    public ResponseEntity<BalanceSheetResponse> getBalanceSheet(
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate asOf) {
        BalanceSheetResponse response = reportService.getBalanceSheet(asOf);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/categories")
    @Operation(summary = "Spending by Category", description = "Aggregates expense spending by category for a given period.")
    public ResponseEntity<CategorySpendingResponse> getCategorySpending(
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate endDate,
            @RequestParam(required = false) String currency) {
        CategorySpendingResponse response = reportService.getCategorySpending(startDate, endDate, currency);
        return ResponseEntity.ok(response);
    }
}
