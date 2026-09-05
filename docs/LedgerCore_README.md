# LedgerCore

> A production-grade financial transaction engine built with Java Spring Boot, featuring double-entry bookkeeping, multi-currency support, and role-based access control.

[![Java](https://img.shields.io/badge/Java-17-orange)](https://openjdk.org/)
[![Spring Boot](https://img.shields.io/badge/Spring%20Boot-3.2-brightgreen)](https://spring.io/projects/spring-boot)
[![MongoDB](https://img.shields.io/badge/MongoDB-7.0-green)](https://www.mongodb.com/)
[![Docker](https://img.shields.io/badge/Docker-Compose-blue)](https://www.docker.com/)

---

## Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Architecture](#architecture)
- [Getting Started](#getting-started)
- [API Documentation](#api-documentation)
- [Database Schema](#database-schema)
- [Security](#security)
- [Testing](#testing)
- [Deployment](#deployment)

---

## Overview

LedgerCore is a RESTful financial transaction API designed for small-to-medium businesses requiring robust double-entry bookkeeping. It handles concurrent balance updates with MongoDB transactions, supports multiple currencies with real-time conversion tracking, and enforces granular role-based access control.

### Why This Project?

- Demonstrates **enterprise Java backend architecture** independent of Node.js
- Showcases **MongoDB aggregation pipelines** for financial reporting
- Implements **Spring Security JWT** with custom RBAC
- Containerized with **Docker Compose** for one-command local setup

---

## Features

| Feature | Description |
|---------|-------------|
| **Double-Entry Bookkeeping** | Every transaction creates exactly two ledger entries (debit + credit) with zero-sum validation |
| **Multi-Currency Support** | Base currency + foreign currency tracking with exchange rate snapshots |
| **Atomic Transactions** | MongoDB multi-document ACID transactions for balance updates |
| **RBAC** | Spring Security with JWT — Admin, Accountant, Viewer roles |
| **Financial Reports** | Monthly P&L, balance sheet, and category breakdown via aggregation pipelines |
| **Batch Processing** | CSV import/export for bulk transaction entry |
| **Rate Limiting** | Redis-backed request throttling per API key |
| **OpenAPI Docs** | Auto-generated Swagger UI at `/swagger-ui.html` |

---

## Tech Stack

| Layer | Technology |
|-------|------------|
| **Language** | Java 17 (LTS) |
| **Framework** | Spring Boot 3.2 |
| **Security** | Spring Security 6, JWT (jjwt) |
| **Database** | MongoDB 7.0 |
| **Cache** | Redis (rate limiting) |
| **Documentation** | SpringDoc OpenAPI |
| **Testing** | JUnit 5, Mockito, Testcontainers |
| **Containerization** | Docker, Docker Compose |
| **Build Tool** | Maven |

---

## Architecture

LedgerCore follows a **layered architecture** with clear separation of concerns:

```
Controller Layer (REST Endpoints)
  -> Validation, DTO Mapping, Auth Checks
Service Layer (Business Logic)
  -> Transaction Orchestration, Reporting
Repository Layer (Data Access)
  -> MongoDB Queries, Aggregation Pipelines
Domain Layer (Entities & Value Objects)
  -> Account, Transaction, LedgerEntry
```

### Key Design Decisions

1. **Immutable Ledger Entries** — Once created, ledger entries cannot be modified. Corrections create reversal entries.
2. **Event-Driven Reporting** — Financial reports are pre-computed via MongoDB change streams and cached.
3. **Optimistic Locking** — Account documents use versioning (`@Version`) to prevent concurrent modification conflicts.

---

## Getting Started

### Prerequisites

- Java 17+
- Maven 3.9+
- Docker & Docker Compose
- Git

### Quick Start

```bash
# Clone the repository
git clone https://github.com/yourusername/ledgercore.git
cd ledgercore

# Start infrastructure (MongoDB + Redis)
docker-compose up -d

# Run the application
./mvnw spring-boot:run

# Access Swagger UI
open http://localhost:8080/swagger-ui.html
```

### Environment Variables

| Variable | Default | Description |
|----------|---------|-------------|
| `MONGODB_URI` | `mongodb://localhost:27017/ledgercore` | MongoDB connection string |
| `REDIS_HOST` | `localhost` | Redis host for rate limiting |
| `JWT_SECRET` | *(required)* | Base64-encoded JWT signing key |
| `JWT_EXPIRATION` | `86400000` | Token expiry in ms (24h) |
| `SERVER_PORT` | `8080` | Application port |

---

## API Documentation

### Authentication

All endpoints (except `/auth/**`) require a Bearer token:

```
Authorization: Bearer <jwt_token>
```

### Core Endpoints

#### Accounts
| Method | Endpoint | Description | Roles |
|--------|----------|-------------|-------|
| `POST` | `/api/v1/accounts` | Create new account | Admin, Accountant |
| `GET` | `/api/v1/accounts` | List all accounts | All |
| `GET` | `/api/v1/accounts/{id}` | Get account by ID | All |
| `GET` | `/api/v1/accounts/{id}/balance` | Get current balance | All |
| `PATCH` | `/api/v1/accounts/{id}` | Update account metadata | Admin, Accountant |

#### Transactions
| Method | Endpoint | Description | Roles |
|--------|----------|-------------|-------|
| `POST` | `/api/v1/transactions` | Create double-entry transaction | Admin, Accountant |
| `GET` | `/api/v1/transactions` | List transactions (paginated) | All |
| `GET` | `/api/v1/transactions/{id}` | Get transaction details | All |
| `POST` | `/api/v1/transactions/{id}/reverse` | Reverse a transaction | Admin, Accountant |
| `POST` | `/api/v1/transactions/import` | Bulk import from CSV | Admin, Accountant |
| `GET` | `/api/v1/transactions/export` | Export to CSV | All |

#### Reports
| Method | Endpoint | Description | Roles |
|--------|----------|-------------|-------|
| `GET` | `/api/v1/reports/pnl` | Monthly Profit & Loss | All |
| `GET` | `/api/v1/reports/balance-sheet` | Balance Sheet | All |
| `GET` | `/api/v1/reports/categories` | Spending by Category | All |

#### Auth
| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/auth/register` | Register new user |
| `POST` | `/auth/login` | Authenticate and get JWT |
| `POST` | `/auth/refresh` | Refresh access token |

### Sample Request: Create Transaction

```bash
curl -X POST http://localhost:8080/api/v1/transactions \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{
    "description": "Office Supplies",
    "currency": "USD",
    "entries": [
      { "accountId": "acc_123", "type": "DEBIT", "amount": 150.00 },
      { "accountId": "acc_456", "type": "CREDIT", "amount": 150.00 }
    ]
  }'
```

---

## Database Schema

### Collections

#### `accounts`
```json
{
  "_id": "ObjectId",
  "accountNumber": "ACC-2024-001",
  "name": "Cash",
  "type": "ASSET",
  "category": "CURRENT_ASSET",
  "currency": "USD",
  "balance": 50000.00,
  "version": 12,
  "createdAt": "ISODate",
  "updatedAt": "ISODate",
  "isActive": true
}
```

#### `transactions`
```json
{
  "_id": "ObjectId",
  "transactionId": "TXN-uuid",
  "description": "Office Supplies",
  "currency": "USD",
  "exchangeRate": 1.0,
  "totalAmount": 150.00,
  "status": "POSTED",
  "createdBy": "user_id",
  "createdAt": "ISODate",
  "reversedBy": null,
  "reversalTransactionId": null
}
```

#### `ledger_entries`
```json
{
  "_id": "ObjectId",
  "transactionId": "TXN-uuid",
  "accountId": "ObjectId",
  "entryType": "DEBIT",
  "amount": 150.00,
  "currency": "USD",
  "runningBalance": 50150.00,
  "createdAt": "ISODate"
}
```

#### `users`
```json
{
  "_id": "ObjectId",
  "email": "admin@ledgercore.com",
  "passwordHash": "bcrypt_hash",
  "role": "ADMIN",
  "isActive": true,
  "createdAt": "ISODate"
}
```

### Indexes

```javascript
// Accounts
db.accounts.createIndex({ "accountNumber": 1 }, { unique: true })
db.accounts.createIndex({ "type": 1, "category": 1 })

// Transactions
db.transactions.createIndex({ "transactionId": 1 }, { unique: true })
db.transactions.createIndex({ "createdAt": -1 })
db.transactions.createIndex({ "createdBy": 1, "createdAt": -1 })

// Ledger Entries
db.ledger_entries.createIndex({ "transactionId": 1 })
db.ledger_entries.createIndex({ "accountId": 1, "createdAt": -1 })
```

---

## Security

### Authentication Flow

```
Client -> POST /auth/login -> Validate credentials -> Generate JWT -> Return token
Client -> Include token in Authorization header -> Spring Security validates -> Access granted/denied
```

### Role Hierarchy

```
ADMIN (can manage users, accounts, all transactions)
  -> ACCOUNTANT (can create transactions, manage accounts)
       -> VIEWER (read-only access to reports and data)
```

### Password Security

- BCrypt hashing with strength 12
- Enforced password policy: min 8 chars, uppercase, lowercase, number, special char
- Account lockout after 5 failed attempts (15-minute window)

---

## Testing

### Running Tests

```bash
# Unit tests
./mvnw test

# Integration tests with Testcontainers
./mvnw verify -P integration-tests

# Specific test class
./mvnw test -Dtest=TransactionServiceTest
```

### Test Coverage

| Layer | Coverage Target |
|-------|----------------|
| Service | >= 85% |
| Controller | >= 80% |
| Repository | >= 70% |

### Key Test Scenarios

- **Concurrent Transactions**: Simultaneous debits/credits to the same account
- **Zero-Sum Validation**: Reject transactions where debits != credits
- **Currency Mismatch**: Reject entries with different currencies in one transaction
- **RBAC Enforcement**: Verify endpoint access per role
- **CSV Import**: Validate malformed rows are rejected with proper error messages

---

## Deployment

### Docker Production Build

```bash
# Build image
./mvnw spring-boot:build-image -Dspring-boot.build-image.imageName=ledgercore:latest

# Run with production compose
docker-compose -f docker-compose.yml -f docker-compose.prod.yml up -d
```

### Health Checks

| Endpoint | Purpose |
|----------|---------|
| `GET /actuator/health` | Liveness probe |
| `GET /actuator/health/readiness` | Readiness probe |
| `GET /actuator/metrics` | Prometheus metrics |

---

## Author

**Pratham Singh** — Full Stack Developer
