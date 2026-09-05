package com.ledgercore.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.ledgercore.dto.account.AccountBalanceResponse;
import com.ledgercore.dto.account.AccountResponse;
import com.ledgercore.dto.account.CreateAccountRequest;
import com.ledgercore.dto.common.PagedResponse;
import com.ledgercore.model.AccountCategory;
import com.ledgercore.model.AccountType;
import com.ledgercore.security.JwtService;
import com.ledgercore.security.RateLimitingService;
import com.ledgercore.service.AccountService;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.test.web.servlet.MockMvc;

import java.math.BigDecimal;
import java.time.Instant;
import java.util.List;

import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@WebMvcTest(AccountController.class)
@AutoConfigureMockMvc(addFilters = false)
class AccountControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @MockBean
    private AccountService accountService;

    @MockBean
    private JwtService jwtService;

    @MockBean
    private UserDetailsService userDetailsService;

    @MockBean
    private RateLimitingService rateLimitingService;

    @Test
    void createAccount_ValidPayload_Returns201() throws Exception {
        CreateAccountRequest request = CreateAccountRequest.builder()
                .name("Office Supplies Expense")
                .type(AccountType.EXPENSE)
                .category(AccountCategory.OPERATING_EXPENSE)
                .currency("USD")
                .openingBalance(BigDecimal.ZERO)
                .build();

        AccountResponse accountResponse = AccountResponse.builder()
                .accountId("acc-123")
                .accountNumber("ACC-2024-015")
                .name("Office Supplies Expense")
                .type(AccountType.EXPENSE)
                .category(AccountCategory.OPERATING_EXPENSE)
                .currency("USD")
                .balance(BigDecimal.ZERO)
                .createdAt(Instant.now())
                .build();

        when(accountService.createAccount(any())).thenReturn(accountResponse);

        mockMvc.perform(post("/api/v1/accounts")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.accountNumber").value("ACC-2024-015"))
                .andExpect(jsonPath("$.name").value("Office Supplies Expense"));
    }

    @Test
    void getAccountBalance_ReturnsBalanceDetails() throws Exception {
        AccountBalanceResponse balanceResponse = AccountBalanceResponse.builder()
                .accountId("acc-123")
                .currentBalance(new BigDecimal("1250.00"))
                .currency("USD")
                .lastTransactionDate(Instant.now())
                .transactionCount(15)
                .build();

        when(accountService.getAccountBalance("acc-123")).thenReturn(balanceResponse);

        mockMvc.perform(get("/api/v1/accounts/acc-123/balance"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.currentBalance").value(1250.00))
                .andExpect(jsonPath("$.transactionCount").value(15));
    }

    @Test
    void listAccounts_ReturnsPagedList() throws Exception {
        AccountResponse account = AccountResponse.builder()
                .accountId("acc-123")
                .accountNumber("ACC-2024-001")
                .name("Cash")
                .type(AccountType.ASSET)
                .balance(new BigDecimal("50000.00"))
                .currency("USD")
                .build();

        PagedResponse<AccountResponse> pagedResponse = PagedResponse.of(List.of(account), 1, 1, 0);

        when(accountService.listAccounts(anyInt(), anyInt(), any(), anyBoolean())).thenReturn(pagedResponse);

        mockMvc.perform(get("/api/v1/accounts"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.totalElements").value(1))
                .andExpect(jsonPath("$.content[0].accountNumber").value("ACC-2024-001"));
    }
}
