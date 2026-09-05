package com.ledgercore.exception;

import org.springframework.http.HttpStatus;

import java.util.Map;

public class RateLimitExceededException extends ApiException {
    public RateLimitExceededException(String message) {
        super(message, HttpStatus.TOO_MANY_REQUESTS, "RATE_LIMIT_EXCEEDED", Map.of("retryAfter", 60));
    }
}
