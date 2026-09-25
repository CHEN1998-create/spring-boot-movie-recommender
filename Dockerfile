# 片屿（FilmIsle）一体化镜像：前端构建产物由 Spring Boot 同域托管
# 免费云托管平台（Zeabur / Koyeb / Render 等）认这个 Dockerfile 自动构建

# ---------- 阶段 1：构建前端（React + Vite） ----------
FROM node:20-alpine AS frontend-build
WORKDIR /app/frontend
COPY frontend/package.json frontend/package-lock.json ./
RUN npm ci
COPY frontend/ ./
RUN npm run build

# ---------- 阶段 2：构建后端（Spring Boot） ----------
FROM maven:3.9-eclipse-temurin-17 AS backend-build
WORKDIR /app/backend
# 先下依赖，利用层缓存
COPY backend/pom.xml ./
RUN mvn -q -B dependency:go-offline
COPY backend/src ./src
RUN mvn -q -B package -DskipTests

# ---------- 阶段 3：运行（单 jar + 前端静态目录） ----------
FROM eclipse-temurin:17-jre-alpine
WORKDIR /app
COPY --from=backend-build /app/backend/target/filmisle-backend-0.0.1-SNAPSHOT.jar app.jar
COPY --from=frontend-build /app/frontend/dist ./public

# 平台注入 PORT 时自动生效；数据库放 /data 便于挂持久卷
ENV PORT=8080 \
    STATIC_DIR=./public \
    DB_PATH=/data/filmisle \
    JAVA_OPTS="-XX:MaxRAMPercentage=75.0"
VOLUME ["/data"]
EXPOSE 8080
ENTRYPOINT ["sh", "-c", "java $JAVA_OPTS -jar app.jar"]
