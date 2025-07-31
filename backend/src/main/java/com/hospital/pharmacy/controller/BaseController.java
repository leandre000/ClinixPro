package com.hospital.pharmacy.controller;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

/**
 * Base Controller with common functionality
 * Follows DRY principle by providing reusable methods
 */
@CrossOrigin(origins = {"http://localhost:3000", "http://127.0.0.1:3000"})
public abstract class BaseController {

    protected final Logger logger = LoggerFactory.getLogger(getClass());

    /**
     * Generic method to handle successful responses
     */
    protected <T> ResponseEntity<T> successResponse(T data) {
        return ResponseEntity.ok(data);
    }

    /**
     * Generic method to handle error responses
     */
    protected ResponseEntity<Map<String, String>> errorResponse(String message) {
        Map<String, String> error = new HashMap<>();
        error.put("message", message);
        return ResponseEntity.internalServerError().body(error);
    }

    /**
     * Generic method to handle not found responses
     */
    protected <T> ResponseEntity<T> notFoundResponse() {
        return ResponseEntity.notFound().build();
    }

    /**
     * Generic method to handle successful creation responses
     */
    protected <T> ResponseEntity<T> createdResponse(T data) {
        return ResponseEntity.ok(data);
    }

    /**
     * Generic method to handle successful deletion responses
     */
    protected ResponseEntity<Void> deletedResponse() {
        return ResponseEntity.ok().build();
    }

    /**
     * Generic method to handle list responses with error handling
     */
    protected <T> ResponseEntity<List<T>> handleListResponse(List<T> data, String operation) {
        try {
            return ResponseEntity.ok(data);
        } catch (Exception e) {
            logger.error("Error during {}: {}", operation, e.getMessage(), e);
            return ResponseEntity.internalServerError().build();
        }
    }

    /**
     * Generic method to handle single entity responses with error handling
     */
    protected <T> ResponseEntity<T> handleEntityResponse(T data, String operation) {
        try {
            if (data != null) {
                return ResponseEntity.ok(data);
            } else {
                return ResponseEntity.notFound().build();
            }
        } catch (Exception e) {
            logger.error("Error during {}: {}", operation, e.getMessage(), e);
            return ResponseEntity.internalServerError().build();
        }
    }
} 