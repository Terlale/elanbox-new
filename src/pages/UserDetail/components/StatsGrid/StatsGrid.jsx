import React from "react";
import styles from "./StatsGrid.module.scss";
import { 
    FaStar, 
    FaCommentAlt, 
    FaBullhorn, 
    FaShoppingBag 
} from "react-icons/fa";

const StatItem = ({ icon, label, value }) => (
    <div className={styles.statCard}>
        <div className={styles.iconBox}>{icon}</div>
        <div className={styles.statContent}>
            <span className={styles.label}>{label}</span>
            <span className={styles.value}>{value}</span>
        </div>
    </div>
);

const StatsGrid = ({ rating = 4.7, reviewCount = 28, activeCount = 12, totalSales = 45 }) => {
    return (
        <section className={styles.statsContainer}>
            <StatItem 
                icon={<FaStar />} 
                label="Reytinq" 
                value={`⭐ ${rating}`} 
            />
            <StatItem 
                icon={<FaCommentAlt />} 
                label="Rəylər" 
                value={`${reviewCount} rəy`} 
            />
            <StatItem 
                icon={<FaBullhorn />} 
                label="Aktiv Elanlar" 
                value={activeCount} 
            />
            <StatItem 
                icon={<FaShoppingBag />} 
                label="Ümumi Satış" 
                value={totalSales} 
            />
        </section>
    );
};

export default StatsGrid;
