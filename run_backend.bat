@echo off
echo Starting Spring Boot Backend...
set PATH=%~dp0maven\apache-maven-3.9.6\bin;%PATH%
set SPRING_DATASOURCE_URL=jdbc:mysql://localhost:3307/placement_portal_db?useSSL=false^&serverTimezone=UTC^&allowPublicKeyRetrieval=true
cd %~dp0backend
mvn spring-boot:run
pause
