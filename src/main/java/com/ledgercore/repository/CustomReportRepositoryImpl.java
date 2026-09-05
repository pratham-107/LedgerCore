package com.ledgercore.repository;

import com.ledgercore.dto.report.*;
import com.ledgercore.model.Account;
import com.ledgercore.model.AccountCategory;
import com.ledgercore.model.AccountType;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.bson.Document;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.core.aggregation.*;
import org.springframework.data.mongodb.core.query.Criteria;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.Instant;
import java.time.LocalDate;
import java.time.YearMonth;
import java.time.ZoneOffset;
import java.util.*;

import static org.springframework.data.mongodb.core.aggregation.Aggregation.*;

@Slf4j
@Repository
@RequiredArgsConstructor
public class CustomReportRepositoryImpl implements CustomReportRepository {

    private final MongoTemplate mongoTemplate;
    private final AccountRepository accountRepository;

    @Override
    public PnlReportResponse generatePnlReport(int year, int month, String currency) {
        YearMonth yearMonth = YearMonth.of(year, month);
        Instant startOfMonth = yearMonth.atDay(1).atStartOfDay().toInstant(ZoneOffset.UTC);
        Instant endOfMonth = yearMonth.atEndOfMonth().atTime(23, 59, 59, 999999999).toInstant(ZoneOffset.UTC);

        String period = String.format("%04d-%02d", year, month);

        List<Criteria> matchCriteria = new ArrayList<>();
        matchCriteria.add(Criteria.where("createdAt").gte(startOfMonth).lte(endOfMonth));
        if (currency != null && !currency.isBlank() && !"ALL".equalsIgnoreCase(currency)) {
            matchCriteria.add(Criteria.where("currency").is(currency));
        }

        Aggregation aggregation = Aggregation.newAggregation(
                match(new Criteria().andOperator(matchCriteria.toArray(new Criteria[0]))),
                lookup("accounts", "accountId", "_id", "accountDoc"),
                unwind("accountDoc", true),
                project("amount", "entryType", "currency", "createdAt")
                        .and("accountDoc.type").as("accountType")
                        .and("accountDoc.category").as("accountCategory")
        );

        AggregationResults<Document> results = mongoTemplate.aggregate(aggregation, "ledger_entries", Document.class);
        List<Document> entries = results.getMappedResults();

        // If lookup with _id didn't match because of ObjectId vs String format, fallback lookup by string
        if (entries.isEmpty() || entries.stream().allMatch(d -> d.get("accountType") == null)) {
            // Alternative lookup: load accounts map
            List<Account> allAccounts = accountRepository.findAll();
            Map<String, Account> accountMap = new HashMap<>();
            for (Account acc : allAccounts) {
                if (acc.getId() != null) accountMap.put(acc.getId(), acc);
                if (acc.getAccountNumber() != null) accountMap.put(acc.getAccountNumber(), acc);
            }

            // query entries directly
            Aggregation rawAgg = Aggregation.newAggregation(
                    match(new Criteria().andOperator(matchCriteria.toArray(new Criteria[0])))
            );
            List<Document> rawEntries = mongoTemplate.aggregate(rawAgg, "ledger_entries", Document.class).getMappedResults();

            Map<String, BigDecimal> revenueCategoryMap = new LinkedHashMap<>();
            Map<String, BigDecimal> expenseCategoryMap = new LinkedHashMap<>();
            BigDecimal totalRev = BigDecimal.ZERO;
            BigDecimal totalExp = BigDecimal.ZERO;

            for (Document doc : rawEntries) {
                String accId = doc.getString("accountId");
                Account acc = accountMap.get(accId);
                if (acc == null) continue;

                Object amtObj = doc.get("amount");
                BigDecimal amount = toBigDecimal(amtObj);
                String entryType = doc.getString("entryType");
                String cat = acc.getCategory() != null ? acc.getCategory().name() : "OTHER";

                if (acc.getType() == AccountType.REVENUE) {
                    BigDecimal effect = "CREDIT".equalsIgnoreCase(entryType) ? amount : amount.negate();
                    totalRev = totalRev.add(effect);
                    revenueCategoryMap.merge(cat, effect, BigDecimal::add);
                } else if (acc.getType() == AccountType.EXPENSE) {
                    BigDecimal effect = "DEBIT".equalsIgnoreCase(entryType) ? amount : amount.negate();
                    totalExp = totalExp.add(effect);
                    expenseCategoryMap.merge(cat, effect, BigDecimal::add);
                }
            }

            return buildPnlResponse(period, currency != null ? currency : "USD", totalRev, revenueCategoryMap, totalExp, expenseCategoryMap);
        }

        Map<String, BigDecimal> revenueCategoryMap = new LinkedHashMap<>();
        Map<String, BigDecimal> expenseCategoryMap = new LinkedHashMap<>();
        BigDecimal totalRev = BigDecimal.ZERO;
        BigDecimal totalExp = BigDecimal.ZERO;

        for (Document doc : entries) {
            String accType = doc.getString("accountType");
            String accCategory = doc.getString("accountCategory");
            if (accCategory == null) accCategory = "OTHER";
            String entryType = doc.getString("entryType");
            BigDecimal amount = toBigDecimal(doc.get("amount"));

            if ("REVENUE".equalsIgnoreCase(accType)) {
                BigDecimal effect = "CREDIT".equalsIgnoreCase(entryType) ? amount : amount.negate();
                totalRev = totalRev.add(effect);
                revenueCategoryMap.merge(accCategory, effect, BigDecimal::add);
            } else if ("EXPENSE".equalsIgnoreCase(accType)) {
                BigDecimal effect = "DEBIT".equalsIgnoreCase(entryType) ? amount : amount.negate();
                totalExp = totalExp.add(effect);
                expenseCategoryMap.merge(accCategory, effect, BigDecimal::add);
            }
        }

        return buildPnlResponse(period, currency != null ? currency : "USD", totalRev, revenueCategoryMap, totalExp, expenseCategoryMap);
    }

    private PnlReportResponse buildPnlResponse(
            String period,
            String currency,
            BigDecimal totalRev,
            Map<String, BigDecimal> revenueCategoryMap,
            BigDecimal totalExp,
            Map<String, BigDecimal> expenseCategoryMap
    ) {
        List<CategoryAmount> revBreakdown = new ArrayList<>();
        revenueCategoryMap.forEach((k, v) -> revBreakdown.add(new CategoryAmount(k, v.setScale(2, RoundingMode.HALF_UP))));

        List<CategoryAmount> expBreakdown = new ArrayList<>();
        expenseCategoryMap.forEach((k, v) -> expBreakdown.add(new CategoryAmount(k, v.setScale(2, RoundingMode.HALF_UP))));

        BigDecimal netIncome = totalRev.subtract(totalExp).setScale(2, RoundingMode.HALF_UP);
        BigDecimal margin = BigDecimal.ZERO;
        if (totalRev.compareTo(BigDecimal.ZERO) > 0) {
            margin = netIncome.divide(totalRev, 4, RoundingMode.HALF_UP)
                    .multiply(BigDecimal.valueOf(100))
                    .setScale(1, RoundingMode.HALF_UP);
        }

        return PnlReportResponse.builder()
                .period(period)
                .currency(currency)
                .revenue(RevenueReport.builder()
                        .total(totalRev.setScale(2, RoundingMode.HALF_UP))
                        .breakdown(revBreakdown)
                        .build())
                .expenses(ExpenseReport.builder()
                        .total(totalExp.setScale(2, RoundingMode.HALF_UP))
                        .breakdown(expBreakdown)
                        .build())
                .netIncome(netIncome)
                .margin(margin)
                .build();
    }

    @Override
    public BalanceSheetResponse generateBalanceSheet(LocalDate asOf) {
        LocalDate date = asOf != null ? asOf : LocalDate.now();
        List<Account> accounts = accountRepository.findAll();

        BigDecimal currentAssets = BigDecimal.ZERO;
        BigDecimal fixedAssets = BigDecimal.ZERO;

        BigDecimal currentLiabilities = BigDecimal.ZERO;
        BigDecimal longTermLiabilities = BigDecimal.ZERO;

        BigDecimal totalEquity = BigDecimal.ZERO;

        for (Account account : accounts) {
            BigDecimal bal = account.getBalance() != null ? account.getBalance() : BigDecimal.ZERO;
            if (account.getType() == AccountType.ASSET) {
                if (account.getCategory() == AccountCategory.CURRENT_ASSET) {
                    currentAssets = currentAssets.add(bal);
                } else {
                    fixedAssets = fixedAssets.add(bal);
                }
            } else if (account.getType() == AccountType.LIABILITY) {
                if (account.getCategory() == AccountCategory.CURRENT_LIABILITY) {
                    currentLiabilities = currentLiabilities.add(bal);
                } else {
                    longTermLiabilities = longTermLiabilities.add(bal);
                }
            } else if (account.getType() == AccountType.EQUITY || account.getType() == AccountType.REVENUE) {
                totalEquity = totalEquity.add(bal);
            } else if (account.getType() == AccountType.EXPENSE) {
                totalEquity = totalEquity.subtract(bal);
            }
        }

        BigDecimal totalAssets = currentAssets.add(fixedAssets).setScale(2, RoundingMode.HALF_UP);
        BigDecimal totalLiabilities = currentLiabilities.add(longTermLiabilities).setScale(2, RoundingMode.HALF_UP);
        totalEquity = totalEquity.setScale(2, RoundingMode.HALF_UP);

        boolean isBalanced = totalAssets.compareTo(totalLiabilities.add(totalEquity)) == 0;

        return BalanceSheetResponse.builder()
                .asOf(date)
                .assets(AssetReport.builder()
                        .current(currentAssets.setScale(2, RoundingMode.HALF_UP))
                        .fixed(fixedAssets.setScale(2, RoundingMode.HALF_UP))
                        .total(totalAssets)
                        .build())
                .liabilities(LiabilityReport.builder()
                        .current(currentLiabilities.setScale(2, RoundingMode.HALF_UP))
                        .longTerm(longTermLiabilities.setScale(2, RoundingMode.HALF_UP))
                        .total(totalLiabilities)
                        .build())
                .equity(totalEquity)
                .balanced(isBalanced)
                .build();
    }

    @Override
    public CategorySpendingResponse generateCategorySpending(LocalDate startDate, LocalDate endDate, String currency) {
        LocalDate start = startDate != null ? startDate : LocalDate.now().withDayOfMonth(1);
        LocalDate end = endDate != null ? endDate : LocalDate.now();

        Instant startInstant = start.atStartOfDay().toInstant(ZoneOffset.UTC);
        Instant endInstant = end.atTime(23, 59, 59, 999999999).toInstant(ZoneOffset.UTC);

        String period = start + " to " + end;

        List<Account> expenseAccounts = accountRepository.findByType(AccountType.EXPENSE);
        Map<String, Account> accountMap = new HashMap<>();
        for (Account a : expenseAccounts) {
            if (a.getId() != null) accountMap.put(a.getId(), a);
            if (a.getAccountNumber() != null) accountMap.put(a.getAccountNumber(), a);
        }

        List<Criteria> matchCriteria = new ArrayList<>();
        matchCriteria.add(Criteria.where("createdAt").gte(startInstant).lte(endInstant));
        if (currency != null && !currency.isBlank() && !"ALL".equalsIgnoreCase(currency)) {
            matchCriteria.add(Criteria.where("currency").is(currency));
        }

        Aggregation aggregation = Aggregation.newAggregation(
                match(new Criteria().andOperator(matchCriteria.toArray(new Criteria[0])))
        );

        List<Document> rawEntries = mongoTemplate.aggregate(aggregation, "ledger_entries", Document.class).getMappedResults();
        Map<String, BigDecimal> spendingByCategory = new LinkedHashMap<>();
        BigDecimal totalSpending = BigDecimal.ZERO;

        for (Document doc : rawEntries) {
            String accId = doc.getString("accountId");
            Account acc = accountMap.get(accId);
            if (acc == null) continue;

            BigDecimal amount = toBigDecimal(doc.get("amount"));
            String entryType = doc.getString("entryType");
            BigDecimal effect = "DEBIT".equalsIgnoreCase(entryType) ? amount : amount.negate();

            String cat = acc.getCategory() != null ? acc.getCategory().name() : "OTHER_EXPENSE";
            totalSpending = totalSpending.add(effect);
            spendingByCategory.merge(cat, effect, BigDecimal::add);
        }

        List<CategoryAmount> breakdown = new ArrayList<>();
        spendingByCategory.forEach((k, v) -> breakdown.add(new CategoryAmount(k, v.setScale(2, RoundingMode.HALF_UP))));

        return CategorySpendingResponse.builder()
                .period(period)
                .currency(currency != null ? currency : "USD")
                .totalSpending(totalSpending.setScale(2, RoundingMode.HALF_UP))
                .categories(breakdown)
                .build();
    }

    private BigDecimal toBigDecimal(Object value) {
        if (value == null) return BigDecimal.ZERO;
        if (value instanceof BigDecimal bd) return bd;
        if (value instanceof Number num) return BigDecimal.valueOf(num.doubleValue());
        try {
            return new BigDecimal(value.toString());
        } catch (Exception e) {
            return BigDecimal.ZERO;
        }
    }
}
