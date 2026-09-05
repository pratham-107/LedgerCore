package com.ledgercore.dto.transaction;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CreateTransactionRequest {

    @NotBlank(message = "Description is required")
    @Size(max = 255, message = "Description cannot exceed 255 characters")
    private String description;

    @NotBlank(message = "Currency is required")
    @Size(min = 3, max = 3, message = "Currency must be a 3-letter ISO code (e.g. USD)")
    private String currency;

    private String reference;

    @Builder.Default
    private BigDecimal exchangeRate = BigDecimal.ONE;

    @NotEmpty(message = "Entries list cannot be empty")
    @Size(min = 2, message = "At least two entries are required for a double-entry transaction")
    @Valid
    private List<EntryRequest> entries;
}
