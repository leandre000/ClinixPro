-- ClinixPro Database Initialization Script
-- This script sets up the initial database structure for ClinixPro

-- Create database if it doesn't exist
-- Note: This should be run as a superuser

-- Set timezone
SET timezone = 'UTC';

-- Create extensions if needed
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create schema for better organization
CREATE SCHEMA IF NOT EXISTS clinixpro;

-- Set search path
SET search_path TO clinixpro, public;

-- Create indexes for better performance
-- These will be created automatically by JPA, but we can add custom ones here

-- Create a function to update the updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Grant necessary permissions
GRANT USAGE ON SCHEMA clinixpro TO postgres;
GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA clinixpro TO postgres;
GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA clinixpro TO postgres;

-- Create a view for dashboard statistics
CREATE OR REPLACE VIEW clinixpro.dashboard_stats AS
SELECT 
    (SELECT COUNT(*) FROM clinixpro.users WHERE role = 'DOCTOR') as total_doctors,
    (SELECT COUNT(*) FROM clinixpro.users WHERE role = 'PHARMACIST') as total_pharmacists,
    (SELECT COUNT(*) FROM clinixpro.users WHERE role = 'RECEPTIONIST') as total_receptionists,
    (SELECT COUNT(*) FROM clinixpro.patients WHERE status = 'Active') as active_patients,
    (SELECT COUNT(*) FROM clinixpro.medicines WHERE stock_status = 'Low') as low_stock_medicines,
    (SELECT COUNT(*) FROM clinixpro.appointments WHERE status = 'Scheduled') as scheduled_appointments;

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_users_email ON clinixpro.users(email);
CREATE INDEX IF NOT EXISTS idx_users_role ON clinixpro.users(role);
CREATE INDEX IF NOT EXISTS idx_users_active ON clinixpro.users(isactive);
CREATE INDEX IF NOT EXISTS idx_patients_status ON clinixpro.patients(status);
CREATE INDEX IF NOT EXISTS idx_medicines_stock ON clinixpro.medicines(stock);
CREATE INDEX IF NOT EXISTS idx_medicines_expiry ON clinixpro.medicines(expiry_date);
CREATE INDEX IF NOT EXISTS idx_appointments_date ON clinixpro.appointments(appointment_date_time);

-- Create a function to check medicine expiry
CREATE OR REPLACE FUNCTION clinixpro.check_medicine_expiry()
RETURNS TABLE(medicine_id VARCHAR, medicine_name VARCHAR, expiry_date DATE, days_until_expiry INTEGER) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        m.medicine_id,
        m.name,
        m.expiry_date,
        (m.expiry_date - CURRENT_DATE)::INTEGER as days_until_expiry
    FROM clinixpro.medicines m
    WHERE m.expiry_date <= CURRENT_DATE + INTERVAL '30 days'
    ORDER BY m.expiry_date;
END;
$$ LANGUAGE plpgsql;

-- Create a function to get low stock medicines
CREATE OR REPLACE FUNCTION clinixpro.get_low_stock_medicines()
RETURNS TABLE(medicine_id VARCHAR, medicine_name VARCHAR, current_stock INTEGER, reorder_level INTEGER) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        m.medicine_id,
        m.name,
        m.stock,
        CASE 
            WHEN m.stock <= 10 THEN 30
            WHEN m.stock <= 20 THEN 50
            ELSE 100
        END as reorder_level
    FROM clinixpro.medicines m
    WHERE m.stock <= 20
    ORDER BY m.stock;
END;
$$ LANGUAGE plpgsql;

-- Grant execute permissions on functions
GRANT EXECUTE ON FUNCTION clinixpro.check_medicine_expiry() TO postgres;
GRANT EXECUTE ON FUNCTION clinixpro.get_low_stock_medicines() TO postgres;

-- Create a trigger to automatically update updated_at timestamp
-- This will be applied to all tables that have an updated_at column

COMMENT ON DATABASE clinixpro IS 'ClinixPro Hospital Pharmacy Management System Database';
COMMENT ON SCHEMA clinixpro IS 'Main schema for ClinixPro application'; 