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
public class AssetReport {
    @Builder.Default
    private BigDecimal current = BigDecimal.ZERO;
    @Builder.Default
    private BigDecimal fixed = BigDecimal.ZERO;
    @Builder.Default
    private BigDecimal total = BigDecimal.ZERO;
}
