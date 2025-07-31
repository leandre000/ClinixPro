package com.hospital.pharmacy.service.impl;

import com.hospital.pharmacy.model.Bed;
import com.hospital.pharmacy.model.Patient;
import com.hospital.pharmacy.repository.BedRepository;
import com.hospital.pharmacy.repository.PatientRepository;
import com.hospital.pharmacy.service.BedService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

/**
 * Implementation of BedService interface.
 * Provides concrete implementation for bed management operations.
 *
 * @author Leandre
 * @version 1.0.0
 * @since 2024
 */
@Service
public class BedServiceImpl implements BedService {

    private static final Logger logger = LoggerFactory.getLogger(BedServiceImpl.class);

    @Autowired
    private BedRepository bedRepository;

    @Autowired
    private PatientRepository patientRepository;

    @Override
    public List<Bed> findByFilters(String ward, String status, String search) {
        logger.debug("Finding beds with filters - ward: {}, status: {}, search: {}", ward, status, search);
        return bedRepository.findByFilters(ward, status, search);
    }

    @Override
    public Optional<Bed> findById(Long id) {
        logger.debug("Finding bed by ID: {}", id);
        return bedRepository.findById(id);
    }

    @Override
    public Optional<Bed> findByBedId(String bedId) {
        logger.debug("Finding bed by bed ID: {}", bedId);
        Bed bed = bedRepository.findByBedId(bedId);
        return Optional.ofNullable(bed);
    }

    @Override
    public Bed save(Bed bed) {
        logger.debug("Saving new bed: {}", bed.getBedId());
        return bedRepository.save(bed);
    }

    @Override
    public Bed update(Long id, Bed updatedBed) {
        logger.debug("Updating bed with ID: {}", id);
        Optional<Bed> existingBed = bedRepository.findById(id);
        
        if (existingBed.isPresent()) {
            Bed bed = existingBed.get();
            bed.setWardName(updatedBed.getWardName());
            bed.setRoomNumber(updatedBed.getRoomNumber());
            bed.setBedNumber(updatedBed.getBedNumber());
            bed.setStatus(updatedBed.getStatus());
            bed.setPatient(updatedBed.getPatient());
            bed.setDoctor(updatedBed.getDoctor());
            bed.setAdmissionDate(updatedBed.getAdmissionDate());
            bed.setDiagnosis(updatedBed.getDiagnosis());
            
            return bedRepository.save(bed);
        } else {
            throw new RuntimeException("Bed not found with ID: " + id);
        }
    }

    @Override
    public Bed updateStatus(String bedId, String status) {
        logger.debug("Updating bed status - bedId: {}, status: {}", bedId, status);
        Bed bed = bedRepository.findByBedId(bedId);
        
        if (bed != null) {
            bed.setStatus(status);
            return bedRepository.save(bed);
        } else {
            throw new RuntimeException("Bed not found with ID: " + bedId);
        }
    }

    @Override
    public Bed assignPatient(String bedId, Long patientId) {
        logger.debug("Assigning patient {} to bed {}", patientId, bedId);
        Bed bed = bedRepository.findByBedId(bedId);
        Optional<Patient> patientOptional = patientRepository.findById(patientId);
        
        if (bed != null && patientOptional.isPresent()) {
            Patient patient = patientOptional.get();
            
            if ("Available".equals(bed.getStatus())) {
                bed.setPatient(patient);
                bed.setStatus("Occupied");
                return bedRepository.save(bed);
            } else {
                throw new RuntimeException("Bed is not available for assignment");
            }
        } else {
            throw new RuntimeException("Bed or patient not found");
        }
    }

    @Override
    public Bed dischargePatient(String bedId) {
        logger.debug("Discharging patient from bed: {}", bedId);
        Bed bed = bedRepository.findByBedId(bedId);
        
        if (bed != null) {
            bed.setPatient(null);
            bed.setStatus("Available");
            bed.setDoctor(null);
            bed.setAdmissionDate(null);
            bed.setDiagnosis(null);
            return bedRepository.save(bed);
        } else {
            throw new RuntimeException("Bed not found with ID: " + bedId);
        }
    }

    @Override
    public void delete(Long id) {
        logger.debug("Deleting bed with ID: {}", id);
        bedRepository.deleteById(id);
    }

    @Override
    public long countByStatus(String status) {
        logger.debug("Counting beds by status: {}", status);
        return bedRepository.countByStatus(status);
    }

    @Override
    public long countByWard(String ward) {
        logger.debug("Counting beds by ward: {}", ward);
        return bedRepository.countByWardName(ward);
    }

    @Override
    public List<Bed> findAvailableBeds() {
        logger.debug("Finding available beds");
        return bedRepository.findByStatus("Available");
    }

    @Override
    public List<Bed> findOccupiedBeds() {
        logger.debug("Finding occupied beds");
        return bedRepository.findByStatus("Occupied");
    }
} 