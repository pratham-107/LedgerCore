package com.ledgercore.repository;

import com.ledgercore.model.Transaction;
import com.ledgercore.model.TransactionStatus;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.time.Instant;
import java.util.Optional;

@Repository
public interface TransactionRepository extends MongoRepository<Transaction, String> {
    Optional<Transaction> findByTransactionId(String transactionId);
    boolean existsByTransactionId(String transactionId);

    Page<Transaction> findByStatus(TransactionStatus status, Pageable pageable);
    Page<Transaction> findByCreatedBy(String createdBy, Pageable pageable);
    Page<Transaction> findByCreatedAtBetween(Instant start, Instant end, Pageable pageable);
}
