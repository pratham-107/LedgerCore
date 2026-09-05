package com.ledgercore.exception;

import org.springframework.http.HttpStatus;

import java.util.Map;

public class AccountNotFoundException extends ApiException {
    public AccountNotFoundException(String accountId) {
        super("Account not found with identifier: " + accountId, HttpStatus.NOT_FOUND, "ACCOUNT_NOT_FOUND", Map.of("accountId", accountId));
    }
}
