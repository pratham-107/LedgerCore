package com.ledgercore.model;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.Id;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.mongodb.core.index.CompoundIndex;
import org.springframework.data.mongodb.core.index.Indexed;
import org.springframework.data.mongodb.core.mapping.Document;

import java.math.BigDecimal;
import java.time.Instant;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Document(collection = "transactions")
@CompoundIndex(name = "created_by_created_at_idx", def = "{'createdBy': 1, 'createdAt': -1}")
public class Transaction {

    @Id
    private String id;

    @Indexed(unique = true)
    private String transactionId;

    private String description;

    private String currency;

    @Builder.Default
    private BigDecimal exchangeRate = BigDecimal.ONE;

    private BigDecimal totalAmount;

    @Builder.Default
    private TransactionStatus status = TransactionStatus.POSTED;

    private String reference;

    private String createdBy;

    @Indexed
    @CreatedDate
    private Instant createdAt;

    @LastModifiedDate
    private Instant updatedAt;

    private String reversedBy;

    private String reversalTransactionId;

    private Instant reversedAt;
}
