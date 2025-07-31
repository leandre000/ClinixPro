"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { 
  FaSearch, 
  FaFilter, 
  FaPlus, 
  FaEye, 
  FaEdit, 
  FaCheckCircle,
  FaTimesCircle,
  FaExclamationTriangle,
  FaPhone,
  FaStethoscope,
  FaHeartbeat,
  FaBrain,
  FaBaby,
  FaBone,
  FaEye as FaEyeIcon,
  FaHistory,
  FaPrint,
  FaClock as FaTimeIcon,
  FaCalendar as FaCalendarIcon,
  FaUserMd as FaDoctorIcon,
  FaTimes as FaTimesIcon
} from "react-icons/fa";
import DashboardLayout from "@/components/DashboardLayout";
import DataService from "@/services/data.service";
import ConfirmationModal from "@/components/ConfirmationModal";

export default function AppointmentsManagement() {
  const router = useRouter();
  const [appointments, setAppointments] = useState([]);
  const [filteredAppointments, setFilteredAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedDoctor, setSelectedDoctor] = useState("All Doctors");
  const [selectedStatus, setSelectedStatus] = useState("All Status");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const [showCancelConfirm, setShowCancelConfirm] = useState(false);
  const [selectedAppointment, setSelectedAppointment] = useState(null);



  const doctors = [
    "All Doctors",
    "Dr. Michael Chen",
    "Dr. Emily Rodriguez", 
    "Dr. Sarah Jefferson",
    "Dr. James Wilson",
    "Dr. Olivia Parker"
  ];

  const statuses = [
    "All Status",
    "Confirmed",
    "Pending", 
    "Cancelled",
    "Completed",
    "No Show"
  ];



  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        setLoading(true);
        setError("");
        
        const data = await DataService.getAllAppointments();
        setAppointments(data);
      } catch (error) {
        console.error('Error fetching appointments:', error);
        setError("Failed to load appointments. Please try again.");
        setAppointments([]);
      } finally {
        setLoading(false);
      }
    };

    fetchAppointments();
  }, []);

  useEffect(() => {
    let filtered = appointments;

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(apt => 
        apt.patient.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        apt.doctor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        apt.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        apt.patient.id.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Filter by date
    if (selectedDate) {
      filtered = filtered.filter(apt => apt.date === selectedDate);
    }

    // Filter by doctor
    if (selectedDoctor !== "All Doctors") {
      filtered = filtered.filter(apt => apt.doctor.name === selectedDoctor);
    }

    // Filter by status
    if (selectedStatus !== "All Status") {
      filtered = filtered.filter(apt => apt.status === selectedStatus);
    }

    setFilteredAppointments(filtered);
    setCurrentPage(1);
  }, [appointments, searchTerm, selectedDate, selectedDoctor, selectedStatus]);

  const getStatusColor = (status) => {
    switch (status) {
      case "Confirmed": return "bg-green-100 text-green-800 border-green-200";
      case "Pending": return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "Cancelled": return "bg-red-100 text-red-800 border-red-200";
      case "Completed": return "bg-blue-100 text-blue-800 border-blue-200";
      case "No Show": return "bg-gray-100 text-gray-800 border-gray-200";
      default: return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const getDepartmentIcon = (department) => {
    switch (department) {
      case "Cardiology": return <FaHeartbeat className="text-red-500" />;
      case "Pediatrics": return <FaBaby className="text-pink-500" />;
      case "Neurology": return <FaBrain className="text-purple-500" />;
      case "Orthopedics": return <FaBone className="text-orange-500" />;
      case "Dermatology": return <FaEyeIcon className="text-green-500" />;
      default: return <FaStethoscope className="text-blue-500" />;
    }
  };

  const handleViewAppointment = (appointment) => {
    router.push(`/admin/appointments/${appointment.id}`);
  };

  const handleEditAppointment = (appointment) => {
    router.push(`/admin/appointments/${appointment.id}/edit`);
  };

  const handleCancelAppointment = (appointment) => {
    setSelectedAppointment(appointment);
    setShowCancelConfirm(true);
  };

  const confirmCancelAppointment = async () => {
    if (!selectedAppointment) return;
    
    try {
      await DataService.cancelAppointment(selectedAppointment.id);
      
      // Update local state
      setAppointments(prev => prev.map(apt => 
        apt.id === selectedAppointment.id 
          ? { ...apt, status: 'Cancelled' }
          : apt
      ));
      
      setSelectedAppointment(null);
    } catch (error) {
      console.error('Error cancelling appointment:', error);
      setError("Failed to cancel appointment. Please try again.");
    }
  };

  const handleViewHistory = (appointment) => {
    router.push(`/admin/appointments/${appointment.id}/history`);
  };



  const confirmLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    router.push("/login");
  };

  const cancelLogout = () => {
    setShowLogoutConfirm(false);
  };

  // Pagination
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentAppointments = filteredAppointments.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredAppointments.length / itemsPerPage);

  if (loading) {
    return (
      <DashboardLayout userType="admin" title="Appointments Management">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-16 w-16 border-4 border-indigo-600 border-t-transparent mx-auto"></div>
            <p className="mt-4 text-gray-900 text-xl font-bold">Loading Appointments...</p>
            <p className="mt-2 text-gray-600 text-lg">Please wait while we fetch your data</p>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout userType="admin" title="Appointments Management">
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-gray-900 mb-3">Appointments Schedule</h1>
        <p className="text-xl text-gray-600">Manage and track all patient appointments</p>
      </div>

      {/* Search and Filter Section */}
      <div className="bg-white rounded-xl border-2 border-gray-200 shadow-lg p-6 mb-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
          {/* Search */}
          <div className="lg:col-span-2">
            <label className="block text-lg font-bold text-gray-900 mb-2">
              <FaSearch className="inline mr-2 text-indigo-600" />
              Search by patient, doctor...
            </label>
              <input
                type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search appointments..."
              className="w-full px-4 py-3 text-lg border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-gray-900 placeholder-gray-500"
            />
            </div>

          {/* Date Filter */}
          <div>
            <label className="block text-lg font-bold text-gray-900 mb-2">
              <FaCalendarIcon className="inline mr-2 text-indigo-600" />
              Date
            </label>
              <input
                type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="w-full px-4 py-3 text-lg border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-gray-900"
            />
          </div>

          {/* Doctor Filter */}
          <div>
            <label className="block text-lg font-bold text-gray-900 mb-2">
              <FaDoctorIcon className="inline mr-2 text-indigo-600" />
              Doctor
            </label>
              <select
              value={selectedDoctor}
              onChange={(e) => setSelectedDoctor(e.target.value)}
              className="w-full px-4 py-3 text-lg border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-gray-900 bg-white"
            >
                {doctors.map(doctor => (
                  <option key={doctor} value={doctor}>{doctor}</option>
                ))}
              </select>
          </div>

          {/* Status Filter */}
          <div>
            <label className="block text-lg font-bold text-gray-900 mb-2">
              <FaFilter className="inline mr-2 text-indigo-600" />
              Status
            </label>
              <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="w-full px-4 py-3 text-lg border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-gray-900 bg-white"
            >
              {statuses.map(status => (
                <option key={status} value={status}>{status}</option>
              ))}
              </select>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-between items-center mt-6 pt-6 border-t-2 border-gray-200">
          <div className="flex space-x-4">
            <button
              onClick={() => router.push('/admin/appointments/new')}
              className="flex items-center px-6 py-3 bg-indigo-600 text-white text-lg font-bold rounded-lg hover:bg-indigo-700 transition-colors shadow-lg"
            >
              <FaPlus className="mr-2" />
                Schedule New
              </button>
            <button
              onClick={() => window.print()}
              className="flex items-center px-6 py-3 bg-green-600 text-white text-lg font-bold rounded-lg hover:bg-green-700 transition-colors shadow-lg"
            >
              <FaPrint className="mr-2" />
              Print Schedule
            </button>
          </div>
          <div className="text-lg font-bold text-gray-700">
            Total: {filteredAppointments.length} appointments
            </div>
          </div>
        </div>
        
      {/* Appointments Table */}
      <div className="bg-white rounded-xl border-2 border-gray-200 shadow-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b-2 border-gray-200">
              <tr>
                <th className="px-6 py-4 text-left text-lg font-bold text-gray-900">APPOINTMENT ID</th>
                <th className="px-6 py-4 text-left text-lg font-bold text-gray-900">PATIENT</th>
                <th className="px-6 py-4 text-left text-lg font-bold text-gray-900">DOCTOR</th>
                <th className="px-6 py-4 text-left text-lg font-bold text-gray-900">DEPARTMENT</th>
                <th className="px-6 py-4 text-left text-lg font-bold text-gray-900">DATE & TIME</th>
                <th className="px-6 py-4 text-left text-lg font-bold text-gray-900">TYPE</th>
                <th className="px-6 py-4 text-left text-lg font-bold text-gray-900">STATUS</th>
                <th className="px-6 py-4 text-left text-lg font-bold text-gray-900">ACTIONS</th>
              </tr>
            </thead>
            <tbody className="divide-y-2 divide-gray-200">
              {currentAppointments.map((appointment) => (
                <tr key={appointment.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4">
                    <span className="text-lg font-bold text-indigo-600">{appointment.id}</span>
                  </td>
                  <td className="px-6 py-4">
                    <div>
                      <div className="text-lg font-bold text-gray-900">{appointment.patient.name}</div>
                      <div className="text-sm text-gray-600">({appointment.patient.id})</div>
                      <div className="text-sm text-gray-500 flex items-center mt-1">
                        <FaPhone className="mr-1" />
                        {appointment.patient.phone}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div>
                      <div className="text-lg font-bold text-gray-900">{appointment.doctor.name}</div>
                      <div className="text-sm text-gray-600">({appointment.doctor.id})</div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center">
                      {getDepartmentIcon(appointment.department)}
                      <span className="ml-2 text-lg font-semibold text-gray-900">{appointment.department}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div>
                      <div className="text-lg font-bold text-gray-900">{appointment.date}</div>
                      <div className="text-lg text-gray-700 flex items-center">
                        <FaTimeIcon className="mr-1 text-indigo-600" />
                        {appointment.time}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-lg font-semibold text-gray-900">{appointment.type}</span>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center px-3 py-1 rounded-full text-lg font-bold border-2 ${getStatusColor(appointment.status)}`}>
                      {appointment.status === "Confirmed" && <FaCheckCircle className="mr-1" />}
                      {appointment.status === "Cancelled" && <FaTimesCircle className="mr-1" />}
                      {appointment.status === "Pending" && <FaExclamationTriangle className="mr-1" />}
                      {appointment.status}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex space-x-2">
                      <button
                        onClick={() => handleViewAppointment(appointment)}
                        className="px-3 py-2 bg-blue-600 text-white text-lg font-bold rounded-lg hover:bg-blue-700 transition-colors"
                        title="View Details"
                      >
                        <FaEye className="text-xl" />
                      </button>
                      <button
                        onClick={() => handleEditAppointment(appointment)}
                        className="px-3 py-2 bg-green-600 text-white text-lg font-bold rounded-lg hover:bg-green-700 transition-colors"
                        title="Edit Appointment"
                      >
                        <FaEdit className="text-xl" />
                      </button>
                      <button
                        onClick={() => handleViewHistory(appointment)}
                        className="px-3 py-2 bg-purple-600 text-white text-lg font-bold rounded-lg hover:bg-purple-700 transition-colors"
                        title="View History"
                      >
                        <FaHistory className="text-xl" />
                      </button>
                      {appointment.status !== "Cancelled" && (
                        <button
                          onClick={() => handleCancelAppointment(appointment)}
                          className="px-3 py-2 bg-red-600 text-white text-lg font-bold rounded-lg hover:bg-red-700 transition-colors"
                          title="Cancel Appointment"
                        >
                          <FaTimesIcon className="text-xl" />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        {/* Pagination */}
        <div className="px-6 py-4 bg-gray-50 border-t-2 border-gray-200">
          <div className="flex items-center justify-between">
            <div className="text-lg font-bold text-gray-900">
              Showing {indexOfFirstItem + 1} to {Math.min(indexOfLastItem, filteredAppointments.length)} of {filteredAppointments.length} appointments
          </div>
          <div className="flex space-x-2">
              <button
                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className="px-4 py-2 text-lg font-bold text-gray-700 bg-white border-2 border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
              Previous
            </button>
              <button
                onClick={() => setCurrentPage(1)}
                className={`px-4 py-2 text-lg font-bold rounded-lg ${
                  currentPage === 1 
                    ? 'bg-indigo-600 text-white' 
                    : 'text-gray-700 bg-white border-2 border-gray-300 hover:bg-gray-50'
                }`}
              >
              1
            </button>
              <button
                onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                disabled={currentPage === totalPages}
                className="px-4 py-2 text-lg font-bold text-gray-700 bg-white border-2 border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
              Next
            </button>
            </div>
          </div>
        </div>
      </div>

      {/* Cancel Appointment Confirmation Modal */}
      <ConfirmationModal
        isOpen={showCancelConfirm}
        onClose={() => setShowCancelConfirm(false)}
        onConfirm={confirmCancelAppointment}
        title="Cancel Appointment"
        message={`Are you sure you want to cancel appointment ${selectedAppointment?.id}?`}
        confirmText="Cancel Appointment"
        cancelText="Keep Appointment"
        type="warning"
      />

      {/* Logout Confirmation Modal */}
      <ConfirmationModal
        isOpen={showLogoutConfirm}
        onClose={cancelLogout}
        onConfirm={confirmLogout}
        title="Confirm Logout"
        message="Are you sure you want to logout? You will need to sign in again to access your account."
        confirmText="Logout"
        cancelText="Cancel"
        type="danger"
      />
    </DashboardLayout>
  );
} 