import { api } from "../api/axios";

class AdminService {
  getUsers = () => api.get("/admins/users");
  updateUserStatus = (id, status) => api.patch(`/admins/users/${id}/status`, null, { params: { status } });

  getReports = (page = 0, size = 10) => api.get("/reports", { params: { page, size } });
  updateReportStatus = (id, status) => api.patch(`/reports/${id}/status`, null, { params: { status } });
  getReportById = (id) => api.get(`/reports/${id}`);
  deleteReport = (id) => api.delete(`/reports/${id}`);

  getRoles = () => api.get("/admins/roles");
  createRole = (roleData) => api.post("/admins/roles", roleData);
  updateRole = (roleData) => api.patch("/admins/roles", roleData);

  getDashboardStats = () => api.get("/analytics/dashboard");
  getActiveUsersCount = () => api.get("/analytics/active-users-count");
  getListingsCount = () => api.get("/analytics/listings-count");
  getCategoriesStats = () => api.get("/analytics/categories-stats");
  getPopularCities = () => api.get("/analytics/popular-cities");

  getDynamicFields = () => api.get("/dynamic-fields");
  getDynamicFieldById = (id) => api.get(`/dynamic-fields/${id}`);
  createDynamicField = (data) => api.post("/dynamic-fields", data);
  updateDynamicField = (id, data) => api.put(`/dynamic-fields/${id}`, data);
  deleteDynamicField = (id) => api.delete(`/dynamic-fields/${id}`);

  getListings = () => api.get("/listings");
  updateListingStatus = (id, status) => api.patch(`/listings/${id}/status`, null, { params: { status } });

  getAdminCategories = () => api.get("/categories");
  createCategory = (data) => api.post("/categories", data);
  updateCategory = (id, data) => api.put(`/categories/${id}`, data);
  deleteCategory = (id) => api.delete(`/categories/${id}`);

  deleteUser = (id) => api.delete(`/admins/profile/${id}/delete`);
  getUserById = (id) => api.get(`/users/${id}`);
  deleteListingAdmin = (id) => api.delete(`/listings/${id}`); 
}

export const adminService = new AdminService();
