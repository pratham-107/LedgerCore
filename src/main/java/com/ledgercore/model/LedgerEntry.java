package com.ledgercore.model;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.index.CompoundIndex;
import org.springframework.data.mongodb.core.index.Indexed;
import org.springframework.data.mongodb.core.mapping.Document;

import java.math.BigDecimal;
import java.time.Instant;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Document(collection = "ledger_entries")
@CompoundIndex(name = "account_created_at_idx", def = "{'accountId': 1, 'createdAt': -1}")
public class LedgerEntry {

    @Id
    private String id;

    private String entryId;

    @Indexed
    private String transactionId;

    @Indexed
    private String accountId;

    private EntryType entryType;

    private BigDecimal amount;

    private String currency;

    private BigDecimal runningBalance;

    @CreatedDate
    private Instant createdAt;
}
