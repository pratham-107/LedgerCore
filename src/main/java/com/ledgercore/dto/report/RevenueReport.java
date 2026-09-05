package com.ledgercore.dto.report;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class RevenueReport {
    @Builder.Default
    private BigDecimal total = BigDecimal.ZERO;
    @Builder.Default
    private List<CategoryAmount> breakdown = new ArrayList<>();
}
