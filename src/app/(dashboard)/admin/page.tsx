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
import DataService from "@/services/data.service";
import AdminService from "@/services/admin.service";

export default function AdminDashboard() {
  const router = useRouter();
  const [stats, setStats] = useState({});
  const [recentStaff, setRecentStaff] = useState([]);
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [sidebarOpen, setSidebarOpen] = useState(false);

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
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    router.push("/login");
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
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-20 w-20 border-4 border-blue-600 border-t-transparent mx-auto"></div>
          <p className="mt-6 text-gray-700 text-xl font-semibold">Loading Your Dashboard...</p>
          <p className="mt-2 text-gray-500 text-lg">Please wait while we prepare everything for you</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header */}
      <header className="bg-white shadow-lg border-b-4 border-blue-600">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="lg:hidden p-3 rounded-lg text-gray-600 hover:text-gray-900 hover:bg-gray-100 transition-colors"
            >
              {sidebarOpen ? <MdClose size={28} /> : <MdMenu size={28} />}
            </button>

            <div className="flex items-center">
              <div className="flex-shrink-0">
                <FaHospital className="h-12 w-12 text-blue-600" />
              </div>
              <div className="ml-4">
                <h1 className="text-2xl font-bold text-gray-900">ClinixPro</h1>
                <p className="text-sm text-gray-600">Hospital Management System</p>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <button className="p-3 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-full transition-colors">
                <FaBell size={24} />
              </button>
              <button className="p-3 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-full transition-colors">
                <FaCog size={24} />
              </button>
              <button
                onClick={handleLogout}
                className="flex items-center px-4 py-2 text-lg font-semibold text-white bg-red-600 hover:bg-red-700 rounded-lg transition-colors"
              >
                <FaSignOutAlt className="mr-2" />
                Logout
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="flex">
        {/* Sidebar */}
        <div className={`fixed inset-y-0 left-0 z-50 w-72 bg-white shadow-xl transform ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0 lg:static lg:inset-0 transition duration-300 ease-in-out`}>
          <div className="h-full flex flex-col">
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-xl font-bold text-gray-900">Admin Panel</h2>
              <p className="text-gray-600">Manage your hospital</p>
            </div>
            <nav className="flex-1 px-6 py-8 space-y-3">
              <a href="#" className="flex items-center px-4 py-3 text-lg font-semibold text-blue-600 bg-blue-50 rounded-xl border-2 border-blue-200">
                <MdDashboard className="mr-4 text-2xl" />
                Dashboard
              </a>
              <a href="#" className="flex items-center px-4 py-3 text-lg font-semibold text-gray-700 hover:text-gray-900 hover:bg-gray-100 rounded-xl transition-colors">
                <MdPeople className="mr-4 text-2xl" />
                Staff Management
              </a>
              <a href="#" className="flex items-center px-4 py-3 text-lg font-semibold text-gray-700 hover:text-gray-900 hover:bg-gray-100 rounded-xl transition-colors">
                <MdLocalHospital className="mr-4 text-2xl" />
                Patients
              </a>
              <a href="#" className="flex items-center px-4 py-3 text-lg font-semibold text-gray-700 hover:text-gray-900 hover:bg-gray-100 rounded-xl transition-colors">
                <MdLocalPharmacy className="mr-4 text-2xl" />
                Pharmacy
              </a>
              <a href="#" className="flex items-center px-4 py-3 text-lg font-semibold text-gray-700 hover:text-gray-900 hover:bg-gray-100 rounded-xl transition-colors">
                <MdEvent className="mr-4 text-2xl" />
                Appointments
              </a>
              <a href="#" className="flex items-center px-4 py-3 text-lg font-semibold text-gray-700 hover:text-gray-900 hover:bg-gray-100 rounded-xl transition-colors">
                <MdAssessment className="mr-4 text-2xl" />
                Reports
              </a>
              <a href="#" className="flex items-center px-4 py-3 text-lg font-semibold text-gray-700 hover:text-gray-900 hover:bg-gray-100 rounded-xl transition-colors">
                <MdSettings className="mr-4 text-2xl" />
                Settings
              </a>
            </nav>
          </div>
        </div>

        {/* Main content */}
        <div className="flex-1 lg:ml-0">
          <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            {error && (
              <div className="mb-8 bg-red-50 border-2 border-red-200 rounded-xl p-6">
                <div className="flex items-center">
                  <FaExclamationTriangle className="text-red-500 text-2xl mr-4" />
                  <div>
                    <h3 className="text-lg font-semibold text-red-800">Connection Error</h3>
                    <p className="text-red-700">{error}</p>
                  </div>
                </div>
              </div>
            )}

            <div className="mb-10">
              <h2 className="text-4xl font-bold text-gray-900 mb-3">Welcome back, Administrator!</h2>
              <p className="text-xl text-gray-600">Here's what's happening with your hospital today.</p>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-10">
              {statCards.map((stat, index) => (
                <div key={index} className="bg-white rounded-2xl shadow-lg border border-gray-200 p-8 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
                  <div className="flex items-center justify-between mb-4">
                    <div className={`p-4 rounded-xl ${stat.color} text-white shadow-lg`}>
                      {stat.icon}
                    </div>
                    <div className="text-right">
                      <p className="text-4xl font-bold text-gray-900">{stat.value}</p>
                      <p className="text-sm text-gray-500">{stat.description}</p>
                    </div>
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">{stat.title}</h3>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div className={`h-2 rounded-full ${stat.color.replace('bg-gradient-to-br', 'bg')}`} style={{width: `${Math.min((stat.value / 10) * 100, 100)}%`}}></div>
                  </div>
                </div>
              ))}
            </div>

            {/* Recent Staff and Appointments */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
              {/* Recent Staff */}
              <div className="bg-white rounded-2xl shadow-lg border border-gray-200">
                <div className="px-8 py-6 border-b-2 border-gray-200">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-2xl font-bold text-gray-900">Recent Staff</h3>
                      <p className="text-gray-600">Latest registered team members</p>
                    </div>
                    <button className="text-blue-600 hover:text-blue-700 text-lg font-semibold">
                      View All
                    </button>
                  </div>
                </div>
                <div className="p-8">
                  {recentStaff.length > 0 ? (
                    <div className="space-y-6">
                      {recentStaff.map((staff) => (
                        <div key={staff.id} className="flex items-center justify-between p-6 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors duration-200">
                          <div className="flex items-center space-x-4">
                            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center">
                              {getRoleIcon(staff.role)}
                            </div>
                            <div>
                              <p className="text-xl font-bold text-gray-900">
                                {staff.firstName} {staff.lastName}
                              </p>
                              <p className="text-lg text-gray-600">{staff.email}</p>
                              <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-semibold border-2 ${getRoleColor(staff.role)}`}>
                                {staff.role}
                              </span>
                            </div>
                          </div>
                          <div className="flex items-center space-x-3">
                            <button className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-200 rounded-lg transition-colors">
                              <FaEdit size={18} />
                            </button>
                            <button
                              onClick={() => handleDeleteStaff(staff.id)}
                              className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                            >
                              <FaTrash size={18} />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-12">
                      <FaUsers className="mx-auto h-16 w-16 text-gray-400 mb-4" />
                      <p className="text-xl text-gray-600 font-semibold">No staff members found</p>
                      <p className="text-gray-500">Add your first team member to get started</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Recent Appointments */}
              <div className="bg-white rounded-2xl shadow-lg border border-gray-200">
                <div className="px-8 py-6 border-b-2 border-gray-200">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-2xl font-bold text-gray-900">Recent Appointments</h3>
                      <p className="text-gray-600">Latest scheduled visits</p>
                    </div>
                    <button className="text-blue-600 hover:text-blue-700 text-lg font-semibold">
                      View All
                    </button>
                  </div>
                </div>
                <div className="p-8">
                  {appointments.length > 0 ? (
                    <div className="space-y-6">
                      {appointments.map((appointment) => (
                        <div key={appointment.id} className="flex items-center justify-between p-6 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors duration-200">
                          <div className="flex items-center space-x-4">
                            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
                              <FaCalendarAlt className="text-green-600 text-2xl" />
                            </div>
                            <div>
                              <p className="text-xl font-bold text-gray-900">{appointment.patientName || 'Patient Name'}</p>
                              <p className="text-lg text-gray-600">{appointment.doctorName || 'Doctor Name'}</p>
                              <div className="flex items-center space-x-2 mt-2">
                                <FaClock className="text-gray-400" />
                                <span className="text-gray-600">
                                  {appointment.appointmentDate || 'Date'} at {appointment.appointmentTime || 'Time'}
                                </span>
                              </div>
                            </div>
                          </div>
                          <div className="flex items-center space-x-3">
                            <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-semibold bg-blue-100 text-blue-800 border-2 border-blue-200">
                              Scheduled
                            </span>
                            <button className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-200 rounded-lg transition-colors">
                              <FaEye size={18} />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-12">
                      <FaCalendarAlt className="mx-auto h-16 w-16 text-gray-400 mb-4" />
                      <p className="text-xl text-gray-600 font-semibold">No appointments found</p>
                      <p className="text-gray-500">Schedule appointments to see them here</p>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="mt-12 bg-white rounded-2xl shadow-lg border border-gray-200 p-8">
              <h3 className="text-2xl font-bold text-gray-900 mb-6">Quick Actions</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                <button className="flex flex-col items-center justify-center p-6 bg-blue-50 hover:bg-blue-100 rounded-xl transition-all duration-300 transform hover:-translate-y-1 hover:shadow-lg">
                  <FaPlus className="text-3xl text-blue-600 mb-3" />
                  <span className="text-blue-600 font-bold text-lg">Add Staff</span>
                </button>
                <button className="flex flex-col items-center justify-center p-6 bg-green-50 hover:bg-green-100 rounded-xl transition-all duration-300 transform hover:-translate-y-1 hover:shadow-lg">
                  <FaHospital className="text-3xl text-green-600 mb-3" />
                  <span className="text-green-600 font-bold text-lg">Add Patient</span>
                </button>
                <button className="flex flex-col items-center justify-center p-6 bg-purple-50 hover:bg-purple-100 rounded-xl transition-all duration-300 transform hover:-translate-y-1 hover:shadow-lg">
                  <FaCalendarAlt className="text-3xl text-purple-600 mb-3" />
                  <span className="text-purple-600 font-bold text-lg">Schedule Appointment</span>
                </button>
                <button className="flex flex-col items-center justify-center p-6 bg-orange-50 hover:bg-orange-100 rounded-xl transition-all duration-300 transform hover:-translate-y-1 hover:shadow-lg">
                  <FaPills className="text-3xl text-orange-600 mb-3" />
                  <span className="text-orange-600 font-bold text-lg">Add Medicine</span>
                </button>
              </div>
            </div>
          </main>
        </div>
      </div>
    </div>
  );
} 
} 