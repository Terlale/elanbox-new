import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchAdminUsers, updateAdminUserStatus, deleteAdminUser } from "../../../redux/thunks/adminThunk";
import UsersTable from "../components/UsersTable";
import UserDetailModal from "../components/UserDetailModal";
import styles from "../styles/Dashboard.module.scss";

const Users = () => {
  const dispatch = useDispatch();
  const { users, loading } = useSelector((state) => state.admin);

  const [processingId, setProcessingId] = React.useState(null);
  const [selectedUser, setSelectedUser] = React.useState(null);
  const [isModalOpen, setIsModalOpen] = React.useState(false);

  useEffect(() => {
    dispatch(fetchAdminUsers());
  }, [dispatch]);

  const handleUpdateStatus = async (id, status) => {
    setProcessingId(id);
    try {
      await dispatch(updateAdminUserStatus({ id, status })).unwrap();
      alert("İstifadəçi statusu uğurla yeniləndi!");
    } catch (err) {
      console.error("User Status Update Error:", err);
      const msg = typeof err === 'string' ? err : (err.message || "Xəta baş verdi");
      alert("Xəta: " + msg);
    } finally {
      setProcessingId(null);
    }
  };

  const handleDeleteUser = async (id) => {
    if (!window.confirm("Bu istifadəçini silmək istədiyinizə əminsiniz?")) return;
    
    setProcessingId(id);
    try {
      await dispatch(deleteAdminUser(id)).unwrap();
      alert("İstifadəçi uğurla silindi!");
    } catch (err) {
      console.error("User Deletion Error:", err);
      const msg = typeof err === 'string' ? err : (err.message || "Xəta baş verdi");
      alert("Xəta: " + msg);
    } finally {
      setProcessingId(null);
    }
  };

  const handleViewUser = (user) => {
    setSelectedUser(user);
    setIsModalOpen(true);
  };

  if (loading && users.length === 0) {
    return (
      <div className={styles.loadingState}>
        <div className={styles.spinner}></div>
        <p>Loading Users...</p>
      </div>
    );
  }

  return (
    <div className={styles.pageContainer}>
      <header className={styles.pageHeader}>
        <h1>Users Management</h1>
        <p>Manage and monitor all users of the marketplace.</p>
      </header>

      <UsersTable 
        users={users} 
        onUpdateStatus={handleUpdateStatus} 
        onDelete={handleDeleteUser}
        onView={handleViewUser}
        processingId={processingId}
      />

      {isModalOpen && (
        <UserDetailModal 
          user={selectedUser} 
          onClose={() => setIsModalOpen(false)} 
        />
      )}
    </div>
  );
};

export default Users;
