import React, { useState, useEffect } from "react";
import { FaBasketShopping, FaUserLarge, FaLayerGroup } from "react-icons/fa6";
import styles from "./counterInfom.module.scss";

const CountUp = ({ end, duration = 2000, suffix = "" }) => {
  const [count, setCount] = useState(0);

  useEffect(() => {
    let startTime;
    let animationFrame;

    const animate = (currentTime) => {
      if (!startTime) startTime = currentTime;
      const progress = Math.min((currentTime - startTime) / duration, 1);
      
      setCount(Math.floor(progress * end));

      if (progress < 1) {
        animationFrame = requestAnimationFrame(animate);
      }
    };

    animationFrame = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animationFrame);
  }, [end, duration]);

  return <span>{count}{suffix}</span>;
};

const CounterInfom = () => {
  const stats = [
    {
      id: 1,
      icon: <FaBasketShopping />,
      target: 10,
      suffix: "k+",
      label: "Aktiv elan",
      colorClass: styles.blue
    },
    {
      id: 2,
      icon: <FaUserLarge />,
      target: 50,
      suffix: "k+",
      label: "Məmnun istifadəçi",
      colorClass: styles.orange
    },
    {
      id: 3,
      icon: <FaLayerGroup />,
      target: 100,
      suffix: "+",
      label: "Kateqoriya",
      colorClass: styles.indigo
    }
  ];

  return (
    <div className={styles.counterRow}>
      {stats.map((item) => (
        <div key={item.id} className={styles.pillCard}>
          <div className={`${styles.iconWrapper} ${item.colorClass}`}>
            {item.icon}
          </div>
          <div className={styles.info}>
            <h3 className={styles.number}>
              <CountUp end={item.target} suffix={item.suffix} />
            </h3>
            <span className={styles.label}>{item.label}</span>
          </div>
        </div>
      ))}
    </div>
  );
};

export default CounterInfom;
