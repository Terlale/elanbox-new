import React from "react";
import { FaCheck, FaTimes, FaEye } from "react-icons/fa";
import styles from "../styles/Table.module.scss";

const ListingsTable = ({ listings, onUpdateStatus, onView, processingId }) => {
  return (
    <div className={styles.tableContainer}>
      <div className={styles.tableHeader}>
        <h3>Marketplace Listings</h3>
      </div>
      <div className={styles.tableWrapper}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>Title</th>
              <th>Owner</th>
              <th>Category</th>
              <th>Price</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {listings.length > 0 ? (
              listings.map((listing) => (
                <tr key={listing.id}>
                  <td>
                    <div className={styles.userInfo}>
                      <span className={styles.name}>{listing.title}</span>
                    </div>
                  </td>
                  <td>{listing.user?.fullName || listing.user?.name || listing.ownerName || "İstifadəçi"}</td>
                  <td>{listing.category?.name || listing.categoryName || "Ümumi"}</td>
                  <td>{listing.price} AZN</td>
                  <td>
                    <span className={`${styles.statusBadge} ${styles[(listing.status || "pending").toLowerCase()] || ""}`}>
                      {listing.status || "Pending"}
                    </span>
                  </td>
                  <td>
                    <div className={styles.actions}>
                      <button 
                        className={styles.actionBtn} 
                        title="View Listing"
                        onClick={() => onView(listing)}
                        disabled={processingId === listing.id}
                      >
                        <FaEye />
                      </button>
                      {listing.status !== "APPROVED" && listing.status !== "ACTIVE" && (
                        <button 
                          className={`${styles.actionBtn} ${styles.activate}`} 
                          title="Approve"
                          onClick={() => onUpdateStatus(listing.id, "approve")}
                          disabled={processingId === listing.id}
                        >
                          {processingId === listing.id ? <div className={styles.btnSpinner}></div> : <FaCheck />}
                        </button>
                      )}
                      {listing.status !== "REJECTED" && (
                        <button 
                          className={`${styles.actionBtn} ${styles.deactivate}`} 
                          title="Reject"
                          onClick={() => onUpdateStatus(listing.id, "reject")}
                          disabled={processingId === listing.id}
                        >
                          {processingId === listing.id ? <div className={styles.btnSpinner}></div> : <FaTimes />}
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="6" style={{ textAlign: "center", padding: "2rem" }}>
                  No listings found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ListingsTable;
