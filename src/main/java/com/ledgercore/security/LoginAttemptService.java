package com.ledgercore.security;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.util.concurrent.ConcurrentHashMap;

@Service
public class LoginAttemptService {

    @Value("${ledgercore.security.max-login-attempts:5}")
    private int maxAttempts;

    @Value("${ledgercore.security.lockout-duration-minutes:15}")
    private int lockoutDurationMinutes;

    private static class AttemptInfo {
        int attempts;
        Instant lockedUntil;
        Instant firstAttemptAt;

        AttemptInfo(int attempts, Instant firstAttemptAt) {
            this.attempts = attempts;
            this.firstAttemptAt = firstAttemptAt;
        }
    }

    private final ConcurrentHashMap<String, AttemptInfo> attemptsCache = new ConcurrentHashMap<>();

    public void loginSucceeded(String key) {
        attemptsCache.remove(key.toLowerCase());
    }

    public void loginFailed(String key) {
        String normalizedKey = key.toLowerCase();
        attemptsCache.compute(normalizedKey, (k, info) -> {
            Instant now = Instant.now();
            if (info == null || now.isAfter(info.firstAttemptAt.plusSeconds(lockoutDurationMinutes * 60L))) {
                return new AttemptInfo(1, now);
            }
            info.attempts++;
            if (info.attempts >= maxAttempts) {
                info.lockedUntil = now.plusSeconds(lockoutDurationMinutes * 60L);
            }
            return info;
        });
    }

    public boolean isLocked(String key) {
        String normalizedKey = key.toLowerCase();
        AttemptInfo info = attemptsCache.get(normalizedKey);
        if (info == null) {
            return false;
        }
        if (info.lockedUntil != null) {
            if (Instant.now().isBefore(info.lockedUntil)) {
                return true;
            } else {
                // Lockout has expired, reset
                attemptsCache.remove(normalizedKey);
                return false;
            }
        }
        return false;
    }

    public int getRemainingAttempts(String key) {
        String normalizedKey = key.toLowerCase();
        AttemptInfo info = attemptsCache.get(normalizedKey);
        if (info == null) {
            return maxAttempts;
        }
        return Math.max(0, maxAttempts - info.attempts);
    }
}
