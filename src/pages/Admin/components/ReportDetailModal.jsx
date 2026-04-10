import React from "react";
import { FaTimes, FaUser, FaFlag, FaExclamationTriangle, FaCalendarAlt } from "react-icons/fa";
import styles from "../styles/Modal.module.scss";

const ReportDetailModal = ({ report, onClose }) => {
  if (!report) return null;

  return (
    <div className={styles.modalOverlay} onClick={onClose}>
      <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
        <button className={styles.closeBtn} onClick={onClose}>
          <FaTimes />
        </button>
        
        <div className={styles.modalHeader}>
          <h2>Report Details</h2>
          <span className={`${styles.statusBadge} ${styles.pending}`}>
            New Report
          </span>
        </div>

        <div className={styles.modalBody}>
          <div className={styles.detailsGrid}>
            <div className={styles.detailItem}>
              <label><FaUser /> Şikayətçi</label>
              <p>{report.user?.fullName || "Anonim"}</p>
              <span className={styles.subText}>{report.user?.email}</span>
            </div>
            <div className={styles.detailItem}>
              <label><FaExclamationTriangle /> Şikayət Olunan Elan</label>
              <p>{report.listing?.title || "Məlum deyil"}</p>
              <span className={styles.subText}>Sahibi: {report.listing?.user?.fullName} | ID: {report.listing?.id}</span>
            </div>
            <div className={styles.detailItem}>
              <label><FaCalendarAlt /> Tarix</label>
              <p>{new Date(report.createdAt).toLocaleString()}</p>
            </div>
          </div>

          <div className={styles.descriptionSection}>
            <label><FaFlag /> Reason for Report</label>
            <div className={styles.reasonBox}>
              <p className={styles.reasonTitle}>{report.reason}</p>
              {report.note && <p className={styles.reasonNote}>{report.note}</p>}
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

export default ReportDetailModal;
