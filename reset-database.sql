-- ClinixPro Database Reset Script
-- This script will completely reset the database and reinitialize it with secure credentials

-- Connect to the database (run this as superuser)
-- psql -U postgres -d clinixpro -f reset-database.sql

-- Drop and recreate the database
DROP DATABASE IF EXISTS clinixpro;
CREATE DATABASE clinixpro;

-- Connect to the new database
\c clinixpro;

-- Run the initialization script
\i backend/src/main/resources/db/init.sql

-- Display completion message
DO $$
BEGIN
    RAISE NOTICE 'Database reset completed successfully!';
    RAISE NOTICE 'Default users created with secure BCrypt hashed passwords:';
    RAISE NOTICE '- Admin: admin@clinixpro.com (password: admin123)';
    RAISE NOTICE '- Doctor: doctor@clinixpro.com (password: doctor123)';
    RAISE NOTICE '- Pharmacist: pharmacist@clinixpro.com (password: pharmacist123)';
    RAISE NOTICE '- Receptionist: receptionist@clinixpro.com (password: receptionist123)';
    RAISE NOTICE 'All passwords are securely hashed using BCrypt with strength 12.';
END $$; 