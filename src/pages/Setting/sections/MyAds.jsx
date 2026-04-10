import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import ReactDOM from "react-dom";
import { fetchUserListings, deleteListing } from "../../../redux/thunks/listingThunks";
import styles from "../settings.module.scss";
import { FaEdit, FaTrash, FaTimes, FaExclamationTriangle } from "react-icons/fa";

const DeleteModal = ({ onConfirm, onCancel, title }) => (
  <div className={styles.modalOverlay} onClick={onCancel}>
    <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
      <FaTimes className={styles.modalClose} onClick={onCancel} />
      <div className={styles.modalIcon}><FaExclamationTriangle /></div>
      <h3>Elanı sil</h3>
      <p><strong>"{title}"</strong> elanını silmək istədiyinizdən əminsiniz? Bu əməliyyat geri qaytarıla bilməz.</p>
      <div className={styles.modalActions}>
        <button className={styles.modalCancel} onClick={onCancel}>Ləğv et</button>
        <button className={styles.modalConfirm} onClick={onConfirm}>Bəli, sil</button>
      </div>
    </div>
  </div>
);

const MyAds = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector((s) => s.auth);
  const { userItems = [], loading } = useSelector((s) => s.listings || {});

  const [deleteData, setDeleteData] = useState(null);

  useEffect(() => {
    console.log("DEBUG: MyAds rendered. UserID:", user?.id, "Items count:", userItems.length);
    if (user?.id) {
      dispatch(fetchUserListings(user.id));
    }
  }, [dispatch, user?.id, userItems.length]);

  const confirmDelete = (id, title) => {
    console.log("DEBUG: Opening delete modal for:", id, title);
    setDeleteData({ id, title });
  };

  const handleFinalDelete = async () => {
    if (!deleteData) return;
    const { id } = deleteData;
    setDeleteData(null);

    try {
      console.log("DEBUG: Finalizing deletion for ID:", id);
      await dispatch(deleteListing({ id, userId: user.id })).unwrap();
      alert("Elan uğurla silindi");
    } catch (err) {
      console.error("DEBUG ERROR: Deletion failed:", err);
      const errorMsg = typeof err === 'string' ? err : (err.message || JSON.stringify(err));
      alert("Xəta: " + errorMsg);
    }
  };

  if (loading && userItems.length === 0) {
    return <div className={styles.loading}>Yüklənir...</div>;
  }

  return (
    <div className={styles.myAdsWrapper}>
      <h2 className={styles.sectionTitle}>Elanlarım</h2>
      <p className={styles.sectionDesc}>Bütün elanlarınızı buradan idarə edə bilərsiniz</p>

      <div className={styles.adsGrid}>
        {userItems.length === 0 ? (
          <div className={styles.emptyState}>
            <p>Hələ ki elanınız yoxdur.</p>
            <button onClick={() => navigate("/add-product")} className={styles.addBtn}>Yeni elan yerləşdir</button>
          </div>
        ) : (
          userItems.map((ad) => {
            const adId = ad.id || ad.listingId;
            const image = ad.images?.[0] || ad.image || ad.imageUrl || ad.mainImage || (ad.listingImages?.length > 0 ? ad.listingImages[0] : null);
            let displayImage = "https://placehold.co/400x300?text=No+Image";

            if (image) {
              const path = typeof image === "string" ? image : (image.path || image.imageName || image.url);
              if (path) displayImage = path.startsWith("http") ? path : `http://localhost:8080/api/v1/listings/images/${path}`;
            }

            return (
              <div key={adId} className={styles.adCard}>
                <div className={styles.adImageWrapper}>
                  <img src={displayImage} alt="" />
                  {ad.premium && <span className={styles.premiumBadge}>Premium</span>}
                </div>

                <div className={styles.adInfo}>
                  <div className={styles.adMainInfo}>
                    <h4>{ad.title}</h4>
                    <p className={styles.adPrice}>{ad.price} AZN</p>
                  </div>
                  <div className={styles.adMeta}>
                    <span>Baxış: {ad.viewCount || 0}</span>
                    {ad.status === "ACTIVE" || ad.status === "APPROVED" ? (
                      <span className={styles.statusActive}>
                        <i /> Təsdiqləndi
                      </span>
                    ) : ad.status === "REJECTED" ? (
                      <span className={styles.statusRejected}>
                        <i /> Rədd edildi
                      </span>
                    ) : (
                      <span className={styles.statusPending}>
                        <i /> Təsdiq gözlənilir
                      </span>
                    )}
                  </div>
                </div>

                <div className={styles.adActions}>
                  <button className={styles.editAction} title="Redaktə et" onClick={() => navigate(`/edit-listing/${adId}`)}>
                    <FaEdit />
                  </button>
                  <button className={styles.deleteAction} title="Sil" onClick={() => confirmDelete(adId, ad.title)}>
                    <FaTrash />
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>

      {deleteData && ReactDOM.createPortal(
        <DeleteModal
          title={deleteData.title}
          onConfirm={handleFinalDelete}
          onCancel={() => setDeleteData(null)}
        />,
        document.body
      )}
    </div>
  );
};

export default MyAds;
