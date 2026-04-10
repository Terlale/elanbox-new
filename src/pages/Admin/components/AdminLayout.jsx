import React, { useState } from "react";
import { Outlet } from "react-router-dom";
import AdminSidebar from "./AdminSidebar";
import AdminHeader from "./AdminHeader";
import styles from "../styles/AdminLayout.module.scss";

const AdminLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  return (
    <div className={styles.adminLayout}>
      {}
      {sidebarOpen && (
        <div 
          className={styles.backdrop} 
          onClick={() => setSidebarOpen(false)} 
        />
      )}

      <AdminSidebar isOpen={sidebarOpen} toggleSidebar={toggleSidebar} />
      <div className={`${styles.mainContent} ${sidebarOpen ? styles.shifted : ""}`}>
        <AdminHeader isOpen={sidebarOpen} toggleSidebar={toggleSidebar} />
        <main className={styles.pageContent}>
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
