import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchAdminRoles, createAdminRole, updateAdminRole } from "../../../redux/thunks/adminThunk";
import RolesTable from "../components/RolesTable";
import RoleModal from "../components/RoleModal";
import { FaPlus } from "react-icons/fa";
import styles from "../styles/Dashboard.module.scss";

const Roles = () => {
  const dispatch = useDispatch();
  const { roles, loading } = useSelector((state) => state.admin);
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedRole, setSelectedRole] = useState(null);
  const [actionLoading, setActionLoading] = useState(false);

  useEffect(() => {
    dispatch(fetchAdminRoles());
  }, [dispatch]);

  const handleCreateRole = () => {
    setSelectedRole(null);
    setIsModalOpen(true);
  };

  const handleEditRole = (role) => {
    setSelectedRole(role);
    setIsModalOpen(true);
  };

  const handleSaveRole = async (roleData) => {
    setActionLoading(true);
    try {
      if (selectedRole) {
        await dispatch(updateAdminRole(roleData)).unwrap();
        alert("Rol uğurla yeniləndi!");
      } else {
        await dispatch(createAdminRole(roleData)).unwrap();
        alert("Yeni rol yaradıldı!");
      }
      setIsModalOpen(false);
    } catch (error) {
      alert("Xəta baş verdi: " + (error.message || error));
    } finally {
      setActionLoading(false);
    }
  };

  if (loading && roles.length === 0) {
    return (
      <div className={styles.loadingState}>
        <div className={styles.spinner}></div>
        <p>Rollar yüklənir...</p>
      </div>
    );
  }

  return (
    <div className={styles.pageContainer}>
      <header className={styles.pageHeader}>
        <div>
          <h1>Rolların İdarə Edilməsi</h1>
          <p>Admin rollarını və icazələrini tənzimləyin.</p>
        </div>
        <button className={styles.primaryBtn} onClick={handleCreateRole} style={{ background: "#17a6f5", color: "white", padding: "10px 24px", borderRadius: "8px", display: "flex", alignItems: "center", gap: "8px" }}>
          <FaPlus />
          <span>Yeni Rol</span>
        </button>
      </header>

      <RolesTable roles={roles} onEdit={handleEditRole} />

      {isModalOpen && (
        <RoleModal 
          role={selectedRole} 
          onClose={() => setIsModalOpen(false)} 
          onSave={handleSaveRole}
          loading={actionLoading}
        />
      )}
    </div>
  );
};

export default Roles;
