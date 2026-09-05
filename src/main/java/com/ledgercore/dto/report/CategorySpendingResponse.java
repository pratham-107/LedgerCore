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
public class CategorySpendingResponse {
    private String period;
    private String currency;
    @Builder.Default
    private BigDecimal totalSpending = BigDecimal.ZERO;
    @Builder.Default
    private List<CategoryAmount> categories = new ArrayList<>();
}
