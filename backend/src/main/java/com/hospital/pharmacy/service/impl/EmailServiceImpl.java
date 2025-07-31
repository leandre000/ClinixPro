package com.hospital.pharmacy.service.impl;

import com.hospital.pharmacy.service.EmailService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

@Service
public class EmailServiceImpl implements EmailService {

    private static final Logger logger = LoggerFactory.getLogger(EmailServiceImpl.class);

    @Autowired(required = false)
    private JavaMailSender emailSender;
    
    @Value("${spring.mail.enabled:false}")
    private boolean mailEnabled;

    @Override
    public void sendPasswordResetEmail(String toEmail, String resetLink) {
        if (!mailEnabled || emailSender == null) {
            logger.warn("Email service is disabled or not configured. Would send reset link to {}: {}", toEmail, resetLink);
            return;
        }
        
        try {
            SimpleMailMessage message = new SimpleMailMessage();
            message.setTo(toEmail);
            message.setSubject("Hospital Pharmacy - Password Reset");
            message.setText("To reset your password, click the link below:\n\n" 
                    + resetLink 
                    + "\n\nThis link will expire in 30 minutes. If you did not request a password reset, please ignore this email.");

            emailSender.send(message);
            logger.info("Password reset email sent to: {}", toEmail);
        } catch (Exception e) {
            logger.error("Failed to send password reset email to: {}", toEmail, e);
            throw new RuntimeException("Failed to send password reset email", e);
        }
    }

    @Override
    public void sendWelcomeEmail(String toEmail, String userName, String role) {
        if (!mailEnabled || emailSender == null) {
            logger.warn("Email service is disabled or not configured. Would send welcome email to {} for user: {}", toEmail, userName);
            return;
        }
        
        try {
            SimpleMailMessage message = new SimpleMailMessage();
            message.setTo(toEmail);
            message.setSubject("Welcome to Hospital Pharmacy System");
            message.setText("Welcome " + userName + "!\n\n" +
                    "Your account has been created successfully with role: " + role + "\n\n" +
                    "You can now log in to the system and start using your account.");

            emailSender.send(message);
            logger.info("Welcome email sent to: {}", toEmail);
        } catch (Exception e) {
            logger.error("Failed to send welcome email to: {}", toEmail, e);
            throw new RuntimeException("Failed to send welcome email", e);
        }
    }

    @Override
    public void sendAppointmentConfirmation(String toEmail, String patientName, String appointmentDate, String doctorName) {
        if (!mailEnabled || emailSender == null) {
            logger.warn("Email service is disabled or not configured. Would send appointment confirmation to {} for patient: {}", toEmail, patientName);
            return;
        }
        
        try {
            SimpleMailMessage message = new SimpleMailMessage();
            message.setTo(toEmail);
            message.setSubject("Appointment Confirmation");
            message.setText("Dear " + patientName + ",\n\n" +
                    "Your appointment has been confirmed for " + appointmentDate + " with Dr. " + doctorName + ".\n\n" +
                    "Please arrive 15 minutes before your scheduled time.");

            emailSender.send(message);
            logger.info("Appointment confirmation email sent to: {}", toEmail);
        } catch (Exception e) {
            logger.error("Failed to send appointment confirmation email to: {}", toEmail, e);
            throw new RuntimeException("Failed to send appointment confirmation email", e);
        }
    }

    @Override
    public void sendPrescriptionReadyNotification(String toEmail, String patientName, String prescriptionId) {
        if (!mailEnabled || emailSender == null) {
            logger.warn("Email service is disabled or not configured. Would send prescription notification to {} for patient: {}", toEmail, patientName);
            return;
        }
        
        try {
            SimpleMailMessage message = new SimpleMailMessage();
            message.setTo(toEmail);
            message.setSubject("Prescription Ready for Pickup");
            message.setText("Dear " + patientName + ",\n\n" +
                    "Your prescription (ID: " + prescriptionId + ") is ready for pickup at the pharmacy.\n\n" +
                    "Please bring your ID when collecting your medication.");

            emailSender.send(message);
            logger.info("Prescription ready notification sent to: {}", toEmail);
        } catch (Exception e) {
            logger.error("Failed to send prescription notification to: {}", toEmail, e);
            throw new RuntimeException("Failed to send prescription notification", e);
        }
    }
}