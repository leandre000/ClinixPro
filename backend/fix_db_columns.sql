-- Fix column types for patients table
-- This script should be run manually to fix the PostgreSQL column types

-- Ensure patientId is of type VARCHAR
ALTER TABLE patients
    ALTER COLUMN patient_id TYPE VARCHAR(255) USING patient_id::VARCHAR(255);

-- Make sure other text columns are proper VARCHAR types
ALTER TABLE patients
    ALTER COLUMN first_name TYPE VARCHAR(50) USING first_name::VARCHAR(50),
    ALTER COLUMN last_name TYPE VARCHAR(50) USING last_name::VARCHAR(50),
    ALTER COLUMN gender TYPE VARCHAR(20) USING gender::VARCHAR(20),
    ALTER COLUMN email TYPE VARCHAR(255) USING email::VARCHAR(255),
    ALTER COLUMN phone_number TYPE VARCHAR(20) USING phone_number::VARCHAR(20),
    ALTER COLUMN address TYPE VARCHAR(255) USING address::VARCHAR(255),
    ALTER COLUMN blood_group TYPE VARCHAR(10) USING blood_group::VARCHAR(10),
    ALTER COLUMN status TYPE VARCHAR(20) USING status::VARCHAR(20);

-- Other text columns that might need explicit casting
ALTER TABLE patients
    ALTER COLUMN allergies TYPE TEXT USING allergies::TEXT,
    ALTER COLUMN chronic_diseases TYPE TEXT USING chronic_diseases::TEXT,
    ALTER COLUMN emergency_contact_name TYPE VARCHAR(100) USING emergency_contact_name::VARCHAR(100),
    ALTER COLUMN emergency_contact_phone TYPE VARCHAR(20) USING emergency_contact_phone::VARCHAR(20),
    ALTER COLUMN emergency_contact_relation TYPE VARCHAR(50) USING emergency_contact_relation::VARCHAR(50),
    ALTER COLUMN insurance_provider TYPE VARCHAR(100) USING insurance_provider::VARCHAR(100),
    ALTER COLUMN insurance_policy_number TYPE VARCHAR(100) USING insurance_policy_number::VARCHAR(100),
    ALTER COLUMN insurance_expiry_date TYPE VARCHAR(20) USING insurance_expiry_date::VARCHAR(20),
    ALTER COLUMN occupation TYPE VARCHAR(100) USING occupation::VARCHAR(100),
    ALTER COLUMN marital_status TYPE VARCHAR(20) USING marital_status::VARCHAR(20),
    ALTER COLUMN medical_history TYPE TEXT USING medical_history::TEXT;

-- Create an index on fields used for search to improve performance
CREATE INDEX IF NOT EXISTS idx_patient_search 
ON patients(first_name, last_name, patient_id, phone_number); 