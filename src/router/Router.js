import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import Home from "../pages/Home/Home";
import Login from "../pages/Auth/Login/Login";
import Register from "../pages/Auth/Register/Register";
import ForgotPassword from "../pages/Auth/ForgotPassword/ForgotPassword";
import VerifySuccess from "../pages/Auth/VerifySuccess/VerifySuccess";
import InformCard from "../pages/InformCard/InformCard";
import UserDetail from "../pages/UserDetail/UserDetail";

import AdminLayout from "../pages/Admin/components/AdminLayout";
import AdminDashboard from "../pages/Admin/AdminDashboard";
import Users from "../pages/Admin/pages/Users";
import Categories from "../pages/Admin/pages/Categories";
import Listings from "../pages/Admin/pages/Listings";
import Reports from "../pages/Admin/pages/Reports";
import DynamicFields from "../pages/Admin/pages/DynamicFields";
import Roles from "../pages/Admin/pages/Roles";
import Analytics from "../pages/Admin/pages/Analytics";
import Setting from "../pages/Setting/Setting";

import AuthProvider from "../auth/AuthProvider";
import PrivateRoute from "../guards/PrivateRoute";
import AdminRoute from "../guards/AdminRoute";

import Profile from "../pages/Setting/sections/Profile";
import MyAds from "../pages/Setting/sections/MyAds";
import Favorites from "../pages/Setting/sections/Favorites";
import Security from "../pages/Setting/sections/Security";
import BlockedUsers from "../pages/Setting/sections/BlockedUsers";
import MyReports from "../pages/Setting/sections/MyReports";
import Logout from "../pages/Setting/sections/Logout";

import MyAdsProduct from "../pages/MyAdsProduct/MyAdsProduct";

import Messages from "../pages/Messages/Messages";

const Router = () => {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>

          {}
          <Route path="/" element={<Home />} />
          <Route path="/home" element={<Home />} />
          <Route path="/listings/:id" element={<InformCard />} />
          <Route path="/users/:id" element={<UserDetail />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/verify-success" element={<VerifySuccess />} />

          {}
          <Route element={<PrivateRoute />}>

            {}
            <Route path="/settings" element={<Setting />}>
              <Route index element={<Profile />} />
              <Route path="my-ads" element={<MyAds />} />
              <Route path="favorites" element={<Favorites />} />
              <Route path="security" element={<Security />} />
              <Route path="logout" element={<Logout />} />
            </Route>

            {}
            <Route path="/add-product" element={<MyAdsProduct />} />
            <Route path="/edit-listing/:id" element={<MyAdsProduct />} />

            {}
            <Route path="/messages" element={<Messages />} />

            {}
            <Route element={<AdminLayout />}>
              <Route element={<AdminRoute />}>
                <Route path="/admin/dashboard" element={<AdminDashboard />} />
                <Route path="/admin/users" element={<Users />} />
                <Route path="/admin/categories" element={<Categories />} />
                <Route path="/admin/listings" element={< Listings />} />
                <Route path="/admin/reports" element={<Reports />} />
                <Route path="/admin/dynamic-fields" element={<DynamicFields />} />
                <Route path="/admin/roles" element={<Roles />} />
                <Route path="/admin/analytics" element={<Analytics />} />
              </Route>
            </Route>

          </Route>

        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
};

export default Router;
