# LedgerCore — Setup & Installation Guide

## Prerequisites

| Tool | Version | Purpose |
|------|---------|---------|
| Java JDK | 17+ | Runtime & compilation |
| Maven | 3.9+ | Build & dependency management |
| Docker | 24+ | Containerization |
| Docker Compose | 2.20+ | Multi-service orchestration |
| Git | 2.40+ | Version control |

## Directory Structure

```
ledgercore/
├── src/
│   ├── main/
│   │   ├── java/com/ledgercore/
│   │   │   ├── config/          # Security, MongoDB, Redis config
│   │   │   ├── controller/      # REST controllers
│   │   │   ├── dto/             # Request/Response DTOs
│   │   │   ├── exception/       # Custom exceptions & handlers
│   │   │   ├── model/           # Domain entities
│   │   │   ├── repository/      # Spring Data repositories
│   │   │   ├── security/        # JWT filters, user details
│   │   │   └── service/         # Business logic
│   │   └── resources/
│   │       ├── application.yml  # Main config
│   │       ├── application-dev.yml
│   │       └── application-prod.yml
│   └── test/
│       ├── java/                # Unit & integration tests
│       └── resources/
├── docker/
│   ├── Dockerfile
│   └── docker-compose.yml
├── pom.xml
└── README.md
```

## Local Development Setup

### Step 1: Clone & Navigate

```bash
git clone https://github.com/yourusername/ledgercore.git
cd ledgercore
```

### Step 2: Start Infrastructure

```bash
docker-compose up -d
```

This starts:
- **MongoDB** on port `27017`
- **Redis** on port `6379`
- **Mongo Express** (DB UI) on port `8081`

Verify:
```bash
docker-compose ps
# Should show mongo, redis, mongo-express as "Up"
```

### Step 3: Configure Environment

Create `.env` file in project root:

```env
JWT_SECRET=your-base64-encoded-secret-key-here-min-256-bits
JWT_EXPIRATION=86400000
MONGODB_URI=mongodb://localhost:27017/ledgercore
REDIS_HOST=localhost
REDIS_PORT=6379
```

> **Generate a secure JWT secret:**
> ```bash
> openssl rand -base64 32
> ```

### Step 4: Build & Run

```bash
# Build
./mvnw clean package -DskipTests

# Run
java -jar target/ledgercore-1.0.0.jar

# Or use Spring Boot Maven plugin
./mvnw spring-boot:run
```

The application starts on `http://localhost:8080`.

### Step 5: Verify Setup

```bash
# Health check
curl http://localhost:8080/actuator/health

# Swagger UI
open http://localhost:8080/swagger-ui.html

# Register first admin user
curl -X POST http://localhost:8080/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@ledgercore.com",
    "password": "SecurePass123!",
    "role": "ADMIN"
  }'
```

## Docker Production Setup

### Build Production Image

```bash
./mvnw spring-boot:build-image \
  -Dspring-boot.build-image.imageName=ledgercore:latest
```

### Production Docker Compose

```yaml
version: '3.8'
services:
  app:
    image: ledgercore:latest
    ports:
      - "8080:8080"
    environment:
      - SPRING_PROFILES_ACTIVE=prod
      - MONGODB_URI=mongodb://mongo:27017/ledgercore
      - REDIS_HOST=redis
      - JWT_SECRET=${JWT_SECRET}
    depends_on:
      - mongo
      - redis
    restart: unless-stopped

  mongo:
    image: mongo:7.0
    volumes:
      - mongo_data:/data/db
    restart: unless-stopped

  redis:
    image: redis:7-alpine
    restart: unless-stopped

volumes:
  mongo_data:
```

Run:
```bash
docker-compose -f docker-compose.yml -f docker-compose.prod.yml up -d
```

## IDE Configuration

### IntelliJ IDEA

1. **Import Project**: Open `pom.xml` as project
2. **Enable Annotation Processing**: Settings -> Build -> Annotation Processors -> Enable
3. **Lombok Plugin**: Ensure Lombok plugin is installed
4. **Run Configuration**: Create Spring Boot run configuration pointing to `LedgerCoreApplication`

### VS Code

Install extensions:
- Extension Pack for Java
- Spring Boot Extension Pack
- MongoDB for VS Code

## Troubleshooting

| Issue | Solution |
|-------|----------|
| `Connection refused` to MongoDB | Ensure `docker-compose up -d` ran successfully. Check `docker logs ledgercore-mongo-1` |
| `Invalid JWT signature` | Verify `JWT_SECRET` is set and is base64-encoded |
| Port 8080 already in use | Change `SERVER_PORT` in `.env` or kill existing process |
| Tests fail with MongoDB connection | Integration tests use Testcontainers — ensure Docker daemon is running |
| `Permission denied` on `./mvnw` | Run `chmod +x mvnw` |

## Useful Commands

```bash
# Run only unit tests
./mvnw test

# Run with dev profile
./mvnw spring-boot:run -Dspring-boot.run.profiles=dev

# Generate test coverage report
./mvnw jacoco:report
# Report at: target/site/jacoco/index.html

# Package without tests
./mvnw clean package -DskipTests

# View application logs
docker-compose logs -f app
```
