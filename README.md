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

LedgerCore is a RESTful financial transaction API designed for businesses requiring robust double-entry bookkeeping. It handles concurrent balance updates with MongoDB transactions, supports multiple currencies with real-time conversion tracking, and enforces granular role-based access control.

### Why This Project?

- Demonstrates **enterprise Java backend architecture** independent of Node.js
- Showcases **MongoDB aggregation pipelines** for financial reporting (P&L, Balance Sheet, Category spending)
- Implements **Spring Security 6 with JWT** and custom RBAC (`ADMIN`, `ACCOUNTANT`, `VIEWER`)
- Containerized with **Docker & Docker Compose** for one-command local setup

---

## Features

| Feature | Description |
|---------|-------------|
| **Double-Entry Bookkeeping** | Every transaction creates balanced ledger entries (debits = credits) with zero-sum validation |
| **Multi-Currency Support** | Base currency + foreign currency tracking with exchange rate snapshots |
| **Atomic Transactions** | MongoDB multi-document ACID transactions with optimistic locking (`@Version`) |
| **RBAC** | Spring Security with JWT — Admin, Accountant, Viewer roles |
| **Financial Reports** | Monthly P&L, balance sheet, and category breakdown via aggregation pipelines |
| **Batch Processing** | CSV import/export for bulk transaction entry |
| **Rate Limiting** | Redis-backed token bucket request throttling per API key/IP |
| **OpenAPI Docs** | Auto-generated Swagger UI at `/swagger-ui.html` |

---

## Tech Stack

| Layer | Technology |
|-------|------------|
| **Language** | Java 17+ (LTS) |
| **Framework** | Spring Boot 3.2 |
| **Security** | Spring Security 6, JWT (jjwt 0.12.5) |
| **Database** | MongoDB 7.0 |
| **Cache** | Redis 7 (Rate limiting & caching) |
| **Documentation** | SpringDoc OpenAPI 3 |
| **Testing** | JUnit 5, Mockito, Spring Boot Test |
| **Containerization** | Docker, Docker Compose |
| **Build Tool** | Maven 3.9+ |

---

## Architecture

LedgerCore follows a clean **layered architecture**:

```
Controller Layer (REST Endpoints)
  -> Validation (Bean Validation), DTO Mapping, Auth & Rate Limiting
Service Layer (Business Logic)
  -> Transaction Orchestration, Double-Entry Balance Calculation, Reversals, CSV Processing
Repository Layer (Data Access)
  -> Spring Data MongoDB, Custom Aggregation Pipelines for Reports
Domain Layer (Entities & Value Objects)
  -> User, Account, Transaction, LedgerEntry
```

---

## Getting Started

### Prerequisites

- Java 17+ (LTS)
- Maven 3.9+ (or use included `./mvnw` / `mvnw.cmd`)
- Docker & Docker Compose

### Quick Start

```bash
# 1. Start MongoDB, Redis and Mongo Express
docker-compose up -d

# 2. Run the application
./mvnw spring-boot:run
# or on Windows:
.\mvnw.cmd spring-boot:run

# 3. Access Swagger UI
http://localhost:8080/swagger-ui.html
```

### Default Seed Accounts & Credentials

The application auto-seeds default users upon first run:
- **Admin**: `admin@ledgercore.com` / `SecurePass123!`
- **Accountant**: `accountant@ledgercore.com` / `SecurePass123!`
- **Viewer**: `viewer@ledgercore.com` / `SecurePass123!`

---

## API Documentation

Interactive Swagger documentation is available at:
`http://localhost:8080/swagger-ui.html`

### Sample Request: Create Transaction

```bash
curl -X POST http://localhost:8080/api/v1/transactions \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{
    "description": "Office Supplies",
    "currency": "USD",
    "entries": [
      { "accountId": "ACC-2024-006", "type": "DEBIT", "amount": 150.00 },
      { "accountId": "ACC-2024-001", "type": "CREDIT", "amount": 150.00 }
    ]
  }'
```

---

## Testing

```bash
# Run all unit and controller tests
.\mvnw.cmd test
```

---

## Author

**Pratham Singh** — Full Stack Developer
