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
  FaMapMarkerAlt
} from "react-icons/fa";
import { 
  MdDashboard, 
  MdPeople, 
  MdLocalHospital, 
  MdPharmacy,
  MdReceipt,
  MdSettings,
  MdNotifications,
  MdMenu,
  MdClose
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
      case "ADMIN": return <FaShieldAlt className="text-red-500" />;
      case "DOCTOR": return <FaUserMd className="text-blue-500" />;
      case "PHARMACIST": return <FaPills className="text-green-500" />;
      case "RECEPTIONIST": return <FaUserNurse className="text-purple-500" />;
      default: return <FaUser className="text-gray-500" />;
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
      icon: <FaUsers className="text-2xl" />,
      color: "bg-gradient-to-r from-blue-500 to-blue-600",
      textColor: "text-blue-600"
    },
    {
      title: "Doctors",
      value: stats.totalDoctors || 0,
      icon: <FaUserMd className="text-2xl" />,
      color: "bg-gradient-to-r from-green-500 to-green-600",
      textColor: "text-green-600"
    },
    {
      title: "Pharmacists",
      value: stats.totalPharmacists || 0,
      icon: <FaPills className="text-2xl" />,
      color: "bg-gradient-to-r from-purple-500 to-purple-600",
      textColor: "text-purple-600"
    },
    {
      title: "Patients",
      value: stats.totalPatients || 0,
      icon: <FaHospital className="text-2xl" />,
      color: "bg-gradient-to-r from-orange-500 to-orange-600",
      textColor: "text-orange-600"
    },
    {
      title: "Appointments",
      value: stats.totalAppointments || 0,
      icon: <FaCalendarAlt className="text-2xl" />,
      color: "bg-gradient-to-r from-pink-500 to-pink-600",
      textColor: "text-pink-600"
    },
    {
      title: "Medicines",
      value: stats.totalMedicines || 0,
      icon: <FaClipboardList className="text-2xl" />,
      color: "bg-gradient-to-r from-indigo-500 to-indigo-600",
      textColor: "text-indigo-600"
    }
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600 text-lg font-medium">Loading Dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="lg:hidden p-2 rounded-md text-gray-600 hover:text-gray-900 hover:bg-gray-100"
            >
              {sidebarOpen ? <MdClose size={24} /> : <MdMenu size={24} />}
            </button>

            <div className="flex items-center">
              <div className="flex-shrink-0">
                <FaHospital className="h-8 w-8 text-blue-600" />
              </div>
              <h1 className="ml-3 text-xl font-semibold text-gray-900">ClinixPro Admin</h1>
            </div>

            <div className="flex items-center space-x-4">
              <button className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-full">
                <FaBell size={20} />
              </button>
              <button className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-full">
                <FaCog size={20} />
              </button>
              <button
                onClick={handleLogout}
                className="flex items-center px-3 py-2 text-sm font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-100 rounded-md"
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
        <div className={`fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-lg transform ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0 lg:static lg:inset-0 transition duration-200 ease-in-out`}>
          <div className="h-full flex flex-col">
            <nav className="flex-1 px-4 py-6 space-y-2">
              <a href="#" className="flex items-center px-3 py-2 text-sm font-medium text-blue-600 bg-blue-50 rounded-md">
                <MdDashboard className="mr-3" />
                Dashboard
              </a>
              <a href="#" className="flex items-center px-3 py-2 text-sm font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-100 rounded-md">
                <MdPeople className="mr-3" />
                Staff Management
              </a>
              <a href="#" className="flex items-center px-3 py-2 text-sm font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-100 rounded-md">
                <MdLocalHospital className="mr-3" />
                Patients
              </a>
              <a href="#" className="flex items-center px-3 py-2 text-sm font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-100 rounded-md">
                <MdPharmacy className="mr-3" />
                Pharmacy
              </a>
              <a href="#" className="flex items-center px-3 py-2 text-sm font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-100 rounded-md">
                <MdReceipt className="mr-3" />
                Appointments
              </a>
              <a href="#" className="flex items-center px-3 py-2 text-sm font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-100 rounded-md">
                <FaChartLine className="mr-3" />
                Reports
              </a>
              <a href="#" className="flex items-center px-3 py-2 text-sm font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-100 rounded-md">
                <MdSettings className="mr-3" />
                Settings
              </a>
            </nav>
          </div>
        </div>

        {/* Main content */}
        <div className="flex-1 lg:ml-0">
          <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            {error && (
              <div className="mb-6 bg-red-50 border border-red-200 rounded-lg p-4">
                <div className="flex">
                  <FaExclamationTriangle className="text-red-400 mt-0.5 mr-3" />
                  <p className="text-red-700">{error}</p>
                </div>
              </div>
            )}

            <div className="mb-8">
              <h2 className="text-3xl font-bold text-gray-900 mb-2">Welcome back, Admin!</h2>
              <p className="text-gray-600">Here's what's happening with your hospital today.</p>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
              {statCards.map((stat, index) => (
                <div key={index} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow duration-200">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600 mb-1">{stat.title}</p>
                      <p className="text-3xl font-bold text-gray-900">{stat.value}</p>
                    </div>
                    <div className={`p-3 rounded-lg ${stat.color} text-white`}>
                      {stat.icon}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Recent Staff and Appointments */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Recent Staff */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-200">
                <div className="px-6 py-4 border-b border-gray-200">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-semibold text-gray-900">Recent Staff</h3>
                    <button className="text-blue-600 hover:text-blue-700 text-sm font-medium">
                      View All
                    </button>
                  </div>
                </div>
                <div className="p-6">
                  {recentStaff.length > 0 ? (
                    <div className="space-y-4">
                      {recentStaff.map((staff) => (
                        <div key={staff.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors duration-200">
                          <div className="flex items-center space-x-3">
                            <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                              {getRoleIcon(staff.role)}
                            </div>
                            <div>
                              <p className="font-medium text-gray-900">
                                {staff.firstName} {staff.lastName}
                              </p>
                              <p className="text-sm text-gray-600">{staff.email}</p>
                              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getRoleColor(staff.role)}`}>
                                {staff.role}
                              </span>
                            </div>
                          </div>
                          <div className="flex items-center space-x-2">
                            <button className="p-1 text-gray-400 hover:text-gray-600">
                              <FaEdit size={14} />
                            </button>
                            <button
                              onClick={() => handleDeleteStaff(staff.id)}
                              className="p-1 text-gray-400 hover:text-red-600"
                            >
                              <FaTrash size={14} />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <FaUsers className="mx-auto h-12 w-12 text-gray-400" />
                      <p className="mt-2 text-gray-600">No staff members found</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Recent Appointments */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-200">
                <div className="px-6 py-4 border-b border-gray-200">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-semibold text-gray-900">Recent Appointments</h3>
                    <button className="text-blue-600 hover:text-blue-700 text-sm font-medium">
                      View All
                    </button>
                  </div>
                </div>
                <div className="p-6">
                  {appointments.length > 0 ? (
                    <div className="space-y-4">
                      {appointments.map((appointment) => (
                        <div key={appointment.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors duration-200">
                          <div className="flex items-center space-x-3">
                            <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                              <FaCalendarAlt className="text-green-600" />
                            </div>
                            <div>
                              <p className="font-medium text-gray-900">{appointment.patientName || 'Patient Name'}</p>
                              <p className="text-sm text-gray-600">{appointment.doctorName || 'Doctor Name'}</p>
                              <div className="flex items-center space-x-2 mt-1">
                                <FaClock className="text-gray-400 text-xs" />
                                <span className="text-xs text-gray-600">
                                  {appointment.appointmentDate || 'Date'} at {appointment.appointmentTime || 'Time'}
                                </span>
                              </div>
                            </div>
                          </div>
                          <div className="flex items-center space-x-2">
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                              Scheduled
                            </span>
                            <button className="p-1 text-gray-400 hover:text-gray-600">
                              <FaEye size={14} />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <FaCalendarAlt className="mx-auto h-12 w-12 text-gray-400" />
                      <p className="mt-2 text-gray-600">No appointments found</p>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="mt-8 bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <button className="flex items-center justify-center p-4 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors duration-200">
                  <FaPlus className="mr-2 text-blue-600" />
                  <span className="text-blue-600 font-medium">Add Staff</span>
                </button>
                <button className="flex items-center justify-center p-4 bg-green-50 hover:bg-green-100 rounded-lg transition-colors duration-200">
                  <FaHospital className="mr-2 text-green-600" />
                  <span className="text-green-600 font-medium">Add Patient</span>
                </button>
                <button className="flex items-center justify-center p-4 bg-purple-50 hover:bg-purple-100 rounded-lg transition-colors duration-200">
                  <FaCalendarAlt className="mr-2 text-purple-600" />
                  <span className="text-purple-600 font-medium">Schedule Appointment</span>
                </button>
                <button className="flex items-center justify-center p-4 bg-orange-50 hover:bg-orange-100 rounded-lg transition-colors duration-200">
                  <FaPills className="mr-2 text-orange-600" />
                  <span className="text-orange-600 font-medium">Add Medicine</span>
                </button>
              </div>
            </div>
          </main>
        </div>
      </div>
    </div>
  );
} 