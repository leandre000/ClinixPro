package com.hospital.pharmacy.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.hospital.pharmacy.model.User;
import com.hospital.pharmacy.repository.UserRepository;
import com.hospital.pharmacy.util.JwtUtil;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureWebMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;
import org.springframework.web.context.WebApplicationContext;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Map;
import java.util.UUID;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;
import com.hospital.pharmacy.repository.AppointmentRepository;
import com.hospital.pharmacy.repository.PrescriptionRepository;
import com.hospital.pharmacy.repository.MedicalRecordRepository;
import com.hospital.pharmacy.repository.MedicineRepository;
import com.hospital.pharmacy.repository.CompanyRepository;
import com.hospital.pharmacy.repository.PatientRepository;
import com.hospital.pharmacy.repository.PasswordResetTokenRepository;

@SpringBootTest
@AutoConfigureWebMvc
@ActiveProfiles("test")
class AuthControllerTest {

    @Autowired
    private WebApplicationContext webApplicationContext;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private JwtUtil jwtUtil;

    @Autowired
    private AppointmentRepository appointmentRepository;

    @Autowired
    private PrescriptionRepository prescriptionRepository;

    @Autowired
    private MedicalRecordRepository medicalRecordRepository;

    @Autowired
    private MedicineRepository medicineRepository;

    @Autowired
    private CompanyRepository companyRepository;

    @Autowired
    private PatientRepository patientRepository;

    @Autowired
    private PasswordResetTokenRepository passwordResetTokenRepository;

    private MockMvc mockMvc;
    private ObjectMapper objectMapper;

    @BeforeEach
    void setUp() {
        mockMvc = MockMvcBuilders.webAppContextSetup(webApplicationContext).build();
        objectMapper = new ObjectMapper();
        
        // Clear test data in proper order to avoid foreign key constraints
        // Clear dependent tables first
        appointmentRepository.deleteAll();
        prescriptionRepository.deleteAll();
        medicalRecordRepository.deleteAll();
        medicineRepository.deleteAll();
        companyRepository.deleteAll();
        patientRepository.deleteAll();
        passwordResetTokenRepository.deleteAll();
        // Clear users last
        userRepository.deleteAll();
    }

    @Test
    void testLoginSuccess() throws Exception {
        // Create test user
        User user = createTestUser("test@example.com", "password123", "ADMIN");
        userRepository.save(user);

        // Test login
        Map<String, String> credentials = new HashMap<>();
        credentials.put("email", "test@example.com");
        credentials.put("password", "password123");

        mockMvc.perform(post("/auth/login")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(credentials)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.token").exists())
                .andExpect(jsonPath("$.user.email").value("test@example.com"))
                .andExpect(jsonPath("$.user.role").value("ADMIN"));
    }

    @Test
    void testLoginFailure() throws Exception {
        Map<String, String> credentials = new HashMap<>();
        credentials.put("email", "nonexistent@example.com");
        credentials.put("password", "wrongpassword");

        mockMvc.perform(post("/auth/login")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(credentials)))
                .andExpect(status().isUnauthorized())
                .andExpect(jsonPath("$.message").value("Invalid email or password"));
    }

    @Test
    void testVerifyTokenSuccess() throws Exception {
        // Create test user
        User user = createTestUser("test@example.com", "password123", "ADMIN");
        userRepository.save(user);

        // Generate token
        String token = jwtUtil.generateToken(user);

        mockMvc.perform(get("/auth/verify")
                .header("Authorization", "Bearer " + token))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.valid").value(true))
                .andExpect(jsonPath("$.user.email").value("test@example.com"));
    }

    @Test
    void testVerifyTokenFailure() throws Exception {
        mockMvc.perform(get("/auth/verify")
                .header("Authorization", "Bearer invalid-token"))
                .andExpect(status().isUnauthorized());
    }

    @Test
    void testForgotPassword() throws Exception {
        // Create test user
        User user = createTestUser("test@example.com", "password123", "ADMIN");
        userRepository.save(user);

        Map<String, String> request = new HashMap<>();
        request.put("email", "test@example.com");

        mockMvc.perform(post("/auth/forgot-password")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isBadRequest()) // Email service will fail in test environment
                .andExpect(jsonPath("$.message").exists());
    }

    private User createTestUser(String email, String password, String role) {
        User user = new User();
        user.setUserId("TEST-" + UUID.randomUUID().toString().substring(0, 8).toUpperCase());
        user.setFirstName("Test");
        user.setLastName("User");
        user.setEmail(email);
        user.setPassword(passwordEncoder.encode(password));
        user.setRole(role);
        user.setPhoneNumber("1234567890");
        user.setAddress("Test Address");
        user.setGender("Male");
        user.setCreatedAt(LocalDateTime.now());
        user.setUpdatedAt(LocalDateTime.now());
        user.setActive(true);
        return user;
    }
} 