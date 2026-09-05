package com.ledgercore.dto.account;

import com.fasterxml.jackson.annotation.JsonInclude;
import com.ledgercore.model.AccountCategory;
import com.ledgercore.model.AccountType;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.Instant;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@JsonInclude(JsonInclude.Include.NON_NULL)
public class AccountResponse {
    private String accountId;
    private String accountNumber;
    private String name;
    private AccountType type;
    private AccountCategory category;
    private String currency;
    private BigDecimal balance;
    private Boolean isActive;
    private Instant createdAt;
    private Instant updatedAt;
}
