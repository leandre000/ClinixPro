package com.hospital.pharmacy.controller;

import com.hospital.pharmacy.model.Patient;
import com.hospital.pharmacy.model.User;
import com.hospital.pharmacy.repository.AppointmentRepository;
import com.hospital.pharmacy.repository.MedicineRepository;
import com.hospital.pharmacy.repository.PatientRepository;
import com.hospital.pharmacy.repository.UserRepository;
import com.hospital.pharmacy.service.UserService;
import jakarta.servlet.http.HttpServletRequest;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;
import com.hospital.pharmacy.config.AppConfig;
import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.UUID;
import org.springframework.web.multipart.MultipartFile;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;

@RestController
@RequestMapping("/admin")
@PreAuthorize("hasRole('ADMIN')")
public class AdminController {

    private static final Logger logger = LoggerFactory.getLogger(AdminController.class);

    // Define the upload directory
    // You might want to make this configurable
    private final String uploadDir = "./uploads/profileImages/";

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private UserService userService;

    @Autowired
    private PatientRepository patientRepository;

    @Autowired
    private AppointmentRepository appointmentRepository;

    @Autowired
    private MedicineRepository medicineRepository;

    // Dashboard Statistics
    @GetMapping("/dashboard")
    public ResponseEntity<?> getDashboardStats(HttpServletRequest request) {
        // Check if user is admin
        User user = (User) request.getAttribute("user");
        String role = (String) request.getAttribute("role");

        if (user == null || !role.equals("ADMIN")) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN)
                    .body(Map.of("message", "Access denied"));
        }

        Map<String, Object> stats = new HashMap<>();
        stats.put("totalDoctors", userRepository.countByRole("DOCTOR"));
        stats.put("totalPharmacists", userRepository.countByRole("PHARMACIST"));
        stats.put("totalReceptionists", userRepository.countByRole("RECEPTIONIST"));
        stats.put("totalPatients", patientRepository.countTotalPatients());
        stats.put("totalAppointments", appointmentRepository.countTotalAppointments());
        stats.put("totalMedicines", medicineRepository.count());

        // Additional statistics can be added here

        return ResponseEntity.ok(stats);
    }

    // User Management - Get all users by role
    @GetMapping("/users")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> getUsersByRole(
            @RequestParam(required = false) String role,
            @RequestParam(required = false) Boolean isActive,
            @RequestParam(required = false) String search) {
        try {
            logger.info("Getting users with filters - role: {}, isActive: {}, search: {}", role, isActive, search);
            List<User> users = userRepository.findByFilters(role, isActive, search);
            logger.info("Found {} users matching criteria", users.size());
            return ResponseEntity.ok(users);
        } catch (Exception e) {
            logger.error("Error fetching users", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("message", "Error fetching users: " + e.getMessage()));
        }
    }

    // User Management - Create new user (doctor, pharmacist, receptionist, admin)
    @PostMapping("/users")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> createUser(@RequestBody User newUser) {
        try {
            logger.info("Creating new user with email: {}, role: {}", newUser.getEmail(), newUser.getRole());

            if (userRepository.existsByEmail(newUser.getEmail())) {
                logger.warn("Email already in use: {}", newUser.getEmail());
                return ResponseEntity.badRequest()
                        .body(Map.of("message", "Email already in use"));
            }

            // Generate a unique userId based on role
            String userId;
            switch (newUser.getRole().toUpperCase()) {
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

            newUser.setUserId(userId);

            // Before saving, ensure isActive is explicitly set
            newUser.setActive(true);

            // Hash the password before saving
            String hashedPassword = passwordEncoder.encode(newUser.getPassword());
            newUser.setPassword(hashedPassword);

            // Set creation timestamps
            newUser.setCreatedAt(LocalDateTime.now());
            newUser.setUpdatedAt(LocalDateTime.now());

            // Save the user
            User savedUser = userRepository.save(newUser);
            logger.info("User created successfully: {}", savedUser.getUserId());

            return ResponseEntity.status(HttpStatus.CREATED).body(savedUser);
        } catch (Exception e) {
            logger.error("Error creating user", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("message", "Error creating user: " + e.getMessage()));
        }
    }

    // User Management - Update user
    @PutMapping("/users/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> updateUser(
            @PathVariable Long id,
            @RequestBody User updatedUser) {
        try {
            logger.info("Updating user with ID: {}", id);
            User updated = userService.update(id, updatedUser);
            return ResponseEntity.ok(updated);
        } catch (Exception e) {
            logger.error("Error updating user: {}", e.getMessage(), e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("message", "Error updating user: " + e.getMessage()));
        }
    }

    // User Management - Upload profile image
    @PostMapping("/users/{id}/profile-image")
    @PreAuthorize("hasRole('ADMIN') or #id == authentication.principal.id")
    public ResponseEntity<?> uploadProfileImage(
            @PathVariable Long id,
            @RequestParam("imageFile") MultipartFile imageFile) {
        try {
            logger.info("Uploading profile image for user with ID: {}", id);

            Authentication auth = SecurityContextHolder.getContext().getAuthentication();
            User currentUser = (User) auth.getPrincipal();

            if (!currentUser.getRole().equals("ADMIN") && !currentUser.getId().equals(id)) {
                logger.warn("Access denied for user {} to upload profile image for user {}",
                        currentUser.getUserId(), id);
                return ResponseEntity.status(HttpStatus.FORBIDDEN)
                        .body(Map.of("message", "Access denied"));
            }

            // Check if the file is empty
            if (imageFile.isEmpty()) {
                return ResponseEntity.badRequest().body(Map.of("message", "Cannot upload empty file"));
            }

            // Create the upload directory if it doesn't exist
            Path uploadPath = Paths.get(uploadDir);
            if (!Files.exists(uploadPath)) {
                Files.createDirectories(uploadPath);
            }

            // Generate a unique filename to avoid conflicts
            String originalFilename = imageFile.getOriginalFilename();
            String fileExtension = "";
            if (originalFilename != null && originalFilename.contains(".")) {
                fileExtension = originalFilename.substring(originalFilename.lastIndexOf("."));
            }
            String uniqueFilename = id + "-" + UUID.randomUUID().toString().substring(0, 8) + fileExtension;
            Path filePath = uploadPath.resolve(uniqueFilename);

            // Save the file to the upload directory
            Files.copy(imageFile.getInputStream(), filePath, StandardCopyOption.REPLACE_EXISTING);

            // Construct the URL to access the image
            // Assuming the 'uploads' directory is served statically
            String imageUrl = "/uploads/profileImages/" + uniqueFilename;

            // Update user's profileImage field in the database
            return userRepository.findById(id)
                    .map(user -> {
                        user.setProfileImage(imageUrl);
                        userRepository.save(user);
                        logger.info("Profile image path updated for user {}: {}", id, imageUrl);
                        return ResponseEntity.ok()
                                .body(Map.of("message", "Profile image uploaded successfully", "imageUrl", imageUrl));
                    })
                    .orElse(ResponseEntity.notFound().build());

        } catch (IOException e) {
            logger.error("Error saving profile image file for user {}", id, e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("message", "Error saving profile image file: " + e.getMessage()));
        } catch (Exception e) {
            logger.error("Error uploading profile image", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("message", "Error uploading profile image: " + e.getMessage()));
        }
    }

    // User Management - Delete user
    @DeleteMapping("/users/{id}")
    public ResponseEntity<?> deleteUser(@PathVariable Long id, HttpServletRequest request) {
        try {
            logger.info("Deleting user with ID: {}", id);

            User admin = (User) request.getAttribute("user");
            String adminRole = (String) request.getAttribute("role");

            if (admin == null || !adminRole.equals("ADMIN")) {
                logger.warn("Access denied for user deletion attempt");
                return ResponseEntity.status(HttpStatus.FORBIDDEN)
                        .body(Map.of("message", "Access denied"));
            }

            // Check if user is trying to delete their own account
            if (admin.getId().equals(id)) {
                logger.warn("Admin attempt to delete own account: {}", admin.getUserId());
                return ResponseEntity.badRequest()
                        .body(Map.of("message", "You cannot delete your own account"));
            }

            return userRepository.findById(id)
                    .map(user -> {
                        try {
                            userRepository.delete(user);
                            logger.info("User deleted successfully: {}", user.getUserId());
                            return ResponseEntity.ok().body(Map.of("message", "User deleted successfully"));
                        } catch (Exception e) {
                            logger.error("Error deleting user: {}", e.getMessage(), e);
                            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                                    .body(Map.of("message", "Error deleting user: " + e.getMessage()));
                        }
                    })
                    .orElse(ResponseEntity.notFound().build());
        } catch (Exception e) {
            logger.error("Error in delete user operation", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("message", "Error deleting user: " + e.getMessage()));
        }
    }

    // Simple test endpoint to check authentication
    @GetMapping("/test-auth")
    public ResponseEntity<?> testAuth(HttpServletRequest request) {
        User user = (User) request.getAttribute("user");
        String role = (String) request.getAttribute("role");

        if (user == null) {
            logger.warn("Auth test: No user found in request");
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(Map.of("message", "No user found in request, authentication failed"));
        }

        logger.info("Auth test: User authenticated - userId: {}, role: {}", user.getUserId(), role);
        return ResponseEntity.ok(Map.of(
                "message", "Authentication successful",
                "userId", user.getUserId(),
                "role", role));
    }

    // Patient Management - Get patient by ID
    @GetMapping("/patients/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> getPatientById(@PathVariable Long id) {
        return patientRepository.findById(id)
                .map(patient -> ResponseEntity.ok(patient))
                .orElse(ResponseEntity.notFound().build());
    }

    // Register a new patient
    @PostMapping("/patients")
    public ResponseEntity<?> registerPatient(
            @RequestBody Patient patient,
            HttpServletRequest request) {

        User admin = (User) request.getAttribute("user");
        String role = (String) request.getAttribute("role");

        if (admin == null || !role.equals("ADMIN")) {
            logger.warn("Access denied for registering patient as admin");
            return ResponseEntity.status(HttpStatus.FORBIDDEN)
                    .body(Map.of("message", "Access denied"));
        }

        // Generate a unique patient ID
        patient.setPatientId("PAT-" + UUID.randomUUID().toString().substring(0, 8).toUpperCase());

        // Set default properties if not provided
        if (patient.getStatus() == null) {
            patient.setStatus("Active");
        }

        // Set registration date
        patient.setRegistrationDate(LocalDateTime.now());

        Patient savedPatient = patientRepository.save(patient);
        logger.info("Patient registered successfully by admin: {}", savedPatient.getPatientId());

        return ResponseEntity.status(HttpStatus.CREATED).body(savedPatient);
    }

    // Update a patient
    @PutMapping("/patients/{id}")
    public ResponseEntity<?> updatePatient(
            @PathVariable Long id,
            @RequestBody Patient updatedPatient,
            HttpServletRequest request) {

        User admin = (User) request.getAttribute("user");
        String role = (String) request.getAttribute("role");

        if (admin == null || !role.equals("ADMIN")) {
            logger.warn("Access denied for updating patient as admin");
            return ResponseEntity.status(HttpStatus.FORBIDDEN)
                    .body(Map.of("message", "Access denied"));
        }

        return patientRepository.findById(id)
                .map(patient -> {
                    // Update fields but keep ID and patientId intact
                    patient.setFirstName(updatedPatient.getFirstName());
                    patient.setLastName(updatedPatient.getLastName());
                    patient.setDateOfBirth(updatedPatient.getDateOfBirth());
                    patient.setGender(updatedPatient.getGender());
                    patient.setEmail(updatedPatient.getEmail());
                    patient.setPhoneNumber(updatedPatient.getPhoneNumber());
                    patient.setAddress(updatedPatient.getAddress());
                    patient.setBloodGroup(updatedPatient.getBloodGroup());
                    patient.setHeight(updatedPatient.getHeight());
                    patient.setWeight(updatedPatient.getWeight());
                    patient.setAllergies(updatedPatient.getAllergies());
                    patient.setChronicDiseases(updatedPatient.getChronicDiseases());
                    patient.setEmergencyContactName(updatedPatient.getEmergencyContactName());
                    patient.setEmergencyContactPhone(updatedPatient.getEmergencyContactPhone());
                    patient.setEmergencyContactRelation(updatedPatient.getEmergencyContactRelation());
                    patient.setInsuranceProvider(updatedPatient.getInsuranceProvider());
                    patient.setInsurancePolicyNumber(updatedPatient.getInsurancePolicyNumber());
                    patient.setInsuranceExpiryDate(updatedPatient.getInsuranceExpiryDate());
                    patient.setOccupation(updatedPatient.getOccupation());
                    patient.setMaritalStatus(updatedPatient.getMaritalStatus());
                    patient.setAssignedDoctor(updatedPatient.getAssignedDoctor());
                    patient.setMedicalHistory(updatedPatient.getMedicalHistory());
                    patient.setStatus(updatedPatient.getStatus());

                    logger.info("Patient updated successfully: {}", patient.getPatientId());
                    return ResponseEntity.ok(patientRepository.save(patient));
                })
                .orElse(ResponseEntity.notFound().build());
    }
}