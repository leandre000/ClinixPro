package com.hospital.pharmacy.service;

import com.hospital.pharmacy.model.*;
import com.hospital.pharmacy.repository.*;
import jakarta.annotation.PostConstruct;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.UUID;

@Service
public class DataInitializationService {

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
    public void initData() {
        // Clear existing data and recreate with proper hashing
        appointmentRepository.deleteAll();
        prescriptionRepository.deleteAll();
        medicalRecordRepository.deleteAll();
        medicineRepository.deleteAll();
        companyRepository.deleteAll();
        patientRepository.deleteAll();
        userRepository.deleteAll();
        
        createUsers();
        createCompanies();
        createMedicines();
        createPatients();
        createAppointments();
        createPrescriptions();
        createMedicalRecords();
    }

    private void createUsers() {
        // Create Admin
        User admin = new User();
        admin.setUserId("ADM-" + UUID.randomUUID().toString().substring(0, 8).toUpperCase());
        admin.setFirstName("Admin");
        admin.setLastName("User");
        admin.setEmail("admin@clinixpro.com");
        admin.setPassword(passwordEncoder.encode("admin123"));
        admin.setRole("ADMIN");
        admin.setPhoneNumber("1234567890");
        admin.setAddress("123 Admin St, Hospital City");
        admin.setGender("Male");
        admin.setCreatedAt(LocalDateTime.now());
        admin.setUpdatedAt(LocalDateTime.now());
        admin.setActive(true);
        userRepository.save(admin);

        // Create Doctors
        User doctor1 = new User();
        doctor1.setUserId("DOC-" + UUID.randomUUID().toString().substring(0, 8).toUpperCase());
        doctor1.setFirstName("Michael");
        doctor1.setLastName("Chen");
        doctor1.setEmail("michael.chen@clinixpro.com");
        doctor1.setPassword(passwordEncoder.encode("doctor123"));
        doctor1.setRole("DOCTOR");
        doctor1.setPhoneNumber("555-101-2345");
        doctor1.setAddress("456 Doctor Ave, Hospital City");
        doctor1.setGender("Male");
        doctor1.setSpecialization("Cardiology");
        doctor1.setLicenseNumber("MED-1234");
        doctor1.setCreatedAt(LocalDateTime.now());
        doctor1.setUpdatedAt(LocalDateTime.now());
        doctor1.setActive(true);
        userRepository.save(doctor1);

        User doctor2 = new User();
        doctor2.setUserId("DOC-" + UUID.randomUUID().toString().substring(0, 8).toUpperCase());
        doctor2.setFirstName("Emily");
        doctor2.setLastName("Rodriguez");
        doctor2.setEmail("emily.rodriguez@clinixpro.com");
        doctor2.setPassword(passwordEncoder.encode("doctor123"));
        doctor2.setRole("DOCTOR");
        doctor2.setPhoneNumber("555-202-3456");
        doctor2.setAddress("789 Doctor Ave, Hospital City");
        doctor2.setGender("Female");
        doctor2.setSpecialization("Pediatrics");
        doctor2.setLicenseNumber("MED-5678");
        doctor2.setCreatedAt(LocalDateTime.now());
        doctor2.setUpdatedAt(LocalDateTime.now());
        doctor2.setActive(true);
        userRepository.save(doctor2);

        User doctor3 = new User();
        doctor3.setUserId("DOC-" + UUID.randomUUID().toString().substring(0, 8).toUpperCase());
        doctor3.setFirstName("Sarah");
        doctor3.setLastName("Jefferson");
        doctor3.setEmail("sarah.jefferson@clinixpro.com");
        doctor3.setPassword(passwordEncoder.encode("doctor123"));
        doctor3.setRole("DOCTOR");
        doctor3.setPhoneNumber("555-303-4567");
        doctor3.setAddress("101 Doctor Ave, Hospital City");
        doctor3.setGender("Female");
        doctor3.setSpecialization("Neurology");
        doctor3.setLicenseNumber("MED-9012");
        doctor3.setCreatedAt(LocalDateTime.now());
        doctor3.setUpdatedAt(LocalDateTime.now());
        doctor3.setActive(true);
        userRepository.save(doctor3);

        // Create Pharmacist
        User pharmacist = new User();
        pharmacist.setUserId("PHM-" + UUID.randomUUID().toString().substring(0, 8).toUpperCase());
        pharmacist.setFirstName("Maria");
        pharmacist.setLastName("Garcia");
        pharmacist.setEmail("pharmacist@clinixpro.com");
        pharmacist.setPassword(passwordEncoder.encode("pharmacist123"));
        pharmacist.setRole("PHARMACIST");
        pharmacist.setPhoneNumber("555-404-5678");
        pharmacist.setAddress("789 Pharma Blvd, Hospital City");
        pharmacist.setGender("Female");
        pharmacist.setLicenseNumber("PHR-5678");
        pharmacist.setCreatedAt(LocalDateTime.now());
        pharmacist.setUpdatedAt(LocalDateTime.now());
        pharmacist.setActive(true);
        userRepository.save(pharmacist);

        // Create Receptionist
        User receptionist = new User();
        receptionist.setUserId("RCP-" + UUID.randomUUID().toString().substring(0, 8).toUpperCase());
        receptionist.setFirstName("John");
        receptionist.setLastName("Anderson");
        receptionist.setEmail("receptionist@clinixpro.com");
        receptionist.setPassword(passwordEncoder.encode("receptionist123"));
        receptionist.setRole("RECEPTIONIST");
        receptionist.setPhoneNumber("555-505-6789");
        receptionist.setAddress("101 Front Desk Rd, Hospital City");
        receptionist.setGender("Male");
        receptionist.setCreatedAt(LocalDateTime.now());
        receptionist.setUpdatedAt(LocalDateTime.now());
        receptionist.setActive(true);
        userRepository.save(receptionist);
    }

    private void createCompanies() {
        Company company1 = new Company();
        company1.setCompanyId("COMP-" + UUID.randomUUID().toString().substring(0, 8).toUpperCase());
        company1.setCompanyName("PharmaCorp Inc.");
        company1.setContactPerson("John Smith");
        company1.setEmail("contact@pharmacorp.com");
        company1.setPhoneNumber("555-111-2222");
        company1.setAddress("123 Pharma Street, Business City");
        company1.setLicenseNumber("LIC-001");
        company1.setCreatedAt(LocalDateTime.now());
        company1.setUpdatedAt(LocalDateTime.now());
        company1.setActive(true);
        companyRepository.save(company1);

        Company company2 = new Company();
        company2.setCompanyId("COMP-" + UUID.randomUUID().toString().substring(0, 8).toUpperCase());
        company2.setCompanyName("MediLife Labs");
        company2.setContactPerson("Jane Doe");
        company2.setEmail("info@medilife.com");
        company2.setPhoneNumber("555-333-4444");
        company2.setAddress("456 Medical Avenue, Science City");
        company2.setLicenseNumber("LIC-002");
        company2.setCreatedAt(LocalDateTime.now());
        company2.setUpdatedAt(LocalDateTime.now());
        company2.setActive(true);
        companyRepository.save(company2);

        Company company3 = new Company();
        company3.setCompanyId("COMP-" + UUID.randomUUID().toString().substring(0, 8).toUpperCase());
        company3.setCompanyName("HealthPharm Ltd.");
        company3.setContactPerson("Mike Johnson");
        company3.setEmail("sales@healthpharm.com");
        company3.setPhoneNumber("555-555-6666");
        company3.setAddress("789 Health Boulevard, Wellness City");
        company3.setLicenseNumber("LIC-003");
        company3.setCreatedAt(LocalDateTime.now());
        company3.setUpdatedAt(LocalDateTime.now());
        company3.setActive(true);
        companyRepository.save(company3);
    }

    private void createMedicines() {
        Company pharmaCorp = companyRepository.findByCompanyName("PharmaCorp Inc.").orElse(null);
        Company mediLife = companyRepository.findByCompanyName("MediLife Labs").orElse(null);
        Company healthPharm = companyRepository.findByCompanyName("HealthPharm Ltd.").orElse(null);

        // Antibiotics
        Medicine amoxicillin = new Medicine();
        amoxicillin.setMedicineId("MED-1001");
        amoxicillin.setName("Amoxicillin");
        amoxicillin.setCategory("Antibiotic");
        amoxicillin.setManufacturer(pharmaCorp);
        amoxicillin.setExpiryDate(LocalDate.of(2025, 5, 15));
        amoxicillin.setStock(145);
        amoxicillin.setPrice(12.99);
        amoxicillin.setDosage("500mg");
        amoxicillin.setDescription("Broad-spectrum antibiotic for bacterial infections");
        amoxicillin.setCreatedAt(LocalDateTime.now());
        amoxicillin.setUpdatedAt(LocalDateTime.now());
        amoxicillin.setActive(true);
        medicineRepository.save(amoxicillin);

        // Antihypertensive
        Medicine lisinopril = new Medicine();
        lisinopril.setMedicineId("MED-1002");
        lisinopril.setName("Lisinopril");
        lisinopril.setCategory("Antihypertensive");
        lisinopril.setManufacturer(mediLife);
        lisinopril.setExpiryDate(LocalDate.of(2024, 11, 30));
        lisinopril.setStock(78);
        lisinopril.setPrice(15.49);
        lisinopril.setDosage("10mg");
        lisinopril.setDescription("ACE inhibitor for high blood pressure");
        lisinopril.setCreatedAt(LocalDateTime.now());
        lisinopril.setUpdatedAt(LocalDateTime.now());
        lisinopril.setActive(true);
        medicineRepository.save(lisinopril);

        // Pain Relief
        Medicine ibuprofen = new Medicine();
        ibuprofen.setMedicineId("MED-1003");
        ibuprofen.setName("Ibuprofen");
        ibuprofen.setCategory("Pain Relief");
        ibuprofen.setManufacturer(healthPharm);
        ibuprofen.setExpiryDate(LocalDate.of(2025, 8, 20));
        ibuprofen.setStock(5);
        ibuprofen.setPrice(8.99);
        ibuprofen.setDosage("400mg");
        ibuprofen.setDescription("Non-steroidal anti-inflammatory drug for pain and fever");
        ibuprofen.setCreatedAt(LocalDateTime.now());
        ibuprofen.setUpdatedAt(LocalDateTime.now());
        ibuprofen.setActive(true);
        medicineRepository.save(ibuprofen);

        // Antacid
        Medicine omeprazole = new Medicine();
        omeprazole.setMedicineId("MED-1004");
        omeprazole.setName("Omeprazole");
        omeprazole.setCategory("Antacid");
        omeprazole.setManufacturer(pharmaCorp);
        omeprazole.setExpiryDate(LocalDate.of(2024, 12, 10));
        omeprazole.setStock(0);
        omeprazole.setPrice(22.50);
        omeprazole.setDosage("20mg");
        omeprazole.setDescription("Proton pump inhibitor for acid reflux");
        omeprazole.setCreatedAt(LocalDateTime.now());
        omeprazole.setUpdatedAt(LocalDateTime.now());
        omeprazole.setActive(true);
        medicineRepository.save(omeprazole);

        // Antidiabetic
        Medicine metformin = new Medicine();
        metformin.setMedicineId("MED-1005");
        metformin.setName("Metformin");
        metformin.setCategory("Antidiabetic");
        metformin.setManufacturer(mediLife);
        metformin.setExpiryDate(LocalDate.of(2025, 3, 15));
        metformin.setStock(92);
        metformin.setPrice(18.75);
        metformin.setDosage("500mg");
        metformin.setDescription("First-line medication for type 2 diabetes");
        metformin.setCreatedAt(LocalDateTime.now());
        metformin.setUpdatedAt(LocalDateTime.now());
        metformin.setActive(true);
        medicineRepository.save(metformin);

        // Cholesterol
        Medicine atorvastatin = new Medicine();
        atorvastatin.setMedicineId("MED-1006");
        atorvastatin.setName("Atorvastatin");
        atorvastatin.setCategory("Cholesterol");
        atorvastatin.setManufacturer(healthPharm);
        atorvastatin.setExpiryDate(LocalDate.of(2025, 6, 30));
        atorvastatin.setStock(3);
        atorvastatin.setPrice(25.00);
        atorvastatin.setDosage("10mg");
        atorvastatin.setDescription("Statin medication for lowering cholesterol");
        atorvastatin.setCreatedAt(LocalDateTime.now());
        atorvastatin.setUpdatedAt(LocalDateTime.now());
        atorvastatin.setActive(true);
        medicineRepository.save(atorvastatin);

        // Antihistamine
        Medicine cetirizine = new Medicine();
        cetirizine.setMedicineId("MED-1007");
        cetirizine.setName("Cetirizine");
        cetirizine.setCategory("Antihistamine");
        cetirizine.setManufacturer(pharmaCorp);
        cetirizine.setExpiryDate(LocalDate.of(2025, 9, 12));
        cetirizine.setStock(156);
        cetirizine.setPrice(6.99);
        cetirizine.setDosage("10mg");
        cetirizine.setDescription("Second-generation antihistamine for allergies");
        cetirizine.setCreatedAt(LocalDateTime.now());
        cetirizine.setUpdatedAt(LocalDateTime.now());
        cetirizine.setActive(true);
        medicineRepository.save(cetirizine);

        // Antihypertensive
        Medicine losartan = new Medicine();
        losartan.setMedicineId("MED-1008");
        losartan.setName("Losartan");
        losartan.setCategory("Antihypertensive");
        losartan.setManufacturer(mediLife);
        losartan.setExpiryDate(LocalDate.of(2024, 10, 25));
        losartan.setStock(0);
        losartan.setPrice(19.99);
        losartan.setDosage("50mg");
        losartan.setDescription("Angiotensin receptor blocker for hypertension");
        losartan.setCreatedAt(LocalDateTime.now());
        losartan.setUpdatedAt(LocalDateTime.now());
        losartan.setActive(true);
        medicineRepository.save(losartan);
    }

    private void createPatients() {
        // Patient 1
        Patient patient1 = new Patient();
        patient1.setPatientId("P-1001");
        patient1.setFirstName("Sarah");
        patient1.setLastName("Johnson");
        patient1.setEmail("sarah.johnson@example.com");
        patient1.setPhoneNumber("555-101-2345");
        patient1.setDateOfBirth(LocalDate.of(1988, 6, 15));
        patient1.setGender("Female");
        patient1.setBloodGroup("A+");
        patient1.setAddress("123 Main St, Patient City");
        patient1.setEmergencyContact("John Johnson");
        patient1.setEmergencyPhone("555-101-2346");
        patient1.setMedicalHistory("Hypertension, Diabetes");
        patient1.setAllergies("Penicillin");
        patient1.setStatus("Active");
        patient1.setCreatedAt(LocalDateTime.now());
        patient1.setUpdatedAt(LocalDateTime.now());
        patient1.setActive(true);
        patientRepository.save(patient1);

        // Patient 2
        Patient patient2 = new Patient();
        patient2.setPatientId("P-1002");
        patient2.setFirstName("Robert");
        patient2.setLastName("Smith");
        patient2.setEmail("robert.smith@example.com");
        patient2.setPhoneNumber("555-202-3456");
        patient2.setDateOfBirth(LocalDate.of(1961, 3, 22));
        patient2.setGender("Male");
        patient2.setBloodGroup("O-");
        patient2.setAddress("456 Oak Ave, Patient City");
        patient2.setEmergencyContact("Mary Smith");
        patient2.setEmergencyPhone("555-202-3457");
        patient2.setMedicalHistory("Heart Disease, Asthma");
        patient2.setAllergies("Sulfa drugs");
        patient2.setStatus("Active");
        patient2.setCreatedAt(LocalDateTime.now());
        patient2.setUpdatedAt(LocalDateTime.now());
        patient2.setActive(true);
        patientRepository.save(patient2);

        // Patient 3
        Patient patient3 = new Patient();
        patient3.setPatientId("P-1003");
        patient3.setFirstName("James");
        patient3.setLastName("Williams");
        patient3.setEmail("james.williams@example.com");
        patient3.setPhoneNumber("555-303-4567");
        patient3.setDateOfBirth(LocalDate.of(1975, 9, 10));
        patient3.setGender("Male");
        patient3.setBloodGroup("B+");
        patient3.setAddress("789 Pine St, Patient City");
        patient3.setEmergencyContact("Lisa Williams");
        patient3.setEmergencyPhone("555-303-4568");
        patient3.setMedicalHistory("Diabetes, Kidney Disease");
        patient3.setAllergies("None");
        patient3.setStatus("Discharged");
        patient3.setCreatedAt(LocalDateTime.now());
        patient3.setUpdatedAt(LocalDateTime.now());
        patient3.setActive(true);
        patientRepository.save(patient3);

        // Patient 4
        Patient patient4 = new Patient();
        patient4.setPatientId("P-1004");
        patient4.setFirstName("Emily");
        patient4.setLastName("Brown");
        patient4.setEmail("emily.brown@example.com");
        patient4.setPhoneNumber("555-404-5678");
        patient4.setDateOfBirth(LocalDate.of(1992, 12, 5));
        patient4.setGender("Female");
        patient4.setBloodGroup("AB-");
        patient4.setAddress("101 Elm St, Patient City");
        patient4.setEmergencyContact("David Brown");
        patient4.setEmergencyPhone("555-404-5679");
        patient4.setMedicalHistory("Asthma, Anxiety");
        patient4.setAllergies("Latex");
        patient4.setStatus("Active");
        patient4.setCreatedAt(LocalDateTime.now());
        patient4.setUpdatedAt(LocalDateTime.now());
        patient4.setActive(true);
        patientRepository.save(patient4);

        // Patient 5
        Patient patient5 = new Patient();
        patient5.setPatientId("P-1005");
        patient5.setFirstName("Michael");
        patient5.setLastName("Davis");
        patient5.setEmail("michael.davis@example.com");
        patient5.setPhoneNumber("555-505-6789");
        patient5.setDateOfBirth(LocalDate.of(1983, 4, 18));
        patient5.setGender("Male");
        patient5.setBloodGroup("O+");
        patient5.setAddress("202 Maple Ave, Patient City");
        patient5.setEmergencyContact("Jennifer Davis");
        patient5.setEmergencyPhone("555-505-6790");
        patient5.setMedicalHistory("Hypertension");
        patient5.setAllergies("Shellfish");
        patient5.setStatus("Active");
        patient5.setCreatedAt(LocalDateTime.now());
        patient5.setUpdatedAt(LocalDateTime.now());
        patient5.setActive(true);
        patientRepository.save(patient5);

        // Patient 6
        Patient patient6 = new Patient();
        patient6.setPatientId("P-1006");
        patient6.setFirstName("Jennifer");
        patient6.setLastName("Lee");
        patient6.setEmail("jennifer.lee@example.com");
        patient6.setPhoneNumber("555-606-7890");
        patient6.setDateOfBirth(LocalDate.of(1990, 7, 12));
        patient6.setGender("Female");
        patient6.setBloodGroup("A-");
        patient6.setAddress("303 Cedar St, Patient City");
        patient6.setEmergencyContact("Tom Lee");
        patient6.setEmergencyPhone("555-606-7891");
        patient6.setMedicalHistory("Migraine, Depression");
        patient6.setAllergies("Aspirin");
        patient6.setStatus("Active");
        patient6.setCreatedAt(LocalDateTime.now());
        patient6.setUpdatedAt(LocalDateTime.now());
        patient6.setActive(true);
        patientRepository.save(patient6);

        // Patient 7
        Patient patient7 = new Patient();
        patient7.setPatientId("P-1007");
        patient7.setFirstName("David");
        patient7.setLastName("Wilson");
        patient7.setEmail("david.wilson@example.com");
        patient7.setPhoneNumber("555-707-8901");
        patient7.setDateOfBirth(LocalDate.of(1978, 11, 30));
        patient7.setGender("Male");
        patient7.setBloodGroup("B-");
        patient7.setAddress("404 Birch Ave, Patient City");
        patient7.setEmergencyContact("Sara Wilson");
        patient7.setEmergencyPhone("555-707-8902");
        patient7.setMedicalHistory("Arthritis, High Cholesterol");
        patient7.setAllergies("None");
        patient7.setStatus("Inactive");
        patient7.setCreatedAt(LocalDateTime.now());
        patient7.setUpdatedAt(LocalDateTime.now());
        patient7.setActive(true);
        patientRepository.save(patient7);

        // Patient 8
        Patient patient8 = new Patient();
        patient8.setPatientId("P-1008");
        patient8.setFirstName("Lisa");
        patient8.setLastName("Anderson");
        patient8.setEmail("lisa.anderson@example.com");
        patient8.setPhoneNumber("555-808-9012");
        patient8.setDateOfBirth(LocalDate.of(1985, 2, 14));
        patient8.setGender("Female");
        patient8.setBloodGroup("AB+");
        patient8.setAddress("505 Spruce St, Patient City");
        patient8.setEmergencyContact("Mark Anderson");
        patient8.setEmergencyPhone("555-808-9013");
        patient8.setMedicalHistory("Thyroid Disease, Osteoporosis");
        patient8.setAllergies("Iodine");
        patient8.setStatus("Active");
        patient8.setCreatedAt(LocalDateTime.now());
        patient8.setUpdatedAt(LocalDateTime.now());
        patient8.setActive(true);
        patientRepository.save(patient8);
    }

    private void createAppointments() {
        User doctor1 = userRepository.findByEmail("michael.chen@clinixpro.com").orElse(null);
        User doctor2 = userRepository.findByEmail("emily.rodriguez@clinixpro.com").orElse(null);
        User doctor3 = userRepository.findByEmail("sarah.jefferson@clinixpro.com").orElse(null);

        Patient patient1 = patientRepository.findByPatientId("P-1001").orElse(null);
        Patient patient2 = patientRepository.findByPatientId("P-1002").orElse(null);
        Patient patient3 = patientRepository.findByPatientId("P-1003").orElse(null);
        Patient patient4 = patientRepository.findByPatientId("P-1004").orElse(null);
        Patient patient5 = patientRepository.findByPatientId("P-1005").orElse(null);
        Patient patient6 = patientRepository.findByPatientId("P-1006").orElse(null);

        // Appointment 1
        Appointment apt1 = new Appointment();
        apt1.setAppointmentId("APT-2001");
        apt1.setPatient(patient1);
        apt1.setDoctor(doctor1);
        apt1.setAppointmentDate(LocalDate.of(2023, 12, 1));
        apt1.setAppointmentTime("09:00");
        apt1.setType("Consultation");
        apt1.setStatus("Confirmed");
        apt1.setNotes("Follow-up consultation for heart condition");
        apt1.setDepartment("Cardiology");
        apt1.setCreatedAt(LocalDateTime.now());
        apt1.setUpdatedAt(LocalDateTime.now());
        apt1.setActive(true);
        appointmentRepository.save(apt1);

        // Appointment 2
        Appointment apt2 = new Appointment();
        apt2.setAppointmentId("APT-2002");
        apt2.setPatient(patient2);
        apt2.setDoctor(doctor2);
        apt2.setAppointmentDate(LocalDate.of(2023, 12, 1));
        apt2.setAppointmentTime("10:30");
        apt2.setType("Check-up");
        apt2.setStatus("Confirmed");
        apt2.setNotes("Annual pediatric check-up");
        apt2.setDepartment("Pediatrics");
        apt2.setCreatedAt(LocalDateTime.now());
        apt2.setUpdatedAt(LocalDateTime.now());
        apt2.setActive(true);
        appointmentRepository.save(apt2);

        // Appointment 3
        Appointment apt3 = new Appointment();
        apt3.setAppointmentId("APT-2003");
        apt3.setPatient(patient3);
        apt3.setDoctor(doctor3);
        apt3.setAppointmentDate(LocalDate.of(2023, 12, 2));
        apt3.setAppointmentTime("11:15");
        apt3.setType("Consultation");
        apt3.setStatus("Cancelled");
        apt3.setNotes("Neurological consultation cancelled by patient");
        apt3.setDepartment("Neurology");
        apt3.setCreatedAt(LocalDateTime.now());
        apt3.setUpdatedAt(LocalDateTime.now());
        apt3.setActive(true);
        appointmentRepository.save(apt3);

        // Appointment 4
        Appointment apt4 = new Appointment();
        apt4.setAppointmentId("APT-2004");
        apt4.setPatient(patient4);
        apt4.setDoctor(doctor1);
        apt4.setAppointmentDate(LocalDate.of(2023, 12, 2));
        apt4.setAppointmentTime("14:00");
        apt4.setType("Surgery Consultation");
        apt4.setStatus("Confirmed");
        apt4.setNotes("Pre-surgery consultation for knee replacement");
        apt4.setDepartment("Orthopedics");
        apt4.setCreatedAt(LocalDateTime.now());
        apt4.setUpdatedAt(LocalDateTime.now());
        apt4.setActive(true);
        appointmentRepository.save(apt4);

        // Appointment 5
        Appointment apt5 = new Appointment();
        apt5.setAppointmentId("APT-2005");
        apt5.setPatient(patient5);
        apt5.setDoctor(doctor2);
        apt5.setAppointmentDate(LocalDate.of(2023, 12, 3));
        apt5.setAppointmentTime("15:30");
        apt5.setType("Check-up");
        apt5.setStatus("Pending");
        apt5.setNotes("Skin condition evaluation");
        apt5.setDepartment("Dermatology");
        apt5.setCreatedAt(LocalDateTime.now());
        apt5.setUpdatedAt(LocalDateTime.now());
        apt5.setActive(true);
        appointmentRepository.save(apt5);

        // Appointment 6
        Appointment apt6 = new Appointment();
        apt6.setAppointmentId("APT-2006");
        apt6.setPatient(patient6);
        apt6.setDoctor(doctor1);
        apt6.setAppointmentDate(LocalDate.of(2023, 12, 3));
        apt6.setAppointmentTime("11:00");
        apt6.setType("Consultation");
        apt6.setStatus("Confirmed");
        apt6.setNotes("Cardiac consultation");
        apt6.setDepartment("Cardiology");
        apt6.setCreatedAt(LocalDateTime.now());
        apt6.setUpdatedAt(LocalDateTime.now());
        apt6.setActive(true);
        appointmentRepository.save(apt6);
    }

    private void createPrescriptions() {
        User doctor1 = userRepository.findByEmail("michael.chen@clinixpro.com").orElse(null);
        User doctor2 = userRepository.findByEmail("emily.rodriguez@clinixpro.com").orElse(null);

        Patient patient1 = patientRepository.findByPatientId("P-1001").orElse(null);
        Patient patient2 = patientRepository.findByPatientId("P-1002").orElse(null);

        Medicine amoxicillin = medicineRepository.findByMedicineId("MED-1001").orElse(null);
        Medicine lisinopril = medicineRepository.findByMedicineId("MED-1002").orElse(null);
        Medicine metformin = medicineRepository.findByMedicineId("MED-1005").orElse(null);

        // Prescription 1
        Prescription pres1 = new Prescription();
        pres1.setPrescriptionId("PRES-3001");
        pres1.setPatient(patient1);
        pres1.setDoctor(doctor1);
        pres1.setMedicine(amoxicillin);
        pres1.setDosage("500mg");
        pres1.setFrequency("Twice daily");
        pres1.setDuration("7 days");
        pres1.setQuantity(14);
        pres1.setInstructions("Take with food");
        pres1.setPrescriptionDate(LocalDate.now());
        pres1.setStatus("Active");
        pres1.setNotes("For bacterial infection");
        pres1.setCreatedAt(LocalDateTime.now());
        pres1.setUpdatedAt(LocalDateTime.now());
        pres1.setActive(true);
        prescriptionRepository.save(pres1);

        // Prescription 2
        Prescription pres2 = new Prescription();
        pres2.setPrescriptionId("PRES-3002");
        pres2.setPatient(patient2);
        pres2.setDoctor(doctor2);
        pres2.setMedicine(lisinopril);
        pres2.setDosage("10mg");
        pres2.setFrequency("Once daily");
        pres2.setDuration("30 days");
        pres2.setQuantity(30);
        pres2.setInstructions("Take in the morning");
        pres2.setPrescriptionDate(LocalDate.now());
        pres2.setStatus("Active");
        pres2.setNotes("For hypertension");
        pres2.setCreatedAt(LocalDateTime.now());
        pres2.setUpdatedAt(LocalDateTime.now());
        pres2.setActive(true);
        prescriptionRepository.save(pres2);

        // Prescription 3
        Prescription pres3 = new Prescription();
        pres3.setPrescriptionId("PRES-3003");
        pres3.setPatient(patient1);
        pres3.setDoctor(doctor1);
        pres3.setMedicine(metformin);
        pres3.setDosage("500mg");
        pres3.setFrequency("Twice daily");
        pres3.setDuration("30 days");
        pres3.setQuantity(60);
        pres3.setInstructions("Take with meals");
        pres3.setPrescriptionDate(LocalDate.now());
        pres3.setStatus("Active");
        pres3.setNotes("For type 2 diabetes");
        pres3.setCreatedAt(LocalDateTime.now());
        pres3.setUpdatedAt(LocalDateTime.now());
        pres3.setActive(true);
        prescriptionRepository.save(pres3);
    }

    private void createMedicalRecords() {
        User doctor1 = userRepository.findByEmail("michael.chen@clinixpro.com").orElse(null);
        User doctor2 = userRepository.findByEmail("emily.rodriguez@clinixpro.com").orElse(null);

        Patient patient1 = patientRepository.findByPatientId("P-1001").orElse(null);
        Patient patient2 = patientRepository.findByPatientId("P-1002").orElse(null);

        // Medical Record 1
        MedicalRecord record1 = new MedicalRecord();
        record1.setRecordId("REC-4001");
        record1.setPatient(patient1);
        record1.setDoctor(doctor1);
        record1.setRecordDate(LocalDate.now());
        record1.setDiagnosis("Hypertension and Type 2 Diabetes");
        record1.setSymptoms("High blood pressure, frequent urination, fatigue");
        record1.setTreatment("Lifestyle modifications, medication management");
        record1.setMedications("Lisinopril 10mg daily, Metformin 500mg twice daily");
        record1.setVitalSigns("BP: 140/90, HR: 72, Temp: 98.6°F");
        record1.setNotes("Patient responding well to treatment. Continue current medications.");
        record1.setFollowUpDate(LocalDate.now().plusMonths(3));
        record1.setCreatedAt(LocalDateTime.now());
        record1.setUpdatedAt(LocalDateTime.now());
        record1.setActive(true);
        medicalRecordRepository.save(record1);

        // Medical Record 2
        MedicalRecord record2 = new MedicalRecord();
        record2.setRecordId("REC-4002");
        record2.setPatient(patient2);
        record2.setDoctor(doctor2);
        record2.setRecordDate(LocalDate.now());
        record2.setDiagnosis("Asthma and Heart Disease");
        record2.setSymptoms("Shortness of breath, chest pain, wheezing");
        record2.setTreatment("Inhaler therapy, cardiac monitoring");
        record2.setMedications("Albuterol inhaler, Aspirin 81mg daily");
        record2.setVitalSigns("BP: 130/85, HR: 68, Temp: 98.4°F, O2 Sat: 96%");
        record2.setNotes("Asthma well controlled. Continue cardiac monitoring.");
        record2.setFollowUpDate(LocalDate.now().plusMonths(2));
        record2.setCreatedAt(LocalDateTime.now());
        record2.setUpdatedAt(LocalDateTime.now());
        record2.setActive(true);
        medicalRecordRepository.save(record2);
    }
}