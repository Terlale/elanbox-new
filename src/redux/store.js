import { configureStore } from "@reduxjs/toolkit";
import categoryReducer from "./slices/categorySlice";
import authReducer from "./slices/authSlice";
import listingReducer from "./slices/listingSlice";
import dynamicFieldReducer from "./slices/dynamicFieldSlice";
import messageReducer from "./slices/messageSlice";
import adminReducer from "./slices/adminSlice";
import blockReducer from "./slices/blockSlice";
import reportReducer from "./slices/reportSlice";

export const store = configureStore({
  reducer: {
    categories: categoryReducer,
    auth: authReducer,
    listings: listingReducer,
    dynamicFields: dynamicFieldReducer,
    messages: messageReducer,
    admin: adminReducer,
    blocks: blockReducer,
    reports: reportReducer,
  },
});
