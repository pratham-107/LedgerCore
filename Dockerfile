# Stage 1: Build
FROM maven:3.9-eclipse-temurin-17 AS build
WORKDIR /app

COPY pom.xml .
COPY src ./src

RUN mvn -q dependency:go-offline && mvn -q -Dmaven.test.skip=true package

# Stage 2: Runtime
FROM eclipse-temurin:17-jre-alpine
WORKDIR /app

RUN addgroup -S ledgercore && adduser -S ledgercore -G ledgercore
USER ledgercore:ledgercore

COPY --from=build /app/target/ledgercore-1.0.0.jar app.jar

EXPOSE 8080

ENV JAVA_OPTS="-Xms128m -Xmx350m -XX:+UseContainerSupport"
ENTRYPOINT ["sh", "-c", "java $JAVA_OPTS -jar app.jar"]
