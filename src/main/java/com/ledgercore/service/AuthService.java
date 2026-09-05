package com.ledgercore.service;

import com.ledgercore.dto.auth.*;
import com.ledgercore.exception.AccountLockedException;
import com.ledgercore.exception.ApiException;
import com.ledgercore.exception.EmailAlreadyExistsException;
import com.ledgercore.model.User;
import com.ledgercore.repository.UserRepository;
import com.ledgercore.security.CustomUserDetails;
import com.ledgercore.security.JwtService;
import com.ledgercore.security.LoginAttemptService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Slf4j
@Service
@RequiredArgsConstructor
public class AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;
    private final AuthenticationManager authenticationManager;
    private final LoginAttemptService loginAttemptService;

    @Transactional
    public UserResponse register(RegisterRequest request) {
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new EmailAlreadyExistsException(request.getEmail());
        }

        User user = User.builder()
                .email(request.getEmail().toLowerCase().trim())
                .passwordHash(passwordEncoder.encode(request.getPassword()))
                .role(request.getRole())
                .baseCurrency(request.getBaseCurrency() != null ? request.getBaseCurrency().toUpperCase().trim() : "USD")
                .isActive(true)
                .build();

        User savedUser = userRepository.save(user);
        log.info("Registered new user with email: {}, role: {}, baseCurrency: {}", savedUser.getEmail(), savedUser.getRole(), savedUser.getBaseCurrency());

        return UserResponse.builder()
                .userId(savedUser.getId())
                .email(savedUser.getEmail())
                .role(savedUser.getRole())
                .baseCurrency(savedUser.getBaseCurrency())
                .createdAt(savedUser.getCreatedAt())
                .build();
    }

    public AuthResponse login(LoginRequest request) {
        String email = request.getEmail().toLowerCase().trim();

        if (loginAttemptService.isLocked(email)) {
            throw new AccountLockedException("Account is temporarily locked due to multiple failed login attempts. Please try again later.");
        }

        try {
            Authentication authentication = authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(email, request.getPassword())
            );

            CustomUserDetails userDetails = (CustomUserDetails) authentication.getPrincipal();
            loginAttemptService.loginSucceeded(email);

            String accessToken = jwtService.generateToken(userDetails, userDetails.getId(), userDetails.getRole().name());
            String refreshToken = jwtService.generateRefreshToken(userDetails);

            return AuthResponse.builder()
                    .accessToken(accessToken)
                    .refreshToken(refreshToken)
                    .tokenType("Bearer")
                    .expiresIn(jwtService.getExpirationTimeSeconds())
                    .user(UserResponse.builder()
                            .userId(userDetails.getId())
                            .email(userDetails.getEmail())
                            .role(userDetails.getRole())
                            .baseCurrency(userDetails.getBaseCurrency())
                            .build())
                    .build();

        } catch (BadCredentialsException ex) {
            loginAttemptService.loginFailed(email);
            int remaining = loginAttemptService.getRemainingAttempts(email);
            log.warn("Failed login attempt for {}. Remaining attempts: {}", email, remaining);
            throw new BadCredentialsException("Invalid email or password");
        }
    }

    public AuthResponse refresh(RefreshTokenRequest request) {
        String refreshToken = request.getRefreshToken();
        try {
            String email = jwtService.extractUsername(refreshToken);
            User user = userRepository.findByEmail(email)
                    .orElseThrow(() -> new ApiException("User not found", HttpStatus.UNAUTHORIZED, "UNAUTHORIZED"));

            CustomUserDetails userDetails = new CustomUserDetails(user);

            if (!jwtService.isTokenValid(refreshToken, userDetails)) {
                throw new ApiException("Invalid or expired refresh token", HttpStatus.UNAUTHORIZED, "UNAUTHORIZED");
            }

            String newAccessToken = jwtService.generateToken(userDetails, userDetails.getId(), userDetails.getRole().name());

            return AuthResponse.builder()
                    .accessToken(newAccessToken)
                    .tokenType("Bearer")
                    .expiresIn(jwtService.getExpirationTimeSeconds())
                    .build();

        } catch (ApiException e) {
            throw e;
        } catch (Exception e) {
            throw new ApiException("Failed to refresh token: " + e.getMessage(), HttpStatus.UNAUTHORIZED, "UNAUTHORIZED");
        }
    }
}
