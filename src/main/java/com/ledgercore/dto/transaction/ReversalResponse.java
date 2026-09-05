package com.ledgercore.dto.transaction;

import com.ledgercore.model.TransactionStatus;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.Instant;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ReversalResponse {
    private String originalTransactionId;
    private String reversalTransactionId;
    private TransactionStatus status;
    private Instant reversedAt;
}
