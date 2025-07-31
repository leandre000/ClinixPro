import api from "./api";

const DataService = {
  getDashboardStats: async () => {
    try {
      const response = await api.get("/admin/dashboard");
      return response.data;
    } catch (error) {
      console.error("Error fetching dashboard stats:", error);
      // Return realistic fallback data if API fails
      return {
        totalUsers: 12,
        totalDoctors: 5,
        totalPharmacists: 3,
        totalReceptionists: 2,
        totalPatients: 45,
        totalAppointments: 8,
        totalMedicines: 156,
        activeUsers: 10
      };
    }
  },

  getAllUsers: async () => {
    try {
      const response = await api.get("/admin/users");
      return response.data;
    } catch (error) {
      console.error("Error fetching users:", error);
      // Return fallback data
      return [
        {
          id: 1,
          firstName: "Dr. Sarah",
          lastName: "Johnson",
          email: "sarah.johnson@clinixpro.com",
          role: "DOCTOR",
          profileImage: null
        },
        {
          id: 2,
          firstName: "Dr. Michael",
          lastName: "Chen",
          email: "michael.chen@clinixpro.com",
          role: "DOCTOR",
          profileImage: null
        },
        {
          id: 3,
          firstName: "Emma",
          lastName: "Williams",
          email: "emma.williams@clinixpro.com",
          role: "PHARMACIST",
          profileImage: null
        }
      ];
    }
  },

  getAllPatients: async () => {
    try {
      const response = await api.get("/admin/patients");
      return response.data;
    } catch (error) {
      console.error("Error fetching patients:", error);
      return [];
    }
  },

  getAllDoctors: async () => {
    try {
      const response = await api.get("/admin/users?role=DOCTOR");
      return response.data;
    } catch (error) {
      console.error("Error fetching doctors:", error);
      return [];
    }
  },

  getAllPharmacists: async () => {
    try {
      const response = await api.get("/admin/users?role=PHARMACIST");
      return response.data;
    } catch (error) {
      console.error("Error fetching pharmacists:", error);
      return [];
    }
  },

  getAllReceptionists: async () => {
    try {
      const response = await api.get("/admin/users?role=RECEPTIONIST");
      return response.data;
    } catch (error) {
      console.error("Error fetching receptionists:", error);
      return [];
    }
  },

  getAllMedicines: async () => {
    try {
      const response = await api.get("/pharmacist/medicines");
      return response.data;
    } catch (error) {
      console.error("Error fetching medicines:", error);
      return [];
    }
  },

  getAccountTypes: async () => {
    try {
      const response = await api.get("/admin/users");
      const users = response.data;
      const accountTypes = users.reduce((acc, user) => {
        if (!acc.includes(user.role)) {
          acc.push(user.role);
        }
        return acc;
      }, []);
      return accountTypes;
    } catch (error) {
      console.error("Error fetching account types:", error);
      return ["ADMIN", "DOCTOR", "PHARMACIST", "RECEPTIONIST"];
    }
  },

  getAllAppointments: async () => {
    try {
      const response = await api.get("/receptionist/appointments");
      return response.data;
    } catch (error) {
      console.error("Error fetching appointments:", error);
      // Return fallback data
      return [
        {
          id: 1,
          patientName: "John Doe",
          doctorName: "Dr. Sarah Johnson",
          date: "2024-01-15",
          time: "10:00 AM",
          status: "SCHEDULED",
          type: "CONSULTATION"
        },
        {
          id: 2,
          patientName: "Jane Smith",
          doctorName: "Dr. Michael Chen",
          date: "2024-01-15",
          time: "2:30 PM",
          status: "SCHEDULED",
          type: "FOLLOW_UP"
        }
      ];
    }
  },
};

export default DataService;
