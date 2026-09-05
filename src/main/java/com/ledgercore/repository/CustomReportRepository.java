package com.ledgercore.repository;

import com.ledgercore.dto.report.BalanceSheetResponse;
import com.ledgercore.dto.report.CategorySpendingResponse;
import com.ledgercore.dto.report.PnlReportResponse;

import java.time.LocalDate;

public interface CustomReportRepository {
    PnlReportResponse generatePnlReport(int year, int month, String currency);
    BalanceSheetResponse generateBalanceSheet(LocalDate asOf);
    CategorySpendingResponse generateCategorySpending(LocalDate startDate, LocalDate endDate, String currency);
}
