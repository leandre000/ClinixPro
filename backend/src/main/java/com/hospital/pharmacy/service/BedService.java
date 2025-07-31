package com.hospital.pharmacy.service;

import com.hospital.pharmacy.model.Bed;
import java.util.List;
import java.util.Optional;

/**
 * Service interface for bed management operations.
 * Provides business logic for bed CRUD operations and status management.
 *
 * @author Leandre
 * @version 1.0.0
 * @since 2024
 */
public interface BedService {

    /**
     * Get all beds with optional filters
     * @param ward Ward filter
     * @param status Status filter (Available, Occupied, Maintenance)
     * @param search Search term for bed number or ward
     * @return List of filtered beds
     */
    List<Bed> findByFilters(String ward, String status, String search);

    /**
     * Find bed by ID
     * @param id Bed ID
     * @return Optional containing bed if found
     */
    Optional<Bed> findById(Long id);

    /**
     * Find bed by bed ID (e.g., BED-001)
     * @param bedId Bed ID string
     * @return Optional containing bed if found
     */
    Optional<Bed> findByBedId(String bedId);

    /**
     * Save a new bed
     * @param bed Bed entity to save
     * @return Saved bed with generated ID
     */
    Bed save(Bed bed);

    /**
     * Update existing bed
     * @param id Bed ID to update
     * @param updatedBed Updated bed data
     * @return Updated bed entity
     */
    Bed update(Long id, Bed updatedBed);

    /**
     * Update bed status
     * @param bedId Bed ID
     * @param status New status
     * @return Updated bed
     */
    Bed updateStatus(String bedId, String status);

    /**
     * Assign patient to bed
     * @param bedId Bed ID
     * @param patientId Patient ID
     * @return Updated bed
     */
    Bed assignPatient(String bedId, Long patientId);

    /**
     * Discharge patient from bed
     * @param bedId Bed ID
     * @return Updated bed
     */
    Bed dischargePatient(String bedId);

    /**
     * Delete bed
     * @param id Bed ID to delete
     */
    void delete(Long id);

    /**
     * Count beds by status
     * @param status Bed status to count
     * @return Number of beds with specified status
     */
    long countByStatus(String status);

    /**
     * Count beds by ward
     * @param ward Ward name to count
     * @return Number of beds in specified ward
     */
    long countByWard(String ward);

    /**
     * Get available beds
     * @return List of available beds
     */
    List<Bed> findAvailableBeds();

    /**
     * Get occupied beds
     * @return List of occupied beds
     */
    List<Bed> findOccupiedBeds();
} 