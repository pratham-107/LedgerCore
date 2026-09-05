# LedgerCore — API Reference

## Base URL

```
Development: http://localhost:8080/api/v1
Production:  https://api.ledgercore.com/api/v1
```

## Authentication

All protected endpoints require a Bearer token in the `Authorization` header.

```
Authorization: Bearer <jwt_token>
```

### Token Lifecycle

- **Access Token**: Valid for 24 hours (configurable)
- **Refresh Token**: Valid for 7 days
- **Token Format**: JWT (HS256 algorithm)

---

## Auth Endpoints

### POST /auth/register

Register a new user account.

**Request:**
```json
{
  "email": "user@example.com",
  "password": "SecurePass123!",
  "role": "ACCOUNTANT"
}
```

**Response (201 Created):**
```json
{
  "userId": "507f1f77bcf86cd799439011",
  "email": "user@example.com",
  "role": "ACCOUNTANT",
  "createdAt": "2024-01-15T10:30:00Z"
}
```

**Error Responses:**
- `409 Conflict` — Email already registered
- `400 Bad Request` — Invalid password format

---

### POST /auth/login

Authenticate and receive JWT tokens.

**Request:**
```json
{
  "email": "user@example.com",
  "password": "SecurePass123!"
}
```

**Response (200 OK):**
```json
{
  "accessToken": "eyJhbGciOiJIUzI1NiIs...",
  "refreshToken": "eyJhbGciOiJIUzI1NiIs...",
  "tokenType": "Bearer",
  "expiresIn": 86400,
  "user": {
    "userId": "507f1f77bcf86cd799439011",
    "email": "user@example.com",
    "role": "ACCOUNTANT"
  }
}
```

**Error Responses:**
- `401 Unauthorized` — Invalid credentials
- `423 Locked` — Account locked due to failed attempts

---

### POST /auth/refresh

Refresh an expired access token.

**Request:**
```json
{
  "refreshToken": "eyJhbGciOiJIUzI1NiIs..."
}
```

**Response (200 OK):**
```json
{
  "accessToken": "eyJhbGciOiJIUzI1NiIs...",
  "expiresIn": 86400
}
```

---

## Account Endpoints

### POST /accounts

Create a new ledger account.

**Roles:** ADMIN, ACCOUNTANT

**Request:**
```json
{
  "name": "Office Supplies Expense",
  "type": "EXPENSE",
  "category": "OPERATING_EXPENSE",
  "currency": "USD",
  "openingBalance": 0.00
}
```

**Response (201 Created):**
```json
{
  "accountId": "507f1f77bcf86cd799439012",
  "accountNumber": "ACC-2024-015",
  "name": "Office Supplies Expense",
  "type": "EXPENSE",
  "category": "OPERATING_EXPENSE",
  "currency": "USD",
  "balance": 0.00,
  "createdAt": "2024-01-15T10:35:00Z"
}
```

---

### GET /accounts

List all accounts with pagination.

**Query Parameters:**
| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `page` | int | 0 | Page number |
| `size` | int | 20 | Page size |
| `type` | string | — | Filter by account type |
| `active` | boolean | true | Filter by active status |

**Response (200 OK):**
```json
{
  "content": [
    {
      "accountId": "507f1f77bcf86cd799439012",
      "accountNumber": "ACC-2024-015",
      "name": "Office Supplies Expense",
      "type": "EXPENSE",
      "balance": 1250.00,
      "currency": "USD"
    }
  ],
  "totalElements": 45,
  "totalPages": 3,
  "currentPage": 0
}
```

---

### GET /accounts/{accountId}/balance

Get current balance and recent activity.

**Response (200 OK):**
```json
{
  "accountId": "507f1f77bcf86cd799439012",
  "currentBalance": 1250.00,
  "currency": "USD",
  "lastTransactionDate": "2024-01-20T14:22:00Z",
  "transactionCount": 15
}
```

---

## Transaction Endpoints

### POST /transactions

Create a double-entry transaction.

**Roles:** ADMIN, ACCOUNTANT

**Request:**
```json
{
  "description": "Monthly Office Rent",
  "currency": "USD",
  "reference": "INV-2024-001",
  "entries": [
    {
      "accountId": "507f1f77bcf86cd799439013",
      "type": "DEBIT",
      "amount": 2000.00
    },
    {
      "accountId": "507f1f77bcf86cd799439014",
      "type": "CREDIT",
      "amount": 2000.00
    }
  ]
}
```

**Validation Rules:**
- Sum of all debits must equal sum of all credits
- Minimum 2 entries required
- All accountIds must exist and be active
- Currency must match account currencies

**Response (201 Created):**
```json
{
  "transactionId": "TXN-a1b2c3d4-e5f6-7890-abcd-ef1234567890",
  "description": "Monthly Office Rent",
  "totalAmount": 2000.00,
  "currency": "USD",
  "status": "POSTED",
  "entries": [
    {
      "entryId": "ENT-001",
      "accountId": "507f1f77bcf86cd799439013",
      "type": "DEBIT",
      "amount": 2000.00,
      "runningBalance": 2000.00
    },
    {
      "entryId": "ENT-002",
      "accountId": "507f1f77bcf86cd799439014",
      "type": "CREDIT",
      "amount": 2000.00,
      "runningBalance": 8000.00
    }
  ],
  "createdAt": "2024-01-15T11:00:00Z"
}
```

**Error Responses:**
- `400 Bad Request` — Debit/credit mismatch or invalid entries
- `404 Not Found` — Account not found
- `409 Conflict` — Concurrent modification detected

---

### POST /transactions/{transactionId}/reverse

Reverse a posted transaction by creating an inverse entry.

**Roles:** ADMIN, ACCOUNTANT

**Response (201 Created):**
```json
{
  "originalTransactionId": "TXN-a1b2c3d4...",
  "reversalTransactionId": "TXN-rev-9876...",
  "status": "REVERSED",
  "reversedAt": "2024-01-16T09:00:00Z"
}
```

---

### POST /transactions/import

Bulk import transactions from CSV.

**Content-Type:** `multipart/form-data`

**Request:**
```
file: transactions.csv
```

**CSV Format:**
```csv
description,currency,debit_account,debit_amount,credit_account,credit_amount
Office Supplies,USD,ACC-001,150.00,ACC-002,150.00
Internet Bill,USD,ACC-003,89.99,ACC-002,89.99
```

**Response (200 OK):**
```json
{
  "totalRows": 50,
  "successful": 48,
  "failed": 2,
  "errors": [
    {
      "row": 12,
      "error": "ACCOUNT_NOT_FOUND",
      "detail": "ACC-999 does not exist"
    },
    {
      "row": 35,
      "error": "DEBIT_CREDIT_MISMATCH",
      "detail": "Debits (100.00) != Credits (1000.00)"
    }
  ]
}
```

---

## Report Endpoints

### GET /reports/pnl

Monthly Profit & Loss statement.

**Query Parameters:**
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `year` | int | Yes | Fiscal year |
| `month` | int | Yes | Month (1-12) |
| `currency` | string | No | Filter by currency (default: all) |

**Response (200 OK):**
```json
{
  "period": "2024-01",
  "currency": "USD",
  "revenue": {
    "total": 50000.00,
    "breakdown": [
      { "category": "PRODUCT_SALES", "amount": 45000.00 },
      { "category": "SERVICE_REVENUE", "amount": 5000.00 }
    ]
  },
  "expenses": {
    "total": 32500.00,
    "breakdown": [
      { "category": "SALARIES", "amount": 25000.00 },
      { "category": "RENT", "amount": 5000.00 },
      { "category": "UTILITIES", "amount": 2500.00 }
    ]
  },
  "netIncome": 17500.00,
  "margin": 35.0
}
```

---

### GET /reports/balance-sheet

Balance sheet as of a specific date.

**Query Parameters:**
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `asOf` | date | No | Date (default: today) |

**Response (200 OK):**
```json
{
  "asOf": "2024-01-31",
  "assets": {
    "current": 75000.00,
    "fixed": 50000.00,
    "total": 125000.00
  },
  "liabilities": {
    "current": 20000.00,
    "longTerm": 30000.00,
    "total": 50000.00
  },
  "equity": 75000.00,
  "balanced": true
}
```

---

## Error Response Format

All errors follow this structure:

```json
{
  "timestamp": "2024-01-15T12:00:00Z",
  "status": 400,
  "error": "INVALID_TRANSACTION",
  "message": "Sum of debits (150.00) does not equal sum of credits (1500.00)",
  "path": "/api/v1/transactions",
  "details": {
    "debitTotal": 150.00,
    "creditTotal": 1500.00
  }
}
```

### Error Codes

| Code | HTTP Status | Description |
|------|-------------|-------------|
| `INVALID_TRANSACTION` | 400 | Transaction validation failed |
| `ACCOUNT_NOT_FOUND` | 404 | Referenced account does not exist |
| `INSUFFICIENT_BALANCE` | 400 | Account balance too low for debit |
| `CONCURRENT_MODIFICATION` | 409 | Account was modified by another request |
| `UNAUTHORIZED` | 401 | Missing or invalid JWT |
| `FORBIDDEN` | 403 | User lacks required role |
| `RATE_LIMIT_EXCEEDED` | 429 | Too many requests |
| `INTERNAL_ERROR` | 500 | Unexpected server error |
