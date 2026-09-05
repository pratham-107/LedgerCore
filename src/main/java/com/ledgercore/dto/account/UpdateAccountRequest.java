package com.ledgercore.dto.account;

import com.ledgercore.model.AccountCategory;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class UpdateAccountRequest {

    @Size(min = 2, max = 100, message = "Account name must be between 2 and 100 characters")
    private String name;

    private AccountCategory category;

    private Boolean isActive;
}
