package com.hospital.pharmacy.service;

/**
 * Service interface for email operations.
 * Provides business logic for sending various types of emails.
 *
 * @author Leandre
 * @version 1.0.0
 * @since 2024
 */
public interface EmailService {
    
    /**
     * Send password reset email
     * @param toEmail Recipient email address
     * @param resetLink Password reset link
     */
    void sendPasswordResetEmail(String toEmail, String resetLink);
    
    /**
     * Send welcome email to new user
     * @param toEmail Recipient email address
     * @param userName User's name
     * @param role User's role
     */
    void sendWelcomeEmail(String toEmail, String userName, String role);
    
    /**
     * Send appointment confirmation email
     * @param toEmail Recipient email address
     * @param patientName Patient's name
     * @param appointmentDate Appointment date
     * @param doctorName Doctor's name
     */
    void sendAppointmentConfirmation(String toEmail, String patientName, String appointmentDate, String doctorName);
    
    /**
     * Send prescription ready notification
     * @param toEmail Recipient email address
     * @param patientName Patient's name
     * @param prescriptionId Prescription ID
     */
    void sendPrescriptionReadyNotification(String toEmail, String patientName, String prescriptionId);
}