package com.hospital.pharmacy.controller;

import com.hospital.pharmacy.model.User;
import com.hospital.pharmacy.repository.UserRepository;

import com.hospital.pharmacy.service.PasswordResetService;
import com.hospital.pharmacy.util.JwtUtil;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Map;
import java.util.Optional;
import java.util.UUID;
@RestController
@RequestMapping("/auth")
public class AuthController {

    private static final Logger logger = LoggerFactory.getLogger(AuthController.class);

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private JwtUtil jwtUtil;

    @Autowired
    private PasswordEncoder passwordEncoder; // Added

    @Autowired
    private PasswordResetService resetService;

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody Map<String, String> credentials) {
        String email = credentials.get("email");
        String password = credentials.get("password");

        logger.info("Login attempt for email: {}", email);
        Optional<User> userOptional = userRepository.findByEmail(email);

        if (userOptional.isPresent()) {
            User user = userOptional.get();

            // ✅ Password check using BCrypt
            if (!passwordEncoder.matches(password, user.getPassword())) {
                logger.warn("Invalid password for email: {}", email);
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                        .body(Map.of("message", "Invalid email or password"));
            }

            String token = jwtUtil.generateToken(user);

            Map<String, Object> response = new HashMap<>();
            response.put("token", token);
            response.put("user", Map.of(
                "id", user.getId(),
                "userId", user.getUserId(),
                "firstName", user.getFirstName(),
                "lastName", user.getLastName(),
                "email", user.getEmail(),
                "role", user.getRole()
            ));

            logger.info("User with email {} logged in successfully", email);
            return ResponseEntity.ok(response);
        }

        logger.warn("No user found with email: {}", email);
        return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                .body(Map.of("message", "Invalid email or password"));
    }

    @GetMapping("/verify")
    public ResponseEntity<?> verifyToken(@RequestHeader("Authorization") String authHeader) {
        try {
            if (authHeader == null || !authHeader.startsWith("Bearer ")) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                        .body(Map.of("message", "Invalid token format"));
            }

            String token = authHeader.substring(7);
            String email = jwtUtil.extractUsername(token);

            if (email != null) {
                Optional<User> userOptional = userRepository.findByEmail(email);
                if (userOptional.isPresent() && jwtUtil.validateToken(token, userOptional.get())) {
                    User user = userOptional.get();
                    Map<String, Object> response = new HashMap<>();
                    response.put("valid", true);
                    response.put("user", Map.of(
                        "id", user.getId(),
                        "userId", user.getUserId(),
                        "firstName", user.getFirstName(),
                        "lastName", user.getLastName(),
                        "email", user.getEmail(),
                        "role", user.getRole()
                    ));
                    return ResponseEntity.ok(response);
                }
            }

            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(Map.of("message", "Invalid token"));
        } catch (Exception e) {
            logger.error("Token verification error: {}", e.getMessage());
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(Map.of("message", "Token verification failed"));
        }
    }

    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody User user) {
        if (userRepository.existsByEmail(user.getEmail())) {
            return ResponseEntity.badRequest()
                    .body(Map.of("message", "Email already in use"));
        }

        String userId;
        switch (user.getRole().toUpperCase()) {
            case "DOCTOR":
                userId = "DOC-" + UUID.randomUUID().toString().substring(0, 8).toUpperCase();
                break;
            case "PHARMACIST":
                userId = "PHM-" + UUID.randomUUID().toString().substring(0, 8).toUpperCase();
                break;
            case "RECEPTIONIST":
                userId = "RCP-" + UUID.randomUUID().toString().substring(0, 8).toUpperCase();
                break;
            case "ADMIN":
                userId = "ADM-" + UUID.randomUUID().toString().substring(0, 8).toUpperCase();
                break;
            default:
                userId = "USR-" + UUID.randomUUID().toString().substring(0, 8).toUpperCase();
        }

        user.setUserId(userId);
        user.setPassword(passwordEncoder.encode(user.getPassword()));
        user.setIsActive(true);
        user.setCreatedAt(LocalDateTime.now());
        user.setUpdatedAt(LocalDateTime.now());

        User savedUser = userRepository.save(user);
        logger.info("User registered successfully: {}", savedUser.getEmail());

        return ResponseEntity.ok(Map.of("message", "User registered successfully"));
    }

    @PostMapping("/create-admin")
    public ResponseEntity<?> createInitialAdmin() {
        // Check if admin already exists
        if (userRepository.findByRole("ADMIN").size() > 0) {
            return ResponseEntity.badRequest()
                    .body(Map.of("message", "Admin user already exists"));
        }

        User admin = new User();
        admin.setUserId("ADM-001");
        admin.setFirstName("Admin");
        admin.setLastName("User");
        admin.setEmail("admin@clinixpro.com");
        admin.setPassword(passwordEncoder.encode("password"));
        admin.setRole("ADMIN");
        admin.setIsActive(true);
        admin.setCreatedAt(LocalDateTime.now());
        admin.setUpdatedAt(LocalDateTime.now());

        userRepository.save(admin);
        logger.info("Initial admin user created successfully");

        return ResponseEntity.ok(Map.of("message", "Admin user created successfully"));
    }

    @GetMapping("/validate")
    public ResponseEntity<?> validateToken(@RequestHeader("Authorization") String authHeader) {
        try {
            if (authHeader == null || !authHeader.startsWith("Bearer ")) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                        .body(Map.of("message", "Invalid token format"));
            }

            String token = authHeader.substring(7);
            String email = jwtUtil.extractUsername(token);

            if (email != null) {
                Optional<User> userOptional = userRepository.findByEmail(email);
                if (userOptional.isPresent() && jwtUtil.validateToken(token, userOptional.get())) {
                    return ResponseEntity.ok(Map.of("valid", true));
                }
            }

            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(Map.of("message", "Invalid token"));
        } catch (Exception e) {
            logger.error("Token validation error: {}", e.getMessage());
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(Map.of("message", "Token validation failed"));
        }
    }

    @PostMapping("/forgot-password")
    public ResponseEntity<?> forgotPassword(@RequestBody Map<String, String> payload) {
        try {
            resetService.sendResetLink(payload.get("email"));
            return ResponseEntity.ok(Map.of("message", "Reset link sent to your email"));
        } catch (Exception e) {
            logger.error("Password reset error: {}", e.getMessage());
            return ResponseEntity.badRequest()
                    .body(Map.of("message", "Failed to send reset link"));
        }
    }

    @RequestMapping(value = "/reset-password", method = {RequestMethod.POST, RequestMethod.OPTIONS})
    public ResponseEntity<?> resetPassword(@RequestBody(required = false) Map<String, String> payload) {
        if (payload == null) {
            return ResponseEntity.ok().build(); // Handle OPTIONS request
        }
        try {
            resetService.resetPassword(payload.get("token"), payload.get("password"));
            return ResponseEntity.ok(Map.of("message", "Password reset successfully"));
        } catch (Exception e) {
            logger.error("Password reset error: {}", e.getMessage());
            return ResponseEntity.badRequest()
                    .body(Map.of("message", "Failed to reset password"));
        }
    }
}

