package com.ledgercore.exception;

import org.springframework.http.HttpStatus;

import java.util.Map;

public class InvalidTransactionException extends ApiException {
    public InvalidTransactionException(String message) {
        super(message, HttpStatus.BAD_REQUEST, "INVALID_TRANSACTION");
    }

    public InvalidTransactionException(String message, Map<String, Object> details) {
        super(message, HttpStatus.BAD_REQUEST, "INVALID_TRANSACTION", details);
    }
}
