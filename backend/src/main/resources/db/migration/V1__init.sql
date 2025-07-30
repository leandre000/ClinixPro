-- ClinixPro Initial Database Migration
-- Version: 1.0.0
-- Description: Initial database setup for ClinixPro Hospital Pharmacy Management System

-- Set timezone
SET timezone = 'UTC';

-- Create extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create schema
CREATE SCHEMA IF NOT EXISTS clinixpro;

-- Set search path
SET search_path TO clinixpro, public;

-- Create users table
CREATE TABLE IF NOT EXISTS clinixpro.users (
    id BIGSERIAL PRIMARY KEY,
    user_id VARCHAR(50) UNIQUE NOT NULL,
    first_name VARCHAR(50) NOT NULL,
    last_name VARCHAR(50) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    role VARCHAR(20) NOT NULL CHECK (role IN ('ADMIN', 'DOCTOR', 'PHARMACIST', 'RECEPTIONIST')),
    phone_number VARCHAR(20),
    address TEXT,
    gender VARCHAR(10),
    profile_image VARCHAR(255),
    specialization VARCHAR(100),
    license_number VARCHAR(50),
    qualification VARCHAR(100),
    shift VARCHAR(20),
    isactive BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create patients table
CREATE TABLE IF NOT EXISTS clinixpro.patients (
    id BIGSERIAL PRIMARY KEY,
    patient_id VARCHAR(50) UNIQUE NOT NULL,
    first_name VARCHAR(50) NOT NULL,
    last_name VARCHAR(50) NOT NULL,
    date_of_birth DATE,
    gender VARCHAR(10) NOT NULL,
    email VARCHAR(100),
    phone_number VARCHAR(20),
    address TEXT,
    blood_group VARCHAR(5),
    height DECIMAL(5,2),
    weight DECIMAL(5,2),
    allergies TEXT,
    chronic_diseases TEXT,
    emergency_contact_name VARCHAR(100),
    emergency_contact_phone VARCHAR(20),
    emergency_contact_relation VARCHAR(50),
    insurance_provider VARCHAR(100),
    insurance_policy_number VARCHAR(50),
    insurance_expiry_date DATE,
    occupation VARCHAR(100),
    marital_status VARCHAR(20),
    assigned_doctor_id BIGINT REFERENCES clinixpro.users(id),
    registration_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    last_visit_date TIMESTAMP,
    medical_history TEXT,
    status VARCHAR(20) DEFAULT 'Active',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create companies table
CREATE TABLE IF NOT EXISTS clinixpro.companies (
    id BIGSERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    contact_person VARCHAR(100),
    email VARCHAR(100),
    phone VARCHAR(20),
    address TEXT,
    status VARCHAR(20) DEFAULT 'Active',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create medicines table
CREATE TABLE IF NOT EXISTS clinixpro.medicines (
    id BIGSERIAL PRIMARY KEY,
    medicine_id VARCHAR(50) UNIQUE NOT NULL,
    name VARCHAR(100) NOT NULL,
    category VARCHAR(50) NOT NULL,
    description TEXT,
    manufacturer VARCHAR(100),
    batch_number VARCHAR(50),
    expiry_date DATE NOT NULL,
    stock INTEGER NOT NULL DEFAULT 0,
    stock_status VARCHAR(20) DEFAULT 'Normal',
    price DECIMAL(10,2) NOT NULL,
    requires_prescription BOOLEAN DEFAULT FALSE,
    dosage_form VARCHAR(50),
    strength VARCHAR(50),
    company_id BIGINT REFERENCES clinixpro.companies(id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create appointments table
CREATE TABLE IF NOT EXISTS clinixpro.appointments (
    id BIGSERIAL PRIMARY KEY,
    appointment_id VARCHAR(50) UNIQUE NOT NULL,
    patient_id BIGINT REFERENCES clinixpro.patients(id),
    doctor_id BIGINT REFERENCES clinixpro.users(id),
    appointment_date_time TIMESTAMP NOT NULL,
    status VARCHAR(20) DEFAULT 'Scheduled',
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create prescriptions table
CREATE TABLE IF NOT EXISTS clinixpro.prescriptions (
    id BIGSERIAL PRIMARY KEY,
    prescription_id VARCHAR(50) UNIQUE NOT NULL,
    patient_id BIGINT REFERENCES clinixpro.patients(id),
    doctor_id BIGINT REFERENCES clinixpro.users(id),
    prescription_date DATE NOT NULL,
    diagnosis TEXT,
    instructions TEXT,
    status VARCHAR(20) DEFAULT 'Active',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create prescription_items table
CREATE TABLE IF NOT EXISTS clinixpro.prescription_items (
    id BIGSERIAL PRIMARY KEY,
    prescription_id BIGINT REFERENCES clinixpro.prescriptions(id),
    medicine_id BIGINT REFERENCES clinixpro.medicines(id),
    dosage VARCHAR(50),
    frequency VARCHAR(50),
    duration VARCHAR(50),
    quantity INTEGER,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create billing table
CREATE TABLE IF NOT EXISTS clinixpro.billing (
    id BIGSERIAL PRIMARY KEY,
    billing_id VARCHAR(50) UNIQUE NOT NULL,
    patient_id BIGINT REFERENCES clinixpro.patients(id),
    appointment_id BIGINT REFERENCES clinixpro.appointments(id),
    total_amount DECIMAL(10,2) NOT NULL,
    paid_amount DECIMAL(10,2) DEFAULT 0,
    payment_status VARCHAR(20) DEFAULT 'Pending',
    billing_date DATE NOT NULL,
    due_date DATE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes for better performance
CREATE INDEX idx_users_email ON clinixpro.users(email);
CREATE INDEX idx_users_role ON clinixpro.users(role);
CREATE INDEX idx_users_active ON clinixpro.users(isactive);
CREATE INDEX idx_patients_status ON clinixpro.patients(status);
CREATE INDEX idx_patients_doctor ON clinixpro.patients(assigned_doctor_id);
CREATE INDEX idx_medicines_stock ON clinixpro.medicines(stock);
CREATE INDEX idx_medicines_expiry ON clinixpro.medicines(expiry_date);
CREATE INDEX idx_medicines_category ON clinixpro.medicines(category);
CREATE INDEX idx_appointments_date ON clinixpro.appointments(appointment_date_time);
CREATE INDEX idx_appointments_status ON clinixpro.appointments(status);
CREATE INDEX idx_prescriptions_patient ON clinixpro.prescriptions(patient_id);
CREATE INDEX idx_prescriptions_doctor ON clinixpro.prescriptions(doctor_id);
CREATE INDEX idx_billing_patient ON clinixpro.billing(patient_id);
CREATE INDEX idx_billing_status ON clinixpro.billing(payment_status);

-- Create triggers for updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Apply triggers to all tables with updated_at column
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON clinixpro.users FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_patients_updated_at BEFORE UPDATE ON clinixpro.patients FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_companies_updated_at BEFORE UPDATE ON clinixpro.companies FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_medicines_updated_at BEFORE UPDATE ON clinixpro.medicines FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_appointments_updated_at BEFORE UPDATE ON clinixpro.appointments FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_prescriptions_updated_at BEFORE UPDATE ON clinixpro.prescriptions FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_billing_updated_at BEFORE UPDATE ON clinixpro.billing FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Insert default admin user
INSERT INTO clinixpro.users (user_id, first_name, last_name, email, password, role, isactive)
VALUES (
    'ADM-001',
    'Admin',
    'User',
    'admin@clinixpro.com',
    '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', -- password: password
    'ADMIN',
    true
) ON CONFLICT (email) DO NOTHING;

-- Insert sample data for testing
INSERT INTO clinixpro.companies (name, contact_person, email, phone, status)
VALUES 
    ('PharmaCorp Inc.', 'John Smith', 'john@pharmacorp.com', '+1234567890', 'Active'),
    ('MediLife Labs', 'Sarah Johnson', 'sarah@medilife.com', '+1234567891', 'Active'),
    ('Global Meds', 'Mike Wilson', 'mike@globalmeds.com', '+1234567892', 'Active')
ON CONFLICT DO NOTHING;

-- Create view for dashboard statistics
CREATE OR REPLACE VIEW clinixpro.dashboard_stats AS
SELECT 
    (SELECT COUNT(*) FROM clinixpro.users WHERE role = 'DOCTOR' AND isactive = true) as total_doctors,
    (SELECT COUNT(*) FROM clinixpro.users WHERE role = 'PHARMACIST' AND isactive = true) as total_pharmacists,
    (SELECT COUNT(*) FROM clinixpro.users WHERE role = 'RECEPTIONIST' AND isactive = true) as total_receptionists,
    (SELECT COUNT(*) FROM clinixpro.patients WHERE status = 'Active') as active_patients,
    (SELECT COUNT(*) FROM clinixpro.medicines WHERE stock <= 20) as low_stock_medicines,
    (SELECT COUNT(*) FROM clinixpro.appointments WHERE status = 'Scheduled') as scheduled_appointments,
    (SELECT COUNT(*) FROM clinixpro.prescriptions WHERE status = 'Active') as active_prescriptions,
    (SELECT COUNT(*) FROM clinixpro.billing WHERE payment_status = 'Pending') as pending_bills;

-- Grant permissions
GRANT USAGE ON SCHEMA clinixpro TO postgres;
GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA clinixpro TO postgres;
GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA clinixpro TO postgres;
GRANT EXECUTE ON FUNCTION update_updated_at_column() TO postgres; 