import api from "./api";

const DataService = {
  getDashboardStats: async () => {
    try {
      const response = await api.get("/admin/dashboard");
      return response.data;
    } catch (error) {
      console.error("Error fetching dashboard stats:", error);
      // Return fallback data if API fails
      return {
        totalUsers: 0,
        totalDoctors: 0,
        totalPharmacists: 0,
        totalReceptionists: 0,
        totalPatients: 0,
        totalAppointments: 0,
        totalMedicines: 0,
        activeUsers: 0
      };
    }
  },

  getAllUsers: async () => {
    try {
      const response = await api.get("/admin/users");
      return response.data;
    } catch (error) {
      console.error("Error fetching users:", error);
      return [];
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
      return [];
    }
  },
};

export default DataService;
