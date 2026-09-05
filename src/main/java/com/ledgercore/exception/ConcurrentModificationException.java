package com.ledgercore.exception;

import org.springframework.http.HttpStatus;

import java.util.Map;

public class ConcurrentModificationException extends ApiException {
    public ConcurrentModificationException(String message) {
        super(message, HttpStatus.CONFLICT, "CONCURRENT_MODIFICATION", Map.of("retryAfter", 100));
    }
}
