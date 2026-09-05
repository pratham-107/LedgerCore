package com.ledgercore.security;

import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.redis.core.StringRedisTemplate;
import org.springframework.stereotype.Service;

import java.time.Duration;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.atomic.AtomicInteger;

@Slf4j
@Service
public class RateLimitingService {

    @Value("${ledgercore.rate-limit.enabled:true}")
    private boolean enabled;

    @Value("${ledgercore.rate-limit.requests-per-minute:60}")
    private int requestsPerMinute;

    private final StringRedisTemplate redisTemplate;

    // In-memory fallback if Redis is unavailable
    private final ConcurrentHashMap<String, RateBucket> localBuckets = new ConcurrentHashMap<>();

    private static class RateBucket {
        final AtomicInteger count = new AtomicInteger(0);
        volatile long resetTimeMillis = System.currentTimeMillis() + 60000;
    }

    public RateLimitingService(@Autowired(required = false) StringRedisTemplate redisTemplate) {
        this.redisTemplate = redisTemplate;
    }

    public boolean isAllowed(String clientKey) {
        if (!enabled) {
            return true;
        }

        String key = "ratelimit:" + clientKey;

        // Try Redis first
        if (redisTemplate != null) {
            try {
                Long currentCount = redisTemplate.opsForValue().increment(key);
                if (currentCount != null && currentCount == 1) {
                    redisTemplate.expire(key, Duration.ofMinutes(1));
                }
                return currentCount != null && currentCount <= requestsPerMinute;
            } catch (Exception e) {
                log.debug("Redis rate limiting unavailable, falling back to in-memory: {}", e.getMessage());
            }
        }

        // In-memory fallback
        RateBucket bucket = localBuckets.compute(clientKey, (k, b) -> {
            long now = System.currentTimeMillis();
            if (b == null || now > b.resetTimeMillis) {
                RateBucket newBucket = new RateBucket();
                newBucket.count.set(1);
                newBucket.resetTimeMillis = now + 60000;
                return newBucket;
            }
            b.count.incrementAndGet();
            return b;
        });

        return bucket.count.get() <= requestsPerMinute;
    }
}
