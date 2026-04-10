import React from "react";
import { FaUserCheck, FaUserSlash, FaEye, FaTrash } from "react-icons/fa";
import styles from "../styles/Table.module.scss";

const UsersTable = ({ users, onUpdateStatus, onDelete, onView, processingId }) => {
  return (
    <div className={styles.tableContainer}>
      <div className={styles.tableHeader}>
        <h3>Users Management</h3>
      </div>
      <div className={styles.tableWrapper}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>User</th>
              <th>Email</th>
              <th>Phone</th>
              <th>City</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.length > 0 ? (
              users.map((user) => (
                <tr key={user.id}>
                  <td>
                    <div className={styles.userCell}>
                      <div className={styles.avatar}>
                        {user.avatar ? (
                          <img src={user.avatar} alt={user.fullName} />
                        ) : (
                          user.fullName?.charAt(0).toUpperCase() || "U"
                        )}
                      </div>
                      <div className={styles.userInfo}>
                        <span className={styles.name}>{user.fullName}</span>
                      </div>
                    </div>
                  </td>
                  <td>{user.email}</td>
                  <td>{user.phone || "N/A"}</td>
                  <td>{user.city || "Baku"}</td>
                  <td>
                    <span className={`${styles.statusBadge} ${styles[(user.status || "").toLowerCase()] || ""}`}>
                      {user.status || "Active"}
                    </span>
                  </td>
                  <td>
                    <div className={styles.actions}>
                      <button 
                        className={styles.actionBtn} 
                        title="View Details"
                        onClick={() => onView(user)}
                        disabled={processingId === user.id}
                      >
                        <FaEye />
                      </button>
                      {(user.status || "").toUpperCase() === "INACTIVE" ? (
                        <button 
                          className={`${styles.actionBtn} ${styles.activate}`} 
                          title="Activate"
                          onClick={() => onUpdateStatus(user.id, "ACTIVE")}
                          disabled={processingId === user.id}
                        >
                          {processingId === user.id ? <div className={styles.btnSpinner} /> : <FaUserCheck />}
                        </button>
                      ) : (
                        <button 
                          className={`${styles.actionBtn} ${styles.deactivate}`} 
                          title="Deactivate"
                          onClick={() => onUpdateStatus(user.id, "INACTIVE")}
                          disabled={processingId === user.id}
                        >
                          {processingId === user.id ? <div className={styles.btnSpinner} /> : <FaUserSlash />}
                        </button>
                      )}
                      <button 
                        className={`${styles.actionBtn} ${styles.delete}`} 
                        title="Delete User"
                        onClick={() => onDelete(user.id)}
                        disabled={processingId === user.id}
                      >
                        <FaTrash />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="6" style={{ textAlign: "center", padding: "2rem" }}>
                  No users found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default UsersTable;
