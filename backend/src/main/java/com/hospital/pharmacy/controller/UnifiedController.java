package com.hospital.pharmacy.controller;

import com.hospital.pharmacy.model.*;
import com.hospital.pharmacy.repository.*;
import com.hospital.pharmacy.service.*;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

/**
 * Unified Controller for handling all frontend API calls
 * Ensures proper integration between frontend and backend
 * 
 * @author Leandre
 * @version 1.0.0
 * @since 2024
 */
@RestController
@CrossOrigin(origins = {"http://localhost:3000", "http://127.0.0.1:3000"})
public class UnifiedController {

    private static final Logger logger = LoggerFactory.getLogger(UnifiedController.class);

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PatientRepository patientRepository;

    @Autowired
    private MedicineRepository medicineRepository;

    @Autowired
    private AppointmentRepository appointmentRepository;

    @Autowired
    private PrescriptionRepository prescriptionRepository;

    // CompanyRepository removed to avoid conflicts with CompanyController

    @Autowired
    private BillingRepository billingRepository;

    @Autowired
    private UserService userService;

    // ==================== USERS ENDPOINTS ====================

    @GetMapping("/users")
    public ResponseEntity<List<User>> getUsers(
            @RequestParam(required = false) String role,
            @RequestParam(required = false) Boolean isActive,
            @RequestParam(required = false) String search) {
        try {
            List<User> users = userService.findByFilters(role, isActive, search);
            return ResponseEntity.ok(users);
        } catch (Exception e) {
            logger.error("Error fetching users: {}", e.getMessage(), e);
            return ResponseEntity.internalServerError().build();
        }
    }

    @GetMapping("/users/{id}")
    public ResponseEntity<User> getUserById(@PathVariable Long id) {
        try {
            Optional<User> user = userService.findById(id);
            return user.map(ResponseEntity::ok)
                    .orElse(ResponseEntity.notFound().build());
        } catch (Exception e) {
            logger.error("Error fetching user by ID {}: {}", id, e.getMessage(), e);
            return ResponseEntity.internalServerError().build();
        }
    }

    @PostMapping("/users")
    public ResponseEntity<User> createUser(@RequestBody User user) {
        try {
            User savedUser = userService.save(user);
            return ResponseEntity.ok(savedUser);
        } catch (Exception e) {
            logger.error("Error creating user: {}", e.getMessage(), e);
            return ResponseEntity.internalServerError().build();
        }
    }

    @PutMapping("/users/{id}")
    public ResponseEntity<User> updateUser(@PathVariable Long id, @RequestBody User user) {
        try {
            User updatedUser = userService.update(id, user);
            return ResponseEntity.ok(updatedUser);
        } catch (Exception e) {
            logger.error("Error updating user with ID {}: {}", id, e.getMessage(), e);
            return ResponseEntity.internalServerError().build();
        }
    }

    @DeleteMapping("/users/{id}")
    public ResponseEntity<Void> deleteUser(@PathVariable Long id) {
        try {
            Optional<User> user = userService.findById(id);
            if (user.isPresent()) {
                userService.delete(user.get());
                return ResponseEntity.ok().build();
            }
            return ResponseEntity.notFound().build();
        } catch (Exception e) {
            logger.error("Error deleting user with ID {}: {}", id, e.getMessage(), e);
            return ResponseEntity.internalServerError().build();
        }
    }

    // ==================== PATIENTS ENDPOINTS ====================

    @GetMapping("/patients")
    public ResponseEntity<List<Patient>> getPatients(
            @RequestParam(required = false) String status,
            @RequestParam(required = false) String search) {
        try {
            List<Patient> patients;
            if (status != null && search != null) {
                patients = patientRepository.findByFilters(status, null, search);
            } else if (status != null) {
                patients = patientRepository.findByStatus(status);
            } else if (search != null) {
                patients = patientRepository.findByFilters(null, null, search);
            } else {
                patients = patientRepository.findAll();
            }
            return ResponseEntity.ok(patients);
        } catch (Exception e) {
            logger.error("Error fetching patients: {}", e.getMessage(), e);
            return ResponseEntity.internalServerError().build();
        }
    }

    @GetMapping("/patients/{id}")
    public ResponseEntity<Patient> getPatientById(@PathVariable Long id) {
        try {
            Optional<Patient> patient = patientRepository.findById(id);
            return patient.map(ResponseEntity::ok)
                    .orElse(ResponseEntity.notFound().build());
        } catch (Exception e) {
            logger.error("Error fetching patient by ID {}: {}", id, e.getMessage(), e);
            return ResponseEntity.internalServerError().build();
        }
    }

    @PostMapping("/patients")
    public ResponseEntity<Patient> createPatient(@RequestBody Patient patient) {
        try {
            Patient savedPatient = patientRepository.save(patient);
            return ResponseEntity.ok(savedPatient);
        } catch (Exception e) {
            logger.error("Error creating patient: {}", e.getMessage(), e);
            return ResponseEntity.internalServerError().build();
        }
    }

    @PutMapping("/patients/{id}")
    public ResponseEntity<Patient> updatePatient(@PathVariable Long id, @RequestBody Patient patient) {
        try {
            if (patientRepository.existsById(id)) {
                patient.setId(id);
                Patient updatedPatient = patientRepository.save(patient);
                return ResponseEntity.ok(updatedPatient);
            }
            return ResponseEntity.notFound().build();
        } catch (Exception e) {
            logger.error("Error updating patient with ID {}: {}", id, e.getMessage(), e);
            return ResponseEntity.internalServerError().build();
        }
    }

    @DeleteMapping("/patients/{id}")
    public ResponseEntity<Void> deletePatient(@PathVariable Long id) {
        try {
            if (patientRepository.existsById(id)) {
                patientRepository.deleteById(id);
                return ResponseEntity.ok().build();
            }
            return ResponseEntity.notFound().build();
        } catch (Exception e) {
            logger.error("Error deleting patient with ID {}: {}", id, e.getMessage(), e);
            return ResponseEntity.internalServerError().build();
        }
    }

    // ==================== MEDICINES ENDPOINTS ====================

    @GetMapping("/medicines")
    public ResponseEntity<List<Medicine>> getMedicines(
            @RequestParam(required = false) String category,
            @RequestParam(required = false) String stockStatus,
            @RequestParam(required = false) String search) {
        try {
            List<Medicine> medicines = medicineRepository.findWithFilters(category, stockStatus, search);
            return ResponseEntity.ok(medicines);
        } catch (Exception e) {
            logger.error("Error fetching medicines: {}", e.getMessage(), e);
            return ResponseEntity.internalServerError().build();
        }
    }

    @GetMapping("/medicines/{id}")
    public ResponseEntity<Medicine> getMedicineById(@PathVariable Long id) {
        try {
            Optional<Medicine> medicine = medicineRepository.findById(id);
            return medicine.map(ResponseEntity::ok)
                    .orElse(ResponseEntity.notFound().build());
        } catch (Exception e) {
            logger.error("Error fetching medicine by ID {}: {}", id, e.getMessage(), e);
            return ResponseEntity.internalServerError().build();
        }
    }

    @PostMapping("/medicines")
    public ResponseEntity<Medicine> createMedicine(@RequestBody Medicine medicine) {
        try {
            Medicine savedMedicine = medicineRepository.save(medicine);
            return ResponseEntity.ok(savedMedicine);
        } catch (Exception e) {
            logger.error("Error creating medicine: {}", e.getMessage(), e);
            return ResponseEntity.internalServerError().build();
        }
    }

    @PutMapping("/medicines/{id}")
    public ResponseEntity<Medicine> updateMedicine(@PathVariable Long id, @RequestBody Medicine medicine) {
        try {
            if (medicineRepository.existsById(id)) {
                medicine.setId(id);
                Medicine updatedMedicine = medicineRepository.save(medicine);
                return ResponseEntity.ok(updatedMedicine);
            }
            return ResponseEntity.notFound().build();
        } catch (Exception e) {
            logger.error("Error updating medicine with ID {}: {}", id, e.getMessage(), e);
            return ResponseEntity.internalServerError().build();
        }
    }

    @DeleteMapping("/medicines/{id}")
    public ResponseEntity<Void> deleteMedicine(@PathVariable Long id) {
        try {
            if (medicineRepository.existsById(id)) {
                medicineRepository.deleteById(id);
                return ResponseEntity.ok().build();
            }
            return ResponseEntity.notFound().build();
        } catch (Exception e) {
            logger.error("Error deleting medicine with ID {}: {}", id, e.getMessage(), e);
            return ResponseEntity.internalServerError().build();
        }
    }

    // ==================== APPOINTMENTS ENDPOINTS ====================

    @GetMapping("/appointments")
    public ResponseEntity<List<Appointment>> getAppointments(
            @RequestParam(required = false) String status,
            @RequestParam(required = false) Long doctorId,
            @RequestParam(required = false) Long patientId,
            @RequestParam(required = false) String startDate,
            @RequestParam(required = false) String endDate) {
        try {
            List<Appointment> appointments = appointmentRepository.findByBasicFilters(status, doctorId, patientId);
            return ResponseEntity.ok(appointments);
        } catch (Exception e) {
            logger.error("Error fetching appointments: {}", e.getMessage(), e);
            return ResponseEntity.internalServerError().build();
        }
    }

    @GetMapping("/appointments/{id}")
    public ResponseEntity<Appointment> getAppointmentById(@PathVariable Long id) {
        try {
            Optional<Appointment> appointment = appointmentRepository.findById(id);
            return appointment.map(ResponseEntity::ok)
                    .orElse(ResponseEntity.notFound().build());
        } catch (Exception e) {
            logger.error("Error fetching appointment by ID {}: {}", id, e.getMessage(), e);
            return ResponseEntity.internalServerError().build();
        }
    }

    @PostMapping("/appointments")
    public ResponseEntity<Appointment> createAppointment(@RequestBody Appointment appointment) {
        try {
            Appointment savedAppointment = appointmentRepository.save(appointment);
            return ResponseEntity.ok(savedAppointment);
        } catch (Exception e) {
            logger.error("Error creating appointment: {}", e.getMessage(), e);
            return ResponseEntity.internalServerError().build();
        }
    }

    @PutMapping("/appointments/{id}")
    public ResponseEntity<Appointment> updateAppointment(@PathVariable Long id, @RequestBody Appointment appointment) {
        try {
            if (appointmentRepository.existsById(id)) {
                appointment.setId(id);
                Appointment updatedAppointment = appointmentRepository.save(appointment);
                return ResponseEntity.ok(updatedAppointment);
            }
            return ResponseEntity.notFound().build();
        } catch (Exception e) {
            logger.error("Error updating appointment with ID {}: {}", id, e.getMessage(), e);
            return ResponseEntity.internalServerError().build();
        }
    }

    @DeleteMapping("/appointments/{id}")
    public ResponseEntity<Void> deleteAppointment(@PathVariable Long id) {
        try {
            if (appointmentRepository.existsById(id)) {
                appointmentRepository.deleteById(id);
                return ResponseEntity.ok().build();
            }
            return ResponseEntity.notFound().build();
        } catch (Exception e) {
            logger.error("Error deleting appointment with ID {}: {}", id, e.getMessage(), e);
            return ResponseEntity.internalServerError().build();
        }
    }

    // ==================== PRESCRIPTIONS ENDPOINTS ====================

    @GetMapping("/prescriptions")
    public ResponseEntity<List<Prescription>> getPrescriptions(
            @RequestParam(required = false) String status,
            @RequestParam(required = false) Long doctorId,
            @RequestParam(required = false) Long patientId) {
        try {
            List<Prescription> prescriptions = prescriptionRepository.findAll();
            return ResponseEntity.ok(prescriptions);
        } catch (Exception e) {
            logger.error("Error fetching prescriptions: {}", e.getMessage(), e);
            return ResponseEntity.internalServerError().build();
        }
    }

    @GetMapping("/prescriptions/{id}")
    public ResponseEntity<Prescription> getPrescriptionById(@PathVariable Long id) {
        try {
            Optional<Prescription> prescription = prescriptionRepository.findById(id);
            return prescription.map(ResponseEntity::ok)
                    .orElse(ResponseEntity.notFound().build());
        } catch (Exception e) {
            logger.error("Error fetching prescription by ID {}: {}", id, e.getMessage(), e);
            return ResponseEntity.internalServerError().build();
        }
    }

    @PostMapping("/prescriptions")
    public ResponseEntity<Prescription> createPrescription(@RequestBody Prescription prescription) {
        try {
            Prescription savedPrescription = prescriptionRepository.save(prescription);
            return ResponseEntity.ok(savedPrescription);
        } catch (Exception e) {
            logger.error("Error creating prescription: {}", e.getMessage(), e);
            return ResponseEntity.internalServerError().build();
        }
    }

    @PutMapping("/prescriptions/{id}")
    public ResponseEntity<Prescription> updatePrescription(@PathVariable Long id, @RequestBody Prescription prescription) {
        try {
            if (prescriptionRepository.existsById(id)) {
                prescription.setId(id);
                Prescription updatedPrescription = prescriptionRepository.save(prescription);
                return ResponseEntity.ok(updatedPrescription);
            }
            return ResponseEntity.notFound().build();
        } catch (Exception e) {
            logger.error("Error updating prescription with ID {}: {}", id, e.getMessage(), e);
            return ResponseEntity.internalServerError().build();
        }
    }

    @DeleteMapping("/prescriptions/{id}")
    public ResponseEntity<Void> deletePrescription(@PathVariable Long id) {
        try {
            if (prescriptionRepository.existsById(id)) {
                prescriptionRepository.deleteById(id);
                return ResponseEntity.ok().build();
            }
            return ResponseEntity.notFound().build();
        } catch (Exception e) {
            logger.error("Error deleting prescription with ID {}: {}", id, e.getMessage(), e);
            return ResponseEntity.internalServerError().build();
        }
    }

    // ==================== COMPANIES ENDPOINTS ====================
    // Note: Company endpoints are handled by CompanyController to avoid conflicts
    // This section is intentionally left empty to prevent duplicate mappings

    // ==================== BILLING ENDPOINTS ====================

    @GetMapping("/billing")
    public ResponseEntity<List<Billing>> getBills(
            @RequestParam(required = false) String paymentStatus,
            @RequestParam(required = false) Long patientId) {
        try {
            List<Billing> bills = billingRepository.findAll();
            return ResponseEntity.ok(bills);
        } catch (Exception e) {
            logger.error("Error fetching bills: {}", e.getMessage(), e);
            return ResponseEntity.internalServerError().build();
        }
    }

    @GetMapping("/billing/{id}")
    public ResponseEntity<Billing> getBillById(@PathVariable Long id) {
        try {
            Optional<Billing> bill = billingRepository.findById(id);
            return bill.map(ResponseEntity::ok)
                    .orElse(ResponseEntity.notFound().build());
        } catch (Exception e) {
            logger.error("Error fetching bill by ID {}: {}", id, e.getMessage(), e);
            return ResponseEntity.internalServerError().build();
        }
    }

    @PostMapping("/billing")
    public ResponseEntity<Billing> createBill(@RequestBody Billing bill) {
        try {
            Billing savedBill = billingRepository.save(bill);
            return ResponseEntity.ok(savedBill);
        } catch (Exception e) {
            logger.error("Error creating bill: {}", e.getMessage(), e);
            return ResponseEntity.internalServerError().build();
        }
    }

    @PutMapping("/billing/{id}")
    public ResponseEntity<Billing> updateBill(@PathVariable Long id, @RequestBody Billing bill) {
        try {
            if (billingRepository.existsById(id)) {
                bill.setId(id);
                Billing updatedBill = billingRepository.save(bill);
                return ResponseEntity.ok(updatedBill);
            }
            return ResponseEntity.notFound().build();
        } catch (Exception e) {
            logger.error("Error updating bill with ID {}: {}", id, e.getMessage(), e);
            return ResponseEntity.internalServerError().build();
        }
    }

    @DeleteMapping("/billing/{id}")
    public ResponseEntity<Void> deleteBill(@PathVariable Long id) {
        try {
            if (billingRepository.existsById(id)) {
                billingRepository.deleteById(id);
                return ResponseEntity.ok().build();
            }
            return ResponseEntity.notFound().build();
        } catch (Exception e) {
            logger.error("Error deleting bill with ID {}: {}", id, e.getMessage(), e);
            return ResponseEntity.internalServerError().build();
        }
    }

    // ==================== DASHBOARD ENDPOINTS ====================

    @GetMapping("/dashboard/stats")
    public ResponseEntity<Map<String, Object>> getDashboardStats() {
        try {
            Map<String, Object> stats = new HashMap<>();
            stats.put("totalDoctors", userRepository.countByRole("DOCTOR"));
            stats.put("totalPharmacists", userRepository.countByRole("PHARMACIST"));
            stats.put("totalReceptionists", userRepository.countByRole("RECEPTIONIST"));
            stats.put("activePatients", patientRepository.countTotalPatients());
            stats.put("lowStockMedicines", 0L);
            stats.put("scheduledAppointments", appointmentRepository.countTotalAppointments());
            stats.put("activePrescriptions", 0L);
            stats.put("pendingBills", 0L);
            return ResponseEntity.ok(stats);
        } catch (Exception e) {
            logger.error("Error fetching dashboard stats: {}", e.getMessage(), e);
            return ResponseEntity.internalServerError().build();
        }
    }

    // ==================== HEALTH CHECK ENDPOINT ====================

    @GetMapping("/health")
    public ResponseEntity<Map<String, Object>> healthCheck() {
        try {
            Map<String, Object> health = new HashMap<>();
            health.put("status", "UP");
            health.put("timestamp", java.time.LocalDateTime.now().toString());
            health.put("database", "Connected");
            health.put("version", "1.0.0");
            return ResponseEntity.ok(health);
        } catch (Exception e) {
            logger.error("Health check failed: {}", e.getMessage(), e);
            Map<String, Object> health = new HashMap<>();
            health.put("status", "DOWN");
            health.put("timestamp", java.time.LocalDateTime.now().toString());
            health.put("error", e.getMessage());
            return ResponseEntity.status(503).body(health);
        }
    }
} 