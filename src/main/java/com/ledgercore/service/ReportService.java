package com.ledgercore.service;

import com.ledgercore.dto.report.BalanceSheetResponse;
import com.ledgercore.dto.report.CategorySpendingResponse;
import com.ledgercore.dto.report.PnlReportResponse;
import com.ledgercore.repository.CustomReportRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDate;

@Service
@RequiredArgsConstructor
public class ReportService {

    private final CustomReportRepository customReportRepository;

    public PnlReportResponse getPnlReport(int year, int month, String currency) {
        return customReportRepository.generatePnlReport(year, month, currency);
    }

    public BalanceSheetResponse getBalanceSheet(LocalDate asOf) {
        return customReportRepository.generateBalanceSheet(asOf);
    }

    public CategorySpendingResponse getCategorySpending(LocalDate startDate, LocalDate endDate, String currency) {
        return customReportRepository.generateCategorySpending(startDate, endDate, currency);
    }
}
