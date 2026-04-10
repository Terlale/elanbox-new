import React, { useState } from "react";
import styles from "./ListingGrid.module.scss";
import ListingCard from "../../../../components/cards/listingCard/ListingCard";
import { FaBullhorn } from "react-icons/fa";

const ListingGrid = ({ listings = [] }) => {
    const [activeFilter, setActiveFilter] = useState("all");

    const filters = [
        { id: "all", label: "Hamısı" },
        { id: "active", label: "Aktiv" },
        { id: "sold", label: "Satılan" }
    ];

    const filteredListings = listings.filter(item => {
        if (activeFilter === "all") return true;
        if (activeFilter === "active") return item.status?.toLowerCase() === "active" || !item.status;
        if (activeFilter === "sold") return item.status?.toLowerCase() === "sold";
        return true;
    });

    return (
        <section className={styles.gridContainer}>
            <div className={styles.gridHeader}>
                <h2>İstifadəçinin elanları</h2>
                <div className={styles.filters}>
                    {filters.map(f => (
                        <button 
                            key={f.id}
                            className={`${styles.filterBtn} ${activeFilter === f.id ? styles.active : ""}`}
                            onClick={() => setActiveFilter(f.id)}
                        >
                            {f.label}
                        </button>
                    ))}
                </div>
            </div>

            {filteredListings.length > 0 ? (
                <div className={styles.grid}>
                    {filteredListings.map(item => (
                        <ListingCard key={item.id} listing={item} />
                    ))}
                </div>
            ) : (
                <div className={styles.emptyState}>
                    <FaBullhorn className={styles.icon} />
                    <h3>Bu istifadəçinin {activeFilter !== "all" ? activeFilter === "active" ? "aktiv" : "satılan " : ""} elanı yoxdur</h3>
                    <p>Digər elanlara baxmaq üçün ana səhifəyə keçid edin.</p>
                </div>
            )}
        </section>
    );
};

export default ListingGrid;
