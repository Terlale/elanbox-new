import { createAsyncThunk } from '@reduxjs/toolkit';
import { adminService } from '../../services/adminService';

export const fetchAdminUsers = createAsyncThunk('admin/fetchUsers', async (_, { rejectWithValue }) => {
  try {
    const response = await adminService.getUsers();
    return response.data;
  } catch (error) {
    return rejectWithValue(error.response?.data || 'Failed to fetch users');
  }
});

export const updateAdminUserStatus = createAsyncThunk('admin/updateUserStatus', async ({ id, status }, { rejectWithValue }) => {
  try {
    const response = await adminService.updateUserStatus(id, status);
    return (response.data && response.data.id) ? response.data : { id, status };
  } catch (error) {
    return rejectWithValue(error.response?.data || 'Failed to update user status');
  }
});

export const fetchAdminReports = createAsyncThunk('admin/fetchReports', async ({ page = 0, size = 10 } = {}, { rejectWithValue }) => {
  try {
    const response = await adminService.getReports(page, size);
    return response.data;
  } catch (error) {
    return rejectWithValue(error.response?.data || 'Failed to fetch reports');
  }
});

export const fetchAdminListings = createAsyncThunk('admin/fetchListings', async (_, { rejectWithValue }) => {
  try {
    const response = await adminService.getListings();
    return response.data;
  } catch (error) {
    return rejectWithValue(error.response?.data || 'Failed to fetch listings');
  }
});

export const updateAdminListingStatus = createAsyncThunk('admin/updateListingStatus', async ({ id, status }, { rejectWithValue }) => {
  try {
    const response = await adminService.updateListingStatus(id, status);
    return response.data;
  } catch (error) {
    return rejectWithValue(error.response?.data || 'Failed to update listing status');
  }
});

export const approveListing = createAsyncThunk(
  "admin/approveListing",
  async (id, { rejectWithValue }) => {
    try {
      const response = await adminService.updateListingStatus(id, "ACTIVE");
      return (response.data && response.data.id) ? response.data : { id, status: "ACTIVE" };
    } catch (error) {
      return rejectWithValue(error.response?.data || "Failed to approve listing");
    }
  }
);

export const rejectListing = createAsyncThunk(
  "admin/rejectListing",
  async (id, { rejectWithValue }) => {
    try {
      const response = await adminService.updateListingStatus(id, "REJECTED");
      return (response.data && response.data.id) ? response.data : { id, status: "REJECTED" };
    } catch (error) {
      return rejectWithValue(error.response?.data || "Failed to reject listing");
    }
  }
);

export const deleteAdminUser = createAsyncThunk(
  "admin/deleteUser",
  async (id, { rejectWithValue }) => {
    try {
      await adminService.deleteUser(id);
      return id;
    } catch (error) {
      return rejectWithValue(error.response?.data || "Failed to delete user");
    }
  }
);

export const fetchUserDetails = createAsyncThunk(
  "admin/fetchUserDetails",
  async (id, { rejectWithValue }) => {
    try {
      const response = await adminService.getUserById(id);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || "Failed to fetch user details");
    }
  }
);

export const blockReportedUser = createAsyncThunk(
  "admin/blockReportedUser",
  async (id, { dispatch, rejectWithValue }) => {
    try {
      await dispatch(updateAdminUserStatus({ id, status: "INACTIVE" })).unwrap();
      return id;
    } catch (error) {
      return rejectWithValue(error || "Failed to block user");
    }
  }
);

export const resolveAdminReport = createAsyncThunk(
  "admin/resolveReport",
  async (id, { rejectWithValue }) => {
    try {
      const response = await adminService.updateReportStatus(id, "RESOLVED");
      return response.data.id || id;
    } catch (error) {
      return rejectWithValue(error.response?.data || "Failed to resolve report");
    }
  }
);

export const deleteAdminReport = createAsyncThunk(
  "admin/deleteReport",
  async (id, { rejectWithValue }) => {
    try {
      await adminService.deleteReport(id);
      return id;
    } catch (error) {
      return rejectWithValue(error.response?.data || "Failed to delete report");
    }
  }
);

export const fetchAdminRoles = createAsyncThunk('admin/fetchRoles', async (_, { rejectWithValue }) => {
  try {
    const response = await adminService.getRoles();
    return response.data;
  } catch (error) {
    return rejectWithValue(error.response?.data || 'Failed to fetch roles');
  }
});

export const createAdminRole = createAsyncThunk('admin/createRole', async (roleData, { rejectWithValue }) => {
  try {
    const response = await adminService.createRole(roleData);
    return response.data;
  } catch (error) {
    return rejectWithValue(error.response?.data || 'Failed to create role');
  }
});

export const updateAdminRole = createAsyncThunk('admin/updateRole', async (roleData, { rejectWithValue }) => {
  try {
    const response = await adminService.updateRole(roleData);
    return response.data;
  } catch (error) {
    return rejectWithValue(error.response?.data || 'Failed to update role');
  }
});

export const fetchAdminDynamicFields = createAsyncThunk('admin/fetchDynamicFields', async (_, { rejectWithValue }) => {
  try {
    const response = await adminService.getDynamicFields();
    return response.data;
  } catch (error) {
    return rejectWithValue(error.response?.data || 'Failed to fetch dynamic fields');
  }
});

export const createAdminDynamicField = createAsyncThunk('admin/createDynamicField', async (data, { rejectWithValue }) => {
  try {
    const response = await adminService.createDynamicField(data);
    return response.data;
  } catch (error) {
    return rejectWithValue(error.response?.data || 'Failed to create dynamic field');
  }
});

export const updateAdminDynamicField = createAsyncThunk('admin/updateDynamicField', async ({ id, data }, { rejectWithValue }) => {
  try {
    const response = await adminService.updateDynamicField(id, data);
    return response.data;
  } catch (error) {
    return rejectWithValue(error.response?.data || 'Failed to update dynamic field');
  }
});

export const deleteAdminDynamicField = createAsyncThunk('admin/deleteDynamicField', async (id, { rejectWithValue }) => {
  try {
    await adminService.deleteDynamicField(id);
    return id;
  } catch (error) {
    console.error("Delete dynamic field error:", error);
    const apiError = error.response?.data?.message || error.response?.data;
    const finalError = typeof apiError === 'string' ? apiError : 'Dinamik sahə silinmədi. Elanlarda istifadə oluna bilər.';
    return rejectWithValue(finalError);
  }
});

export const fetchAdminCategories = createAsyncThunk('admin/fetchCategories', async (_, { rejectWithValue }) => {
  try {
    const response = await adminService.getAdminCategories();
    return response.data;
  } catch (error) {
    return rejectWithValue(error.response?.data || 'Failed to fetch categories');
  }
});

export const createAdminCategory = createAsyncThunk('admin/createCategory', async (data, { rejectWithValue }) => {
  try {
    const response = await adminService.createCategory(data);
    return response.data;
  } catch (error) {
    return rejectWithValue(error.response?.data || 'Failed to create category');
  }
});

export const updateAdminCategory = createAsyncThunk('admin/updateCategory', async ({ id, data }, { rejectWithValue }) => {
  try {
    const response = await adminService.updateCategory(id, data);
    return response.data;
  } catch (error) {
    return rejectWithValue(error.response?.data || 'Failed to update category');
  }
});

export const deleteAdminCategory = createAsyncThunk('admin/deleteCategory', async (id, { rejectWithValue }) => {
  try {
    await adminService.deleteCategory(id);
    return id;
  } catch (error) {
    return rejectWithValue(error.response?.data || 'Failed to delete category');
  }
});

export const deleteListingAdmin = createAsyncThunk(
  "admin/deleteListing",
  async (id, { rejectWithValue }) => {
    try {
      await adminService.deleteListingAdmin(id);
      return id;
    } catch (error) {
      return rejectWithValue(error.response?.data || "Failed to delete listing");
    }
  }
);

export const fetchDashboardStats = createAsyncThunk('admin/fetchDashboardStats', async (_, { rejectWithValue }) => {
  try {
    const response = await adminService.getDashboardStats();
    return response.data;
  } catch (error) {
    return rejectWithValue(error.response?.data || 'Failed to fetch dashboard stats');
  }
});

export const fetchAllAnalytics = createAsyncThunk('admin/fetchAllAnalytics', async (_, { rejectWithValue }) => {
  try {
    const [activeUsers, listingsCount, categoriesStats, popularCities] = await Promise.all([
      adminService.getActiveUsersCount(),
      adminService.getListingsCount(),
      adminService.getCategoriesStats(),
      adminService.getPopularCities()
    ]);
    return {
      activeUsers: activeUsers.data,
      listingsCount: listingsCount.data,
      categoriesStats: categoriesStats.data,
      popularCities: popularCities.data
    };
  } catch (error) {
    return rejectWithValue(error.response?.data || 'Failed to fetch analytics');
  }
});
