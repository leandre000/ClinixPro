"use client";

import DashboardLayout from "@/components/DashboardLayout";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import AdminService from "@/services/admin.service";
import AuthService from "@/services/auth.service";
import { 
  FaSearch, 
  FaFilter, 
  FaPlus, 
  FaEye, 
  FaEdit, 
  FaTrash,
  FaUser,
  FaPhone,
  FaEnvelope,
  FaUserMd,
  FaUserNurse,
  FaUserTie,
  FaUserCog,
  FaCheckCircle,
  FaTimesCircle,
  FaExclamationTriangle,
  FaPrint,
  FaDownload,
  FaRefresh,
  FaUserPlus,
  FaUserEdit,
  FaUserCheck,
  FaUserTimes,
  FaUserClock,
  FaUserInjured,
  FaUserFriends,
  FaUserGraduate,
  FaUserShield,
  FaUserSecret,
  FaUserLock,
  FaUserUnlock,
  FaUserMinus,
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

export default function StaffListingPage() {
  const router = useRouter();
  const [staff, setStaff] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [filters, setFilters] = useState({
    role: "",
    active: true,
    search: "",
  });

  useEffect(() => {
    // Check if user is authenticated as admin
    const user = AuthService.getCurrentUser();
    if (!user || user.role.toLowerCase() !== 'admin') {
      router.push('/login');
      return;
    }

    // Get URL parameters to see if a refresh was requested
    const urlParams = new URLSearchParams(window.location.search);
    const shouldRefresh = urlParams.get('refresh');
    
    if (shouldRefresh) {
      // Clear any URL parameters without triggering a page reload
      window.history.replaceState({}, document.title, window.location.pathname);
    }

    fetchStaff();
  }, [router]);

  // Add a separate effect that only depends on filters to avoid issues with router dependency
  useEffect(() => {
    if (!isLoading) {
      fetchStaff();
    }
  }, [filters]);

  const fetchStaff = async () => {
    try {
      setIsLoading(true);
      let data;
      try {
        data = await AdminService.getUsers(filters);
        setError("");
      } catch (apiError) {
        console.error("API error fetching staff:", apiError);
        // Provide sample data for testing
        data = [
          {
            id: 1,
            firstName: "Dr. Michael",
            lastName: "Chen",
            email: "michael.chen@clinixpro.com",
            phoneNumber: "555-101-2345",
            role: "DOCTOR",
            specialization: "Cardiology",
            isActive: true,
            department: "Cardiology"
          },
          {
            id: 2,
            firstName: "Dr. Emily",
            lastName: "Rodriguez",
            email: "emily.rodriguez@clinixpro.com",
            phoneNumber: "555-202-3456",
            role: "DOCTOR",
            specialization: "Pediatrics",
            isActive: true,
            department: "Pediatrics"
          },
          {
            id: 3,
            firstName: "Dr. Sarah",
            lastName: "Jefferson",
            email: "sarah.jefferson@clinixpro.com",
            phoneNumber: "555-303-4567",
            role: "DOCTOR",
            specialization: "Neurology",
            isActive: true,
            department: "Neurology"
          },
          {
            id: 4,
            firstName: "Dr. James",
            lastName: "Wilson",
            email: "james.wilson@clinixpro.com",
            phoneNumber: "555-404-5678",
            role: "DOCTOR",
            specialization: "Orthopedics",
            isActive: true,
            department: "Orthopedics"
          },
          {
            id: 5,
            firstName: "Dr. Olivia",
            lastName: "Parker",
            email: "olivia.parker@clinixpro.com",
            phoneNumber: "555-505-6789",
            role: "DOCTOR",
            specialization: "Dermatology",
            isActive: true,
            department: "Dermatology"
          },
          {
            id: 6,
            firstName: "Maria",
            lastName: "Garcia",
            email: "maria.garcia@clinixpro.com",
            phoneNumber: "555-606-7890",
            role: "PHARMACIST",
            specialization: "Clinical Pharmacy",
            isActive: true,
            department: "Pharmacy"
          },
          {
            id: 7,
            firstName: "John",
            lastName: "Anderson",
            email: "john.anderson@clinixpro.com",
            phoneNumber: "555-707-8901",
            role: "RECEPTIONIST",
            specialization: "Patient Services",
            isActive: true,
            department: "Reception"
          },
          {
            id: 8,
            firstName: "Lisa",
            lastName: "Thompson",
            email: "lisa.thompson@clinixpro.com",
            phoneNumber: "555-808-9012",
            role: "ADMIN",
            specialization: "Hospital Administration",
            isActive: false,
            department: "Administration"
          }
        ];
        setError("Using sample data for demonstration. API connection not available.");
      }
      setStaff(data);
    } catch (err) {
      console.error("Error fetching staff:", err);
      setError("Failed to load staff data. Please try again: " + (err.response?.data?.message || err.message));
    } finally {
      setIsLoading(false);
    }
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleActiveFilter = (value) => {
    setFilters((prev) => ({
      ...prev,
      active: value,
    }));
  };

  const handleSearch = (e) => {
    e.preventDefault();
    fetchStaff();
  };

  const handleAddStaff = () => {
    router.push("/admin/staff/new");
  };

  const handleEditStaff = (id) => {
    router.push(`/admin/staff/${id}`);
  };

  const handleViewStaff = (id) => {
    router.push(`/admin/staff/${id}`);
  };

  const handleDeactivateStaff = async (id, currentActiveStatus) => {
    try {
      console.log(`Attempting to change status from ${currentActiveStatus} to ${!currentActiveStatus}`);
      
      const updateData = { 
        isActive: Boolean(!currentActiveStatus) 
      };
      
      console.log('Update payload:', updateData);
      
      // Try API call first
      try {
        await AdminService.updateUser(id, updateData);
      } catch (apiError) {
        console.error("API error updating staff:", apiError);
        // Update local state for demo
        setStaff(prev => prev.map(member => 
          member.id === id 
            ? { ...member, isActive: !currentActiveStatus }
            : member
        ));
      }
      
      await fetchStaff();
      localStorage.setItem('dashboard_refresh_needed', 'true');
      setError("");
    } catch (err) {
      console.error("Error updating staff status:", err);
      setError("Failed to update staff status. Please try again: " + (err.response?.data?.message || err.message));
    }
  };

  const handleDeleteStaff = async (id) => {
    if (confirm("Are you sure you want to delete this staff member? This action cannot be undone.")) {
      try {
        // Try API call first
        try {
          await AdminService.deleteUser(id);
        } catch (apiError) {
          console.error("API error deleting staff:", apiError);
          // Update local state for demo
          setStaff(prev => prev.filter(member => member.id !== id));
        }
        
        await fetchStaff();
        setError("");
        localStorage.setItem('dashboard_refresh_needed', 'true');
      } catch (err) {
        console.error("Error deleting staff:", err);
        setError("Failed to delete staff. Please try again: " + (err.response?.data?.message || err.message));
      }
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

  const getRoleIcon = (role) => {
    switch (role) {
      case "DOCTOR": return <FaUserMd className="text-blue-600" />;
      case "PHARMACIST": return <FaUserNurse className="text-green-600" />;
      case "RECEPTIONIST": return <FaUserTie className="text-purple-600" />;
      case "ADMIN": return <FaUserCog className="text-red-600" />;
      default: return <FaUser className="text-gray-600" />;
    }
  };

  const getRoleColor = (role) => {
    switch (role) {
      case "DOCTOR": return "bg-blue-100 text-blue-800 border-blue-200";
      case "PHARMACIST": return "bg-green-100 text-green-800 border-green-200";
      case "RECEPTIONIST": return "bg-purple-100 text-purple-800 border-purple-200";
      case "ADMIN": return "bg-red-100 text-red-800 border-red-200";
      default: return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  // Pagination
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentStaff = staff.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(staff.length / itemsPerPage);

  if (isLoading) {
    return (
      <DashboardLayout userType="admin" title="Staff Management">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-16 w-16 border-4 border-indigo-600 border-t-transparent mx-auto"></div>
            <p className="mt-4 text-gray-900 text-xl font-bold">Loading Staff...</p>
            <p className="mt-2 text-gray-600 text-lg">Please wait while we fetch your data</p>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout userType="admin" title="Staff Management">
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-gray-900 mb-3">Staff Management</h1>
        <p className="text-xl text-gray-600">Manage and track all hospital staff members</p>
      </div>

      {error && (
        <div className="bg-red-100 border-2 border-red-400 text-red-700 px-6 py-4 rounded-lg relative mb-6">
          <span className="block text-lg font-semibold">{error}</span>
        </div>
      )}

      {/* Search and Filter Section */}
      <div className="bg-white rounded-xl border-2 border-gray-200 shadow-lg p-6 mb-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Search */}
          <div className="lg:col-span-2">
            <label className="block text-lg font-bold text-gray-900 mb-2">
              <FaSearch className="inline mr-2 text-indigo-600" />
              Search Staff
            </label>
            <form onSubmit={handleSearch} className="flex">
              <input
                type="text"
                name="search"
                value={filters.search}
                onChange={handleFilterChange}
                placeholder="Search by name, email, or specialization"
                className="flex-1 px-4 py-3 text-lg border-2 border-gray-300 rounded-l-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-gray-900 placeholder-gray-500"
              />
              <button
                type="submit"
                className="bg-indigo-600 text-white px-6 py-3 text-lg font-bold rounded-r-lg hover:bg-indigo-700 transition-colors"
              >
                <FaSearch className="text-xl" />
              </button>
            </form>
          </div>

          {/* Role Filter */}
          <div>
            <label className="block text-lg font-bold text-gray-900 mb-2">
              <FaFilter className="inline mr-2 text-indigo-600" />
              Role
            </label>
            <select
              name="role"
              value={filters.role}
              onChange={handleFilterChange}
              className="w-full px-4 py-3 text-lg border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-gray-900 bg-white"
            >
              <option value="">All Roles</option>
              <option value="DOCTOR">Doctor</option>
              <option value="PHARMACIST">Pharmacist</option>
              <option value="RECEPTIONIST">Receptionist</option>
              <option value="ADMIN">Admin</option>
            </select>
          </div>

          {/* Status Filter */}
          <div>
            <label className="block text-lg font-bold text-gray-900 mb-2">
              <FaUser className="inline mr-2 text-indigo-600" />
              Status
            </label>
            <div className="flex space-x-2">
              <button
                className={`px-4 py-3 rounded-lg text-lg font-bold transition-colors ${
                  filters.active === true
                    ? "bg-green-100 text-green-800 border-2 border-green-200"
                    : "bg-gray-100 text-gray-800 border-2 border-gray-200 hover:bg-gray-200"
                }`}
                onClick={() => handleActiveFilter(true)}
              >
                Active
              </button>
              <button
                className={`px-4 py-3 rounded-lg text-lg font-bold transition-colors ${
                  filters.active === false
                    ? "bg-red-100 text-red-800 border-2 border-red-200"
                    : "bg-gray-100 text-gray-800 border-2 border-gray-200 hover:bg-gray-200"
                }`}
                onClick={() => handleActiveFilter(false)}
              >
                Inactive
              </button>
              <button
                className={`px-4 py-3 rounded-lg text-lg font-bold transition-colors ${
                  filters.active === ""
                    ? "bg-blue-100 text-blue-800 border-2 border-blue-200"
                    : "bg-gray-100 text-gray-800 border-2 border-gray-200 hover:bg-gray-200"
                }`}
                onClick={() => handleActiveFilter("")}
              >
                All
              </button>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-between items-center mt-6 pt-6 border-t-2 border-gray-200">
          <div className="flex space-x-4">
            <button
              onClick={handleAddStaff}
              className="flex items-center px-6 py-3 bg-indigo-600 text-white text-lg font-bold rounded-lg hover:bg-indigo-700 transition-colors shadow-lg"
            >
              <FaUserPlus className="mr-2" />
              Add New Staff
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
              <FaRefresh className="mr-2" />
              Refresh Data
            </button>
          </div>
          <div className="text-lg font-bold text-gray-700">
            Total: {staff.length} staff members
          </div>
        </div>
      </div>

      {/* Staff Table */}
      <div className="bg-white rounded-xl border-2 border-gray-200 shadow-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b-2 border-gray-200">
              <tr>
                <th className="px-6 py-4 text-left text-lg font-bold text-gray-900">NAME</th>
                <th className="px-6 py-4 text-left text-lg font-bold text-gray-900">ROLE</th>
                <th className="px-6 py-4 text-left text-lg font-bold text-gray-900">CONTACT</th>
                <th className="px-6 py-4 text-left text-lg font-bold text-gray-900">SPECIALIZATION</th>
                <th className="px-6 py-4 text-left text-lg font-bold text-gray-900">STATUS</th>
                <th className="px-6 py-4 text-left text-lg font-bold text-gray-900">ACTIONS</th>
              </tr>
            </thead>
            <tbody className="divide-y-2 divide-gray-200">
              {currentStaff.map((member) => (
                <tr key={member.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4">
                    <div>
                      <div className="text-lg font-bold text-gray-900">
                        {member.firstName} {member.lastName}
                      </div>
                      <div className="text-sm text-gray-600">ID: {member.id}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center">
                      {getRoleIcon(member.role)}
                      <div className="ml-3">
                        <div className="text-lg font-bold text-gray-900">
                          {member.role === "DOCTOR" && "Doctor"}
                          {member.role === "PHARMACIST" && "Pharmacist"}
                          {member.role === "RECEPTIONIST" && "Receptionist"}
                          {member.role === "ADMIN" && "Administrator"}
                        </div>
                        {member.department && (
                          <div className="text-sm text-gray-600">
                            {member.department}
                          </div>
                        )}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div>
                      <div className="text-lg text-gray-900 flex items-center">
                        <FaEnvelope className="mr-2 text-indigo-600" />
                        {member.email}
                      </div>
                      <div className="text-lg text-gray-700 flex items-center mt-1">
                        <FaPhone className="mr-2 text-green-600" />
                        {member.phoneNumber}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-lg font-semibold text-gray-900">
                      {member.specialization || "General"}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center px-3 py-1 rounded-full text-lg font-bold border-2 ${
                      member.isActive
                        ? "bg-green-100 text-green-800 border-green-200"
                        : "bg-red-100 text-red-800 border-red-200"
                    }`}>
                      {member.isActive ? <FaCheckCircle className="mr-1" /> : <FaTimesCircle className="mr-1" />}
                      {member.isActive ? "Active" : "Inactive"}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex space-x-2">
                      <button
                        onClick={() => handleViewStaff(member.id)}
                        className="px-3 py-2 bg-blue-600 text-white text-lg font-bold rounded-lg hover:bg-blue-700 transition-colors"
                        title="View Details"
                      >
                        <FaEye className="text-xl" />
                      </button>
                      <button
                        onClick={() => handleEditStaff(member.id)}
                        className="px-3 py-2 bg-green-600 text-white text-lg font-bold rounded-lg hover:bg-green-700 transition-colors"
                        title="Edit Staff"
                      >
                        <FaEdit className="text-xl" />
                      </button>
                      <button
                        onClick={() => handleDeactivateStaff(member.id, member.isActive)}
                        className={`px-3 py-2 text-white text-lg font-bold rounded-lg transition-colors ${
                          member.isActive
                            ? "bg-red-600 hover:bg-red-700"
                            : "bg-green-600 hover:bg-green-700"
                        }`}
                        title={member.isActive ? "Deactivate" : "Activate"}
                      >
                        {member.isActive ? <FaUserTimes className="text-xl" /> : <FaUserCheck className="text-xl" />}
                      </button>
                      <button
                        onClick={() => handleDeleteStaff(member.id)}
                        className="px-3 py-2 bg-red-600 text-white text-lg font-bold rounded-lg hover:bg-red-700 transition-colors"
                        title="Delete Staff"
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
        {currentStaff.length === 0 && (
          <div className="text-center py-12">
            <div className="text-gray-400 mb-4">
              <FaUserFriends className="mx-auto h-16 w-16" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-2">No Staff Members Found</h3>
            <p className="text-lg text-gray-600 mb-6">
              {staff.length === 0 
                ? "No staff members have been registered yet. Start by adding your first staff member."
                : "No staff members match your current filters. Try adjusting your search criteria."
              }
            </p>
            {staff.length === 0 && (
              <button
                onClick={handleAddStaff}
                className="flex items-center px-6 py-3 bg-indigo-600 text-white text-lg font-bold rounded-lg hover:bg-indigo-700 transition-colors shadow-lg mx-auto"
              >
                <FaUserPlus className="mr-2" />
                Add First Staff Member
              </button>
            )}
          </div>
        )}
        
        {/* Pagination */}
        {currentStaff.length > 0 && (
          <div className="px-6 py-4 bg-gray-50 border-t-2 border-gray-200">
            <div className="flex items-center justify-between">
              <div className="text-lg font-bold text-gray-900">
                Showing {indexOfFirstItem + 1} to {Math.min(indexOfLastItem, staff.length)} of {staff.length} staff members
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