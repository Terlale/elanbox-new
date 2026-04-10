import React from "react";
import { FaTimes, FaEnvelope, FaPhone, FaMapMarkerAlt, FaCalendarAlt, FaUser } from "react-icons/fa";
import styles from "../styles/Modal.module.scss";

const UserDetailModal = ({ user, onClose }) => {
  if (!user) return null;

  return (
    <div className={styles.modalOverlay} onClick={onClose}>
      <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
        <button className={styles.closeBtn} onClick={onClose}>
          <FaTimes />
        </button>
        
        <div className={styles.modalHeader}>
          <h2>User Details</h2>
          <span className={`${styles.statusBadge} ${styles[(user.status || "active").toLowerCase()] || ""}`}>
            {user.status || "Active"}
          </span>
        </div>

        <div className={styles.modalBody}>
          <div className={styles.userProfileHeader}>
            <div className={styles.largeAvatar}>
              {user.avatar ? (
                <img src={user.avatar} alt={user.fullName} />
              ) : (
                <FaUser />
              )}
            </div>
            <div className={styles.headerInfo}>
              <h3>{user.fullName}</h3>
              <p className={styles.role}>{user.role || "User"}</p>
            </div>
          </div>

          <div className={styles.detailsGrid}>
            <div className={styles.detailItem}>
              <label><FaEnvelope /> Email</label>
              <p>{user.email}</p>
            </div>
            <div className={styles.detailItem}>
              <label><FaPhone /> Phone</label>
              <p>{user.phone || "N/A"}</p>
            </div>
            <div className={styles.detailItem}>
              <label><FaMapMarkerAlt /> City</label>
              <p>{user.city || "Baku"}</p>
            </div>
            <div className={styles.detailItem}>
              <label><FaCalendarAlt /> Joined</label>
              <p>{user.createdAt ? new Date(user.createdAt).toLocaleDateString() : "N/A"}</p>
            </div>
          </div>

          <div className={styles.statsSection}>
            <div className={styles.statBox}>
              <span className={styles.statLabel}>Total Listings</span>
              <span className={styles.statValue}>{user.listingsCount || 0}</span>
            </div>
            <div className={styles.statBox}>
              <span className={styles.statLabel}>Reports Count</span>
              <span className={styles.statValue}>{user.reportsCount || 0}</span>
            </div>
          </div>
        </div>

        <div className={styles.modalFooter}>
          <button className={styles.secondaryBtn} onClick={onClose}>Close</button>
        </div>
      </div>
    </div>
  );
};

export default UserDetailModal;
