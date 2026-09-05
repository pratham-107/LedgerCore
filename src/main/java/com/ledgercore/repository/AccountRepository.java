package com.ledgercore.repository;

import com.ledgercore.model.Account;
import com.ledgercore.model.AccountType;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface AccountRepository extends MongoRepository<Account, String> {
    Optional<Account> findByAccountNumber(String accountNumber);
    boolean existsByAccountNumber(String accountNumber);

    Page<Account> findByIsActive(boolean isActive, Pageable pageable);
    Page<Account> findByTypeAndIsActive(AccountType type, boolean isActive, Pageable pageable);
    Page<Account> findByType(AccountType type, Pageable pageable);

    List<Account> findByIsActive(boolean isActive);
    List<Account> findByType(AccountType type);
    long countByAccountNumberStartingWith(String prefix);
}
