package com.ledgercore.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.ledgercore.dto.transaction.CreateTransactionRequest;
import com.ledgercore.dto.transaction.EntryRequest;
import com.ledgercore.dto.transaction.ReversalResponse;
import com.ledgercore.dto.transaction.TransactionResponse;
import com.ledgercore.model.EntryType;
import com.ledgercore.model.TransactionStatus;
import com.ledgercore.security.JwtService;
import com.ledgercore.security.RateLimitingService;
import com.ledgercore.service.CsvService;
import com.ledgercore.service.TransactionService;
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

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@WebMvcTest(TransactionController.class)
@AutoConfigureMockMvc(addFilters = false)
class TransactionControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @MockBean
    private TransactionService transactionService;

    @MockBean
    private CsvService csvService;

    @MockBean
    private JwtService jwtService;

    @MockBean
    private UserDetailsService userDetailsService;

    @MockBean
    private RateLimitingService rateLimitingService;

    @Test
    void createTransaction_ValidPayload_Returns201() throws Exception {
        CreateTransactionRequest request = CreateTransactionRequest.builder()
                .description("Monthly Office Rent")
                .currency("USD")
                .reference("INV-2024-001")
                .entries(List.of(
                        EntryRequest.builder().accountId("acc-1").type(EntryType.DEBIT).amount(new BigDecimal("2000.00")).build(),
                        EntryRequest.builder().accountId("acc-2").type(EntryType.CREDIT).amount(new BigDecimal("2000.00")).build()
                ))
                .build();

        TransactionResponse response = TransactionResponse.builder()
                .transactionId("TXN-12345")
                .description("Monthly Office Rent")
                .totalAmount(new BigDecimal("2000.00"))
                .currency("USD")
                .status(TransactionStatus.POSTED)
                .createdAt(Instant.now())
                .build();

        when(transactionService.createTransaction(any())).thenReturn(response);

        mockMvc.perform(post("/api/v1/transactions")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.transactionId").value("TXN-12345"))
                .andExpect(jsonPath("$.totalAmount").value(2000.00))
                .andExpect(jsonPath("$.status").value("POSTED"));
    }

    @Test
    void reverseTransaction_Returns201() throws Exception {
        ReversalResponse response = ReversalResponse.builder()
                .originalTransactionId("TXN-12345")
                .reversalTransactionId("TXN-rev-67890")
                .status(TransactionStatus.REVERSED)
                .reversedAt(Instant.now())
                .build();

        when(transactionService.reverseTransaction(eq("TXN-12345"))).thenReturn(response);

        mockMvc.perform(post("/api/v1/transactions/TXN-12345/reverse"))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.originalTransactionId").value("TXN-12345"))
                .andExpect(jsonPath("$.reversalTransactionId").value("TXN-rev-67890"))
                .andExpect(jsonPath("$.status").value("REVERSED"));
    }

    @Test
    void exportCsv_ReturnsCsvFile() throws Exception {
        byte[] csvData = "TransactionId,CreatedAt,Description\nTXN-1,2024-01-01,Test\n".getBytes();
        when(csvService.exportTransactionsCsv()).thenReturn(csvData);

        mockMvc.perform(get("/api/v1/transactions/export"))
                .andExpect(status().isOk())
                .andExpect(header().string("Content-Disposition", "attachment; filename=transactions_export.csv"))
                .andExpect(content().contentType("text/csv"));
    }
}
