import React from "react";
import { FaCheckCircle, FaTrash, FaUserLock, FaEye } from "react-icons/fa";
import styles from "../styles/Table.module.scss";

const ReportsTable = ({ reports, onAction, onView, processingId }) => {
  return (
    <div className={styles.tableContainer}>
      <div className={styles.tableHeader}>
        <h3>User Reports</h3>
      </div>
      <div className={styles.tableWrapper}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>Şikayətçi</th>
              <th>Elan</th>
              <th>Elan Sahibi</th>
              <th>Səbəb</th>
              <th>Tarix</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {reports.length > 0 ? (
              reports.map((report) => (
                <tr key={report.id}>
                  <td>{report.user?.fullName || "Anonim"}</td>
                  <td>{report.listing?.title || "Elan Silinib"}</td>
                  <td>{report.listing?.user?.fullName || "-"}</td>
                  <td>
                    <span style={{ fontWeight: 500 }}>{report.reason}</span>
                  </td>
                  <td>{new Date(report.createdAt).toLocaleDateString()}</td>
                  <td>
                    <div className={styles.actions}>
                      <button 
                        className={styles.actionBtn} 
                        title="View Report"
                        onClick={() => onView(report)}
                        disabled={processingId === report.id}
                      >
                        <FaEye />
                      </button>
                      <button 
                        className={`${styles.actionBtn} ${styles.activate}`} 
                        title="Resolve Report"
                        onClick={() => onAction(report, "RESOLVE")}
                        disabled={processingId === report.id}
                      >
                        {processingId === report.id ? <div className={styles.btnSpinner} /> : <FaCheckCircle />}
                      </button>
                      <button 
                        className={`${styles.actionBtn} ${styles.deactivate}`} 
                        title="Block Reported User"
                        onClick={() => onAction(report, "BLOCK")}
                        disabled={processingId === report.id}
                      >
                        <FaUserLock />
                      </button>
                      <button 
                        className={`${styles.actionBtn} ${styles.delete}`} 
                        title="Delete Content"
                        onClick={() => onAction(report, "DELETE")}
                        disabled={processingId === report.id}
                      >
                        <FaTrash />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5" style={{ textAlign: "center", padding: "2rem" }}>
                  No reports found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ReportsTable;
