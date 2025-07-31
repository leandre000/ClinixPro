"use client";

import DashboardLayout from "@/components/DashboardLayout";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import AuthService from "@/services/auth.service";
import dynamic from "next/dynamic";
import ErrorModal from "@/components/ErrorModal";

// Dynamically import the AppointmentForm component with SSR disabled
const AppointmentForm = dynamic(() => import("@/components/forms/AppointmentForm"), {
  ssr: false,
});

export default function AddAppointmentPage() {
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

  const handleSuccess = () => {
    // Show success message
    alert(`Appointment has been scheduled successfully!`);
    
    // Navigate back with a query parameter to force refresh
    router.push('/admin/appointments?refresh=' + new Date().getTime());
  };

  const handleCancel = () => {
    router.back();
  };

  const handleError = (error) => {
    console.error("Error scheduling appointment:", error);
    setErrorMessage(error.message || "An error occurred while scheduling the appointment. Please try again.");
    setShowErrorModal(true);
  };

  return (
    <DashboardLayout userType="admin" title="Schedule New Appointment">
      <div className="bg-white shadow rounded-lg p-6">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-lg font-medium text-gray-900">
            Schedule New Appointment
          </h3>
          <button
            onClick={handleCancel}
            className="px-4 py-2 text-gray-700 border border-gray-300 rounded hover:bg-gray-100"
          >
            Cancel
          </button>
        </div>
        
        <AppointmentForm 
          onSuccess={handleSuccess} 
          onCancel={handleCancel}
          onError={handleError}
        />
        
        <ErrorModal
          isOpen={showErrorModal}
          onClose={() => setShowErrorModal(false)}
          title="Error Scheduling Appointment"
          message={errorMessage}
          type="error"
          showRetry={true}
          onRetry={() => setShowErrorModal(false)}
        />
      </div>
    </DashboardLayout>
  );
} 