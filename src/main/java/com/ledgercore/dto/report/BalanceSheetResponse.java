package com.ledgercore.dto.report;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDate;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class BalanceSheetResponse {
    private LocalDate asOf;
    private AssetReport assets;
    private LiabilityReport liabilities;
    private BigDecimal equity;
    private boolean balanced;
}
