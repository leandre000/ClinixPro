package com.hospital.pharmacy.controller;

import com.hospital.pharmacy.dto.CompanyDTO;
import com.hospital.pharmacy.dto.DistributorDTO;
import com.hospital.pharmacy.dto.MedicineDTO;
import com.hospital.pharmacy.model.Company;
import com.hospital.pharmacy.model.Distributor;
import com.hospital.pharmacy.model.Medicine;
import com.hospital.pharmacy.model.Prescription;
import com.hospital.pharmacy.repository.CompanyRepository;
import com.hospital.pharmacy.repository.DistributorRepository;
import com.hospital.pharmacy.repository.MedicineRepository;
import com.hospital.pharmacy.repository.PrescriptionRepository;
import com.hospital.pharmacy.service.CompanyService;
import com.hospital.pharmacy.service.DistributorService;
import com.hospital.pharmacy.service.MedicineService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.logging.Logger;

@RestController
@RequestMapping("/pharmacist")
@PreAuthorize("hasRole('PHARMACIST')")
public class PharmacistController {

    private static final Logger logger = Logger.getLogger(PharmacistController.class.getName());

    @Autowired
    private MedicineService medicineService;

    @Autowired
    private CompanyService companyService;

    @Autowired
    private DistributorService distributorService;

    @Autowired
    private MedicineRepository medicineRepository;

    @Autowired
    private CompanyRepository companyRepository;

    @Autowired
    private DistributorRepository distributorRepository;

    @Autowired
    private PrescriptionRepository prescriptionRepository;

    // Pharmacist Dashboard Statistics
    @GetMapping("/dashboard")
    public ResponseEntity<?> getPharmacistDashboard(Authentication authentication) {
        Map<String, Object> stats = new HashMap<>();
        stats.put("totalMedicines", medicineRepository.count());
        stats.put("totalCompanies", companyRepository.count());
        stats.put("totalDistributors", distributorRepository.count());
        stats.put("activePrescriptions", prescriptionRepository.countByStatus("ACTIVE"));
        stats.put("completedPrescriptions", prescriptionRepository.countByStatus("COMPLETED"));
        stats.put("lowStockMedicines", medicineService.getLowStatusMedicines().size());

        return ResponseEntity.ok(stats);
    }

    // Get all medicines with filters
    @GetMapping("/medicines")
    public ResponseEntity<?> getMedicines(
            @RequestParam(required = false) String category,
            @RequestParam(required = false) String stockStatus,
            @RequestParam(required = false) String prescriptionFilter) {

        List<MedicineDTO> medicines = medicineService.filterMedicines(
                category, stockStatus, prescriptionFilter);

        return ResponseEntity.ok(medicines);
    }

    // Search medicines
    @GetMapping("/medicines/search")
    public ResponseEntity<?> searchMedicines(@RequestParam String keyword) {
        List<MedicineDTO> medicines = medicineService.searchMedicines(keyword);
        return ResponseEntity.ok(medicines);
    }

    // Create new medicine
    @PostMapping("/medicines")
    public ResponseEntity<?> createMedicine(@RequestBody MedicineDTO medicineDTO) {
        MedicineDTO createdMedicine = medicineService.createMedicine(medicineDTO);
        return ResponseEntity.status(HttpStatus.CREATED).body(createdMedicine);
    }

    // Update a medicine
    @PutMapping("/medicines/{medicineId}")
    public ResponseEntity<?> updateMedicine(
            @PathVariable String medicineId,
            @RequestBody MedicineDTO medicineDTO) {

        MedicineDTO updatedMedicine = medicineService.updateMedicine(medicineId, medicineDTO);
        return ResponseEntity.ok(updatedMedicine);
    }

    // Delete a medicine
    @DeleteMapping("/medicines/{medicineId}")
    public ResponseEntity<?> deleteMedicine(@PathVariable String medicineId) {
        medicineService.deleteMedicine(medicineId);
        return ResponseEntity.ok(Map.of("message", "Medicine deleted successfully"));
    }

    // Get all companies
    @GetMapping("/companies")
    public ResponseEntity<?> getCompanies(
            @RequestParam(required = false) String status,
            @RequestParam(required = false) String name) {

        List<Company> companies = companyService.findAllCompanies();
        return ResponseEntity.ok(companies);
    }

    // Create new company
    @PostMapping("/companies")
    public ResponseEntity<?> createCompany(@RequestBody CompanyDTO companyDTO) {
        Company createdCompany = companyService.createCompany(companyDTO);
        return ResponseEntity.status(HttpStatus.CREATED).body(createdCompany);
    }

    // Update a company
    @PutMapping("/companies/{id}")
    public ResponseEntity<?> updateCompany(
            @PathVariable Long id,
            @RequestBody CompanyDTO companyDTO) {

        Company updatedCompany = companyService.updateCompany(id, companyDTO);
        return ResponseEntity.ok(updatedCompany);
    }

    // Get company by ID
    @GetMapping("/companies/{id}")
    public ResponseEntity<?> getCompanyById(@PathVariable Long id) {
        return companyRepository.findById(id)
                .map(company -> ResponseEntity.ok(company))
                .orElse(ResponseEntity.notFound().build());
    }

    // Get all distributors
    @GetMapping("/distributors")
    public ResponseEntity<?> getDistributors(
            @RequestParam(required = false) String region,
            @RequestParam(required = false) String status) {

        List<Distributor> distributors;
        if (region != null || status != null) {
            distributors = distributorService.findWithFilters(region, status);
        } else {
            distributors = distributorRepository.findAll();
        }

        return ResponseEntity.ok(distributors);
    }

    // Create new distributor
    @PostMapping("/distributors")
    public ResponseEntity<?> createDistributor(@RequestBody DistributorDTO distributorDTO) {
        Distributor createdDistributor = distributorService.createDistributor(distributorDTO);
        return ResponseEntity.status(HttpStatus.CREATED).body(createdDistributor);
    }

    // Update a distributor
    @PutMapping("/distributors/{id}")
    public ResponseEntity<?> updateDistributor(
            @PathVariable Long id,
            @RequestBody DistributorDTO distributorDTO) {

        Distributor updatedDistributor = distributorService.updateDistributor(id, distributorDTO);
        return ResponseEntity.ok(updatedDistributor);
    }

    // Get distributor by ID
    @GetMapping("/distributors/{id}")
    public ResponseEntity<?> getDistributorById(@PathVariable Long id) {
        return distributorRepository.findById(id)
                .map(distributor -> ResponseEntity.ok(distributor))
                .orElse(ResponseEntity.notFound().build());
    }

    // Get low stock medicines
    @GetMapping("/medicines/low-stock")
    public ResponseEntity<?> getLowStockMedicines() {
        List<MedicineDTO> medicines = medicineService.getLowStatusMedicines();
        logger.info("this is the low_Stock medicine " + medicines);
        return ResponseEntity.ok(medicines);
    }

    // Get expired medicines
    @GetMapping("/medicines/expired")
    public ResponseEntity<?> getExpiredMedicines() {
        List<MedicineDTO> medicines = medicineService.getExpiredMedicines();
        return ResponseEntity.ok(medicines);
    }

    // Get medicine categories
    @GetMapping("/medicine-categories")
    public ResponseEntity<?> getMedicineCategories() {
        List<String> categories = medicineService.getAllCategories();
        return ResponseEntity.ok(categories);
    }

    // Get inventory summary
    @GetMapping("/inventory")
    public ResponseEntity<?> getInventorySummary() {
        Map<String, Object> inventory = new HashMap<>();
        inventory.put("totalMedicines", medicineRepository.count());
        inventory.put("lowStockCount", medicineService.getLowStatusMedicines().size());
        inventory.put("expiredCount", medicineService.getExpiredMedicines().size());
        inventory.put("categories", medicineService.getAllCategories());
        return ResponseEntity.ok(inventory);
    }

    // Get reports
    @GetMapping("/reports")
    public ResponseEntity<?> getReports(
            @RequestParam(required = false) String type,
            @RequestParam(required = false) String startDate,
            @RequestParam(required = false) String endDate) {
        
        Map<String, Object> reports = new HashMap<>();
        
        if ("inventory".equals(type)) {
            reports.put("lowStock", medicineService.getLowStatusMedicines());
            reports.put("expired", medicineService.getExpiredMedicines());
        } else if ("prescriptions".equals(type)) {
            reports.put("active", prescriptionRepository.findByStatus("ACTIVE"));
            reports.put("completed", prescriptionRepository.findByStatus("COMPLETED"));
        } else {
            // Default report with all data
            reports.put("inventory", Map.of(
                "lowStock", medicineService.getLowStatusMedicines(),
                "expired", medicineService.getExpiredMedicines()
            ));
            reports.put("prescriptions", Map.of(
                "active", prescriptionRepository.findByStatus("ACTIVE"),
                "completed", prescriptionRepository.findByStatus("COMPLETED")
            ));
        }
        
        return ResponseEntity.ok(reports);
    }

    // Get orders (placeholder - can be expanded later)
    @GetMapping("/orders")
    public ResponseEntity<?> getOrders() {
        // Placeholder for orders functionality
        return ResponseEntity.ok(Map.of("message", "Orders functionality coming soon"));
    }

    // Create order (placeholder - can be expanded later)
    @PostMapping("/orders")
    public ResponseEntity<?> createOrder(@RequestBody Map<String, Object> orderData) {
        // Placeholder for order creation functionality
        return ResponseEntity.ok(Map.of("message", "Order creation functionality coming soon"));
    }

    // Get active prescriptions to be filled
    @GetMapping("/prescriptions")
    public ResponseEntity<?> getActivePrescriptions() {
        List<Prescription> prescriptions = prescriptionRepository.findByStatus("ACTIVE");
        return ResponseEntity.ok(prescriptions);
    }

    // Get a specific prescription by ID
    @GetMapping("/prescriptions/{id}")
    public ResponseEntity<?> getPrescriptionById(@PathVariable Long id) {
        return prescriptionRepository.findById(id)
                .map(prescription -> ResponseEntity.ok(prescription))
                .orElse(ResponseEntity.notFound().build());
    }

    // Fill a prescription
    @PutMapping("/prescriptions/{id}/fill")
    public ResponseEntity<?> fillPrescription(@PathVariable Long id) {
        return prescriptionRepository.findById(id)
                .map(prescription -> {
                    if (!"ACTIVE".equals(prescription.getStatus())) {
                        return ResponseEntity.badRequest()
                                .body(Map.of("message", "Prescription is not active"));
                    }

                    prescription.setStatus("COMPLETED");
                    return ResponseEntity.ok(prescriptionRepository.save(prescription));
                })
                .orElse(ResponseEntity.notFound().build());
    }
}