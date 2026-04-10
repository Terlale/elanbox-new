import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { FaChevronRight } from "react-icons/fa6";
import styles from "./latestlistings.module.scss";
import ListingCard from "../../../../components/cards/listingCard/ListingCard";
import { fetchLatestListings } from "../../../../redux/thunks/listingThunks";

const LatestListings = () => {
  const dispatch = useDispatch();

  const { latestItems, loading } = useSelector(
    (state) => state.listings
  );

  useEffect(() => {
    dispatch(fetchLatestListings());
  }, [dispatch]);

  if (loading) return <p>Yüklənir...</p>;

  return (
    <section className={styles.section}>
      <div className={styles.container}>
        <div className={styles.header}>
          <h2 className={styles.title}>Son Elanlar</h2>
          <Link to="/search" className={styles.viewAllBtn}>
            Hamısına bax <FaChevronRight className={styles.btnIcon} />
          </Link>
        </div>

        <div className={styles.grid}>
          {latestItems.map((item) => (
            <ListingCard key={item.id} item={item} variant="default" />
          ))}
        </div>
      </div>
    </section>
  );
};

export default LatestListings;
