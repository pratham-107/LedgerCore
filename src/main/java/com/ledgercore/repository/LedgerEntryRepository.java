package com.ledgercore.repository;

import com.ledgercore.model.LedgerEntry;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.time.Instant;
import java.util.List;
import java.util.Optional;

@Repository
public interface LedgerEntryRepository extends MongoRepository<LedgerEntry, String> {
    List<LedgerEntry> findByTransactionIdOrderByCreatedAtAsc(String transactionId);
    List<LedgerEntry> findByAccountIdOrderByCreatedAtDesc(String accountId);
    Optional<LedgerEntry> findFirstByAccountIdOrderByCreatedAtDesc(String accountId);
    long countByAccountId(String accountId);
    List<LedgerEntry> findByAccountIdAndCreatedAtLessThanEqualOrderByCreatedAtDesc(String accountId, Instant asOf);
}
