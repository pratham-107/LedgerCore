package com.ledgercore.controller;

import com.ledgercore.dto.account.AccountBalanceResponse;
import com.ledgercore.dto.account.AccountResponse;
import com.ledgercore.dto.account.CreateAccountRequest;
import com.ledgercore.dto.account.UpdateAccountRequest;
import com.ledgercore.dto.common.PagedResponse;
import com.ledgercore.model.AccountType;
import com.ledgercore.service.AccountService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/accounts")
@RequiredArgsConstructor
@Tag(name = "Accounts", description = "Chart of Accounts management and balance queries")
@SecurityRequirement(name = "bearerAuth")
public class AccountController {

    private final AccountService accountService;

    @PostMapping
    @PreAuthorize("hasAnyRole('ADMIN', 'ACCOUNTANT')")
    @Operation(summary = "Create account", description = "Create a new ledger account. Roles: ADMIN, ACCOUNTANT")
    public ResponseEntity<AccountResponse> createAccount(@Valid @RequestBody CreateAccountRequest request) {
        AccountResponse response = accountService.createAccount(request);
        return new ResponseEntity<>(response, HttpStatus.CREATED);
    }

    @GetMapping
    @Operation(summary = "List accounts", description = "List all accounts with pagination and filtering. Roles: ALL")
    public ResponseEntity<PagedResponse<AccountResponse>> listAccounts(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size,
            @RequestParam(required = false) AccountType type,
            @RequestParam(defaultValue = "true") Boolean active) {
        PagedResponse<AccountResponse> response = accountService.listAccounts(page, size, type, active);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/{id}")
    @Operation(summary = "Get account by ID or number", description = "Retrieve account details. Roles: ALL")
    public ResponseEntity<AccountResponse> getAccount(@PathVariable String id) {
        AccountResponse response = accountService.getAccount(id);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/{id}/balance")
    @Operation(summary = "Get account balance", description = "Get current balance and transaction activity. Roles: ALL")
    public ResponseEntity<AccountBalanceResponse> getAccountBalance(@PathVariable String id) {
        AccountBalanceResponse response = accountService.getAccountBalance(id);
        return ResponseEntity.ok(response);
    }

    @PatchMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN', 'ACCOUNTANT')")
    @Operation(summary = "Update account", description = "Update account metadata. Roles: ADMIN, ACCOUNTANT")
    public ResponseEntity<AccountResponse> updateAccount(
            @PathVariable String id,
            @Valid @RequestBody UpdateAccountRequest request) {
        AccountResponse response = accountService.updateAccount(id, request);
        return ResponseEntity.ok(response);
    }
}
