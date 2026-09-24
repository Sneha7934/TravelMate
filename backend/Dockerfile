# Multi-stage Dockerfile for Spring Boot on Render Free Tier (512MB RAM safe)
FROM eclipse-temurin:21-jdk-alpine AS build
WORKDIR /app

# Copy Maven wrapper and POM first for dependency caching
COPY mvnw .
COPY .mvn .mvn
COPY pom.xml .

RUN chmod +x mvnw
RUN ./mvnw dependency:go-offline -B || true

# Copy source code and package jar
COPY src src
RUN ./mvnw clean package -DskipTests

# Runtime stage with lightweight JRE
FROM eclipse-temurin:21-jre-alpine
WORKDIR /app

# Create a non-root user for security
RUN addgroup -S appgroup && adduser -S appuser -G appgroup
USER appuser

COPY --from=build /app/target/*.jar app.jar

ENV PORT=8080
EXPOSE 8080

# Tuned JVM flags specifically for Render's 512MB memory limit
ENV JAVA_TOOL_OPTIONS="-XX:+UseSerialGC -Xss512k -XX:MaxRAMPercentage=75.0 -Xmx320m -XX:+TieredCompilation -XX:TieredStopAtLevel=1"

ENTRYPOINT ["java", "-jar", "app.jar"]
