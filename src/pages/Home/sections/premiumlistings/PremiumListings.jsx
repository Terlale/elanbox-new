import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { FaChevronRight } from "react-icons/fa6";
import styles from "./premiumlistings.module.scss";
import ListingCard from "../../../../components/cards/listingCard/ListingCard";
import { fetchPremiumListings } from "../../../../redux/thunks/listingThunks";

const PremiumListings = () => {
  const dispatch = useDispatch();

  const { premiumItems, loading } = useSelector(
    (state) => state.listings
  );

  useEffect(() => {
    dispatch(fetchPremiumListings());
  }, [dispatch]);

  if (loading) return <p>Yüklənir...</p>;

  return (
    <section className={styles.section}>
      <div className={styles.container}>
        <div className={styles.header}>
          <h2 className={styles.title}>Premium Elanlar</h2>
          <Link to="/search?type=premium" className={styles.viewAllBtn}>
            Hamısına bax <FaChevronRight className={styles.btnIcon} />
          </Link>
        </div>

        <div className={styles.grid}>
          {premiumItems.map((item) => (
            <ListingCard key={item.id} item={item} variant="featured" />
          ))}
        </div>
      </div>
    </section>
  );
};

export default PremiumListings;
