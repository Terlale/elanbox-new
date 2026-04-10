import React from "react";
import { FaArrowUp, FaArrowDown } from "react-icons/fa";
import styles from "../styles/AdminStatsCard.module.scss";

const AdminStatsCard = ({ title, value, icon, trend, trendValue, colorClass }) => {
  const isPositive = trend === "up";

  return (
    <div className={`${styles.statsCard} ${styles[colorClass]}`}>
      <div className={styles.iconWrapper}>
        {icon}
      </div>
      <div className={styles.content}>
        <p className={styles.title}>{title}</p>
        <h3 className={styles.value}>{value}</h3>
      </div>
      {trendValue && (
        <div className={`${styles.trend} ${isPositive ? styles.positive : styles.negative}`}>
          {isPositive ? <FaArrowUp /> : <FaArrowDown />}
          <span>{trendValue}</span>
        </div>
      )}
    </div>
  );
};

export default AdminStatsCard;
