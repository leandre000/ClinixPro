# ClinixPro Database Reset Guide

## 🛡️ Secure Login Credentials

The database has been updated with secure BCrypt hashed passwords for all default users. Here are the login credentials:

| Role | Email | Password |
|------|-------|----------|
| **Admin** | admin@clinixpro.com | admin123 |
| **Doctor** | doctor@clinixpro.com | doctor123 |
| **Pharmacist** | pharmacist@clinixpro.com | pharmacist123 |
| **Receptionist** | receptionist@clinixpro.com | receptionist123 |

## 🔐 Security Features

- **BCrypt Hashing**: All passwords are securely hashed using BCrypt with strength 12
- **No Plain Text**: Passwords are never stored in plain text in the database
- **Industry Standard**: BCrypt is the industry standard for password hashing
- **Salt Protection**: Each password hash includes a unique salt for additional security

## 🗄️ Database Reset Options

### Option 1: Using the Batch Script (Windows)
```bash
# Run the batch script
reset-database.bat
```

### Option 2: Using the PowerShell Script (Windows)
```powershell
# Run the PowerShell script
.\reset-database.ps1
```

### Option 3: Manual Reset (Any OS)
```bash
# Connect to PostgreSQL as superuser
psql -U postgres

# Run the reset script
\i reset-database.sql
```

## 📋 What the Reset Does

1. **Drops existing database** (if it exists)
2. **Creates new database** with proper schema
3. **Creates all tables** with proper relationships
4. **Inserts secure user credentials** with BCrypt hashed passwords
5. **Creates indexes** for optimal performance
6. **Sets up triggers** for automatic timestamp updates
7. **Creates views** for dashboard statistics
8. **Inserts sample data** for testing

## 🔧 Database Structure

The reset creates the following tables:
- `users` - User accounts with secure password hashing
- `patients` - Patient information
- `companies` - Pharmaceutical companies
- `medicines` - Medicine inventory
- `appointments` - Doctor appointments
- `prescriptions` - Medical prescriptions
- `prescription_items` - Items in prescriptions
- `billing` - Patient billing
- `password_reset_tokens` - Secure password reset tokens

## 🚀 After Reset

1. **Start the backend application**:
   ```bash
   cd backend
   mvn spring-boot:run
   ```

2. **Start the frontend application**:
   ```bash
   npm run dev
   ```

3. **Login with any of the credentials above**

## 🔍 Verification

To verify the database was reset correctly:

```sql
-- Connect to the database
psql -U postgres -d clinixpro

-- Check users table
SELECT user_id, first_name, last_name, email, role, isactive 
FROM clinixpro.users;

-- Verify password hashes are BCrypt format
SELECT email, 
       CASE 
           WHEN password LIKE '$2a$%' THEN 'BCrypt Hash'
           ELSE 'Plain Text (INSECURE!)'
       END as password_type
FROM clinixpro.users;
```

## ⚠️ Important Notes

- **Backup First**: Always backup your existing data before resetting
- **PostgreSQL Required**: Make sure PostgreSQL is running
- **Superuser Access**: You need PostgreSQL superuser privileges
- **Data Loss**: This will delete ALL existing data
- **Production**: Never use these default passwords in production

## 🆘 Troubleshooting

### PostgreSQL Not Running
```bash
# Start PostgreSQL service
sudo systemctl start postgresql  # Linux
# or
net start postgresql-x64-15      # Windows
```

### Permission Denied
```bash
# Connect as postgres user
sudo -u postgres psql
```

### Database Already Exists
The reset script will automatically drop and recreate the database.

## 📞 Support

If you encounter any issues:
1. Check that PostgreSQL is running
2. Verify you have superuser privileges
3. Check the PostgreSQL logs for errors
4. Ensure the `reset-database.sql` file is in the correct location

---

**Security Note**: These are development credentials. For production use, change all passwords immediately after deployment. 