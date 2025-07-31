package com.hospital.pharmacy.service;

import com.hospital.pharmacy.model.*;
import com.hospital.pharmacy.repository.*;
import jakarta.annotation.PostConstruct;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.UUID;

/**
 * Service for initializing sample data in the database.
 * Follows DRY, KISS, and separation of concerns principles.
 * 
 * @author Leandre
 * @version 1.0.0
 * @since 2024
 */
@Service
public class DataInitializationService {

    private static final Logger logger = LoggerFactory.getLogger(DataInitializationService.class);

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PatientRepository patientRepository;

    @Autowired
    private MedicineRepository medicineRepository;

    @Autowired
    private CompanyRepository companyRepository;

    @Autowired
    private AppointmentRepository appointmentRepository;

    @Autowired
    private PrescriptionRepository prescriptionRepository;

    @Autowired
    private MedicalRecordRepository medicalRecordRepository;

    private final BCryptPasswordEncoder passwordEncoder = new BCryptPasswordEncoder();

    @PostConstruct
    @Transactional
    public void initData() {
        try {
            logger.info("Starting data initialization...");
            
            // Clear existing data and recreate with proper hashing
            clearAllData();
            
            // Create data in proper order to maintain referential integrity
            createUsers();
            createCompanies();
            createMedicines();
            createPatients();
            createAppointments();
            createPrescriptions();
            createMedicalRecords();
            
            logger.info("Data initialization completed successfully");
        } catch (Exception e) {
            logger.error("Error during data initialization: {}", e.getMessage(), e);
            throw new RuntimeException("Failed to initialize data", e);
        }
    }

    private void clearAllData() {
        logger.info("Clearing existing data...");
        appointmentRepository.deleteAll();
        prescriptionRepository.deleteAll();
        medicalRecordRepository.deleteAll();
        medicineRepository.deleteAll();
        companyRepository.deleteAll();
        patientRepository.deleteAll();
        userRepository.deleteAll();
        logger.info("All existing data cleared");
    }

    private void createUsers() {
        logger.info("Creating users...");
        
        // Create Admin
        createUser("ADM", "Admin", "User", "admin@clinixpro.com", "admin123", "ADMIN", "1234567890", "123 Admin St, Hospital City", "Male", null, null);
        
        // Create Doctors
        createUser("DOC", "Michael", "Chen", "michael.chen@clinixpro.com", "doctor123", "DOCTOR", "555-101-2345", "456 Doctor Ave, Hospital City", "Male", "Cardiology", "MED-1234");
        createUser("DOC", "Emily", "Rodriguez", "emily.rodriguez@clinixpro.com", "doctor123", "DOCTOR", "555-202-3456", "789 Doctor Ave, Hospital City", "Female", "Pediatrics", "MED-5678");
        createUser("DOC", "Sarah", "Jefferson", "sarah.jefferson@clinixpro.com", "doctor123", "DOCTOR", "555-303-4567", "101 Doctor Ave, Hospital City", "Female", "Neurology", "MED-9012");
        
        // Create Pharmacist
        createUser("PHM", "Maria", "Garcia", "pharmacist@clinixpro.com", "pharmacist123", "PHARMACIST", "555-404-5678", "789 Pharma Blvd, Hospital City", "Female", null, "PHR-5678");
        
        // Create Receptionist
        createUser("RCP", "John", "Anderson", "receptionist@clinixpro.com", "receptionist123", "RECEPTIONIST", "555-505-6789", "101 Front Desk Rd, Hospital City", "Male", null, null);
        
        logger.info("Users created successfully");
    }

    private void createUser(String prefix, String firstName, String lastName, String email, String password, 
                           String role, String phoneNumber, String address, String gender, String specialization, String licenseNumber) {
        User user = new User();
        user.setUserId(prefix + "-" + UUID.randomUUID().toString().substring(0, 8).toUpperCase());
        user.setFirstName(firstName);
        user.setLastName(lastName);
        user.setEmail(email);
        user.setPassword(passwordEncoder.encode(password));
        user.setRole(role);
        user.setPhoneNumber(phoneNumber);
        user.setAddress(address);
        user.setGender(gender);
        user.setSpecialization(specialization);
        user.setLicenseNumber(licenseNumber);
        user.setCreatedAt(LocalDateTime.now());
        user.setUpdatedAt(LocalDateTime.now());
        user.setActive(true);
        userRepository.save(user);
    }

    private void createCompanies() {
        logger.info("Creating companies...");
        
        createCompany("PharmaCorp Inc.", "John Smith", "contact@pharmacorp.com", "555-111-2222", "123 Pharma Street, Business City");
        createCompany("MediLife Labs", "Jane Doe", "info@medilife.com", "555-333-4444", "456 Medical Avenue, Science City");
        createCompany("HealthPharm Ltd.", "Mike Johnson", "sales@healthpharm.com", "555-555-6666", "789 Health Boulevard, Wellness City");
        
        logger.info("Companies created successfully");
    }

    private void createCompany(String name, String contactPerson, String email, String phone, String address) {
        Company company = new Company();
        company.setCompanyId("COMP-" + UUID.randomUUID().toString().substring(0, 8).toUpperCase());
        company.setName(name);
        company.setContactPerson(contactPerson);
        company.setEmail(email);
        company.setPhone(phone);
        company.setAddress(address);
        company.setStatus("Active");
        company.setRegistrationDate(LocalDate.now());
        companyRepository.save(company);
    }

    private void createMedicines() {
        logger.info("Creating medicines...");
        
        Company pharmaCorp = companyRepository.findByName("PharmaCorp Inc.").orElse(null);
        Company mediLife = companyRepository.findByName("MediLife Labs").orElse(null);
        Company healthPharm = companyRepository.findByName("HealthPharm Ltd.").orElse(null);

        // Antibiotics
        createMedicine("MED-1001", "Amoxicillin", "Antibiotic", "Broad-spectrum antibiotic for bacterial infections", 
                      "PharmaCorp Inc.", LocalDate.of(2025, 5, 15), 145, new BigDecimal("12.99"), "500mg", pharmaCorp);
        
        // Antihypertensive
        createMedicine("MED-1002", "Lisinopril", "Antihypertensive", "ACE inhibitor for high blood pressure", 
                      "MediLife Labs", LocalDate.of(2024, 11, 30), 78, new BigDecimal("15.49"), "10mg", mediLife);
        
        // Pain Relief
        createMedicine("MED-1003", "Ibuprofen", "Pain Relief", "Non-steroidal anti-inflammatory drug for pain and fever", 
                      "HealthPharm Ltd.", LocalDate.of(2025, 8, 20), 5, new BigDecimal("8.99"), "400mg", healthPharm);
        
        // Antacid
        createMedicine("MED-1004", "Omeprazole", "Antacid", "Proton pump inhibitor for acid reflux", 
                      "PharmaCorp Inc.", LocalDate.of(2024, 12, 10), 0, new BigDecimal("22.50"), "20mg", pharmaCorp);
        
        // Antidiabetic
        createMedicine("MED-1005", "Metformin", "Antidiabetic", "First-line medication for type 2 diabetes", 
                      "MediLife Labs", LocalDate.of(2025, 3, 15), 92, new BigDecimal("18.75"), "500mg", mediLife);
        
        // Cholesterol
        createMedicine("MED-1006", "Atorvastatin", "Cholesterol", "Statin medication for lowering cholesterol", 
                      "HealthPharm Ltd.", LocalDate.of(2025, 6, 30), 3, new BigDecimal("25.00"), "10mg", healthPharm);
        
        // Antihistamine
        createMedicine("MED-1007", "Cetirizine", "Antihistamine", "Second-generation antihistamine for allergies", 
                      "PharmaCorp Inc.", LocalDate.of(2025, 9, 12), 156, new BigDecimal("6.99"), "10mg", pharmaCorp);
        
        // Antihypertensive
        createMedicine("MED-1008", "Losartan", "Antihypertensive", "Angiotensin receptor blocker for hypertension", 
                      "MediLife Labs", LocalDate.of(2024, 10, 25), 0, new BigDecimal("19.99"), "50mg", mediLife);
        
        logger.info("Medicines created successfully");
    }

    private void createMedicine(String medicineId, String name, String category, String description, 
                               String manufacturer, LocalDate expiryDate, Integer stock, BigDecimal price, 
                               String strength, Company company) {
        Medicine medicine = new Medicine();
        medicine.setMedicineId(medicineId);
        medicine.setName(name);
        medicine.setCategory(category);
        medicine.setManufacturer(manufacturer);
        medicine.setExpiryDate(expiryDate);
        medicine.setStock(stock);
        medicine.setPrice(price);
        medicine.setStrength(strength);
        medicine.setDescription(description);
        medicine.setCompany(company);
        medicineRepository.save(medicine);
    }

    private void createPatients() {
        logger.info("Creating patients...");
        
        createPatient("P-1001", "Sarah", "Johnson", "sarah.johnson@example.com", "555-101-2345", 
                     LocalDate.of(1988, 6, 15), "Female", "A+", "123 Main St, Patient City", 
                     "John Johnson", "555-101-2346", "Hypertension, Diabetes", "Penicillin", "Active");
        
        createPatient("P-1002", "Robert", "Smith", "robert.smith@example.com", "555-202-3456", 
                     LocalDate.of(1961, 3, 22), "Male", "O-", "456 Oak Ave, Patient City", 
                     "Mary Smith", "555-202-3457", "Heart Disease, Asthma", "Sulfa drugs", "Active");
        
        createPatient("P-1003", "James", "Williams", "james.williams@example.com", "555-303-4567", 
                     LocalDate.of(1975, 9, 10), "Male", "B+", "789 Pine St, Patient City", 
                     "Lisa Williams", "555-303-4568", "Diabetes, Kidney Disease", "None", "Discharged");
        
        createPatient("P-1004", "Emily", "Brown", "emily.brown@example.com", "555-404-5678", 
                     LocalDate.of(1992, 12, 5), "Female", "AB-", "101 Elm St, Patient City", 
                     "David Brown", "555-404-5679", "Asthma, Anxiety", "Latex", "Active");
        
        createPatient("P-1005", "Michael", "Davis", "michael.davis@example.com", "555-505-6789", 
                     LocalDate.of(1983, 4, 18), "Male", "O+", "202 Maple Ave, Patient City", 
                     "Jennifer Davis", "555-505-6790", "Hypertension", "Shellfish", "Active");
        
        createPatient("P-1006", "Jennifer", "Lee", "jennifer.lee@example.com", "555-606-7890", 
                     LocalDate.of(1990, 7, 12), "Female", "A-", "303 Cedar St, Patient City", 
                     "Tom Lee", "555-606-7891", "Migraine, Depression", "Aspirin", "Active");
        
        createPatient("P-1007", "David", "Wilson", "david.wilson@example.com", "555-707-8901", 
                     LocalDate.of(1978, 11, 30), "Male", "B-", "404 Birch Ave, Patient City", 
                     "Sara Wilson", "555-707-8902", "Arthritis, High Cholesterol", "None", "Inactive");
        
        createPatient("P-1008", "Lisa", "Anderson", "lisa.anderson@example.com", "555-808-9012", 
                     LocalDate.of(1985, 2, 14), "Female", "AB+", "505 Spruce St, Patient City", 
                     "Mark Anderson", "555-808-9013", "Thyroid Disease, Osteoporosis", "Iodine", "Active");
        
        logger.info("Patients created successfully");
    }

    private void createPatient(String patientId, String firstName, String lastName, String email, String phoneNumber,
                              LocalDate dateOfBirth, String gender, String bloodGroup, String address,
                              String emergencyContactName, String emergencyContactPhone, String medicalHistory,
                              String allergies, String status) {
        Patient patient = new Patient();
        patient.setPatientId(patientId);
        patient.setFirstName(firstName);
        patient.setLastName(lastName);
        patient.setEmail(email);
        patient.setPhoneNumber(phoneNumber);
        patient.setDateOfBirth(dateOfBirth);
        patient.setGender(gender);
        patient.setBloodGroup(bloodGroup);
        patient.setAddress(address);
        patient.setEmergencyContactName(emergencyContactName);
        patient.setEmergencyContactPhone(emergencyContactPhone);
        patient.setMedicalHistory(medicalHistory);
        patient.setAllergies(allergies);
        patient.setStatus(status);
        patientRepository.save(patient);
    }

    private void createAppointments() {
        logger.info("Creating appointments...");
        
        User doctor1 = userRepository.findByEmail("michael.chen@clinixpro.com").orElse(null);
        User doctor2 = userRepository.findByEmail("emily.rodriguez@clinixpro.com").orElse(null);
        User doctor3 = userRepository.findByEmail("sarah.jefferson@clinixpro.com").orElse(null);

        Patient patient1 = patientRepository.findByPatientId("P-1001").orElse(null);
        Patient patient2 = patientRepository.findByPatientId("P-1002").orElse(null);
        Patient patient3 = patientRepository.findByPatientId("P-1003").orElse(null);
        Patient patient4 = patientRepository.findByPatientId("P-1004").orElse(null);
        Patient patient5 = patientRepository.findByPatientId("P-1005").orElse(null);
        Patient patient6 = patientRepository.findByPatientId("P-1006").orElse(null);

        createAppointment("APT-2001", patient1, doctor1, LocalDateTime.of(2023, 12, 1, 9, 0), "Consultation", "Confirmed", "Follow-up consultation for heart condition");
        createAppointment("APT-2002", patient2, doctor2, LocalDateTime.of(2023, 12, 1, 10, 30), "Check-up", "Confirmed", "Annual pediatric check-up");
        createAppointment("APT-2003", patient3, doctor3, LocalDateTime.of(2023, 12, 2, 11, 15), "Consultation", "Cancelled", "Neurological consultation cancelled by patient");
        createAppointment("APT-2004", patient4, doctor1, LocalDateTime.of(2023, 12, 2, 14, 0), "Surgery Consultation", "Confirmed", "Pre-surgery consultation for knee replacement");
        createAppointment("APT-2005", patient5, doctor2, LocalDateTime.of(2023, 12, 3, 15, 30), "Check-up", "Pending", "Skin condition evaluation");
        createAppointment("APT-2006", patient6, doctor1, LocalDateTime.of(2023, 12, 3, 11, 0), "Consultation", "Confirmed", "Cardiac consultation");
        
        logger.info("Appointments created successfully");
    }

    private void createAppointment(String appointmentId, Patient patient, User doctor, LocalDateTime appointmentDateTime,
                                  String type, String status, String notes) {
        Appointment appointment = new Appointment();
        appointment.setAppointmentId(appointmentId);
        appointment.setPatient(patient);
        appointment.setDoctor(doctor);
        appointment.setAppointmentDateTime(appointmentDateTime);
        appointment.setType(type);
        appointment.setStatus(status);
        appointment.setNotes(notes);
        appointmentRepository.save(appointment);
    }

    private void createPrescriptions() {
        logger.info("Creating prescriptions...");
        
        User doctor1 = userRepository.findByEmail("michael.chen@clinixpro.com").orElse(null);
        User doctor2 = userRepository.findByEmail("emily.rodriguez@clinixpro.com").orElse(null);

        Patient patient1 = patientRepository.findByPatientId("P-1001").orElse(null);
        Patient patient2 = patientRepository.findByPatientId("P-1002").orElse(null);

        createPrescription("PRES-3001", patient1, doctor1, "Amoxicillin", "500mg", "Twice daily", "7 days", "Take with food", "For bacterial infection");
        createPrescription("PRES-3002", patient2, doctor2, "Lisinopril", "10mg", "Once daily", "30 days", "Take in the morning", "For hypertension");
        createPrescription("PRES-3003", patient1, doctor1, "Metformin", "500mg", "Twice daily", "30 days", "Take with meals", "For type 2 diabetes");
        
        logger.info("Prescriptions created successfully");
    }

    private void createPrescription(String prescriptionId, Patient patient, User doctor, String medication, String dosage,
                                   String frequency, String duration, String instructions, String notes) {
        Prescription prescription = new Prescription();
        prescription.setPrescriptionId(prescriptionId);
        prescription.setPatient(patient);
        prescription.setDoctor(doctor);
        prescription.setMedication(medication);
        prescription.setDosage(dosage);
        prescription.setFrequency(frequency);
        prescription.setDuration(duration);
        prescription.setInstructions(instructions);
        prescription.setPrescriptionDate(LocalDate.now());
        prescription.setExpiryDate(LocalDate.now().plusMonths(1));
        prescription.setStatus("Active");
        prescription.setNotes(notes);
        prescriptionRepository.save(prescription);
    }

    private void createMedicalRecords() {
        logger.info("Creating medical records...");
        
        User doctor1 = userRepository.findByEmail("michael.chen@clinixpro.com").orElse(null);
        User doctor2 = userRepository.findByEmail("emily.rodriguez@clinixpro.com").orElse(null);

        Patient patient1 = patientRepository.findByPatientId("P-1001").orElse(null);
        Patient patient2 = patientRepository.findByPatientId("P-1002").orElse(null);

        createMedicalRecord("REC-4001", patient1, doctor1, "High blood pressure and frequent urination", 
                           "Hypertension and Type 2 Diabetes", "Lifestyle modifications, medication management", 
                           "Patient responding well to treatment. Continue current medications.");
        
        createMedicalRecord("REC-4002", patient2, doctor2, "Shortness of breath and chest pain", 
                           "Asthma and Heart Disease", "Inhaler therapy, cardiac monitoring", 
                           "Asthma well controlled. Continue cardiac monitoring.");
        
        logger.info("Medical records created successfully");
    }

    private void createMedicalRecord(String recordId, Patient patient, User doctor, String chiefComplaint,
                                    String diagnosis, String treatment, String notes) {
        MedicalRecord record = new MedicalRecord();
        record.setRecordId(recordId);
        record.setPatient(patient);
        record.setDoctor(doctor);
        record.setRecordDate(LocalDate.now());
        record.setChiefComplaint(chiefComplaint);
        record.setDiagnosis(diagnosis);
        record.setTreatment(treatment);
        record.setNotes(notes);
        medicalRecordRepository.save(record);
    }
}