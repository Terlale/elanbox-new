import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchFavorites } from "../../../redux/thunks/listingThunks";
import ListingCard from "../../../components/cards/listingCard/ListingCard";
import styles from "../settings.module.scss";

const Favorites = () => {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const { favoriteItems, loading } = useSelector((state) => state.listings);

  useEffect(() => {
    if (user?.id) {
      dispatch(fetchFavorites(user.id));
    }
  }, [dispatch, user?.id]);

  return (
    <div>
      <h2 className={styles.sectionTitle}>Favoritlər</h2>
      <p className={styles.sectionDesc}>Bəyəndiyiniz elanlar burada toplanır</p>

      {loading && favoriteItems.length === 0 ? (
        <p>Yüklənir...</p>
      ) : favoriteItems.length === 0 ? (
        <div style={{ textAlign: "center", padding: "40px 0" }}>
          <p style={{ color: "#6b7280" }}>Hələ ki heç bir elanı favoritlərinizə əlavə etməmisiniz.</p>
        </div>
      ) : (
        <div className={styles.form} style={{
          display: "grid",
          gridTemplateColumns: "1fr",
          gap: "16px"
        }}>
          {favoriteItems.map((item) => (
            <ListingCard key={item.id} item={item} variant="landscape" />
          ))}
        </div>
      )}
    </div>
  );
};

export default Favorites;
