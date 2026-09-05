package com.ledgercore.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.ledgercore.dto.auth.AuthResponse;
import com.ledgercore.dto.auth.LoginRequest;
import com.ledgercore.dto.auth.RegisterRequest;
import com.ledgercore.dto.auth.UserResponse;
import com.ledgercore.model.Role;
import com.ledgercore.security.JwtService;
import com.ledgercore.service.AuthService;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.test.web.servlet.MockMvc;

import java.time.Instant;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@WebMvcTest(AuthController.class)
@AutoConfigureMockMvc(addFilters = false)
class AuthControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @MockBean
    private AuthService authService;

    @MockBean
    private JwtService jwtService;

    @MockBean
    private UserDetailsService userDetailsService;

    @MockBean
    private com.ledgercore.security.RateLimitingService rateLimitingService;

    @Test
    void register_ValidPayload_Returns201() throws Exception {
        RegisterRequest request = RegisterRequest.builder()
                .email("admin@ledgercore.com")
                .password("SecurePass123!")
                .role(Role.ADMIN)
                .build();

        UserResponse userResponse = UserResponse.builder()
                .userId("user-1")
                .email("admin@ledgercore.com")
                .role(Role.ADMIN)
                .createdAt(Instant.now())
                .build();

        when(authService.register(any())).thenReturn(userResponse);

        mockMvc.perform(post("/auth/register")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.email").value("admin@ledgercore.com"))
                .andExpect(jsonPath("$.role").value("ADMIN"));
    }

    @Test
    void register_InvalidPassword_Returns400() throws Exception {
        RegisterRequest request = RegisterRequest.builder()
                .email("admin@ledgercore.com")
                .password("weak")
                .role(Role.ADMIN)
                .build();

        mockMvc.perform(post("/auth/register")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isBadRequest());
    }

    @Test
    void login_ValidCredentials_ReturnsTokens() throws Exception {
        LoginRequest request = LoginRequest.builder()
                .email("admin@ledgercore.com")
                .password("SecurePass123!")
                .build();

        AuthResponse authResponse = AuthResponse.builder()
                .accessToken("access-token-xyz")
                .refreshToken("refresh-token-xyz")
                .tokenType("Bearer")
                .expiresIn(86400)
                .build();

        when(authService.login(any())).thenReturn(authResponse);

        mockMvc.perform(post("/auth/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.accessToken").value("access-token-xyz"))
                .andExpect(jsonPath("$.tokenType").value("Bearer"));
    }
}
