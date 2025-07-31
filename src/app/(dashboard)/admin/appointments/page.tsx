"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { 
  FaCalendarAlt, 
  FaSearch, 
  FaFilter, 
  FaPlus, 
  FaEye, 
  FaEdit, 
  FaTrash,
  FaClock,
  FaUser,
  FaUserMd,
  FaHospital,
  FaCheckCircle,
  FaTimesCircle,
  FaExclamationTriangle,
  FaCalendarCheck,
  FaCalendarTimes,
  FaCalendarDay,
  FaPhone,
  FaEnvelope,
  FaMapMarkerAlt,
  FaStethoscope,
  FaNotesMedical,
  FaProcedures,
  FaHeartbeat,
  FaBrain,
  FaBaby,
  FaBone,
  FaEye as FaEyeIcon,
  FaEdit as FaEditIcon,
  FaTrash as FaTrashIcon,
  FaHistory,
  FaPrint,
  FaDownload,
  FaShare,
  FaBell,
  FaClock as FaTimeIcon,
  FaCalendar as FaCalendarIcon,
  FaUser as FaUserIcon,
  FaUserMd as FaDoctorIcon,
  FaHospital as FaHospitalIcon,
  FaCheck as FaCheckIcon,
  FaTimes as FaTimesIcon,
  FaExclamation as FaExclamationIcon,
  FaQuestion as FaQuestionIcon,
  FaInfo as FaInfoIcon,
  FaWarning as FaWarningIcon,
  FaSuccess as FaSuccessIcon,
  FaError as FaErrorIcon,
  FaLoading as FaLoadingIcon,
  FaRedo as FaRefreshIcon,
  FaSync as FaSyncIcon,
  FaCog as FaCogIcon,
  FaSettings as FaSettingsIcon,
  FaUserCog as FaUserCogIcon,
  FaUserEdit as FaUserEditIcon,
  FaUserPlus as FaUserPlusIcon,
  FaUserMinus as FaUserMinusIcon,
  FaUserCheck as FaUserCheckIcon,
  FaUserTimes as FaUserTimesIcon,
  FaUserLock as FaUserLockIcon,
  FaUserUnlock as FaUserUnlockIcon,
  FaUserShield as FaUserShieldIcon,
  FaUserSecret as FaUserSecretIcon,
  FaUserTie as FaUserTieIcon,
  FaUserGraduate as FaUserGraduateIcon,
  FaUserNurse as FaUserNurseIcon,
  FaUserInjured as FaUserInjuredIcon,
  FaUserFriends as FaUserFriendsIcon,
  FaUserCheck as FaUserCheckIcon2,
  FaUserClock as FaUserClockIcon,
  FaUserCog as FaUserCogIcon2,
  FaUserEdit as FaUserEditIcon2,
  FaUserGraduate as FaUserGraduateIcon2,
  FaUserInjured as FaUserInjuredIcon2,
  FaUserLock as FaUserLockIcon2,
  FaUserMinus as FaUserMinusIcon2,
  FaUserNurse as FaUserNurseIcon2,
  FaUserPlus as FaUserPlusIcon2,
  FaUserSecret as FaUserSecretIcon2,
  FaUserShield as FaUserShieldIcon2,
  FaUserTie as FaUserTieIcon2,
  FaUserTimes as FaUserTimesIcon2,
  FaUserUnlock as FaUserUnlockIcon2
} from "react-icons/fa";
import DashboardLayout from "@/components/DashboardLayout";
import DataService from "@/services/data.service";

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

  // Sample data for demonstration
  const sampleAppointments = [
    { 
      id: "APT-2001", 
      patient: { name: "John Smith", id: "P-10045", phone: "+1-555-0123", email: "john.smith@email.com" },
      doctor: { name: "Dr. Michael Chen", id: "DOC-1001", department: "Cardiology" },
      date: "2023-12-01",
      time: "09:00 AM",
      type: "Consultation",
      status: "Confirmed",
      notes: "Follow-up consultation for heart condition",
      department: "Cardiology"
    },
    { 
      id: "APT-2002", 
      patient: { name: "Maria Garcia", id: "P-10089", phone: "+1-555-0124", email: "maria.garcia@email.com" },
      doctor: { name: "Dr. Emily Rodriguez", id: "DOC-1002", department: "Pediatrics" },
      date: "2023-12-01",
      time: "10:30 AM",
      type: "Check-up",
      status: "Confirmed",
      notes: "Annual pediatric check-up",
      department: "Pediatrics"
    },
    { 
      id: "APT-2003", 
      patient: { name: "Robert Johnson", id: "P-10123", phone: "+1-555-0125", email: "robert.johnson@email.com" },
      doctor: { name: "Dr. Sarah Jefferson", id: "DOC-1003", department: "Neurology" },
      date: "2023-12-02",
      time: "11:15 AM",
      type: "Consultation",
      status: "Cancelled",
      notes: "Neurological consultation cancelled by patient",
      department: "Neurology"
    },
    { 
      id: "APT-2004", 
      patient: { name: "Jennifer Lee", id: "P-10056", phone: "+1-555-0126", email: "jennifer.lee@email.com" },
      doctor: { name: "Dr. James Wilson", id: "DOC-1004", department: "Orthopedics" },
      date: "2023-12-02",
      time: "02:00 PM",
      type: "Surgery Consultation",
      status: "Confirmed",
      notes: "Pre-surgery consultation for knee replacement",
      department: "Orthopedics"
    },
    { 
      id: "APT-2005", 
      patient: { name: "William Brown", id: "P-10078", phone: "+1-555-0127", email: "william.brown@email.com" },
      doctor: { name: "Dr. Olivia Parker", id: "DOC-1005", department: "Dermatology" },
      date: "2023-12-03",
      time: "03:30 PM",
      type: "Check-up",
      status: "Pending",
      notes: "Skin condition evaluation",
      department: "Dermatology"
    },
    { 
      id: "APT-2006", 
      patient: { name: "Emma Wilson", id: "P-10032", phone: "+1-555-0128", email: "emma.wilson@email.com" },
      doctor: { name: "Dr. Michael Chen", id: "DOC-1001", department: "Cardiology" },
      date: "2023-12-03",
      time: "11:00 AM",
      type: "Consultation",
      status: "Confirmed",
      notes: "Cardiac consultation",
      department: "Cardiology"
    }
  ];

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

  const departments = [
    "Cardiology",
    "Pediatrics", 
    "Neurology",
    "Orthopedics",
    "Dermatology",
    "General Medicine"
  ];

  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        setLoading(true);
        // Try to fetch from API first
        try {
          const data = await DataService.getAllAppointments();
          setAppointments(data);
        } catch (error) {
          console.log('Using sample appointments data');
          setAppointments(sampleAppointments);
        }
      } catch (error) {
        console.error('Error fetching appointments:', error);
        setAppointments(sampleAppointments);
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

  const handleCancelAppointment = async (appointment) => {
    if (confirm(`Are you sure you want to cancel appointment ${appointment.id}?`)) {
      try {
        // API call to cancel appointment
        // await DataService.cancelAppointment(appointment.id);
        console.log('Appointment cancelled:', appointment.id);
        
        // Update local state
        setAppointments(prev => prev.map(apt => 
          apt.id === appointment.id 
            ? { ...apt, status: 'Cancelled' }
            : apt
        ));
      } catch (error) {
        console.error('Error cancelling appointment:', error);
      }
    }
  };

  const handleViewHistory = (appointment) => {
    router.push(`/admin/appointments/${appointment.id}/history`);
  };

  const handleLogout = () => {
    setShowLogoutConfirm(true);
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
                          <FaTimes className="text-xl" />
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

      {/* Logout Confirmation Modal */}
      {showLogoutConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="fixed inset-0 bg-black bg-opacity-50" onClick={cancelLogout}></div>
          <div className="bg-white rounded-xl p-8 max-w-md w-full mx-4 border-2 border-gray-200 shadow-2xl">
            <div className="flex items-center mb-6">
              <div className="flex-shrink-0">
                <FaExclamationTriangle className="h-8 w-8 text-red-600" />
              </div>
              <div className="ml-4">
                <h3 className="text-2xl font-bold text-gray-900">Confirm Logout</h3>
              </div>
            </div>
            <div className="mb-8">
              <p className="text-lg text-gray-600 leading-relaxed">
                Are you sure you want to logout? You will need to sign in again to access your account.
              </p>
            </div>
            <div className="flex justify-end space-x-4">
              <button
                onClick={cancelLogout}
                className="px-6 py-3 text-lg font-bold text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={confirmLogout}
                className="px-6 py-3 text-lg font-bold text-white bg-red-600 rounded-lg hover:bg-red-700 transition-colors"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
} 