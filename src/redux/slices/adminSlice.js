import { createSlice } from '@reduxjs/toolkit';
import {
  fetchAdminUsers,
  updateAdminUserStatus,
  fetchAdminReports,
  fetchAdminListings,
  updateAdminListingStatus,
  approveListing,
  rejectListing,
  fetchDashboardStats,
  fetchAllAnalytics,
  deleteAdminUser,
  resolveAdminReport,
  deleteAdminReport,
  deleteListingAdmin,
  fetchAdminRoles,
  createAdminRole,
  updateAdminRole,
  fetchAdminDynamicFields,
  createAdminDynamicField,
  updateAdminDynamicField,
  deleteAdminDynamicField,
  fetchAdminCategories,
  createAdminCategory,
  updateAdminCategory,
  deleteAdminCategory
} from '../thunks/adminThunk';

const initialState = {
  users: [],
  reports: [],
  listings: [],
  roles: [],
  dynamicFields: [],
  categories: [],
  dashboardStats: null,
  analyticsData: {
    activeUsers: [],
    listingsCount: [],
    categoriesStats: [],
    popularCities: []
  },
  loading: false,
  error: null
};

const handlePending = (state) => {
  state.loading = true;
  state.error = null;
};
const handleRejected = (state, action) => {
  state.loading = false;
  state.error = action.payload || 'An error occurred';
};

const adminSlice = createSlice({
  name: 'admin',
  initialState,
  reducers: {
    clearAdminError: (state) => {
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    builder.addCase(fetchAdminUsers.pending, handlePending)
           .addCase(fetchAdminUsers.fulfilled, (state, action) => {
               state.loading = false;
               state.users = action.payload;
           })
           .addCase(fetchAdminUsers.rejected, handleRejected);

    builder.addCase(updateAdminUserStatus.fulfilled, (state, action) => {
      const index = state.users.findIndex(u => u.id === action.payload.id);
      if (index !== -1) {
        state.users[index] = { ...state.users[index], ...action.payload };
      }
    });

    builder.addCase(deleteAdminUser.fulfilled, (state, action) => {
      state.users = state.users.filter(u => u.id !== action.payload);
    });

    builder.addCase(fetchAdminReports.pending, handlePending)
            .addCase(fetchAdminReports.fulfilled, (state, action) => {
              state.loading = false;
              state.reports = action.payload.content || action.payload;
              state.pagination = {
                totalElements: action.payload.totalElements,
                totalPages: action.payload.totalPages,
                pageNumber: action.payload.pageable?.pageNumber
              };
            })
           .addCase(fetchAdminReports.rejected, handleRejected);

    builder.addCase(resolveAdminReport.fulfilled, (state, action) => {
      const index = state.reports.findIndex(r => r.id === action.payload);
      if (index !== -1) {
        state.reports[index].status = "RESOLVED";
      }
    });

    builder.addCase(deleteAdminReport.fulfilled, (state, action) => {
      state.reports = state.reports.filter(r => r.id !== action.payload);
    });

    builder.addCase(fetchAdminListings.pending, handlePending)
           .addCase(fetchAdminListings.fulfilled, (state, action) => {
             state.loading = false;
             state.listings = action.payload;
           })
           .addCase(fetchAdminListings.rejected, handleRejected);

    builder.addCase(updateAdminListingStatus.fulfilled, (state, action) => {
      const index = state.listings.findIndex(l => l.id === action.payload.id);
      if (index !== -1) {
        state.listings[index] = action.payload;
      }
    });

    builder.addCase(approveListing.fulfilled, (state, action) => {
      const index = state.listings.findIndex(l => l.id === action.payload.id);
      if (index !== -1) {
        state.listings[index] = { ...state.listings[index], ...action.payload };
      }
    });

    builder.addCase(rejectListing.fulfilled, (state, action) => {
      const index = state.listings.findIndex(l => l.id === action.payload.id);
      if (index !== -1) {
        state.listings[index] = { ...state.listings[index], ...action.payload };
      }
    });

    builder.addCase(deleteListingAdmin.fulfilled, (state, action) => {
      state.listings = state.listings.filter(l => l.id !== action.payload);
    });

    builder.addCase(fetchAdminRoles.pending, handlePending)
           .addCase(fetchAdminRoles.fulfilled, (state, action) => {
             state.loading = false;
             state.roles = action.payload;
           })
           .addCase(fetchAdminRoles.rejected, handleRejected);

    builder.addCase(createAdminRole.fulfilled, (state, action) => {
      state.roles.push(action.payload);
    });

    builder.addCase(updateAdminRole.fulfilled, (state, action) => {
      const index = state.roles.findIndex(r => r.name === action.payload.name);
      if (index !== -1) {
        state.roles[index] = action.payload;
      }
    });

    builder.addCase(fetchAdminDynamicFields.pending, handlePending)
           .addCase(fetchAdminDynamicFields.fulfilled, (state, action) => {
             state.loading = false;
             state.dynamicFields = action.payload;
           })
           .addCase(fetchAdminDynamicFields.rejected, handleRejected);

    builder.addCase(createAdminDynamicField.pending, handlePending)
           .addCase(createAdminDynamicField.fulfilled, (state, action) => {
             state.loading = false;
             state.dynamicFields.push(action.payload);
           })
           .addCase(createAdminDynamicField.rejected, handleRejected);

    builder.addCase(updateAdminDynamicField.pending, handlePending)
           .addCase(updateAdminDynamicField.fulfilled, (state, action) => {
             state.loading = false;
             const index = state.dynamicFields.findIndex(f => Number(f.id) === Number(action.payload.id));
             if (index !== -1) {
               state.dynamicFields[index] = action.payload;
             }
           })
           .addCase(updateAdminDynamicField.rejected, handleRejected);

    builder.addCase(deleteAdminDynamicField.pending, handlePending)
           .addCase(deleteAdminDynamicField.fulfilled, (state, action) => {
             state.loading = false;
             state.dynamicFields = state.dynamicFields.filter(f => Number(f.id) !== Number(action.payload));
           })
           .addCase(deleteAdminDynamicField.rejected, handleRejected);

    builder.addCase(fetchAdminCategories.pending, handlePending)
           .addCase(fetchAdminCategories.fulfilled, (state, action) => {
             state.loading = false;
             state.categories = action.payload;
           })
           .addCase(fetchAdminCategories.rejected, handleRejected);

    builder.addCase(createAdminCategory.fulfilled, (state, action) => {
      state.categories.push(action.payload);
    });

    builder.addCase(updateAdminCategory.fulfilled, (state, action) => {
      const index = state.categories.findIndex(c => c.id === action.payload.id);
      if (index !== -1) {
        state.categories[index] = action.payload;
      }
    });

    builder.addCase(deleteAdminCategory.fulfilled, (state, action) => {
      state.categories = state.categories.filter(c => c.id !== action.payload);
    });

    builder.addCase(fetchDashboardStats.pending, handlePending)
           .addCase(fetchDashboardStats.fulfilled, (state, action) => {
             state.loading = false;
             state.dashboardStats = action.payload;
           })
           .addCase(fetchDashboardStats.rejected, handleRejected);

    builder.addCase(fetchAllAnalytics.pending, handlePending)
           .addCase(fetchAllAnalytics.fulfilled, (state, action) => {
             state.loading = false;
             state.analyticsData = action.payload;
           })
           .addCase(fetchAllAnalytics.rejected, handleRejected);
  }
});

export const { clearAdminError } = adminSlice.actions;
export default adminSlice.reducer;
