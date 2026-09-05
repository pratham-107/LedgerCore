package com.ledgercore.dto.report;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class PnlReportResponse {
    private String period;
    private String currency;
    private RevenueReport revenue;
    private ExpenseReport expenses;
    private BigDecimal netIncome;
    private BigDecimal margin; // percentage e.g. 35.0%
}
