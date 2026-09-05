package com.ledgercore.service;

import com.ledgercore.dto.auth.AuthResponse;
import com.ledgercore.dto.auth.LoginRequest;
import com.ledgercore.dto.auth.RegisterRequest;
import com.ledgercore.dto.auth.UserResponse;
import com.ledgercore.exception.AccountLockedException;
import com.ledgercore.exception.EmailAlreadyExistsException;
import com.ledgercore.model.Role;
import com.ledgercore.model.User;
import com.ledgercore.repository.UserRepository;
import com.ledgercore.security.CustomUserDetails;
import com.ledgercore.security.JwtService;
import com.ledgercore.security.LoginAttemptService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.time.Instant;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class AuthServiceTest {

    @Mock
    private UserRepository userRepository;

    @Mock
    private PasswordEncoder passwordEncoder;

    @Mock
    private JwtService jwtService;

    @Mock
    private AuthenticationManager authenticationManager;

    @Mock
    private LoginAttemptService loginAttemptService;

    @InjectMocks
    private AuthService authService;

    private User sampleUser;

    @BeforeEach
    void setUp() {
        sampleUser = User.builder()
                .id("user-123")
                .email("test@ledgercore.com")
                .passwordHash("encodedHash")
                .role(Role.ACCOUNTANT)
                .isActive(true)
                .createdAt(Instant.now())
                .build();
    }

    @Test
    void register_Success() {
        RegisterRequest request = RegisterRequest.builder()
                .email("test@ledgercore.com")
                .password("SecurePass123!")
                .role(Role.ACCOUNTANT)
                .build();

        when(userRepository.existsByEmail("test@ledgercore.com")).thenReturn(false);
        when(passwordEncoder.encode("SecurePass123!")).thenReturn("encodedHash");
        when(userRepository.save(any(User.class))).thenReturn(sampleUser);

        UserResponse response = authService.register(request);

        assertNotNull(response);
        assertEquals("user-123", response.getUserId());
        assertEquals("test@ledgercore.com", response.getEmail());
        assertEquals(Role.ACCOUNTANT, response.getRole());
    }

    @Test
    void register_DuplicateEmail_ThrowsException() {
        RegisterRequest request = RegisterRequest.builder()
                .email("test@ledgercore.com")
                .password("SecurePass123!")
                .role(Role.ACCOUNTANT)
                .build();

        when(userRepository.existsByEmail("test@ledgercore.com")).thenReturn(true);

        assertThrows(EmailAlreadyExistsException.class, () -> authService.register(request));
    }

    @Test
    void login_Success() {
        LoginRequest request = LoginRequest.builder()
                .email("test@ledgercore.com")
                .password("SecurePass123!")
                .build();

        CustomUserDetails userDetails = new CustomUserDetails(sampleUser);
        Authentication auth = new UsernamePasswordAuthenticationToken(userDetails, null, userDetails.getAuthorities());

        when(loginAttemptService.isLocked("test@ledgercore.com")).thenReturn(false);
        when(authenticationManager.authenticate(any(UsernamePasswordAuthenticationToken.class))).thenReturn(auth);
        when(jwtService.generateToken(any(), anyString(), anyString())).thenReturn("mock-access-token");
        when(jwtService.generateRefreshToken(any())).thenReturn("mock-refresh-token");
        when(jwtService.getExpirationTimeSeconds()).thenReturn(86400L);

        AuthResponse response = authService.login(request);

        assertNotNull(response);
        assertEquals("mock-access-token", response.getAccessToken());
        assertEquals("mock-refresh-token", response.getRefreshToken());
        assertEquals(86400L, response.getExpiresIn());
        verify(loginAttemptService).loginSucceeded("test@ledgercore.com");
    }

    @Test
    void login_LockedAccount_ThrowsException() {
        LoginRequest request = LoginRequest.builder()
                .email("locked@ledgercore.com")
                .password("SecurePass123!")
                .build();

        when(loginAttemptService.isLocked("locked@ledgercore.com")).thenReturn(true);

        assertThrows(AccountLockedException.class, () -> authService.login(request));
    }

    @Test
    void login_BadCredentials_RecordsFailedAttempt() {
        LoginRequest request = LoginRequest.builder()
                .email("test@ledgercore.com")
                .password("WrongPassword")
                .build();

        when(loginAttemptService.isLocked("test@ledgercore.com")).thenReturn(false);
        when(authenticationManager.authenticate(any(UsernamePasswordAuthenticationToken.class)))
                .thenThrow(new BadCredentialsException("Bad credentials"));

        assertThrows(BadCredentialsException.class, () -> authService.login(request));
        verify(loginAttemptService).loginFailed("test@ledgercore.com");
    }
}
