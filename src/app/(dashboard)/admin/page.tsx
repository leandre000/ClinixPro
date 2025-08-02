"use client";

import React, { useState, useEffect } from "react";
import DashboardLayout from "@/components/DashboardLayout";
import { FaUsers, FaUserMd, FaPills, FaCalendarAlt, FaMoneyBillWave, FaChartBar, FaExclamationTriangle, FaCheckCircle, FaClock, FaUserInjured, FaUserGraduate, FaUserNurse, FaUserTie, FaUserShield, FaUserSecret, FaUserLock, FaUserUnlock, FaUserMinus, FaUserCog, FaUserEditIcon, FaUserPlusIcon, FaUserMinusIcon, FaUserCheckIcon, FaUserTimesIcon, FaUserLockIcon, FaUserUnlockIcon, FaUserShieldIcon, FaUserSecretIcon, FaUserTieIcon, FaUserGraduateIcon, FaUserNurseIcon, FaUserInjuredIcon, FaUserFriendsIcon, FaUserClockIcon, FaUserCogIcon } from "react-icons/fa";
import { MdDashboard, MdPeople, MdLocalHospital, MdLocalPharmacy, MdReceipt, MdSettings, MdNotifications, MdMenu, MdClose, MdPerson, MdGroup, MdMedicalServices, MdMedication, MdEvent, MdAssessment, MdSecurity } from "react-icons/md";
import { apiService } from "@/services/api";

interface DashboardStats {
  totalDoctors: number;
  totalPharmacists: number;
  totalReceptionists: number;
  activePatients: number;
  lowStockMedicines: number;
  scheduledAppointments: number;
  activePrescriptions: number;
  pendingBills: number;
}

interface RecentActivity {
  id: number;
  type: string;
  description: string;
  timestamp: string;
  user: string;
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<DashboardStats>({
    totalDoctors: 0,
    totalPharmacists: 0,
    totalReceptionists: 0,
    activePatients: 0,
    lowStockMedicines: 0,
    scheduledAppointments: 0,
    activePrescriptions: 0,
    pendingBills: 0,
  });

  const [recentActivities, setRecentActivities] = useState<RecentActivity[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const dashboardStats = await apiService.getDashboardStats();
      setStats(dashboardStats);
    } catch (err) {
      console.error("Error fetching dashboard stats:", err);
    } finally {
      setLoading(false);
    }
  };

  const fetchRecentActivities = async () => {
    try {
      // Mock data for recent activities
      const activities: RecentActivity[] = [
        {
          id: 1,
          type: "appointment",
          description: "New appointment scheduled for John Doe",
          timestamp: "2024-01-15T10:30:00Z",
          user: "Dr. Smith",
        },
        {
          id: 2,
          type: "prescription",
          description: "Prescription created for Jane Smith",
          timestamp: "2024-01-15T09:15:00Z",
          user: "Dr. Johnson",
        },
        {
          id: 3,
          type: "medicine",
          description: "Medicine stock updated",
          timestamp: "2024-01-15T08:45:00Z",
          user: "Pharmacist",
        },
      ];
      setRecentActivities(activities);
    } catch (err) {
      console.error("Error fetching recent activities:", err);
    }
  };

  const StatCard = ({ title, value, icon: Icon, color }: { title: string; value: number; icon: any; color: string }) => (
    <div className={`bg-white rounded-lg shadow-md p-6 border-l-4 ${color}`}>
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600">{title}</p>
          <p className="text-2xl font-bold text-gray-900">{value}</p>
        </div>
        <div className={`p-3 rounded-full ${color.replace('border-', 'bg-').replace('-500', '-100')}`}>
          <Icon className="w-6 h-6 text-gray-600" />
        </div>
      </div>
    </div>
  );

  const ActivityItem = ({ activity }: { activity: RecentActivity }) => (
    <div className="flex items-center space-x-3 p-3 hover:bg-gray-50 rounded-lg">
      <div className="flex-shrink-0">
        <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
          <FaUsers className="w-4 h-4 text-blue-600" />
        </div>
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-gray-900">{activity.description}</p>
        <p className="text-xs text-gray-500">
          {new Date(activity.timestamp).toLocaleString()} • {activity.user}
        </p>
      </div>
    </div>
  );

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="p-6">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
          <p className="text-gray-600 mt-2">Welcome back! Here's what's happening today.</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatCard
            title="Total Doctors"
            value={stats.totalDoctors}
            icon={FaUserMd}
            color="border-blue-500"
          />
          <StatCard
            title="Active Patients"
            value={stats.activePatients}
            icon={FaUsers}
            color="border-green-500"
          />
          <StatCard
            title="Scheduled Appointments"
            value={stats.scheduledAppointments}
            icon={FaCalendarAlt}
            color="border-yellow-500"
          />
          <StatCard
            title="Pending Bills"
            value={stats.pendingBills}
            icon={FaMoneyBillWave}
            color="border-red-500"
          />
        </div>

        {/* Additional Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatCard
            title="Total Pharmacists"
            value={stats.totalPharmacists}
            icon={FaPills}
            color="border-purple-500"
          />
          <StatCard
            title="Total Receptionists"
            value={stats.totalReceptionists}
            icon={FaUsers}
            color="border-indigo-500"
          />
          <StatCard
            title="Low Stock Medicines"
            value={stats.lowStockMedicines}
            icon={FaExclamationTriangle}
            color="border-orange-500"
          />
          <StatCard
            title="Active Prescriptions"
            value={stats.activePrescriptions}
            icon={FaCheckCircle}
            color="border-teal-500"
          />
        </div>

        {/* Recent Activities */}
        <div className="bg-white rounded-lg shadow-md">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">Recent Activities</h2>
          </div>
          <div className="p-6">
            {recentActivities.length > 0 ? (
              <div className="space-y-2">
                {recentActivities.map((activity) => (
                  <ActivityItem key={activity.id} activity={activity} />
                ))}
              </div>
            ) : (
              <p className="text-gray-500 text-center py-4">No recent activities</p>
            )}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}