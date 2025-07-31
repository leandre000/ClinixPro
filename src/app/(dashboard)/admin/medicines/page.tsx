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
  FaTrash,
  FaPills,
  FaBuilding,
  FaCalendar,
  FaDollarSign,
  FaBox,
  FaExclamationTriangle,
  FaCheckCircle,
  FaTimesCircle,
  FaPrint,
  FaDownload,
  FaRedo,
  FaShoppingCart,
  FaHistory,
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

export default function MedicinesPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [stockFilter, setStockFilter] = useState("all");
  const [manufacturerFilter, setManufacturerFilter] = useState("all");
  const [medicines, setMedicines] = useState([]);
  const [categories, setCategories] = useState([]);
  const [manufacturers, setManufacturers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  
  useEffect(() => {
    const fetchMedicines = async () => {
      try {
        setLoading(true);
        console.log("Fetching medicines...");
        
        let response;
        try {
          response = await AdminService.getMedicines();
          setError("");
        } catch (apiError) {
          console.error("API error fetching medicines:", apiError);
          // If the API fails completely, provide mock data for development
          response = [
            { 
              id: "MED-1001", 
              name: "Amoxicillin", 
              categoryName: "Antibiotic",
              companyName: "PharmaCorp Inc.",
              expiryDate: "2025-05-15",
              stock: 145,
              price: 12.99,
              dosage: "500mg",
              status: "In Stock"
            },
            { 
              id: "MED-1002", 
              name: "Lisinopril", 
              categoryName: "Antihypertensive",
              companyName: "MediLife Labs",
              expiryDate: "2024-11-30",
              stock: 78,
              price: 15.49,
              dosage: "10mg",
              status: "In Stock"
            },
            { 
              id: "MED-1003", 
              name: "Ibuprofen", 
              categoryName: "Pain Relief",
              companyName: "HealthPharm Ltd.",
              expiryDate: "2025-08-20",
              stock: 5,
              price: 8.99,
              dosage: "400mg",
              status: "Low Stock"
            },
            { 
              id: "MED-1004", 
              name: "Omeprazole", 
              categoryName: "Antacid",
              companyName: "PharmaCorp Inc.",
              expiryDate: "2024-12-10",
              stock: 0,
              price: 22.50,
              dosage: "20mg",
              status: "Out of Stock"
            },
            { 
              id: "MED-1005", 
              name: "Metformin", 
              categoryName: "Antidiabetic",
              companyName: "MediLife Labs",
              expiryDate: "2025-03-15",
              stock: 92,
              price: 18.75,
              dosage: "500mg",
              status: "In Stock"
            },
            { 
              id: "MED-1006", 
              name: "Atorvastatin", 
              categoryName: "Cholesterol",
              companyName: "HealthPharm Ltd.",
              expiryDate: "2025-06-30",
              stock: 3,
              price: 25.00,
              dosage: "10mg",
              status: "Low Stock"
            },
            { 
              id: "MED-1007", 
              name: "Cetirizine", 
              categoryName: "Antihistamine",
              companyName: "PharmaCorp Inc.",
              expiryDate: "2025-09-12",
              stock: 156,
              price: 6.99,
              dosage: "10mg",
              status: "In Stock"
            },
            { 
              id: "MED-1008", 
              name: "Losartan", 
              categoryName: "Antihypertensive",
              companyName: "MediLife Labs",
              expiryDate: "2024-10-25",
              stock: 0,
              price: 19.99,
              dosage: "50mg",
              status: "Out of Stock"
            }
          ];
          setError("Using sample data for demonstration. API connection not available.");
        }
        
        console.log("Fetched medicines:", response);
        
        if (!response || !Array.isArray(response)) {
          throw new Error("Invalid response format");
        }
        
        // Transform the medicines data to match the expected structure
        const formattedMedicines = response.map(med => ({
          id: med.id || `MED-${Math.floor(Math.random() * 1000)}`,
          name: med.name || "Unknown Medicine",
          category: med.category?.name || med.categoryName || "Uncategorized",
          manufacturer: med.manufacturer?.name || med.companyName || "Unknown Manufacturer",
          expiryDate: med.expiryDate ? new Date(med.expiryDate).toISOString().split('T')[0] : "Not specified",
          stock: med.stock || 0,
          price: med.price || 0,
          dosage: med.dosage || "Not specified",
          status: getStockStatus(med.stock),
          // Original medicine data for reference
          originalMedicine: med
        }));
        
        // Extract unique categories and manufacturers from the medicines
        const uniqueCategories = [...new Set(formattedMedicines
          .filter(med => med.category)
          .map(med => med.category))];
        
        const uniqueManufacturers = [...new Set(formattedMedicines
          .filter(med => med.manufacturer)
          .map(med => med.manufacturer))];
        
        console.log("Formatted medicines:", formattedMedicines);
        setMedicines(formattedMedicines);
        setCategories(uniqueCategories);
        setManufacturers(uniqueManufacturers);
        
      } catch (err) {
        console.error("Error processing medicines data:", err);
          setError("Failed to process medicines data. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    // Fetch medicines on initial load or when refresh parameter changes
    const refreshParam = searchParams.get('refresh');
    fetchMedicines();
  }, [searchParams, error]);
  
  // Determine stock status based on quantity
  const getStockStatus = (quantity) => {
    if (quantity === undefined || quantity === null) return "Unknown";
    if (quantity === 0) return "Out of Stock";
    if (quantity <= 10) return "Low Stock";
    return "In Stock";
  };

  const getStockStatusFilter = (medicine) => {
    if (stockFilter === "all") return true;
    return medicine.status === stockFilter;
  };

  const filteredMedicines = medicines
    .filter(medicine => 
      (categoryFilter === "all" || medicine.category === categoryFilter) &&
      (manufacturerFilter === "all" || medicine.manufacturer === manufacturerFilter) &&
      getStockStatusFilter(medicine) &&
      (searchQuery === "" || 
       medicine.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
       medicine.id.toString().toLowerCase().includes(searchQuery.toLowerCase()) ||
       medicine.manufacturer.toLowerCase().includes(searchQuery.toLowerCase()))
    );

  const handleViewMedicine = (medicine) => {
    router.push(`/admin/medicines/${medicine.id}`);
  };

  const handleEditMedicine = (medicine) => {
    router.push(`/pharmacist/medicines/edit/${medicine.id}`);
  };

  const handleOrderMedicine = (medicine) => {
    router.push(`/pharmacist/inventory/order/${medicine.id}`);
  };

  const handleViewHistory = (medicine) => {
    router.push(`/admin/medicines/${medicine.id}/history`);
  };

  const handleDeleteMedicine = async (medicine) => {
    if (confirm(`Are you sure you want to delete medicine ${medicine.name}? This action cannot be undone.`)) {
      try {
        // API call to delete medicine
        // await AdminService.deleteMedicine(medicine.id);
        console.log('Medicine deleted:', medicine.id);
        
        // Update local state
        setMedicines(prev => prev.filter(m => m.id !== medicine.id));
      } catch (error) {
        console.error('Error deleting medicine:', error);
        setError("Failed to delete medicine. Please try again.");
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

  // Pagination
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentMedicines = filteredMedicines.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredMedicines.length / itemsPerPage);

  if (loading) {
    return (
      <DashboardLayout userType="admin" title="Medicines Management">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-16 w-16 border-4 border-indigo-600 border-t-transparent mx-auto"></div>
            <p className="mt-4 text-gray-900 text-xl font-bold">Loading Medicines...</p>
            <p className="mt-2 text-gray-600 text-lg">Please wait while we fetch your data</p>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout userType="admin" title="Medicines Management">
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-gray-900 mb-3">Medicines Inventory</h1>
        <p className="text-xl text-gray-600">Manage and track all medicines and pharmaceutical supplies</p>
      </div>

      {error && (
        <div className="bg-red-100 border-2 border-red-400 text-red-700 px-6 py-4 rounded-lg relative mb-6">
          <span className="block text-lg font-semibold">{error}</span>
        </div>
      )}
      
      {/* Search and Filter Section */}
      <div className="bg-white rounded-xl border-2 border-gray-200 shadow-lg p-6 mb-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
          {/* Search */}
          <div className="lg:col-span-2">
            <label className="block text-lg font-bold text-gray-900 mb-2">
              <FaSearch className="inline mr-2 text-indigo-600" />
              Search Medicines
            </label>
            <div className="relative">
              <input
                type="text"
                placeholder="Search by name, ID or manufacturer..."
                className="w-full px-4 py-3 text-lg border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-gray-900 placeholder-gray-500"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <FaSearch className="absolute right-3 top-4 h-5 w-5 text-gray-400" />
            </div>
          </div>

          {/* Category Filter */}
          <div>
            <label className="block text-lg font-bold text-gray-900 mb-2">
              <FaFilter className="inline mr-2 text-indigo-600" />
              Category
            </label>
              <select
              className="w-full px-4 py-3 text-lg border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-gray-900 bg-white"
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
              >
                <option value="all">All Categories</option>
                {categories.map(category => (
                  <option key={category} value={category}>{category}</option>
                ))}
              </select>
          </div>

          {/* Manufacturer Filter */}
          <div>
            <label className="block text-lg font-bold text-gray-900 mb-2">
              <FaBuilding className="inline mr-2 text-indigo-600" />
              Manufacturer
            </label>
            <select
              className="w-full px-4 py-3 text-lg border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-gray-900 bg-white"
              value={manufacturerFilter}
              onChange={(e) => setManufacturerFilter(e.target.value)}
            >
              <option value="all">All Manufacturers</option>
              {manufacturers.map(manufacturer => (
                <option key={manufacturer} value={manufacturer}>{manufacturer}</option>
              ))}
            </select>
          </div>

          {/* Stock Filter */}
          <div>
            <label className="block text-lg font-bold text-gray-900 mb-2">
              <FaBox className="inline mr-2 text-indigo-600" />
              Stock Status
            </label>
              <select
              className="w-full px-4 py-3 text-lg border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-gray-900 bg-white"
                value={stockFilter}
                onChange={(e) => setStockFilter(e.target.value)}
              >
                <option value="all">All Stock Status</option>
                <option value="In Stock">In Stock</option>
                <option value="Low Stock">Low Stock</option>
                <option value="Out of Stock">Out of Stock</option>
              </select>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-between items-center mt-6 pt-6 border-t-2 border-gray-200">
          <div className="flex space-x-4">
              <button 
                onClick={() => router.push('/pharmacist/medicines/add')}
              className="flex items-center px-6 py-3 bg-indigo-600 text-white text-lg font-bold rounded-lg hover:bg-indigo-700 transition-colors shadow-lg"
              >
              <FaPlus className="mr-2" />
                Add Medicine
              </button>
            <button
              onClick={() => router.push('/pharmacist/inventory')}
              className="flex items-center px-6 py-3 bg-green-600 text-white text-lg font-bold rounded-lg hover:bg-green-700 transition-colors shadow-lg"
            >
              <FaBox className="mr-2" />
              View Inventory
            </button>
            <button
              onClick={() => window.print()}
              className="flex items-center px-6 py-3 bg-blue-600 text-white text-lg font-bold rounded-lg hover:bg-blue-700 transition-colors shadow-lg"
            >
              <FaPrint className="mr-2" />
              Print Inventory
            </button>
            <button
              onClick={() => window.location.reload()}
              className="flex items-center px-6 py-3 bg-purple-600 text-white text-lg font-bold rounded-lg hover:bg-purple-700 transition-colors shadow-lg"
            >
                              <FaRedo className="mr-2" />
              Refresh Data
            </button>
          </div>
          <div className="text-lg font-bold text-gray-700">
            Total: {filteredMedicines.length} medicines
            </div>
          </div>
        </div>
        
      {/* Medicines Table */}
      <div className="bg-white rounded-xl border-2 border-gray-200 shadow-lg overflow-hidden">
            <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b-2 border-gray-200">
              <tr>
                <th className="px-6 py-4 text-left text-lg font-bold text-gray-900">MEDICINE ID</th>
                <th className="px-6 py-4 text-left text-lg font-bold text-gray-900">NAME</th>
                <th className="px-6 py-4 text-left text-lg font-bold text-gray-900">CATEGORY</th>
                <th className="px-6 py-4 text-left text-lg font-bold text-gray-900">MANUFACTURER</th>
                <th className="px-6 py-4 text-left text-lg font-bold text-gray-900">DOSAGE</th>
                <th className="px-6 py-4 text-left text-lg font-bold text-gray-900">PRICE</th>
                <th className="px-6 py-4 text-left text-lg font-bold text-gray-900">STOCK</th>
                <th className="px-6 py-4 text-left text-lg font-bold text-gray-900">EXPIRY DATE</th>
                <th className="px-6 py-4 text-left text-lg font-bold text-gray-900">STATUS</th>
                <th className="px-6 py-4 text-left text-lg font-bold text-gray-900">ACTIONS</th>
                  </tr>
                </thead>
            <tbody className="divide-y-2 divide-gray-200">
              {currentMedicines.map((medicine) => (
                <tr key={medicine.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4">
                    <span className="text-lg font-bold text-indigo-600">{medicine.id}</span>
                  </td>
                  <td className="px-6 py-4">
                    <div>
                      <div className="text-lg font-bold text-gray-900">{medicine.name}</div>
                      <div className="text-sm text-gray-600">ID: {medicine.id}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center">
                      <FaPills className="mr-2 text-blue-600" />
                      <span className="text-lg font-semibold text-gray-900">{medicine.category}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center">
                      <FaBuilding className="mr-2 text-green-600" />
                      <span className="text-lg text-gray-900">{medicine.manufacturer}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-lg font-semibold text-gray-900">{medicine.dosage}</span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center">
                      <FaDollarSign className="mr-1 text-green-600" />
                      <span className="text-lg font-bold text-gray-900">${medicine.price.toFixed(2)}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center">
                      <FaBox className="mr-2 text-purple-600" />
                      <span className="text-lg font-bold text-gray-900">{medicine.stock} units</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center">
                      <FaCalendar className="mr-2 text-orange-600" />
                      <span className="text-lg text-gray-900">{medicine.expiryDate}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center px-3 py-1 rounded-full text-lg font-bold border-2 ${
                      medicine.status === 'In Stock' ? 'bg-green-100 text-green-800 border-green-200' : 
                      medicine.status === 'Low Stock' ? 'bg-yellow-100 text-yellow-800 border-yellow-200' : 
                      'bg-red-100 text-red-800 border-red-200'
                    }`}>
                      {medicine.status === "In Stock" && <FaCheckCircle className="mr-1" />}
                      {medicine.status === "Low Stock" && <FaExclamationTriangle className="mr-1" />}
                      {medicine.status === "Out of Stock" && <FaTimesCircle className="mr-1" />}
                          {medicine.status}
                        </span>
                      </td>
                  <td className="px-6 py-4">
                    <div className="flex space-x-2">
                      <button
                        onClick={() => handleViewMedicine(medicine)}
                        className="px-3 py-2 bg-blue-600 text-white text-lg font-bold rounded-lg hover:bg-blue-700 transition-colors"
                        title="View Details"
                      >
                        <FaEye className="text-xl" />
                      </button>
                      <button
                        onClick={() => handleEditMedicine(medicine)}
                        className="px-3 py-2 bg-green-600 text-white text-lg font-bold rounded-lg hover:bg-green-700 transition-colors"
                        title="Edit Medicine"
                      >
                        <FaEdit className="text-xl" />
                      </button>
                        <button 
                        onClick={() => handleOrderMedicine(medicine)}
                        className="px-3 py-2 bg-orange-600 text-white text-lg font-bold rounded-lg hover:bg-orange-700 transition-colors"
                        title="Order Medicine"
                        >
                        <FaShoppingCart className="text-xl" />
                        </button>
                        <button 
                        onClick={() => handleViewHistory(medicine)}
                        className="px-3 py-2 bg-purple-600 text-white text-lg font-bold rounded-lg hover:bg-purple-700 transition-colors"
                        title="View History"
                        >
                        <FaHistory className="text-xl" />
                        </button>
                        <button 
                        onClick={() => handleDeleteMedicine(medicine)}
                        className="px-3 py-2 bg-red-600 text-white text-lg font-bold rounded-lg hover:bg-red-700 transition-colors"
                        title="Delete Medicine"
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
        {currentMedicines.length === 0 && (
          <div className="text-center py-12">
            <div className="text-gray-400 mb-4">
              <FaPills className="mx-auto h-16 w-16" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-2">No Medicines Found</h3>
            <p className="text-lg text-gray-600 mb-6">
              {filteredMedicines.length === 0 && medicines.length > 0 
                ? "No medicines match your current filters. Try adjusting your search criteria."
                : "No medicines have been added to inventory yet. Start by adding your first medicine."
              }
            </p>
            {medicines.length === 0 && (
              <button
                onClick={() => router.push('/pharmacist/medicines/add')}
                className="flex items-center px-6 py-3 bg-indigo-600 text-white text-lg font-bold rounded-lg hover:bg-indigo-700 transition-colors shadow-lg mx-auto"
              >
                <FaPlus className="mr-2" />
                Add First Medicine
              </button>
            )}
              </div>
            )}
            
        {/* Pagination */}
        {currentMedicines.length > 0 && (
          <div className="px-6 py-4 bg-gray-50 border-t-2 border-gray-200">
            <div className="flex items-center justify-between">
              <div className="text-lg font-bold text-gray-900">
                Showing {indexOfFirstItem + 1} to {Math.min(indexOfLastItem, filteredMedicines.length)} of {filteredMedicines.length} medicines
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