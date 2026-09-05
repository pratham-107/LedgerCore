package com.ledgercore.dto.transaction;

import com.fasterxml.jackson.annotation.JsonInclude;
import com.ledgercore.model.TransactionStatus;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.Instant;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@JsonInclude(JsonInclude.Include.NON_NULL)
public class TransactionResponse {
    private String transactionId;
    private String description;
    private BigDecimal totalAmount;
    private String currency;
    private BigDecimal exchangeRate;
    private TransactionStatus status;
    private String reference;
    private List<EntryResponse> entries;
    private String createdBy;
    private Instant createdAt;
    private String reversedBy;
    private String reversalTransactionId;
    private Instant reversedAt;
}
