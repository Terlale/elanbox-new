import { createSlice } from "@reduxjs/toolkit";
import {
  fetchPremiumListings,
  fetchLatestListings,
  createListing,
  fetchUserListings,
  searchListings,
  toggleFavorite,
  fetchFavorites,
  fetchListingById,
  fetchSimilarListings,
  deleteListing
} from "../thunks/listingThunks";

const initialState = {
  premiumItems: [],
  latestItems: [],
  userItems: [],
  searchItems: [],
  favoriteItems: [],
  currentListing: null,
  similarItems: [],
  isSearching: false,
  loading: false,
  detailLoading: false,
  error: null,
};

const listingSlice = createSlice({
  name: "listings",
  initialState,
  reducers: {
    clearSearch: (state) => {
      state.searchItems = [];
      state.isSearching = false;
    },
  },

  extraReducers: (builder) => {
    builder
      
      .addCase(fetchPremiumListings.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchPremiumListings.fulfilled, (state, action) => {
        state.loading = false;
        state.premiumItems = action.payload;
      })
      .addCase(fetchPremiumListings.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      .addCase(fetchLatestListings.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchLatestListings.fulfilled, (state, action) => {
        state.loading = false;
        state.latestItems = action.payload;
      })
      .addCase(fetchLatestListings.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      .addCase(createListing.pending, (state) => {
        state.loading = true;
      })
      .addCase(createListing.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(createListing.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      .addCase(fetchUserListings.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchUserListings.fulfilled, (state, action) => {
        state.loading = false;
        state.userItems = action.payload;
      })
      .addCase(fetchUserListings.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      .addCase(searchListings.pending, (state) => {
        state.loading = true;
        state.isSearching = true;
      })
      .addCase(searchListings.fulfilled, (state, action) => {
        state.loading = false;
        state.searchItems = action.payload;
      })
      .addCase(searchListings.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      .addCase(fetchFavorites.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchFavorites.fulfilled, (state, action) => {
        state.loading = false;
        const items = Array.isArray(action.payload) ? action.payload : (action.payload?.content || []);
        state.favoriteItems = items.map(item => {
          if (item?.listing) return item.listing;
          if (!item.id && item.listingId) return { ...item, id: item.listingId };
          return item;
        });
      })
      .addCase(fetchFavorites.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      .addCase(toggleFavorite.pending, (state, action) => {
        const { listingId, isFavorite } = action.meta.arg;

        if (!isFavorite) {
          const sourceLists = [state.latestItems, state.premiumItems, state.searchItems, state.userItems, state.similarItems];
          let itemToAdd = null;
          for (const list of sourceLists) {
            const found = list.find(i => String(i.id) === String(listingId));
            if (found) { itemToAdd = found; break; }
          }
          if (!itemToAdd && state.currentListing && String(state.currentListing.id) === String(listingId)) {
            itemToAdd = state.currentListing;
          }
          if (itemToAdd && !state.favoriteItems.some(i => String(i.id) === String(listingId))) {
            state.favoriteItems.push(itemToAdd);
          }
        } else {
          state.favoriteItems = state.favoriteItems.filter(item => String(item.id) !== String(listingId));
        }
      })

      .addCase(toggleFavorite.fulfilled, (state, action) => {
        const { listingId, isFavorite } = action.payload;

        if (isFavorite) {
          const sourceLists = [state.latestItems, state.premiumItems, state.searchItems, state.userItems, state.similarItems];
          let itemToAdd = null;
          for (const list of sourceLists) {
            const found = list.find(i => String(i.id) === String(listingId));
            if (found) { itemToAdd = found; break; }
          }
          if (!itemToAdd && state.currentListing && String(state.currentListing.id) === String(listingId)) {
            itemToAdd = state.currentListing;
          }
          if (itemToAdd && !state.favoriteItems.some(i => String(i.id) === String(listingId))) {
            state.favoriteItems.push(itemToAdd);
          }
        } else {
          state.favoriteItems = state.favoriteItems.filter(item => String(item.id) !== String(listingId));
        }
      })

      .addCase(fetchListingById.pending, (state) => {
        state.detailLoading = true;
        state.currentListing = null;
      })
      .addCase(fetchListingById.fulfilled, (state, action) => {
        state.detailLoading = false;
        state.currentListing = action.payload;
      })
      .addCase(fetchListingById.rejected, (state, action) => {
        state.detailLoading = false;
        state.error = action.payload;
      })

      .addCase(fetchSimilarListings.pending, (state) => {
        state.similarItems = [];
      })
      .addCase(fetchSimilarListings.fulfilled, (state, action) => {
        state.similarItems = action.payload;
      })
      .addCase(fetchSimilarListings.rejected, (state) => {
        state.similarItems = [];
      })

      .addCase(deleteListing.pending, (state) => {
        state.loading = true;
      })
      .addCase(deleteListing.fulfilled, (state, action) => {
        state.loading = false;
        state.userItems = state.userItems.filter(item => String(item.id) !== String(action.payload));
        state.latestItems = state.latestItems.filter(item => String(item.id) !== String(action.payload));
        state.premiumItems = state.premiumItems.filter(item => String(item.id) !== String(action.payload));
        state.favoriteItems = state.favoriteItems.filter(item => String(item.id) !== String(action.payload));
      })
      .addCase(deleteListing.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

  },
});

export const { clearSearch } = listingSlice.actions;

export default listingSlice.reducer;
