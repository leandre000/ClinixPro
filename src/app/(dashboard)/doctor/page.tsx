"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { 
  FaUserMd, 
  FaStethoscope, 
  FaCalendarAlt, 
  FaClipboardList, 
  FaHospital,
  FaUserFriends,
  FaChartLine,
  FaBell,
  FaCog,
  FaSignOutAlt,
  FaUser,
  FaExclamationTriangle,
  FaCheckCircle,
  FaClock,
  FaPhone,
  FaEnvelope,
  FaMapMarkerAlt,
  FaTachometerAlt,
  FaPrescriptionBottle,
  FaClipboardCheck,
  FaChartBar,
  FaPlus,
  FaSearch,
  FaFilter,
  FaEdit,
  FaEye,
  FaTrash
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

export default function DoctorDashboard() {
  const router = useRouter();
  const [stats, setStats] = useState({});
  const [patients, setPatients] = useState([]);
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user") || "{}");
    if (!user.role || user.role !== "DOCTOR") {
      router.push("/login");
      return;
    }

    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        setError("");
        
        // Fetch doctor-specific data
        const patientsData = await DataService.getAllPatients();
        setPatients(patientsData.slice(0, 5));

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

  const statCards = [
    {
      title: "Today's Appointments",
      value: appointments.length || 0,
      icon: <FaCalendarAlt className="text-3xl" />,
      color: "bg-gradient-to-br from-blue-500 to-blue-600",
      textColor: "text-blue-600",
      description: "Scheduled for today"
    },
    {
      title: "Total Patients",
      value: patients.length || 0,
      icon: <FaUserFriends className="text-3xl" />,
      color: "bg-gradient-to-br from-green-500 to-green-600",
      textColor: "text-green-600",
      description: "Under your care"
    },
    {
      title: "Pending Reports",
      value: "3",
      icon: <FaClipboardList className="text-3xl" />,
      color: "bg-gradient-to-br from-orange-500 to-orange-600",
      textColor: "text-orange-600",
      description: "Awaiting review"
    },
    {
      title: "Available Medicines",
      value: "150+",
      icon: <FaPrescriptionBottle className="text-3xl" />,
      color: "bg-gradient-to-br from-purple-500 to-purple-600",
      textColor: "text-purple-600",
      description: "In pharmacy"
    }
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-20 w-20 border-4 border-green-600 border-t-transparent mx-auto"></div>
          <p className="mt-6 text-gray-700 text-xl font-semibold">Loading Your Dashboard...</p>
          <p className="mt-2 text-gray-500 text-lg">Please wait while we prepare everything for you</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100">
      {/* Header */}
      <header className="bg-white shadow-lg border-b-4 border-green-600">
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
                <FaUserMd className="h-12 w-12 text-green-600" />
              </div>
              <div className="ml-4">
                <h1 className="text-2xl font-bold text-gray-900">Doctor Portal</h1>
                <p className="text-sm text-gray-600">Patient Care Management</p>
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
              <h2 className="text-xl font-bold text-gray-900">Doctor Panel</h2>
              <p className="text-gray-600">Patient care & management</p>
            </div>
            <nav className="flex-1 px-6 py-8 space-y-3">
              <a href="#" className="flex items-center px-4 py-3 text-lg font-semibold text-green-600 bg-green-50 rounded-xl border-2 border-green-200">
                <MdDashboard className="mr-4 text-2xl" />
                Dashboard
              </a>
              <a href="#" className="flex items-center px-4 py-3 text-lg font-semibold text-gray-700 hover:text-gray-900 hover:bg-gray-100 rounded-xl transition-colors">
                <MdPeople className="mr-4 text-2xl" />
                My Patients
              </a>
              <a href="#" className="flex items-center px-4 py-3 text-lg font-semibold text-gray-700 hover:text-gray-900 hover:bg-gray-100 rounded-xl transition-colors">
                <MdEvent className="mr-4 text-2xl" />
                Appointments
              </a>
              <a href="#" className="flex items-center px-4 py-3 text-lg font-semibold text-gray-700 hover:text-gray-900 hover:bg-gray-100 rounded-xl transition-colors">
                <MdMedicalServices className="mr-4 text-2xl" />
                Medical Records
              </a>
              <a href="#" className="flex items-center px-4 py-3 text-lg font-semibold text-gray-700 hover:text-gray-900 hover:bg-gray-100 rounded-xl transition-colors">
                <MdMedication className="mr-4 text-2xl" />
                Prescriptions
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
              <h2 className="text-4xl font-bold text-gray-900 mb-3">Welcome, Doctor!</h2>
              <p className="text-xl text-gray-600">Manage your patients and appointments efficiently.</p>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-10">
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
                    <div className={`h-2 rounded-full ${stat.color.replace('bg-gradient-to-br', 'bg')}`} style={{width: `${Math.min((parseInt(stat.value) / 10) * 100, 100)}%`}}></div>
                  </div>
                </div>
              ))}
            </div>

            {/* Patients and Appointments */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
              {/* My Patients */}
              <div className="bg-white rounded-2xl shadow-lg border border-gray-200">
                <div className="px-8 py-6 border-b-2 border-gray-200">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-2xl font-bold text-gray-900">My Patients</h3>
                      <p className="text-gray-600">Patients under your care</p>
                    </div>
                    <button className="text-green-600 hover:text-green-700 text-lg font-semibold">
                      View All
                    </button>
                  </div>
                </div>
                <div className="p-8">
                  {patients.length > 0 ? (
                    <div className="space-y-6">
                      {patients.map((patient) => (
                        <div key={patient.id} className="flex items-center justify-between p-6 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors duration-200">
                          <div className="flex items-center space-x-4">
                            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
                              <FaUser className="text-green-600 text-2xl" />
                            </div>
                            <div>
                              <p className="text-xl font-bold text-gray-900">
                                {patient.firstName} {patient.lastName}
                              </p>
                              <p className="text-lg text-gray-600">Patient ID: {patient.patientId}</p>
                              <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-semibold border-2 bg-green-100 text-green-800 border-green-200">
                                Active
                              </span>
                            </div>
                          </div>
                          <div className="flex items-center space-x-3">
                            <button className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-200 rounded-lg transition-colors">
                              <FaEye size={18} />
                            </button>
                            <button className="p-2 text-gray-400 hover:text-green-600 hover:bg-green-50 rounded-lg transition-colors">
                              <FaEdit size={18} />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-12">
                      <FaUserFriends className="mx-auto h-16 w-16 text-gray-400 mb-4" />
                      <p className="text-xl text-gray-600 font-semibold">No patients assigned</p>
                      <p className="text-gray-500">Patients will appear here when assigned to you</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Today's Appointments */}
              <div className="bg-white rounded-2xl shadow-lg border border-gray-200">
                <div className="px-8 py-6 border-b-2 border-gray-200">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-2xl font-bold text-gray-900">Today's Appointments</h3>
                      <p className="text-gray-600">Your scheduled visits</p>
                    </div>
                    <button className="text-green-600 hover:text-green-700 text-lg font-semibold">
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
                            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center">
                              <FaCalendarAlt className="text-blue-600 text-2xl" />
                            </div>
                            <div>
                              <p className="text-xl font-bold text-gray-900">{appointment.patientName || 'Patient Name'}</p>
                              <p className="text-lg text-gray-600">Appointment #{appointment.id}</p>
                              <div className="flex items-center space-x-2 mt-2">
                                <FaClock className="text-gray-400" />
                                <span className="text-gray-600">
                                  {appointment.appointmentTime || '10:00 AM'}
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
                      <p className="text-xl text-gray-600 font-semibold">No appointments today</p>
                      <p className="text-gray-500">Your schedule is clear for today</p>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="mt-12 bg-white rounded-2xl shadow-lg border border-gray-200 p-8">
              <h3 className="text-2xl font-bold text-gray-900 mb-6">Quick Actions</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                <button className="flex flex-col items-center justify-center p-6 bg-green-50 hover:bg-green-100 rounded-xl transition-all duration-300 transform hover:-translate-y-1 hover:shadow-lg">
                  <FaUserFriends className="text-3xl text-green-600 mb-3" />
                  <span className="text-green-600 font-bold text-lg">View Patients</span>
                </button>
                <button className="flex flex-col items-center justify-center p-6 bg-blue-50 hover:bg-blue-100 rounded-xl transition-all duration-300 transform hover:-translate-y-1 hover:shadow-lg">
                  <FaCalendarAlt className="text-3xl text-blue-600 mb-3" />
                  <span className="text-blue-600 font-bold text-lg">Schedule Visit</span>
                </button>
                <button className="flex flex-col items-center justify-center p-6 bg-purple-50 hover:bg-purple-100 rounded-xl transition-all duration-300 transform hover:-translate-y-1 hover:shadow-lg">
                  <FaPrescriptionBottle className="text-3xl text-purple-600 mb-3" />
                  <span className="text-purple-600 font-bold text-lg">Write Prescription</span>
                </button>
                <button className="flex flex-col items-center justify-center p-6 bg-orange-50 hover:bg-orange-100 rounded-xl transition-all duration-300 transform hover:-translate-y-1 hover:shadow-lg">
                  <FaClipboardList className="text-3xl text-orange-600 mb-3" />
                  <span className="text-orange-600 font-bold text-lg">Medical Records</span>
                </button>
              </div>
            </div>
          </main>
        </div>
      </div>
    </div>
  );
} 