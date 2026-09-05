package com.ledgercore.controller;

import com.ledgercore.dto.report.*;
import com.ledgercore.security.JwtService;
import com.ledgercore.security.RateLimitingService;
import com.ledgercore.service.ReportService;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.test.web.servlet.MockMvc;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;

import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@WebMvcTest(ReportController.class)
@AutoConfigureMockMvc(addFilters = false)
class ReportControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private ReportService reportService;

    @MockBean
    private JwtService jwtService;

    @MockBean
    private UserDetailsService userDetailsService;

    @MockBean
    private RateLimitingService rateLimitingService;

    @Test
    void getPnl_ReturnsPnlResponse() throws Exception {
        PnlReportResponse pnl = PnlReportResponse.builder()
                .period("2024-01")
                .currency("USD")
                .revenue(RevenueReport.builder()
                        .total(new BigDecimal("50000.00"))
                        .breakdown(List.of(new CategoryAmount("PRODUCT_SALES", new BigDecimal("50000.00"))))
                        .build())
                .expenses(ExpenseReport.builder()
                        .total(new BigDecimal("32500.00"))
                        .breakdown(List.of(new CategoryAmount("RENT", new BigDecimal("32500.00"))))
                        .build())
                .netIncome(new BigDecimal("17500.00"))
                .margin(new BigDecimal("35.0"))
                .build();

        when(reportService.getPnlReport(eq(2024), eq(1), any())).thenReturn(pnl);

        mockMvc.perform(get("/api/v1/reports/pnl")
                        .param("year", "2024")
                        .param("month", "1"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.period").value("2024-01"))
                .andExpect(jsonPath("$.netIncome").value(17500.00))
                .andExpect(jsonPath("$.margin").value(35.0));
    }

    @Test
    void getBalanceSheet_ReturnsBalanceSheetResponse() throws Exception {
        BalanceSheetResponse balanceSheet = BalanceSheetResponse.builder()
                .asOf(LocalDate.of(2024, 1, 31))
                .assets(AssetReport.builder()
                        .current(new BigDecimal("75000.00"))
                        .fixed(new BigDecimal("50000.00"))
                        .total(new BigDecimal("125000.00"))
                        .build())
                .liabilities(LiabilityReport.builder()
                        .current(new BigDecimal("20000.00"))
                        .longTerm(new BigDecimal("30000.00"))
                        .total(new BigDecimal("50000.00"))
                        .build())
                .equity(new BigDecimal("75000.00"))
                .balanced(true)
                .build();

        when(reportService.getBalanceSheet(any())).thenReturn(balanceSheet);

        mockMvc.perform(get("/api/v1/reports/balance-sheet"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.balanced").value(true))
                .andExpect(jsonPath("$.assets.total").value(125000.00))
                .andExpect(jsonPath("$.liabilities.total").value(50000.00))
                .andExpect(jsonPath("$.equity").value(75000.00));
    }
}
