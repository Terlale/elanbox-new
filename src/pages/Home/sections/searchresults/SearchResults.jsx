import React from "react";
import { useDispatch, useSelector } from "react-redux";
import styles from "../latestlistings/latestlistings.module.scss";
import ListingCard from "../../../../components/cards/listingCard/ListingCard";
import { clearSearch } from "../../../../redux/slices/listingSlice";

const SearchResults = () => {
    const dispatch = useDispatch();
    const { searchItems, isSearching, loading } = useSelector((state) => state.listings);

    if (!isSearching) return null;

    const handleClear = () => {
        dispatch(clearSearch());
    };

    return (
        <section className={styles.section} style={{ backgroundColor: "#f0f7ff", borderBottom: "1px solid #e0e0e0" }}>
            <div className={styles.container}>
                <div className={styles.header}>
                    <h2>Axtarış Nəticələri ({searchItems.length})</h2>
                    <button className={styles.moreBtn} onClick={handleClear}>
                        X təmizlə
                    </button>
                </div>

                <div className={styles.grid}>
                    {loading ? (
                        <p>Axtarılır...</p>
                    ) : searchItems.length > 0 ? (
                        searchItems.map((item) => (
                            <ListingCard key={item.id} item={item} />
                        ))
                    ) : (
                        <p>Heç bir elan tapılmadı.</p>
                    )}
                </div>
            </div>
        </section>
    );
};

export default SearchResults;
