package com.hospital.pharmacy.config;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Configuration;

import jakarta.annotation.PostConstruct;

@Configuration
public class DatabaseConfig {

    private static final Logger logger = LoggerFactory.getLogger(DatabaseConfig.class);

    @Value("${spring.datasource.url:NOT_SET}")
    private String databaseUrl;

    @Value("${spring.datasource.username:NOT_SET}")
    private String databaseUsername;

    @Value("${spring.datasource.password:NOT_SET}")
    private String databasePassword;

    @Value("${spring.datasource.driver-class-name:NOT_SET}")
    private String driverClassName;

    @PostConstruct
    public void logDatabaseConfiguration() {
        logger.info("=== DATABASE CONFIGURATION DEBUG ===");
        logger.info("Database URL: {}", databaseUrl);
        logger.info("Database Username: {}", databaseUsername);
        logger.info("Database Password: {}", databasePassword != null ? "***SET***" : "NOT_SET");
        logger.info("Driver Class Name: {}", driverClassName);
        logger.info("Active Profile: {}", System.getProperty("spring.profiles.active"));
        logger.info("Environment Variables:");
        logger.info("  DATABASE_URL: {}", System.getenv("DATABASE_URL"));
        logger.info("  DATABASE_USERNAME: {}", System.getenv("DATABASE_USERNAME"));
        logger.info("  DATABASE_PASSWORD: {}", System.getenv("DATABASE_PASSWORD") != null ? "***SET***" : "NOT_SET");
        logger.info("  SPRING_DATASOURCE_URL: {}", System.getenv("SPRING_DATASOURCE_URL"));
        logger.info("  SPRING_DATASOURCE_USERNAME: {}", System.getenv("SPRING_DATASOURCE_USERNAME"));
        logger.info("  SPRING_DATASOURCE_PASSWORD: {}", System.getenv("SPRING_DATASOURCE_PASSWORD") != null ? "***SET***" : "NOT_SET");
        logger.info("=== END DATABASE CONFIGURATION DEBUG ===");
    }
}
