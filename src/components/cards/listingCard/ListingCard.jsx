import React from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import styles from "./listingcard.module.scss";
import { FaMapMarkerAlt, FaEye, FaStar } from "react-icons/fa";
import { useActionGuard } from "../../../guards/useActionGuard";
import FavoriteButton from "../../common/FavoriteButton/FavoriteButton";

const ListingCard = ({ listing, item, variant = "default" }) => {
  const currentListing = listing || item;
  const navigate = useNavigate();
  const guard = useActionGuard();
  const { blockedUsers } = useSelector((s) => s.blocks);

  // Filter out listings from blocked users
  const isOwnerBlocked = blockedUsers?.some(
    (b) => b.blocked?.id === (currentListing?.user?.id || currentListing?.userId)
  );

  if (!currentListing || isOwnerBlocked) return null;

  const getImageUrl = () => {
    if (!currentListing) return null;

    const imageData =
      currentListing.images?.[0] ||
      currentListing.image ||
      currentListing.imageUrl ||
      currentListing.imagePath ||
      currentListing.listingImages?.[0] ||
      currentListing.imageUrls?.[0] ||
      currentListing.mainImage;

    if (!imageData) return null;
    if (typeof imageData === "string" && imageData.startsWith("http")) return imageData;

    const imgObj = typeof imageData === "object" ? imageData : null;
    const path =
      imgObj?.url ||
      imgObj?.imageUrl ||
      imgObj?.imagePath ||
      imgObj?.imageName ||
      imgObj?.path ||
      (typeof imageData === "string" ? imageData : "");

    if (path) {
      if (!path.startsWith("http")) {
        return `http://localhost:8080/api/v1/listings/images/${path}`;
      }
      return path;
    }

    return null;
  };

  const displayImage = getImageUrl();

  const checkPremium = () => {
    if (!currentListing) return false;
    const fields = [currentListing.premium, currentListing.isPremium, currentListing.premiumListing, currentListing.premiumStatus];
    return fields.some(val => {
      if (val === true) return true;
      if (typeof val === "string") {
        const lower = val.toLowerCase();
        return lower === "true" || lower === "active" || lower === "premium";
      }
      if (typeof val === "number") return val === 1;
      return false;
    });
  };

  const isPremium = checkPremium() || variant === "featured";

  const handleClick = () => {
    if (currentListing?.id) {
      guard(() => navigate(`/listings/${currentListing.id}`));
    }
  };

  if (!currentListing) return null;

  return (
    <div 
      className={`${styles.card} ${isPremium ? styles['card--featured'] : styles['card--default']}`} 
      onClick={handleClick}
    >
      <div className={styles.imageWrapper}>
        {displayImage ? (
          <img src={displayImage} alt={currentListing.title} className={styles.image} />
        ) : (
          <div className={styles.placeholderBox}>
            <span className={styles.placeholderText}>Şəkil Yoxdur</span>
          </div>
        )}
        <div className={styles.overlay} />
        
        <div className={styles.topBadges}>
          {isPremium && <span className={styles.premiumBadge}>Premium</span>}
        </div>

        <div className={styles.favoriteWrapper} onClick={(e) => e.stopPropagation()}>
          <FavoriteButton listingId={currentListing.id} variant="icon" />
        </div>

        <div className={styles.content}>
          <div className={styles.mainInfo}>
            <p className={styles.price}>
              {currentListing.price ? `${currentListing.price} AZN` : "Qiymət yoxdur"}
            </p>
            <h4 className={styles.title}>{currentListing.title}</h4>
            
            <div className={styles.metadata}>
              <span className={styles.location}>
                <FaMapMarkerAlt />
                {currentListing.city || "Bakı"}
              </span>
              <span className={styles.separator}>•</span>
              <span className={styles.time}>Bu gün 11:15</span>
            </div>
          </div>

          <div className={styles.footer}>
            <div className={styles.views}>
              <FaEye /> 1.2K baxış
            </div>
            <div className={styles.rating}>
              <FaStar /> 4.9
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ListingCard;
