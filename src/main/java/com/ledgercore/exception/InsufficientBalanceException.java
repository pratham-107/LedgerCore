package com.ledgercore.exception;

import org.springframework.http.HttpStatus;

import java.math.BigDecimal;
import java.util.Map;

public class InsufficientBalanceException extends ApiException {
    public InsufficientBalanceException(String accountNumber, BigDecimal currentBalance, BigDecimal requestedAmount) {
        super(
            String.format("Insufficient balance in account %s. Current: %s, Requested: %s", accountNumber, currentBalance, requestedAmount),
            HttpStatus.BAD_REQUEST,
            "INSUFFICIENT_BALANCE",
            Map.of("accountNumber", accountNumber, "currentBalance", currentBalance, "requestedAmount", requestedAmount)
        );
    }
}
