# ClinixPro - Hospital Pharmacy Management System

A comprehensive, full-stack hospital pharmacy management system built with modern technologies and best practices.

## 🏥 Overview

ClinixPro is a professional-grade hospital pharmacy management system that streamlines healthcare operations, patient care, and pharmaceutical inventory management. Built with enterprise-level architecture and security standards.

## 🚀 Tech Stack

### Frontend
- **Next.js 15** - React framework with App Router
- **TypeScript** - Type-safe development
- **Tailwind CSS** - Modern, responsive UI
- **Chart.js** - Data visualization and analytics
- **Axios** - HTTP client for API communication

### Backend
- **Spring Boot 3.1.5** - Enterprise Java framework
- **Spring Security** - Authentication and authorization
- **Spring Data JPA** - Database operations
- **PostgreSQL** - Reliable database system
- **JWT** - Secure token-based authentication
- **Flyway** - Database migration management

## 🏗️ Architecture

```
ClinixPro/
├── frontend/          # Next.js application
│   ├── src/
│   │   ├── app/      # App router pages
│   │   ├── components/ # Reusable components
│   │   ├── services/   # API services
│   │   └── utils/      # Utility functions
│   └── public/       # Static assets
├── backend/           # Spring Boot application
│   ├── src/main/java/
│   │   ├── controller/ # REST API controllers
│   │   ├── service/    # Business logic
│   │   ├── repository/ # Data access layer
│   │   ├── model/      # Entity models
│   │   └── config/     # Configuration classes
│   └── src/main/resources/
└── docs/             # Documentation
```

## 👥 User Roles

### Admin
- System administration and user management
- Hospital-wide analytics and reporting
- Staff and department management

### Doctor
- Patient consultation and medical records
- Prescription management
- Appointment scheduling

### Pharmacist
- Medicine inventory management
- Prescription processing
- Supplier and distributor management

### Receptionist
- Patient registration and billing
- Appointment scheduling
- Payment processing

## 🔧 Installation

### Prerequisites
- Java 17+
- Node.js 18+
- PostgreSQL 12+
- Maven 3.6+

### Quick Start

1. **Clone the repository**
   ```bash
   git clone https://github.com/leandre000/ClinixPro.git
   cd ClinixPro
   ```

2. **Backend Setup**
   ```bash
   cd backend
   mvn clean install
   mvn spring-boot:run
   ```

3. **Frontend Setup**
   ```bash
   npm install
   npm run dev
   ```

4. **Database Setup**
   ```sql
   CREATE DATABASE clinixpro;
   ```

## 🔐 Security Features

- JWT-based authentication
- Role-based access control (RBAC)
- Password encryption with BCrypt
- CORS configuration
- Input validation and sanitization

## 📊 Features

### Core Functionality
- ✅ User authentication and authorization
- ✅ Patient management system
- ✅ Medicine inventory tracking
- ✅ Prescription management
- ✅ Appointment scheduling
- ✅ Billing and payment processing
- ✅ Medical records management
- ✅ Analytics and reporting

### Advanced Features
- ✅ Real-time stock monitoring
- ✅ Expiry date tracking
- ✅ Supplier management
- ✅ Multi-role dashboard
- ✅ Responsive design
- ✅ Data visualization

## 🧪 Testing

```bash
# Backend tests
mvn test

# Frontend tests
npm test
```

## 📈 Performance

- Optimized database queries
- Efficient caching strategies
- Responsive UI components
- Fast API responses

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👨‍💻 Author

**Leandre** - Professional Software Developer

## 🆘 Support

For support and questions, please open an issue in the GitHub repository.

---

**ClinixPro** - Empowering Healthcare with Technology

