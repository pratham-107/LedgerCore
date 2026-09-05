package com.ledgercore.exception;

import org.springframework.http.HttpStatus;

import java.util.Map;

public class AccountLockedException extends ApiException {
    public AccountLockedException(String message) {
        super(message, HttpStatus.LOCKED, "ACCOUNT_LOCKED", Map.of("lockoutMinutes", 15));
    }
}
