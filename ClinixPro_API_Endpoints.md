# ClinixPro - Complete API Endpoints Documentation

## 🏥 **ClinixPro Hospital Management System API**

### **Base URL**: `http://localhost:8080/api`

---

## **🔐 Authentication Endpoints**

### **1. Login**
```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "admin@clinixpro.com",
  "password": "password"
}
```

**Response:**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": 1,
    "firstName": "Admin",
    "lastName": "User",
    "email": "admin@clinixpro.com",
    "role": "ADMIN",
    "isActive": true
  }
}
```

### **2. Verify Token**
```http
GET /api/auth/verify
Authorization: Bearer <token>
```

**Response:**
```json
{
  "valid": true,
  "user": {
    "id": 1,
    "firstName": "Admin",
    "lastName": "User",
    "email": "admin@clinixpro.com",
    "role": "ADMIN"
  }
}
```

### **3. Register User**
```http
POST /api/auth/register
Content-Type: application/json

{
  "firstName": "John",
  "lastName": "Doe",
  "email": "john.doe@example.com",
  "password": "password123",
  "role": "DOCTOR",
  "phone": "+1234567890"
}
```

### **4. Create Admin**
```http
POST /api/auth/create-admin
Authorization: Bearer <token>
```

### **5. Forgot Password**
```http
POST /api/auth/forgot-password
Content-Type: application/json

{
  "email": "user@example.com"
}
```

### **6. Reset Password**
```http
POST /api/auth/reset-password
Content-Type: application/json

{
  "token": "reset-token-here",
  "newPassword": "newpassword123"
}
```

---

## **👨‍⚕️ Admin Endpoints**

### **1. Dashboard**
```http
GET /api/admin/dashboard
Authorization: Bearer <token>
```

**Response:**
```json
{
  "totalUsers": 25,
  "totalPatients": 150,
  "totalDoctors": 8,
  "totalPharmacists": 5,
  "totalReceptionists": 3,
  "activeUsers": 22,
  "recentActivity": [...]
}
```

### **2. Get Users**
```http
GET /api/admin/users?role=DOCTOR&isActive=true&search=john
Authorization: Bearer <token>
```

**Query Parameters:**
- `role`: Filter by role (ADMIN, DOCTOR, PHARMACIST, RECEPTIONIST)
- `isActive`: Filter by active status (true/false)
- `search`: Search by name or email

### **3. Create User**
```http
POST /api/admin/users
Authorization: Bearer <token>
Content-Type: application/json

{
  "firstName": "Jane",
  "lastName": "Smith",
  "email": "jane.smith@example.com",
  "password": "password123",
  "role": "PHARMACIST",
  "phone": "+1234567890",
  "isActive": true
}
```

### **4. Update User**
```http
PUT /api/admin/users/{id}
Authorization: Bearer <token>
Content-Type: application/json

{
  "firstName": "Jane",
  "lastName": "Smith",
  "email": "jane.smith@example.com",
  "phone": "+1234567890",
  "isActive": true
}
```

### **5. Delete User**
```http
DELETE /api/admin/users/{id}
Authorization: Bearer <token>
```

---

## **👨‍⚕️ Doctor Endpoints**

### **1. Dashboard**
```http
GET /api/doctor/dashboard
Authorization: Bearer <token>
```

**Response:**
```json
{
  "totalPatients": 45,
  "todayAppointments": 8,
  "pendingPrescriptions": 12,
  "occupiedBeds": 15,
  "availableBeds": 5
}
```

### **2. Get Patients**
```http
GET /api/doctor/patients
Authorization: Bearer <token>
```

### **3. Get Appointments**
```http
GET /api/doctor/appointments
Authorization: Bearer <token>
```

### **4. Get Today's Appointments**
```http
GET /api/doctor/appointments/today
Authorization: Bearer <token>
```

### **5. Complete Appointment**
```http
PUT /api/doctor/appointments/{id}/complete
Authorization: Bearer <token>
```

### **6. Get Prescriptions**
```http
GET /api/doctor/prescriptions
Authorization: Bearer <token>
```

### **7. Create Prescription**
```http
POST /api/doctor/prescriptions/create
Authorization: Bearer <token>
Content-Type: application/json

{
  "patientId": 1,
  "diagnosis": "Hypertension",
  "prescriptionItems": [
    {
      "medicineId": "MED-001",
      "dosage": "10mg",
      "frequency": "Once daily",
      "duration": "30 days",
      "quantity": 30
    }
  ]
}
```

### **8. Get Beds**
```http
GET /api/doctor/beds
Authorization: Bearer <token>
```

### **9. Assign Patient to Bed**
```http
PUT /api/doctor/beds/{bedId}/assign?patientId=1
Authorization: Bearer <token>
```

### **10. Discharge Patient**
```http
PUT /api/doctor/beds/{bedId}/discharge
Authorization: Bearer <token>
```

---

## **💊 Pharmacist Endpoints**

### **1. Dashboard**
```http
GET /api/pharmacist/dashboard
Authorization: Bearer <token>
```

**Response:**
```json
{
  "totalMedicines": 150,
  "lowStockMedicines": 8,
  "expiredMedicines": 3,
  "totalCompanies": 12,
  "totalDistributors": 8,
  "activePrescriptions": 25,
  "completedPrescriptions": 180
}
```

### **2. Get Medicines**
```http
GET /api/pharmacist/medicines?category=Antibiotics&stockStatus=Low&prescriptionFilter=Required
Authorization: Bearer <token>
```

**Query Parameters:**
- `category`: Filter by medicine category
- `stockStatus`: Filter by stock status (Low, Normal, Critical)
- `prescriptionFilter`: Filter by prescription requirement

### **3. Search Medicines**
```http
GET /api/pharmacist/medicines/search?keyword=paracetamol
Authorization: Bearer <token>
```

### **4. Create Medicine**
```http
POST /api/pharmacist/medicines
Authorization: Bearer <token>
Content-Type: application/json

{
  "name": "Paracetamol 500mg",
  "category": "Pain Relief",
  "description": "Pain reliever and fever reducer",
  "manufacturer": "Generic Pharma",
  "batchNumber": "BATCH-001",
  "expiryDate": "2025-12-31",
  "stock": 100,
  "stockStatus": "Normal",
  "price": 5.99,
  "requiresPrescription": false,
  "dosageForm": "Tablet",
  "strength": "500mg",
  "interactions": ["Alcohol", "Blood thinners"],
  "sideEffects": ["Nausea", "Stomach upset"]
}
```

### **5. Update Medicine**
```http
PUT /api/pharmacist/medicines/{medicineId}
Authorization: Bearer <token>
Content-Type: application/json

{
  "name": "Paracetamol 500mg",
  "category": "Pain Relief",
  "description": "Updated description",
  "manufacturer": "Generic Pharma",
  "batchNumber": "BATCH-002",
  "expiryDate": "2025-12-31",
  "stock": 150,
  "stockStatus": "Normal",
  "price": 6.99,
  "requiresPrescription": false,
  "dosageForm": "Tablet",
  "strength": "500mg"
}
```

### **6. Delete Medicine**
```http
DELETE /api/pharmacist/medicines/{medicineId}
Authorization: Bearer <token>
```

### **7. Get Low Stock Medicines**
```http
GET /api/pharmacist/medicines/low-stock
Authorization: Bearer <token>
```

### **8. Get Expired Medicines**
```http
GET /api/pharmacist/medicines/expired
Authorization: Bearer <token>
```

### **9. Get Medicine Categories**
```http
GET /api/pharmacist/medicine-categories
Authorization: Bearer <token>
```

### **10. Get Inventory Summary**
```http
GET /api/pharmacist/inventory
Authorization: Bearer <token>
```

**Response:**
```json
{
  "totalMedicines": 150,
  "lowStockCount": 8,
  "expiredCount": 3,
  "categories": ["Antibiotics", "Pain Relief", "Cardiovascular", "Diabetes"]
}
```

### **11. Get Reports**
```http
GET /api/pharmacist/reports?type=inventory&startDate=2024-01-01&endDate=2024-12-31
Authorization: Bearer <token>
```

**Query Parameters:**
- `type`: Report type (inventory, prescriptions)
- `startDate`: Start date for report
- `endDate`: End date for report

### **12. Get Companies**
```http
GET /api/pharmacist/companies
Authorization: Bearer <token>
```

### **13. Create Company**
```http
POST /api/pharmacist/companies
Authorization: Bearer <token>
Content-Type: application/json

{
  "name": "PharmaCorp Inc.",
  "address": "123 Pharma Street, Medical City",
  "phone": "+1-555-0123",
  "email": "contact@pharmacorp.com",
  "website": "https://pharmacorp.com",
  "licenseNumber": "PHARMA-001",
  "status": "Active"
}
```

### **14. Get Distributors**
```http
GET /api/pharmacist/distributors?region=North&status=Active
Authorization: Bearer <token>
```

### **15. Get Active Prescriptions**
```http
GET /api/pharmacist/prescriptions
Authorization: Bearer <token>
```

### **16. Fill Prescription**
```http
PUT /api/pharmacist/prescriptions/{id}/fill
Authorization: Bearer <token>
```

---

## **🏥 Receptionist Endpoints**

### **1. Dashboard**
```http
GET /api/receptionist/dashboard
Authorization: Bearer <token>
```

### **2. Get Patients**
```http
GET /api/receptionist/patients
Authorization: Bearer <token>
```

### **3. Create Patient**
```http
POST /api/receptionist/patients
Authorization: Bearer <token>
Content-Type: application/json

{
  "firstName": "John",
  "lastName": "Patient",
  "dateOfBirth": "1990-01-01",
  "gender": "MALE",
  "phone": "+1234567890",
  "email": "john.patient@example.com",
  "address": "123 Patient Street, City",
  "emergencyContact": "+1234567891",
  "bloodType": "O+",
  "allergies": ["Penicillin"],
  "medicalHistory": "Hypertension"
}
```

### **4. Get Appointments**
```http
GET /api/receptionist/appointments
Authorization: Bearer <token>
```

### **5. Create Appointment**
```http
POST /api/receptionist/appointments
Authorization: Bearer <token>
Content-Type: application/json

{
  "patientId": 1,
  "doctorId": 2,
  "appointmentDate": "2024-12-25T10:00:00",
  "reason": "Regular checkup",
  "status": "SCHEDULED"
}
```

### **6. Get Billing**
```http
GET /api/receptionist/billing
Authorization: Bearer <token>
```

### **7. Create Billing**
```http
POST /api/receptionist/billing
Authorization: Bearer <token>
Content-Type: application/json

{
  "patientId": 1,
  "appointmentId": 1,
  "amount": 150.00,
  "description": "Consultation fee",
  "status": "PENDING"
}
```

---

## **🏢 Company Endpoints**

### **1. Get All Companies**
```http
GET /api/companies
Authorization: Bearer <token>
```

### **2. Get Company by ID**
```http
GET /api/companies/{id}
Authorization: Bearer <token>
```

### **3. Get Company by Company ID**
```http
GET /api/companies/companyId/{companyId}
Authorization: Bearer <token>
```

### **4. Create Company**
```http
POST /api/companies
Authorization: Bearer <token>
Content-Type: application/json

{
  "name": "New Pharma Corp",
  "address": "456 New Street, Pharma City",
  "phone": "+1-555-0456",
  "email": "contact@newpharma.com",
  "website": "https://newpharma.com",
  "licenseNumber": "PHARMA-002",
  "status": "Active"
}
```

### **5. Update Company**
```http
PUT /api/companies/{id}
Authorization: Bearer <token>
Content-Type: application/json

{
  "name": "Updated Pharma Corp",
  "address": "789 Updated Street, Pharma City",
  "phone": "+1-555-0789",
  "email": "contact@updatedpharma.com",
  "website": "https://updatedpharma.com",
  "licenseNumber": "PHARMA-002",
  "status": "Active"
}
```

### **6. Delete Company**
```http
DELETE /api/companies/{id}
Authorization: Bearer <token>
```

### **7. Search Companies**
```http
GET /api/companies/search?keyword=pharma
Authorization: Bearer <token>
```

---

## **📊 Data & Analytics Endpoints**

### **1. Dashboard Stats**
```http
GET /api/data/dashboard-stats
Authorization: Bearer <token>
```

### **2. Get All Patients Data**
```http
GET /api/data/patients
Authorization: Bearer <token>
```

### **3. Get All Medicines Data**
```http
GET /api/data/medicines
Authorization: Bearer <token>
```

### **4. Get All Companies Data**
```http
GET /api/data/companies
Authorization: Bearer <token>
```

### **5. Get All Distributors Data**
```http
GET /api/data/distributors
Authorization: Bearer <token>
```

---

## **🔧 Error Responses**

### **400 Bad Request**
```json
{
  "error": "Bad Request",
  "message": "Invalid input data",
  "timestamp": "2024-12-25T10:00:00",
  "path": "/api/auth/login"
}
```

### **401 Unauthorized**
```json
{
  "error": "Unauthorized",
  "message": "Invalid or expired token",
  "timestamp": "2024-12-25T10:00:00",
  "path": "/api/admin/dashboard"
}
```

### **403 Forbidden**
```json
{
  "error": "Forbidden",
  "message": "Access denied. Insufficient privileges.",
  "timestamp": "2024-12-25T10:00:00",
  "path": "/api/admin/users"
}
```

### **404 Not Found**
```json
{
  "error": "Not Found",
  "message": "Resource not found",
  "timestamp": "2024-12-25T10:00:00",
  "path": "/api/medicines/999"
}
```

### **500 Internal Server Error**
```json
{
  "error": "Internal Server Error",
  "message": "An unexpected error occurred",
  "timestamp": "2024-12-25T10:00:00",
  "path": "/api/pharmacist/dashboard"
}
```

---

## **🔐 Authentication & Authorization**

### **JWT Token Format**
```
Authorization: Bearer <jwt-token>
```

### **User Roles**
- **ADMIN**: Full system access
- **DOCTOR**: Patient management, appointments, prescriptions, beds
- **PHARMACIST**: Medicine management, inventory, companies, distributors
- **RECEPTIONIST**: Patient registration, appointments, billing

### **Token Expiration**
- **Access Token**: 24 hours
- **Refresh Token**: 7 days

---

## **📋 Usage Instructions**

### **1. Getting Started**
1. Start the backend server: `mvn spring-boot:run`
2. Start the frontend: `npm run dev`
3. Access Swagger UI: `http://localhost:8080/swagger-ui.html`
4. Import Postman collection: `ClinixPro_Postman_Collection.json`

### **2. Authentication Flow**
1. Login with credentials to get JWT token
2. Include token in Authorization header for all subsequent requests
3. Use token until expiration, then re-authenticate

### **3. Testing Endpoints**
1. Use Swagger UI for interactive testing
2. Use Postman collection for comprehensive testing
3. Use curl commands for quick testing

### **4. Common Headers**
```http
Content-Type: application/json
Authorization: Bearer <token>
Accept: application/json
```

---

## **🚀 Swagger UI Access**

**URL**: `http://localhost:8080/swagger-ui.html`

**Features**:
- Interactive API documentation
- Test endpoints directly from browser
- View request/response schemas
- Download OpenAPI specification

---

## **📱 Frontend Access**

**URL**: `http://localhost:3000`

**Features**:
- Modern React-based UI
- Role-based dashboards
- Real-time data updates
- Responsive design

---

## **🔧 Development Tools**

### **Backend**
- **Port**: 8080
- **Database**: PostgreSQL (port 5434)
- **Build**: Maven
- **Framework**: Spring Boot 3.1.5

### **Frontend**
- **Port**: 3000
- **Framework**: Next.js 15
- **Build**: npm
- **Styling**: Tailwind CSS

---

**🎉 ClinixPro API is now ready for development and testing!** 