"use client";

import React, { useState, useEffect } from 'react';
import DashboardLayout from '@/components/DashboardLayout';
import { FaPlus, FaEdit, FaTrash, FaRedo, FaEye, FaEyeSlash } from 'react-icons/fa';
import DataService from '@/services/data.service';
import ConfirmationModal from '@/components/ConfirmationModal';

export default function StaffPage() {
  const [staff, setStaff] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [showDeactivateConfirm, setShowDeactivateConfirm] = useState(false);
  const [selectedStaff, setSelectedStaff] = useState(null);

  const fetchStaff = async () => {
    try {
      setLoading(true);
      setError('');
      const response = await DataService.getAllUsers();
      
      if (response && response.length > 0) {
        // Transform the data to match our expected format
        const transformedStaff = response.map(user => ({
          id: user.id,
          name: `${user.firstName} ${user.lastName}`,
          email: user.email,
          role: user.role,
          phone: user.phone || 'N/A',
          status: user.isActive ? 'Active' : 'Inactive',
          joinDate: user.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'N/A'
        }));
        setStaff(transformedStaff);
      } else {
        setStaff([]);
        setError('No staff data available');
      }
    } catch (err) {
      console.error('Error fetching staff:', err);
      setError('Failed to load staff data');
      setStaff([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStaff();
  }, []);

  const handleDeactivateStaff = (staffMember) => {
    setSelectedStaff(staffMember);
    setShowDeactivateConfirm(true);
  };

  const handleDeleteStaff = (staffMember) => {
    setSelectedStaff(staffMember);
    setShowDeleteConfirm(true);
  };

  const confirmDeactivateStaff = async () => {
    if (!selectedStaff) return;
    
    try {
      // API call to deactivate staff would go here
      // await DataService.deactivateUser(selectedStaff.id);
      
      // Update local state
      setStaff(prevStaff => 
        prevStaff.map(s => 
          s.id === selectedStaff.id 
            ? { ...s, status: s.status === 'Active' ? 'Inactive' : 'Active' }
            : s
        )
      );
      
      setShowDeactivateConfirm(false);
      setSelectedStaff(null);
    } catch (error) {
      console.error('Error deactivating staff:', error);
      setError('Failed to deactivate staff member');
    }
  };

  const confirmDeleteStaff = async () => {
    if (!selectedStaff) return;
    
    try {
      // API call to delete staff would go here
      // await DataService.deleteUser(selectedStaff.id);
      
      // Update local state
      setStaff(prevStaff => prevStaff.filter(s => s.id !== selectedStaff.id));
      
      setShowDeleteConfirm(false);
      setSelectedStaff(null);
    } catch (error) {
      console.error('Error deleting staff:', error);
      setError('Failed to delete staff member');
    }
  };

  const filteredStaff = staff.filter(member =>
    member.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    member.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    member.role.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStatusColor = (status) => {
    return status === 'Active' ? 'text-green-600 bg-green-100' : 'text-red-600 bg-red-100';
  };

  const getRoleColor = (role) => {
    const colors = {
      'ADMIN': 'bg-purple-100 text-purple-800',
      'DOCTOR': 'bg-blue-100 text-blue-800',
      'PHARMACIST': 'bg-green-100 text-green-800',
      'RECEPTIONIST': 'bg-orange-100 text-orange-800',
      'NURSE': 'bg-pink-100 text-pink-800'
    };
    return colors[role] || 'bg-gray-100 text-gray-800';
  };

  return (
    <DashboardLayout userType="admin" title="Staff Management">
      <div className="container mx-auto p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-gray-800">Staff Management</h1>
          <button
            onClick={() => window.location.href = '/admin/staff/new'}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center gap-2"
          >
            <FaPlus /> Add New Staff
          </button>
        </div>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}

        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex justify-between items-center mb-4">
            <div className="flex items-center gap-4">
              <input
                type="text"
                placeholder="Search staff..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <button
              onClick={fetchStaff}
              className="text-gray-600 hover:text-gray-800"
              title="Refresh"
            >
              <FaRedo />
            </button>
          </div>

          {loading ? (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
              <p className="mt-2 text-gray-600">Loading staff data...</p>
            </div>
          ) : filteredStaff.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-gray-600">No staff members found</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Name
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Email
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Role
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Phone
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Join Date
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredStaff.map((member) => (
                    <tr key={member.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">{member.name}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{member.email}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getRoleColor(member.role)}`}>
                          {member.role}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {member.phone}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(member.status)}`}>
                          {member.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {member.joinDate}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex space-x-2">
                          <button
                            onClick={() => window.location.href = `/admin/staff/${member.id}`}
                            className="text-blue-600 hover:text-blue-900"
                            title="View"
                          >
                            <FaEye />
                          </button>
                          <button
                            onClick={() => window.location.href = `/admin/staff/${member.id}/edit`}
                            className="text-green-600 hover:text-green-900"
                            title="Edit"
                          >
                            <FaEdit />
                          </button>
                          <button
                            onClick={() => handleDeactivateStaff(member)}
                            className="text-yellow-600 hover:text-yellow-900"
                            title={member.status === 'Active' ? 'Deactivate' : 'Activate'}
                          >
                            {member.status === 'Active' ? <FaEyeSlash /> : <FaEye />}
                          </button>
                          <button
                            onClick={() => handleDeleteStaff(member)}
                            className="text-red-600 hover:text-red-900"
                            title="Delete"
                          >
                            <FaTrash />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* Confirmation Modals */}
      <ConfirmationModal
        isOpen={showDeleteConfirm}
        onClose={() => setShowDeleteConfirm(false)}
        onConfirm={confirmDeleteStaff}
        title="Delete Staff Member"
        message={`Are you sure you want to delete ${selectedStaff?.name}? This action cannot be undone.`}
        confirmText="Delete"
        cancelText="Cancel"
        type="danger"
      />

      <ConfirmationModal
        isOpen={showDeactivateConfirm}
        onClose={() => setShowDeactivateConfirm(false)}
        onConfirm={confirmDeactivateStaff}
        title={`${selectedStaff?.status === 'Active' ? 'Deactivate' : 'Activate'} Staff Member`}
        message={`Are you sure you want to ${selectedStaff?.status === 'Active' ? 'deactivate' : 'activate'} ${selectedStaff?.name}?`}
        confirmText={selectedStaff?.status === 'Active' ? 'Deactivate' : 'Activate'}
        cancelText="Cancel"
        type="warning"
      />
    </DashboardLayout>
  );
} 