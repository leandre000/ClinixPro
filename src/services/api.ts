import axios, { AxiosInstance, AxiosResponse } from 'axios';

// API Configuration with environment support
const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080/api';
const IS_PRODUCTION = process.env.NODE_ENV === 'production';

console.log(`API Service initialized with URL: ${API_URL}`);
console.log(`Environment: ${process.env.NODE_ENV}`);

// Types
export interface User {
  id: number;
  userId: string;
  firstName: string;
  lastName: string;
  email: string;
  role: 'ADMIN' | 'DOCTOR' | 'PHARMACIST' | 'RECEPTIONIST';
  phoneNumber?: string;
  address?: string;
  gender?: string;
  specialization?: string;
  licenseNumber?: string;
  qualification?: string;
  shift?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Patient {
  id: number;
  patientId: string;
  firstName: string;
  lastName: string;
  dateOfBirth?: string;
  gender: string;
  email?: string;
  phoneNumber?: string;
  address?: string;
  bloodGroup?: string;
  height?: number;
  weight?: number;
  allergies?: string;
  chronicDiseases?: string;
  emergencyContactName?: string;
  emergencyContactPhone?: string;
  emergencyContactRelation?: string;
  insuranceProvider?: string;
  insurancePolicyNumber?: string;
  insuranceExpiryDate?: string;
  occupation?: string;
  maritalStatus?: string;
  assignedDoctorId?: number;
  registrationDate: string;
  lastVisitDate?: string;
  medicalHistory?: string;
  status: string;
  createdAt: string;
  updatedAt: string;
}

export interface Medicine {
  id: number;
  medicineId: string;
  name: string;
  category: string;
  description?: string;
  manufacturer?: string;
  batchNumber?: string;
  expiryDate: string;
  stock: number;
  stockStatus: string;
  price: number;
  requiresPrescription: boolean;
  dosageForm?: string;
  strength?: string;
  companyId?: number;
  createdAt: string;
  updatedAt: string;
}

export interface Appointment {
  id: number;
  appointmentId: string;
  patientId: number;
  doctorId: number;
  appointmentDateTime: string;
  status: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
  patient?: Patient;
  doctor?: User;
}

export interface Prescription {
  id: number;
  prescriptionId: string;
  patientId: number;
  doctorId: number;
  prescriptionDate: string;
  diagnosis?: string;
  instructions?: string;
  status: string;
  createdAt: string;
  updatedAt: string;
  patient?: Patient;
  doctor?: User;
}

export interface Company {
  id: number;
  name: string;
  contactPerson?: string;
  email?: string;
  phone?: string;
  address?: string;
  status: string;
  createdAt: string;
  updatedAt: string;
}

export interface Billing {
  id: number;
  billingId: string;
  patientId: number;
  appointmentId?: number;
  totalAmount: number;
  paidAmount: number;
  paymentStatus: string;
  billingDate: string;
  dueDate?: string;
  createdAt: string;
  updatedAt: string;
  patient?: Patient;
  appointment?: Appointment;
}

export interface DashboardStats {
  totalDoctors: number;
  totalPharmacists: number;
  totalReceptionists: number;
  activePatients: number;
  lowStockMedicines: number;
  scheduledAppointments: number;
  activePrescriptions: number;
  pendingBills: number;
}

export interface LoginResponse {
  token: string;
  user: User;
}

export interface ApiResponse<T> {
  data: T;
  message?: string;
  success: boolean;
}

// API Service Class
class ApiService {
  private api: AxiosInstance;

  constructor() {
    this.api = axios.create({
      baseURL: API_URL,
      headers: {
        'Content-Type': 'application/json',
      },
      timeout: 15000,
    });

    // Request interceptor
    this.api.interceptors.request.use(
      (config) => {
        const token = localStorage.getItem('token');
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      (error) => {
        return Promise.reject(error);
      }
    );

    // Response interceptor
    this.api.interceptors.response.use(
      (response) => response,
      (error) => {
        if (error.response?.status === 401) {
          localStorage.removeItem('token');
          localStorage.removeItem('user');
          window.location.href = '/login';
        }
        return Promise.reject(error);
      }
    );
  }

  // Authentication
  async login(email: string, password: string): Promise<LoginResponse> {
    const response: AxiosResponse<LoginResponse> = await this.api.post('/auth/login', {
      email,
      password,
    });
    return response.data;
  }

  async verifyToken(): Promise<{ valid: boolean; user: User }> {
    const response: AxiosResponse<{ valid: boolean; user: User }> = await this.api.get('/auth/verify');
    return response.data;
  }

  async forgotPassword(email: string): Promise<{ message: string }> {
    const response: AxiosResponse<{ message: string }> = await this.api.post('/auth/forgot-password', {
      email,
    });
    return response.data;
  }

  async resetPassword(token: string, password: string): Promise<{ message: string }> {
    const response: AxiosResponse<{ message: string }> = await this.api.post('/auth/reset-password', {
      token,
      password,
    });
    return response.data;
  }

  // Users
  async getUsers(filters?: {
    role?: string;
    isActive?: boolean;
    search?: string;
  }): Promise<User[]> {
    const params = new URLSearchParams();
    if (filters?.role) params.append('role', filters.role);
    if (filters?.isActive !== undefined) params.append('isActive', filters.isActive.toString());
    if (filters?.search) params.append('search', filters.search);

    const response: AxiosResponse<User[]> = await this.api.get(`/users?${params.toString()}`);
    return response.data;
  }

  async getUserById(id: number): Promise<User> {
    const response: AxiosResponse<User> = await this.api.get(`/users/${id}`);
    return response.data;
  }

  async createUser(user: Partial<User>): Promise<User> {
    const response: AxiosResponse<User> = await this.api.post('/users', user);
    return response.data;
  }

  async updateUser(id: number, user: Partial<User>): Promise<User> {
    const response: AxiosResponse<User> = await this.api.put(`/users/${id}`, user);
    return response.data;
  }

  async deleteUser(id: number): Promise<void> {
    await this.api.delete(`/users/${id}`);
  }

  // Patients
  async getPatients(filters?: {
    status?: string;
    search?: string;
  }): Promise<Patient[]> {
    const params = new URLSearchParams();
    if (filters?.status) params.append('status', filters.status);
    if (filters?.search) params.append('search', filters.search);

    const response: AxiosResponse<Patient[]> = await this.api.get(`/patients?${params.toString()}`);
    return response.data;
  }

  async getPatientById(id: number): Promise<Patient> {
    const response: AxiosResponse<Patient> = await this.api.get(`/patients/${id}`);
    return response.data;
  }

  async createPatient(patient: Partial<Patient>): Promise<Patient> {
    const response: AxiosResponse<Patient> = await this.api.post('/patients', patient);
    return response.data;
  }

  async updatePatient(id: number, patient: Partial<Patient>): Promise<Patient> {
    const response: AxiosResponse<Patient> = await this.api.put(`/patients/${id}`, patient);
    return response.data;
  }

  async deletePatient(id: number): Promise<void> {
    await this.api.delete(`/patients/${id}`);
  }

  // Medicines
  async getMedicines(filters?: {
    category?: string;
    stockStatus?: string;
    search?: string;
  }): Promise<Medicine[]> {
    const params = new URLSearchParams();
    if (filters?.category) params.append('category', filters.category);
    if (filters?.stockStatus) params.append('stockStatus', filters.stockStatus);
    if (filters?.search) params.append('search', filters.search);

    const response: AxiosResponse<Medicine[]> = await this.api.get(`/medicines?${params.toString()}`);
    return response.data;
  }

  async getMedicineById(id: number): Promise<Medicine> {
    const response: AxiosResponse<Medicine> = await this.api.get(`/medicines/${id}`);
    return response.data;
  }

  async createMedicine(medicine: Partial<Medicine>): Promise<Medicine> {
    const response: AxiosResponse<Medicine> = await this.api.post('/medicines', medicine);
    return response.data;
  }

  async updateMedicine(id: number, medicine: Partial<Medicine>): Promise<Medicine> {
    const response: AxiosResponse<Medicine> = await this.api.put(`/medicines/${id}`, medicine);
    return response.data;
  }

  async deleteMedicine(id: number): Promise<void> {
    await this.api.delete(`/medicines/${id}`);
  }

  // Appointments
  async getAppointments(filters?: {
    status?: string;
    doctorId?: number;
    patientId?: number;
    startDate?: string;
    endDate?: string;
  }): Promise<Appointment[]> {
    const params = new URLSearchParams();
    if (filters?.status) params.append('status', filters.status);
    if (filters?.doctorId) params.append('doctorId', filters.doctorId.toString());
    if (filters?.patientId) params.append('patientId', filters.patientId.toString());
    if (filters?.startDate) params.append('startDate', filters.startDate);
    if (filters?.endDate) params.append('endDate', filters.endDate);

    const response: AxiosResponse<Appointment[]> = await this.api.get(`/appointments?${params.toString()}`);
    return response.data;
  }

  async getAppointmentById(id: number): Promise<Appointment> {
    const response: AxiosResponse<Appointment> = await this.api.get(`/appointments/${id}`);
    return response.data;
  }

  async createAppointment(appointment: Partial<Appointment>): Promise<Appointment> {
    const response: AxiosResponse<Appointment> = await this.api.post('/appointments', appointment);
    return response.data;
  }

  async updateAppointment(id: number, appointment: Partial<Appointment>): Promise<Appointment> {
    const response: AxiosResponse<Appointment> = await this.api.put(`/appointments/${id}`, appointment);
    return response.data;
  }

  async deleteAppointment(id: number): Promise<void> {
    await this.api.delete(`/appointments/${id}`);
  }

  // Prescriptions
  async getPrescriptions(filters?: {
    status?: string;
    doctorId?: number;
    patientId?: number;
  }): Promise<Prescription[]> {
    const params = new URLSearchParams();
    if (filters?.status) params.append('status', filters.status);
    if (filters?.doctorId) params.append('doctorId', filters.doctorId.toString());
    if (filters?.patientId) params.append('patientId', filters.patientId.toString());

    const response: AxiosResponse<Prescription[]> = await this.api.get(`/prescriptions?${params.toString()}`);
    return response.data;
  }

  async getPrescriptionById(id: number): Promise<Prescription> {
    const response: AxiosResponse<Prescription> = await this.api.get(`/prescriptions/${id}`);
    return response.data;
  }

  async createPrescription(prescription: Partial<Prescription>): Promise<Prescription> {
    const response: AxiosResponse<Prescription> = await this.api.post('/prescriptions', prescription);
    return response.data;
  }

  async updatePrescription(id: number, prescription: Partial<Prescription>): Promise<Prescription> {
    const response: AxiosResponse<Prescription> = await this.api.put(`/prescriptions/${id}`, prescription);
    return response.data;
  }

  async deletePrescription(id: number): Promise<void> {
    await this.api.delete(`/prescriptions/${id}`);
  }

  // Companies
  async getCompanies(): Promise<Company[]> {
    const response: AxiosResponse<Company[]> = await this.api.get('/companies');
    return response.data;
  }

  async getCompanyById(id: number): Promise<Company> {
    const response: AxiosResponse<Company> = await this.api.get(`/companies/${id}`);
    return response.data;
  }

  async createCompany(company: Partial<Company>): Promise<Company> {
    const response: AxiosResponse<Company> = await this.api.post('/companies', company);
    return response.data;
  }

  async updateCompany(id: number, company: Partial<Company>): Promise<Company> {
    const response: AxiosResponse<Company> = await this.api.put(`/companies/${id}`, company);
    return response.data;
  }

  async deleteCompany(id: number): Promise<void> {
    await this.api.delete(`/companies/${id}`);
  }

  // Billing
  async getBills(filters?: {
    paymentStatus?: string;
    patientId?: number;
  }): Promise<Billing[]> {
    const params = new URLSearchParams();
    if (filters?.paymentStatus) params.append('paymentStatus', filters.paymentStatus);
    if (filters?.patientId) params.append('patientId', filters.patientId.toString());

    const response: AxiosResponse<Billing[]> = await this.api.get(`/billing?${params.toString()}`);
    return response.data;
  }

  async getBillById(id: number): Promise<Billing> {
    const response: AxiosResponse<Billing> = await this.api.get(`/billing/${id}`);
    return response.data;
  }

  async createBill(bill: Partial<Billing>): Promise<Billing> {
    const response: AxiosResponse<Billing> = await this.api.post('/billing', bill);
    return response.data;
  }

  async updateBill(id: number, bill: Partial<Billing>): Promise<Billing> {
    const response: AxiosResponse<Billing> = await this.api.put(`/billing/${id}`, bill);
    return response.data;
  }

  async deleteBill(id: number): Promise<void> {
    await this.api.delete(`/billing/${id}`);
  }

  // Dashboard Stats
  async getDashboardStats(): Promise<DashboardStats> {
    const response: AxiosResponse<DashboardStats> = await this.api.get('/dashboard/stats');
    return response.data;
  }

  // Health Check
  async healthCheck(): Promise<{ status: string; timestamp: string }> {
    const response: AxiosResponse<{ status: string; timestamp: string }> = await this.api.get('/health');
    return response.data;
  }
}

// Export singleton instance
export const apiService = new ApiService();
export default apiService; 