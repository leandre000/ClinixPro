package com.hospital.pharmacy.repository;

import com.hospital.pharmacy.model.MedicalRecord;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Repository
public interface MedicalRecordRepository extends JpaRepository<MedicalRecord, Long> {
    
    Optional<MedicalRecord> findByRecordId(String recordId);
    
    List<MedicalRecord> findByPatientId(Long patientId);
    
    List<MedicalRecord> findByDoctorId(Long doctorId);
    
    List<MedicalRecord> findByRecordDateBetween(LocalDate startDate, LocalDate endDate);
    
    @Query("SELECT mr FROM MedicalRecord mr WHERE mr.patient.id = :patientId ORDER BY mr.recordDate DESC")
    List<MedicalRecord> findRecentRecordsByPatientId(@Param("patientId") Long patientId);
    
    @Query("SELECT COUNT(mr) FROM MedicalRecord mr WHERE mr.recordDate = :date")
    Long countRecordsByDate(@Param("date") LocalDate date);
    
    List<MedicalRecord> findByPatientIdOrderByRecordDateDesc(Long patientId);
} 