package com.hospital.pharmacy.service;

import com.hospital.pharmacy.dto.MedicineDTO;
import com.hospital.pharmacy.model.Medicine;

import java.util.List;

/**
 * Service interface for medicine management operations.
 * Provides business logic for medicine CRUD operations and inventory management.
 *
 * @author Leandre
 * @version 1.0.0
 * @since 2024
 */
public interface MedicineService {

    /**
     * Filter medicines by various criteria
     * @param category Medicine category filter
     * @param stockStatus Stock status filter
     * @param prescriptionFilter Prescription requirement filter
     * @return List of filtered medicines
     */
    List<MedicineDTO> filterMedicines(String category, String stockStatus, String prescriptionFilter);

    /**
     * Search medicines by keyword
     * @param keyword Search term
     * @return List of matching medicines
     */
    List<MedicineDTO> searchMedicines(String keyword);

    /**
     * Create a new medicine
     * @param medicineDTO Medicine data
     * @return Created medicine
     */
    MedicineDTO createMedicine(MedicineDTO medicineDTO);

    /**
     * Update an existing medicine
     * @param medicineId Medicine ID
     * @param medicineDTO Updated medicine data
     * @return Updated medicine
     */
    MedicineDTO updateMedicine(String medicineId, MedicineDTO medicineDTO);

    /**
     * Delete a medicine
     * @param medicineId Medicine ID to delete
     */
    void deleteMedicine(String medicineId);

    /**
     * Get medicines with low stock
     * @return List of medicines with low stock
     */
    List<MedicineDTO> getLowStatusMedicines();

    /**
     * Get expired medicines
     * @return List of expired medicines
     */
    List<MedicineDTO> getExpiredMedicines();

    /**
     * Get all medicine categories
     * @return List of available categories
     */
    List<String> getAllCategories();
}