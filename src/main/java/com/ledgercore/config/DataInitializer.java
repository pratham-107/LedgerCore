package com.ledgercore.config;

import com.ledgercore.model.*;
import com.ledgercore.repository.AccountRepository;
import com.ledgercore.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.math.BigDecimal;

@Slf4j
@Component
@RequiredArgsConstructor
public class DataInitializer implements CommandLineRunner {

    private final UserRepository userRepository;
    private final AccountRepository accountRepository;
    private final PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) {
        // Seed default admin user if no users exist
        if (userRepository.count() == 0) {
            User admin = User.builder()
                    .email("admin@ledgercore.com")
                    .passwordHash(passwordEncoder.encode("SecurePass123!"))
                    .role(Role.ADMIN)
                    .isActive(true)
                    .build();
            userRepository.save(admin);

            User accountant = User.builder()
                    .email("accountant@ledgercore.com")
                    .passwordHash(passwordEncoder.encode("SecurePass123!"))
                    .role(Role.ACCOUNTANT)
                    .isActive(true)
                    .build();
            userRepository.save(accountant);

            User viewer = User.builder()
                    .email("viewer@ledgercore.com")
                    .passwordHash(passwordEncoder.encode("SecurePass123!"))
                    .role(Role.VIEWER)
                    .isActive(true)
                    .build();
            userRepository.save(viewer);

            log.info("Initialized default users: admin@ledgercore.com, accountant@ledgercore.com, viewer@ledgercore.com (Password: SecurePass123!)");
        }

        // Seed default chart of accounts if empty
        if (accountRepository.count() == 0) {
            Account cash = Account.builder()
                    .accountNumber("ACC-2024-001")
                    .name("Cash on Hand")
                    .type(AccountType.ASSET)
                    .category(AccountCategory.CURRENT_ASSET)
                    .currency("USD")
                    .balance(new BigDecimal("50000.00"))
                    .isActive(true)
                    .build();
            accountRepository.save(cash);

            Account bank = Account.builder()
                    .accountNumber("ACC-2024-002")
                    .name("Operating Bank Account")
                    .type(AccountType.ASSET)
                    .category(AccountCategory.CURRENT_ASSET)
                    .currency("USD")
                    .balance(new BigDecimal("25000.00"))
                    .isActive(true)
                    .build();
            accountRepository.save(bank);

            Account accountsPayable = Account.builder()
                    .accountNumber("ACC-2024-003")
                    .name("Accounts Payable")
                    .type(AccountType.LIABILITY)
                    .category(AccountCategory.CURRENT_LIABILITY)
                    .currency("USD")
                    .balance(new BigDecimal("20000.00"))
                    .isActive(true)
                    .build();
            accountRepository.save(accountsPayable);

            Account commonStock = Account.builder()
                    .accountNumber("ACC-2024-004")
                    .name("Common Stock Equity")
                    .type(AccountType.EQUITY)
                    .category(AccountCategory.EQUITY)
                    .currency("USD")
                    .balance(new BigDecimal("55000.00"))
                    .isActive(true)
                    .build();
            accountRepository.save(commonStock);

            Account productSales = Account.builder()
                    .accountNumber("ACC-2024-005")
                    .name("Product Sales Revenue")
                    .type(AccountType.REVENUE)
                    .category(AccountCategory.PRODUCT_SALES)
                    .currency("USD")
                    .balance(BigDecimal.ZERO)
                    .isActive(true)
                    .build();
            accountRepository.save(productSales);

            Account officeSupplies = Account.builder()
                    .accountNumber("ACC-2024-006")
                    .name("Office Supplies Expense")
                    .type(AccountType.EXPENSE)
                    .category(AccountCategory.OFFICE_SUPPLIES)
                    .currency("USD")
                    .balance(BigDecimal.ZERO)
                    .isActive(true)
                    .build();
            accountRepository.save(officeSupplies);

            Account rentExpense = Account.builder()
                    .accountNumber("ACC-2024-007")
                    .name("Office Rent Expense")
                    .type(AccountType.EXPENSE)
                    .category(AccountCategory.RENT)
                    .currency("USD")
                    .balance(BigDecimal.ZERO)
                    .isActive(true)
                    .build();
            accountRepository.save(rentExpense);

            log.info("Initialized default Chart of Accounts (ACC-2024-001 to ACC-2024-007)");
        }
    }
}
