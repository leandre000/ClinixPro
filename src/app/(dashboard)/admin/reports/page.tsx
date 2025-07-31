"use client";

import React, { useState, useEffect } from 'react';
import DashboardLayout from '@/components/DashboardLayout';
import AdvancedChart from '@/components/AdvancedChart';
import ModernTable from '@/components/ModernTable';
import { 
  FaChartBar, 
  FaUsers, 
  FaCalendarAlt, 
  FaPills, 
  FaDollarSign,
  FaDownload,
  FaFilter,
  FaEye
} from 'react-icons/fa';
import DataService from '@/services/data.service';

export default function ReportsPage() {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({});
  const [recentActivity, setRecentActivity] = useState([]);
  const [selectedPeriod, setSelectedPeriod] = useState('month');

  useEffect(() => {
    const fetchReportData = async () => {
      try {
        setLoading(true);
        const dashboardStats = await DataService.getDashboardStats();
        setStats(dashboardStats);
        
        // Mock recent activity data
        setRecentActivity([
          { id: 1, action: 'New patient registered', user: 'Dr. Smith', time: '2 hours ago', type: 'patient' },
          { id: 2, action: 'Appointment scheduled', user: 'Receptionist', time: '3 hours ago', type: 'appointment' },
          { id: 3, action: 'Medicine added to inventory', user: 'Pharmacist', time: '5 hours ago', type: 'medicine' },
          { id: 4, action: 'Staff member added', user: 'Admin', time: '1 day ago', type: 'staff' },
        ]);
      } catch (error) {
        console.error('Error fetching report data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchReportData();
  }, []);

  // Mock chart data
  const patientGrowthData = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
    values: [120, 150, 180, 220, 280, 320]
  };

  const appointmentTrendsData = {
    labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    values: [45, 52, 38, 61, 55, 42, 28]
  };

  const revenueData = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
    values: [15000, 18000, 22000, 25000, 28000, 32000]
  };

  const medicineDistributionData = {
    labels: ['Antibiotics', 'Painkillers', 'Vitamins', 'Antihistamines', 'Others'],
    values: [25, 30, 20, 15, 10]
  };

  const activityColumns = [
    { key: 'action', label: 'Action' },
    { key: 'user', label: 'User' },
    { key: 'time', label: 'Time' },
    { key: 'type', label: 'Type' }
  ];

  const handleExportReport = (type: string) => {
    // Implement export functionality
    console.log(`Exporting ${type} report`);
  };

  if (loading) {
    return (
      <DashboardLayout userType="admin" title="Reports & Analytics">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-16 w-16 border-4 border-indigo-600 border-t-transparent mx-auto"></div>
            <p className="mt-4 text-gray-700 text-lg font-semibold">Loading Reports...</p>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout userType="admin" title="Reports & Analytics">
      {/* Header with Export Options */}
      <div className="mb-8">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Reports & Analytics</h1>
            <p className="text-lg text-gray-600">Comprehensive insights into your hospital operations</p>
          </div>
          <div className="flex items-center space-x-4">
            <select
              value={selectedPeriod}
              onChange={(e) => setSelectedPeriod(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-base"
            >
              <option value="week">This Week</option>
              <option value="month">This Month</option>
              <option value="quarter">This Quarter</option>
              <option value="year">This Year</option>
            </select>
            <button
              onClick={() => handleExportReport('comprehensive')}
              className="flex items-center space-x-2 bg-indigo-600 text-white px-6 py-3 rounded-lg hover:bg-indigo-700 transition-colors font-semibold"
            >
              <FaDownload className="h-5 w-5" />
              <span>Export Report</span>
            </button>
          </div>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Patients</p>
              <p className="text-3xl font-bold text-gray-900">{stats.totalPatients || 0}</p>
              <p className="text-sm text-green-600">+12% from last month</p>
            </div>
            <div className="p-3 bg-blue-100 rounded-lg">
              <FaUsers className="h-8 w-8 text-blue-600" />
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Appointments</p>
              <p className="text-3xl font-bold text-gray-900">{stats.totalAppointments || 0}</p>
              <p className="text-sm text-green-600">+8% from last month</p>
            </div>
            <div className="p-3 bg-green-100 rounded-lg">
              <FaCalendarAlt className="h-8 w-8 text-green-600" />
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Revenue</p>
              <p className="text-3xl font-bold text-gray-900">${stats.totalRevenue || 0}</p>
              <p className="text-sm text-green-600">+15% from last month</p>
            </div>
            <div className="p-3 bg-yellow-100 rounded-lg">
              <FaDollarSign className="h-8 w-8 text-yellow-600" />
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Medicines</p>
              <p className="text-3xl font-bold text-gray-900">{stats.totalMedicines || 0}</p>
              <p className="text-sm text-red-600">-3% from last month</p>
            </div>
            <div className="p-3 bg-purple-100 rounded-lg">
              <FaPills className="h-8 w-8 text-purple-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        <AdvancedChart
          data={patientGrowthData}
          title="Patient Growth Trend"
          type="line"
          color="rgba(59, 130, 246, 0.8)"
          description="Monthly patient registration growth"
          height={350}
          showStats={true}
          showTrends={true}
        />

        <AdvancedChart
          data={appointmentTrendsData}
          title="Weekly Appointment Trends"
          type="bar"
          color="rgba(16, 185, 129, 0.8)"
          description="Appointments by day of the week"
          height={350}
          showStats={true}
        />

        <AdvancedChart
          data={revenueData}
          title="Revenue Analysis"
          type="area"
          color="rgba(245, 158, 11, 0.8)"
          description="Monthly revenue trends"
          height={350}
          showStats={true}
          showTrends={true}
        />

        <AdvancedChart
          data={medicineDistributionData}
          title="Medicine Distribution"
          type="doughnut"
          description="Distribution of medicine categories"
          height={350}
          showStats={true}
        />
      </div>

      {/* Recent Activity */}
      <div className="bg-white rounded-lg border border-gray-200 shadow-sm">
        <div className="px-6 py-4 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-bold text-gray-900">Recent Activity</h3>
            <button className="text-indigo-600 hover:text-indigo-700 font-semibold">
              View All
            </button>
          </div>
        </div>
        <ModernTable
          columns={activityColumns}
          data={recentActivity}
          onView={(row) => console.log('View activity:', row)}
        />
      </div>

      {/* Export Options */}
      <div className="mt-8 bg-white rounded-lg border border-gray-200 shadow-sm p-6">
        <h3 className="text-xl font-bold text-gray-900 mb-4">Export Reports</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <button
            onClick={() => handleExportReport('patients')}
            className="flex items-center justify-center space-x-2 p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <FaUsers className="h-6 w-6 text-blue-600" />
            <span className="font-semibold text-gray-900">Patient Report</span>
          </button>
          <button
            onClick={() => handleExportReport('appointments')}
            className="flex items-center justify-center space-x-2 p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <FaCalendarAlt className="h-6 w-6 text-green-600" />
            <span className="font-semibold text-gray-900">Appointment Report</span>
          </button>
          <button
            onClick={() => handleExportReport('financial')}
            className="flex items-center justify-center space-x-2 p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <FaDollarSign className="h-6 w-6 text-yellow-600" />
            <span className="font-semibold text-gray-900">Financial Report</span>
          </button>
        </div>
      </div>
    </DashboardLayout>
  );
} 