-- Reset database for ClinixPro
-- This script clears the users table to allow new encoded passwords

-- Clear all users (this will trigger the data initialization service to recreate them)
DELETE FROM users;

-- Reset the sequence if using auto-increment
-- ALTER SEQUENCE users_id_seq RESTART WITH 1;

-- Verify the table is empty
SELECT COUNT(*) FROM users; 