package com.ledgercore.dto.transaction;

import com.fasterxml.jackson.annotation.JsonInclude;
import com.ledgercore.model.EntryType;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@JsonInclude(JsonInclude.Include.NON_NULL)
public class EntryResponse {
    private String entryId;
    private String accountId;
    private String accountNumber;
    private String accountName;
    private EntryType type;
    private BigDecimal amount;
    private BigDecimal runningBalance;
}
