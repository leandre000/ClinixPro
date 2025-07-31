"use client";

import DashboardLayout from "@/components/DashboardLayout";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import AuthService from "@/services/auth.service";
import dynamic from "next/dynamic";
import ErrorModal from "@/components/ErrorModal";

// Dynamically import the MedicineForm component with SSR disabled
const MedicineForm = dynamic(() => import("@/components/forms/MedicineForm"), {
  ssr: false,
});

export default function AddMedicinePage() {
  const router = useRouter();
  const [showErrorModal, setShowErrorModal] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    // Check if user is authenticated as admin
    const user = AuthService.getCurrentUser();
    if (!user || user.role.toLowerCase() !== 'admin') {
      router.push('/login');
      return;
    }
  }, [router]);

  const handleSuccess = (medicineData) => {
    // Show success message
    alert(`${medicineData.name} has been added successfully!`);
    
    // Navigate back with a query parameter to force refresh
    router.push('/admin/medicines?refresh=' + new Date().getTime());
  };

  const handleCancel = () => {
    router.back();
  };

  const handleError = (error) => {
    console.error("Error adding medicine:", error);
    setErrorMessage(error.message || "An error occurred while adding the medicine. Please try again.");
    setShowErrorModal(true);
  };

  return (
    <DashboardLayout userType="admin" title="Add New Medicine">
      <div className="bg-white shadow rounded-lg p-6">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-lg font-medium text-gray-900">
            Add New Medicine
          </h3>
          <button
            onClick={handleCancel}
            className="px-4 py-2 text-gray-700 border border-gray-300 rounded hover:bg-gray-100"
          >
            Cancel
          </button>
        </div>
        
        <MedicineForm 
          onSuccess={handleSuccess} 
          onCancel={handleCancel}
          onError={handleError}
        />
        
        <ErrorModal
          isOpen={showErrorModal}
          onClose={() => setShowErrorModal(false)}
          title="Error Adding Medicine"
          message={errorMessage}
          type="error"
          showRetry={true}
          onRetry={() => setShowErrorModal(false)}
        />
      </div>
    </DashboardLayout>
  );
} 