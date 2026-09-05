package com.ledgercore.exception;

import org.springframework.http.HttpStatus;

import java.util.Map;

public class EmailAlreadyExistsException extends ApiException {
    public EmailAlreadyExistsException(String email) {
        super("Email is already registered: " + email, HttpStatus.CONFLICT, "EMAIL_ALREADY_EXISTS", Map.of("email", email));
    }
}
