import React from "react";
import { FaTimes } from "react-icons/fa";
import styles from "../styles/Modal.module.scss";

const ListingDetailModal = ({ listing, onClose }) => {
  if (!listing) return null;

  return (
    <div className={styles.modalOverlay} onClick={onClose}>
      <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
        <button className={styles.closeBtn} onClick={onClose}>
          <FaTimes />
        </button>
        
        <div className={styles.modalHeader}>
          <h2>Listing Details</h2>
          <span className={`${styles.statusBadge} ${styles[listing.status?.toLowerCase()] || ""}`}>
            {listing.status || "Pending"}
          </span>
        </div>

        <div className={styles.modalBody}>
          <div className={styles.imageGallery}>
            {listing.images && listing.images.length > 0 ? (
              listing.images.map((img, index) => (
                <img key={index} src={img} alt={`Listing ${index}`} className={styles.listingImage} />
              ))
            ) : (
              <div className={styles.noImage}>No images available</div>
            )}
          </div>

          <div className={styles.detailsGrid}>
            <div className={styles.detailItem}>
              <label>Title</label>
              <p>{listing.title}</p>
            </div>
            <div className={styles.detailItem}>
              <label>Price</label>
              <p className={styles.price}>{listing.price} AZN</p>
            </div>
            <div className={styles.detailItem}>
              <label>Category</label>
              <p>{listing.category?.name || listing.categoryName || "Ümumi"}</p>
            </div>
            <div className={styles.detailItem}>
              <label>City</label>
              <p>{listing.city || "Bakı"}</p>
            </div>
            <div className={styles.detailItem}>
              <label>Owner</label>
              <p>{listing.user?.fullName || listing.user?.name || listing.ownerName || "İstifadəçi"}</p>
            </div>
          </div>

          <div className={styles.descriptionSection}>
            <label>Description</label>
            <p>{listing.description || "No description provided."}</p>
          </div>
        </div>

        <div className={styles.modalFooter}>
          <button className={styles.secondaryBtn} onClick={onClose}>Close</button>
        </div>
      </div>
    </div>
  );
};

export default ListingDetailModal;
