"use client";

import DashboardLayout from "@/components/DashboardLayout";
import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import AdminService from "@/services/admin.service";
import { 
  FaSearch, 
  FaFilter, 
  FaPlus, 
  FaEye, 
  FaEdit, 
  FaHistory,
  FaUser,
  FaPhone,
  FaEnvelope,
  FaCalendar,
  FaVenusMars,
  FaTint,
  FaUserMd,
  FaCheckCircle,
  FaTimesCircle,
  FaExclamationTriangle,
  FaPrint,
  FaDownload,
  FaRedo,
  FaTrash,
  FaUserPlus,
  FaUserEdit,
  FaUserCheck,
  FaUserTimes,
  FaUserClock,
  FaUserInjured,
  FaUserFriends,
  FaUserGraduate,
  FaUserNurse,
  FaUserTie,
  FaUserShield,
  FaUserSecret,
  FaUserLock,
  FaUserUnlock,
  FaUserMinus,
  FaUserCog,
  FaUserEditIcon,
  FaUserPlusIcon,
  FaUserMinusIcon,
  FaUserCheckIcon,
  FaUserTimesIcon,
  FaUserLockIcon,
  FaUserUnlockIcon,
  FaUserShieldIcon,
  FaUserSecretIcon,
  FaUserTieIcon,
  FaUserGraduateIcon,
  FaUserNurseIcon,
  FaUserInjuredIcon,
  FaUserFriendsIcon,
  FaUserClockIcon,
  FaUserCogIcon
} from "react-icons/fa";
import ConfirmationModal from "@/components/ConfirmationModal";

export default function PatientsPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [ageFilter, setAgeFilter] = useState("all");
  const [genderFilter, setGenderFilter] = useState("all");
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  
  // Calculate age from date of birth
  const calculateAge = (dateOfBirth) => {
    if (!dateOfBirth) return "N/A";
    const dob = new Date(dateOfBirth);
    const today = new Date();
    let age = today.getFullYear() - dob.getFullYear();
    const monthDiff = today.getMonth() - dob.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < dob.getDate())) {
      age--;
    }
    return age;
  };
  
  useEffect(() => {
    const fetchPatients = async () => {
      try {
        setLoading(true);
        setError("");
        
        const response = await AdminService.getPatients();
        
        // Transform the patients data to match the expected structure
        const formattedPatients = response.map(patient => ({
          id: patient.patientId || patient.id,
          name: `${patient.firstName} ${patient.lastName}`,
          email: patient.email || "N/A",
          phone: patient.phoneNumber || "N/A",
          age: calculateAge(patient.dateOfBirth),
          gender: patient.gender || "N/A",
          bloodGroup: patient.bloodGroup || "N/A",
          lastVisit: patient.lastVisitDate ? new Date(patient.lastVisitDate).toISOString().split('T')[0] : "Never",
          status: patient.status || "Active",
          doctor: patient.doctorName || "Not assigned",
          dateOfBirth: patient.dateOfBirth,
          // Original patient data for reference
          originalPatient: patient
        }));
        
        setPatients(formattedPatients);
      } catch (error) {
        console.error("Error fetching patients:", error);
        setError("Failed to load patients. Please try again.");
        setPatients([]);
      } finally {
        setLoading(false);
      }
    };

    // Fetch patients on initial load or when refresh parameter changes
    const refreshParam = searchParams.get('refresh');
    fetchPatients();
  }, [searchParams]);

  // Filter age ranges
  const getAgeFilter = (patient) => {
    if (ageFilter === "all") return true;
    const age = patient.age;
    if (typeof age !== 'number') return false;
    
    if (ageFilter === "0-18") return age >= 0 && age <= 18;
    if (ageFilter === "19-35") return age >= 19 && age <= 35;
    if (ageFilter === "36-50") return age >= 36 && age <= 50;
    if (ageFilter === "51-65") return age >= 51 && age <= 65;
    if (ageFilter === "65+") return age > 65;
    
    return true;
  };

  const filteredPatients = patients
    .filter(patient => 
      (statusFilter === "all" || patient.status === statusFilter) &&
      (genderFilter === "all" || patient.gender === genderFilter) &&
      getAgeFilter(patient) &&
      (searchQuery === "" || 
       patient.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
       patient.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
       patient.id.toString().toLowerCase().includes(searchQuery.toLowerCase()))
    );

  const handleViewPatient = (patient) => {
    router.push(`/admin/patients/${patient.id}`);
  };

  const handleEditPatient = (patient) => {
    router.push(`/admin/patients/${patient.id}/edit`);
  };

  const handleViewHistory = (patient) => {
    router.push(`/admin/patients/${patient.id}/history`);
  };

  const handleAddRecord = (patient) => {
    router.push(`/admin/patients/${patient.id}/add-record`);
  };

  const handleDeletePatient = (patient) => {
    setSelectedPatient(patient);
    setShowDeleteConfirm(true);
  };

  const confirmDeletePatient = async () => {
    if (!selectedPatient) return;
    
    try {
      await AdminService.deletePatient(selectedPatient.id);
      
      // Remove from local state
      setPatients(prev => prev.filter(p => p.id !== selectedPatient.id));
      
      setSelectedPatient(null);
    } catch (error) {
      console.error("Error deleting patient:", error);
      setError("Failed to delete patient. Please try again.");
    }
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
  const currentPatients = filteredPatients.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredPatients.length / itemsPerPage);

  if (loading) {
    return (
      <DashboardLayout userType="admin" title="Patients Management">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-16 w-16 border-4 border-indigo-600 border-t-transparent mx-auto"></div>
            <p className="mt-4 text-gray-900 text-xl font-bold">Loading Patients...</p>
            <p className="mt-2 text-gray-600 text-lg">Please wait while we fetch your data</p>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout userType="admin" title="Patients Management">
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-gray-900 mb-3">Patients Directory</h1>
        <p className="text-xl text-gray-600">Manage and track all patient information</p>
      </div>

      {error && (
        <div className="bg-red-100 border-2 border-red-400 text-red-700 px-6 py-4 rounded-lg relative mb-6">
          <span className="block text-lg font-semibold">{error}</span>
        </div>
      )}
      
      {/* Search and Filter Section */}
      <div className="bg-white rounded-xl border-2 border-gray-200 shadow-lg p-6 mb-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4">
          {/* Search */}
          <div className="lg:col-span-2">
            <label className="block text-lg font-bold text-gray-900 mb-2">
              <FaSearch className="inline mr-2 text-indigo-600" />
              Search Patients
            </label>
            <div className="relative">
              <input
                type="text"
                placeholder="Search by name, email, or ID..."
                className="w-full px-4 py-3 text-lg border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-gray-900 placeholder-gray-500"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <FaSearch className="absolute right-3 top-4 h-5 w-5 text-gray-400" />
            </div>
          </div>

          {/* Age Filter */}
          <div>
            <label className="block text-lg font-bold text-gray-900 mb-2">
              <FaUser className="inline mr-2 text-indigo-600" />
              Age Range
            </label>
              <select
              className="w-full px-4 py-3 text-lg border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-gray-900 bg-white"
                value={ageFilter}
                onChange={(e) => setAgeFilter(e.target.value)}
              >
                <option value="all">All Ages</option>
                <option value="0-18">0-18 years</option>
                <option value="19-35">19-35 years</option>
                <option value="36-50">36-50 years</option>
                <option value="51-65">51-65 years</option>
                <option value="65+">65+ years</option>
              </select>
          </div>

          {/* Gender Filter */}
          <div>
            <label className="block text-lg font-bold text-gray-900 mb-2">
              <FaVenusMars className="inline mr-2 text-indigo-600" />
              Gender
            </label>
            <select
              className="w-full px-4 py-3 text-lg border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-gray-900 bg-white"
              value={genderFilter}
              onChange={(e) => setGenderFilter(e.target.value)}
            >
              <option value="all">All Genders</option>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
            </select>
          </div>

          {/* Status Filter */}
          <div>
            <label className="block text-lg font-bold text-gray-900 mb-2">
              <FaFilter className="inline mr-2 text-indigo-600" />
              Status
            </label>
              <select
              className="w-full px-4 py-3 text-lg border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-gray-900 bg-white"
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
              >
                <option value="all">All Status</option>
                <option value="Active">Active</option>
                <option value="Inactive">Inactive</option>
              <option value="Discharged">Discharged</option>
              </select>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-between items-center mt-6 pt-6 border-t-2 border-gray-200">
          <div className="flex space-x-4">
            <button
                onClick={() => router.push('/admin/patients/register')}
              className="flex items-center px-6 py-3 bg-indigo-600 text-white text-lg font-bold rounded-lg hover:bg-indigo-700 transition-colors shadow-lg"
              >
              <FaUserPlus className="mr-2" />
                Register New Patient
            </button>
            <button
              onClick={() => window.print()}
              className="flex items-center px-6 py-3 bg-green-600 text-white text-lg font-bold rounded-lg hover:bg-green-700 transition-colors shadow-lg"
            >
              <FaPrint className="mr-2" />
              Print Directory
            </button>
            <button
              onClick={() => window.location.reload()}
              className="flex items-center px-6 py-3 bg-blue-600 text-white text-lg font-bold rounded-lg hover:bg-blue-700 transition-colors shadow-lg"
            >
                              <FaRedo className="mr-2" />
              Refresh Data
            </button>
          </div>
          <div className="text-lg font-bold text-gray-700">
            Total: {filteredPatients.length} patients
            </div>
          </div>
        </div>
        
      {/* Patients Table */}
      <div className="bg-white rounded-xl border-2 border-gray-200 shadow-lg overflow-hidden">
            <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b-2 border-gray-200">
              <tr>
                <th className="px-6 py-4 text-left text-lg font-bold text-gray-900">PATIENT ID</th>
                <th className="px-6 py-4 text-left text-lg font-bold text-gray-900">NAME</th>
                <th className="px-6 py-4 text-left text-lg font-bold text-gray-900">CONTACT</th>
                <th className="px-6 py-4 text-left text-lg font-bold text-gray-900">AGE/GENDER</th>
                <th className="px-6 py-4 text-left text-lg font-bold text-gray-900">BLOOD GROUP</th>
                <th className="px-6 py-4 text-left text-lg font-bold text-gray-900">LAST VISIT</th>
                <th className="px-6 py-4 text-left text-lg font-bold text-gray-900">DOCTOR</th>
                <th className="px-6 py-4 text-left text-lg font-bold text-gray-900">STATUS</th>
                <th className="px-6 py-4 text-left text-lg font-bold text-gray-900">ACTIONS</th>
                  </tr>
                </thead>
            <tbody className="divide-y-2 divide-gray-200">
              {currentPatients.map((patient) => (
                <tr key={patient.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4">
                    <span className="text-lg font-bold text-indigo-600">{patient.id}</span>
                  </td>
                  <td className="px-6 py-4">
                    <div>
                      <div className="text-lg font-bold text-gray-900">{patient.name}</div>
                      <div className="text-sm text-gray-600">ID: {patient.id}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div>
                      <div className="text-lg text-gray-900 flex items-center">
                        <FaEnvelope className="mr-2 text-indigo-600" />
                        {patient.email}
                      </div>
                      <div className="text-lg text-gray-700 flex items-center mt-1">
                        <FaPhone className="mr-2 text-green-600" />
                        {patient.phone}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div>
                      <div className="text-lg font-bold text-gray-900">{patient.age} years</div>
                      <div className="text-lg text-gray-700 flex items-center">
                        <FaVenusMars className="mr-2 text-purple-600" />
                        {patient.gender}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center">
                      <FaTint className="mr-2 text-red-600" />
                      <span className="text-lg font-bold text-gray-900">{patient.bloodGroup}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center">
                      <FaCalendar className="mr-2 text-blue-600" />
                      <span className="text-lg text-gray-900">{patient.lastVisit}</span>
                    </div>
                      </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center">
                      <FaUserMd className="mr-2 text-green-600" />
                      <span className="text-lg text-gray-900">{patient.doctor}</span>
                    </div>
                      </td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center px-3 py-1 rounded-full text-lg font-bold border-2 ${
                      patient.status === 'Active' ? 'bg-green-100 text-green-800 border-green-200' : 
                      patient.status === 'Inactive' ? 'bg-red-100 text-red-800 border-red-200' :
                      'bg-yellow-100 text-yellow-800 border-yellow-200'
                    }`}>
                      {patient.status === "Active" && <FaCheckCircle className="mr-1" />}
                      {patient.status === "Inactive" && <FaTimesCircle className="mr-1" />}
                      {patient.status === "Discharged" && <FaExclamationTriangle className="mr-1" />}
                          {patient.status}
                        </span>
                      </td>
                  <td className="px-6 py-4">
                    <div className="flex space-x-2">
                      <button
                        onClick={() => handleViewPatient(patient)}
                        className="px-3 py-2 bg-blue-600 text-white text-lg font-bold rounded-lg hover:bg-blue-700 transition-colors"
                        title="View Details"
                      >
                        <FaEye className="text-xl" />
                      </button>
                      <button
                        onClick={() => handleEditPatient(patient)}
                        className="px-3 py-2 bg-green-600 text-white text-lg font-bold rounded-lg hover:bg-green-700 transition-colors"
                        title="Edit Patient"
                      >
                        <FaEdit className="text-xl" />
                      </button>
                        <button 
                        onClick={() => handleViewHistory(patient)}
                        className="px-3 py-2 bg-purple-600 text-white text-lg font-bold rounded-lg hover:bg-purple-700 transition-colors"
                        title="View History"
                        >
                        <FaHistory className="text-xl" />
                        </button>
                        <button 
                        onClick={() => handleAddRecord(patient)}
                        className="px-3 py-2 bg-orange-600 text-white text-lg font-bold rounded-lg hover:bg-orange-700 transition-colors"
                        title="Add Medical Record"
                        >
                        <FaUserEdit className="text-xl" />
                        </button>
                        <button 
                        onClick={() => handleDeletePatient(patient)}
                        className="px-3 py-2 bg-red-600 text-white text-lg font-bold rounded-lg hover:bg-red-700 transition-colors"
                        title="Delete Patient"
                        >
                        <FaTrash className="text-xl" />
                        </button>
                    </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            
        {/* Empty State */}
        {currentPatients.length === 0 && (
          <div className="text-center py-12">
            <div className="text-gray-400 mb-4">
              <FaUserFriends className="mx-auto h-16 w-16" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-2">No Patients Found</h3>
            <p className="text-lg text-gray-600 mb-6">
              {filteredPatients.length === 0 && patients.length > 0 
                ? "No patients match your current filters. Try adjusting your search criteria."
                : "No patients have been registered yet. Start by adding your first patient."
              }
            </p>
            {patients.length === 0 && (
              <button
                onClick={() => router.push('/admin/patients/register')}
                className="flex items-center px-6 py-3 bg-indigo-600 text-white text-lg font-bold rounded-lg hover:bg-indigo-700 transition-colors shadow-lg mx-auto"
              >
                <FaUserPlus className="mr-2" />
                Register First Patient
              </button>
            )}
              </div>
            )}
            
        {/* Pagination */}
        {currentPatients.length > 0 && (
          <div className="px-6 py-4 bg-gray-50 border-t-2 border-gray-200">
            <div className="flex items-center justify-between">
              <div className="text-lg font-bold text-gray-900">
                Showing {indexOfFirstItem + 1} to {Math.min(indexOfLastItem, filteredPatients.length)} of {filteredPatients.length} patients
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
        )}
      </div>

      {/* Delete Confirmation Modal */}
      <ConfirmationModal
        isOpen={showDeleteConfirm}
        onClose={() => setShowDeleteConfirm(false)}
        onConfirm={confirmDeletePatient}
        title="Delete Patient"
        message={`Are you sure you want to delete ${selectedPatient?.name}? This action cannot be undone.`}
        confirmText="Delete"
        cancelText="Cancel"
        type="danger"
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