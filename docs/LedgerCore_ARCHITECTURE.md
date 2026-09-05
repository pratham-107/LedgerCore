# LedgerCore — Architecture Documentation

## System Architecture

```
Client Layer
  (Postman, Frontend App, CLI Tool, Swagger UI)
         |
         v
API Gateway / Load Balancer
  (Nginx / AWS ALB — rate limiting, SSL termination)
         |
         v
LedgerCore Application
  +----------------+----------------+----------------+-------------+
  | Auth Controller| Account Ctrl   | Transaction Ctrl| Report Ctrl|
  +--------+-------+--------+-------+--------+-------+------+------+
           |                |                |              |
  +--------v-------+--------v-------+--------v-------+------v------+
  | Auth Service   | Account Service| Transaction Svc| Report Svc |
  +--------+-------+--------+-------+--------+-------+------+------+
           |                |                |              |
  +--------v-------+--------v-------+--------v-------+------v------+
  | User Repo      | Account Repo   | Transaction Repo| MongoDB    |
  +----------------+----------------+----------------+ Aggregation|
         |                |                |              |
         v                v                v              v
    MongoDB          MongoDB          MongoDB         Redis
    (Users)          (Accounts)       (Transactions   (Cache &
                                      & Entries)      Rate Limit)
```

## Component Breakdown

### 1. Controller Layer
- **Responsibility**: HTTP request handling, input validation (Bean Validation), DTO mapping
- **Exception Handling**: Global `@ControllerAdvice` converts exceptions to standardized error responses
- **Security**: `@PreAuthorize` annotations enforce role-based access

### 2. Service Layer
- **Responsibility**: Business logic orchestration, transaction boundaries
- **Key Pattern**: All write operations are wrapped in `@Transactional` with MongoDB sessions
- **Validation**: Double-entry validation (sum of debits = sum of credits) before persistence

### 3. Repository Layer
- **Responsibility**: Data access abstraction via Spring Data MongoDB
- **Custom Queries**: Aggregation pipelines for financial reports
- **Optimistic Locking**: `@Version` field on Account documents prevents lost updates

### 4. Domain Model

```
Account (1) <-----> (N) LedgerEntry (N) <-----> (1) Transaction
  accountNumber          entryType                   transactionId
  name                   amount                      description
  type                   currency                    totalAmount
  balance                runningBalance              status
  version                createdAt                   createdAt
```

## Transaction Flow

### Creating a Transaction (Double-Entry)

```
1. Client POST /api/v1/transactions
   -> Request body: description, currency, entries[]

2. Controller validates DTO (Bean Validation)

3. TransactionService.createTransaction():
   a. Validate entries: sum(debits) == sum(credits)
   b. Validate all accountIds exist and are active
   c. Start MongoDB session + transaction
   d. For each entry:
      - Lock account document (findAndModify with version check)
      - Update account balance
      - Create ledger entry with running balance
   e. Create transaction document
   f. Commit MongoDB transaction
   g. If any step fails -> abort transaction, throw exception

4. Return TransactionResponse with generated IDs
```

## Reporting Architecture

Financial reports use MongoDB Aggregation Pipelines:

### Monthly P&L Pipeline
```javascript
db.ledger_entries.aggregate([
  { $match: { createdAt: { $gte: startOfMonth, $lte: endOfMonth } } },
  { $lookup: { from: "accounts", localField: "accountId", foreignField: "_id", as: "account" } },
  { $unwind: "$account" },
  { $match: { "account.type": { $in: ["REVENUE", "EXPENSE"] } } },
  { $group: {
      _id: "$account.type",
      total: { $sum: "$amount" }
  }},
  { $project: {
      revenue: { $cond: [{ $eq: ["$_id", "REVENUE"] }, "$total", 0] },
      expenses: { $cond: [{ $eq: ["$_id", "EXPENSE"] }, "$total", 0] }
  }}
])
```

## Security Architecture

```
Request -> JWT Filter -> Authentication -> Role Check -> Endpoint Access
              |              |              |
              v              v              v
        Extract Token   Validate       @PreAuthorize
        from Header     Signature      SpEL Expression
```

## Scalability Considerations

| Bottleneck | Mitigation |
|------------|------------|
| Concurrent balance updates | Optimistic locking + retry with exponential backoff |
| Heavy report queries | Pre-computed materialized views via change streams |
| CSV import memory | Streaming parser (Apache Commons CSV) + batch inserts |
| API rate limits | Redis token bucket algorithm per user |

## Error Handling Strategy

| Exception Type | HTTP Status | Response Body |
|----------------|-------------|---------------|
| `InvalidTransactionException` | 400 Bad Request | `{ "error": "DEBIT_CREDIT_MISMATCH", "message": "..." }` |
| `AccountNotFoundException` | 404 Not Found | `{ "error": "ACCOUNT_NOT_FOUND", "accountId": "..." }` |
| `ConcurrentModificationException` | 409 Conflict | `{ "error": "ACCOUNT_MODIFIED", "retryAfter": 100 }` |
| `AccessDeniedException` | 403 Forbidden | `{ "error": "INSUFFICIENT_PRIVILEGES" }` |
| `RateLimitExceededException` | 429 Too Many Requests | `{ "error": "RATE_LIMIT_EXCEEDED", "retryAfter": 60 }` |
