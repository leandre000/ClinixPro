"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { 
  FaUsers, 
  FaUserMd, 
  FaPills, 
  FaCalendarAlt, 
  FaChartLine, 
  FaHospital,
  FaUserNurse,
  FaClipboardList,
  FaTrash,
  FaEdit,
  FaEye,
  FaPlus,
  FaSearch,
  FaFilter,
  FaBell,
  FaCog,
  FaSignOutAlt,
  FaHome,
  FaUser,
  FaShieldAlt,
  FaExclamationTriangle,
  FaCheckCircle,
  FaClock,
  FaPhone,
  FaEnvelope,
  FaMapMarkerAlt,
  FaTachometerAlt,
  FaUserFriends,
  FaStethoscope,
  FaPrescriptionBottle,
  FaClipboardCheck,
  FaChartBar,
  FaCog as FaSettings
} from "react-icons/fa";
import { 
  MdDashboard, 
  MdPeople, 
  MdLocalHospital, 
  MdLocalPharmacy,
  MdReceipt,
  MdSettings,
  MdNotifications,
  MdMenu,
  MdClose,
  MdPerson,
  MdGroup,
  MdMedicalServices,
  MdMedication,
  MdEvent,
  MdAssessment,
  MdSecurity
} from "react-icons/md";
import DashboardLayout from "@/components/DashboardLayout";
import DataService from "@/services/data.service";
import AdminService from "@/services/admin.service";

export default function AdminDashboard() {
  const router = useRouter();
  const [stats, setStats] = useState({});
  const [recentStaff, setRecentStaff] = useState([]);
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user") || "{}");
    if (!user.role || user.role !== "ADMIN") {
      router.push("/login");
      return;
    }

    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        setError("");
        
        const dashboardStats = await DataService.getDashboardStats();
        setStats(dashboardStats);

        const staffData = await AdminService.getUsers({ active: true });
        setRecentStaff(staffData.slice(0, 5));

        try {
          const appointmentsData = await DataService.getAllAppointments();
          setAppointments(appointmentsData.slice(0, 4));
        } catch (err) {
          console.error('Error loading appointments data:', err);
        }
        
      } catch (err) {
        console.error("Error fetching dashboard data:", err);
        setError("Failed to load dashboard data. Please check your connection and try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, [router]);

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

  const handleDeleteStaff = async (id) => {
    if (confirm("Are you sure you want to deactivate this staff member?")) {
      try {
        await AdminService.deleteUser(id);
        const staffData = await AdminService.getUsers({ active: true });
        setRecentStaff(staffData.slice(0, 5));
        const dashboardStats = await DataService.getDashboardStats();
        setStats(dashboardStats);
      } catch (err) {
        console.error("Error deleting staff:", err);
        setError("Failed to deactivate staff. Please try again.");
      }
    }
  };

  const handleQuickAction = (action) => {
    switch (action) {
      case 'add-staff':
        router.push('/admin/staff/new');
        break;
      case 'add-patient':
        router.push('/admin/patients/register');
        break;
      case 'schedule-appointment':
        router.push('/admin/appointments/new');
        break;
      case 'add-medicine':
        router.push('/admin/medicines/add');
        break;
      default:
        break;
    }
  };

  const getRoleIcon = (role) => {
    switch (role) {
      case "ADMIN": return <FaShieldAlt className="text-red-500 text-xl" />;
      case "DOCTOR": return <FaUserMd className="text-blue-500 text-xl" />;
      case "PHARMACIST": return <FaPills className="text-green-500 text-xl" />;
      case "RECEPTIONIST": return <FaUserNurse className="text-purple-500 text-xl" />;
      default: return <FaUser className="text-gray-500 text-xl" />;
    }
  };

  const getRoleColor = (role) => {
    switch (role) {
      case "ADMIN": return "bg-red-100 text-red-800 border-red-200";
      case "DOCTOR": return "bg-blue-100 text-blue-800 border-blue-200";
      case "PHARMACIST": return "bg-green-100 text-green-800 border-green-200";
      case "RECEPTIONIST": return "bg-purple-100 text-purple-800 border-purple-200";
      default: return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const statCards = [
    {
      title: "Total Users",
      value: stats.totalUsers || 0,
      icon: <FaUsers className="text-3xl" />,
      color: "bg-gradient-to-br from-blue-500 to-blue-600",
      textColor: "text-blue-600",
      description: "All registered staff members"
    },
    {
      title: "Doctors",
      value: stats.totalDoctors || 0,
      icon: <FaUserMd className="text-3xl" />,
      color: "bg-gradient-to-br from-green-500 to-green-600",
      textColor: "text-green-600",
      description: "Medical professionals"
    },
    {
      title: "Pharmacists",
      value: stats.totalPharmacists || 0,
      icon: <FaPills className="text-3xl" />,
      color: "bg-gradient-to-br from-purple-500 to-purple-600",
      textColor: "text-purple-600",
      description: "Pharmacy staff"
    },
    {
      title: "Patients",
      value: stats.totalPatients || 0,
      icon: <FaHospital className="text-3xl" />,
      color: "bg-gradient-to-br from-orange-500 to-orange-600",
      textColor: "text-orange-600",
      description: "Registered patients"
    },
    {
      title: "Appointments",
      value: stats.totalAppointments || 0,
      icon: <FaCalendarAlt className="text-3xl" />,
      color: "bg-gradient-to-br from-pink-500 to-pink-600",
      textColor: "text-pink-600",
      description: "Scheduled appointments"
    },
    {
      title: "Medicines",
      value: stats.totalMedicines || 0,
      icon: <FaClipboardList className="text-3xl" />,
      color: "bg-gradient-to-br from-indigo-500 to-indigo-600",
      textColor: "text-indigo-600",
      description: "Available medicines"
    }
  ];

  if (loading) {
    return (
      <DashboardLayout userType="admin" title="Dashboard">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-16 w-16 border-4 border-indigo-600 border-t-transparent mx-auto"></div>
            <p className="mt-4 text-gray-700 text-lg font-semibold">Loading Your Dashboard...</p>
            <p className="mt-2 text-gray-500">Please wait while we prepare everything for you</p>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout userType="admin" title="Dashboard">
      {error && (
        <div className="mb-8 bg-red-50 border border-red-200 rounded-lg p-4">
          <div className="flex items-center">
            <FaExclamationTriangle className="text-red-500 text-xl mr-3" />
            <div>
              <h3 className="text-lg font-semibold text-red-800">Connection Error</h3>
              <p className="text-red-700">{error}</p>
            </div>
          </div>
        </div>
      )}

      <div className="mb-8">
        <h2 className="text-3xl font-bold text-gray-900 mb-2">Welcome back, Administrator!</h2>
        <p className="text-lg text-gray-600">Here's what's happening with your hospital today.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        {statCards.map((stat, index) => (
          <div key={index} className="bg-white rounded-lg border border-gray-200 p-6 hover:shadow-md transition-all duration-300 transform hover:-translate-y-1">
            <div className="flex items-center justify-between mb-4">
              <div className={`p-3 rounded-lg ${stat.color} text-white shadow-lg`}>
                {stat.icon}
              </div>
              <div className="text-right">
                <p className="text-3xl font-bold text-gray-900">{stat.value}</p>
                <p className="text-sm text-gray-500">{stat.description}</p>
              </div>
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">{stat.title}</h3>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div className={`h-2 rounded-full ${stat.color.replace('bg-gradient-to-br', 'bg')}`} style={{width: `${Math.min((stat.value / 10) * 100, 100)}%`}}></div>
            </div>
          </div>
        ))}
      </div>

      {/* Recent Staff and Appointments */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        {/* Recent Staff */}
        <div className="bg-white rounded-lg border border-gray-200 shadow-sm">
          <div className="px-6 py-4 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-xl font-bold text-gray-900">Recent Staff</h3>
                <p className="text-gray-600">Latest registered team members</p>
              </div>
              <button 
                onClick={() => router.push('/admin/staff')}
                className="text-indigo-600 hover:text-indigo-700 font-semibold text-base"
              >
                View All
              </button>
            </div>
          </div>
          <div className="p-6">
            {recentStaff.length > 0 ? (
              <div className="space-y-4">
                {recentStaff.map((staff) => (
                  <div key={staff.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                    <div className="flex items-center space-x-3">
                      <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                        {getRoleIcon(staff.role)}
                      </div>
                      <div>
                        <p className="font-bold text-gray-900 text-base">
                          {staff.firstName} {staff.lastName}
                        </p>
                        <p className="text-gray-600 text-sm">{staff.email}</p>
                        <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-semibold border ${getRoleColor(staff.role)}`}>
                          {staff.role}
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <button 
                        onClick={() => router.push(`/admin/staff/${staff.id}`)}
                        className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                        title="Edit Staff"
                      >
                        <FaEdit size={16} />
                      </button>
                      <button
                        onClick={() => handleDeleteStaff(staff.id)}
                        className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        title="Delete Staff"
                      >
                        <FaTrash size={16} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <FaUsers className="mx-auto h-12 w-12 text-gray-400 mb-3" />
                <p className="text-lg text-gray-600 font-semibold">No staff members found</p>
                <p className="text-gray-500">Add your first team member to get started</p>
              </div>
            )}
          </div>
        </div>

        {/* Recent Appointments */}
        <div className="bg-white rounded-lg border border-gray-200 shadow-sm">
          <div className="px-6 py-4 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-xl font-bold text-gray-900">Recent Appointments</h3>
                <p className="text-gray-600">Latest scheduled visits</p>
              </div>
              <button 
                onClick={() => router.push('/admin/appointments')}
                className="text-indigo-600 hover:text-indigo-700 font-semibold text-base"
              >
                View All
              </button>
            </div>
          </div>
          <div className="p-6">
            {appointments.length > 0 ? (
              <div className="space-y-4">
                {appointments.map((appointment) => (
                  <div key={appointment.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                    <div className="flex items-center space-x-3">
                      <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                        <FaCalendarAlt className="text-green-600 text-xl" />
                      </div>
                      <div>
                        <p className="font-bold text-gray-900 text-base">{appointment.patientName || 'Patient Name'}</p>
                        <p className="text-gray-600 text-sm">{appointment.doctorName || 'Doctor Name'}</p>
                        <div className="flex items-center space-x-2 mt-1">
                          <FaClock className="text-gray-400 text-sm" />
                          <span className="text-sm text-gray-600">
                            {appointment.appointmentDate || 'Date'} at {appointment.appointmentTime || 'Time'}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-semibold bg-blue-100 text-blue-800 border border-blue-200">
                        Scheduled
                      </span>
                      <button 
                        onClick={() => router.push(`/admin/appointments/${appointment.id}`)}
                        className="p-2 text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
                        title="View Appointment"
                      >
                        <FaEye size={16} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <FaCalendarAlt className="mx-auto h-12 w-12 text-gray-400 mb-3" />
                <p className="text-lg text-gray-600 font-semibold">No appointments found</p>
                <p className="text-gray-500">Schedule appointments to see them here</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-6">
        <h3 className="text-xl font-bold text-gray-900 mb-6">Quick Actions</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <button 
            onClick={() => handleQuickAction('add-staff')}
            className="flex flex-col items-center justify-center p-6 bg-blue-50 hover:bg-blue-100 rounded-lg transition-all duration-300 transform hover:-translate-y-1 hover:shadow-md border border-blue-200"
          >
            <FaPlus className="text-2xl text-blue-600 mb-2" />
            <span className="text-blue-600 font-bold text-base">Add Staff</span>
          </button>
          <button 
            onClick={() => handleQuickAction('add-patient')}
            className="flex flex-col items-center justify-center p-6 bg-green-50 hover:bg-green-100 rounded-lg transition-all duration-300 transform hover:-translate-y-1 hover:shadow-md border border-green-200"
          >
            <FaHospital className="text-2xl text-green-600 mb-2" />
            <span className="text-green-600 font-bold text-base">Add Patient</span>
          </button>
          <button 
            onClick={() => handleQuickAction('schedule-appointment')}
            className="flex flex-col items-center justify-center p-6 bg-purple-50 hover:bg-purple-100 rounded-lg transition-all duration-300 transform hover:-translate-y-1 hover:shadow-md border border-purple-200"
          >
            <FaCalendarAlt className="text-2xl text-purple-600 mb-2" />
            <span className="text-purple-600 font-bold text-base">Schedule Appointment</span>
          </button>
          <button 
            onClick={() => handleQuickAction('add-medicine')}
            className="flex flex-col items-center justify-center p-6 bg-orange-50 hover:bg-orange-100 rounded-lg transition-all duration-300 transform hover:-translate-y-1 hover:shadow-md border border-orange-200"
          >
            <FaPills className="text-2xl text-orange-600 mb-2" />
            <span className="text-orange-600 font-bold text-base">Add Medicine</span>
          </button>
        </div>
      </div>

      {/* Logout Confirmation Modal */}
      {showLogoutConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="fixed inset-0 bg-black bg-opacity-50" onClick={cancelLogout}></div>
          <div className="bg-white rounded-lg p-6 max-w-sm w-full mx-4 border border-gray-200 shadow-xl">
            <div className="flex items-center mb-4">
              <div className="flex-shrink-0">
                <FaExclamationTriangle className="h-6 w-6 text-red-600" />
              </div>
              <div className="ml-3">
                <h3 className="text-lg font-medium text-gray-900">Confirm Logout</h3>
              </div>
            </div>
            <div className="mb-6">
              <p className="text-sm text-gray-500">
                Are you sure you want to logout? You will need to sign in again to access your account.
              </p>
            </div>
            <div className="flex justify-end space-x-3">
              <button
                onClick={cancelLogout}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={confirmLogout}
                className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-md hover:bg-red-700 transition-colors"
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