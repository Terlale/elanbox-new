import React from "react";
import { FaCircleCheck, FaRocket, FaShieldHalved } from "react-icons/fa6";
import styles from "./banner.module.scss";
import Searchbox from "../searchbox/Searchbox";
import CounterInfom from "../counterInfom/CounterInfom";
import bannerImg from "../../../../assets/images/banner.png";

const Banner = () => {
  return (
    <section className={styles.hero}>
      <div className={styles.container}>
        <div className={styles.leftContent}>
          <div className={styles.topBadge}>
            <span>🌍</span> AZƏRBAYCANDA #1 MARKETPLACE
          </div>

          <h1 className={styles.title}>
            Elanını yerləşdir, <span className={styles.accent}>alıcını tap!</span>
          </h1>

          <p className={styles.subtitle}>
            Minlərlə elan arasından axtardığınız məhsulu və ya xidməti asanlıqla tapın.
            Elan yerləşdirmək isə tamamilə <strong>pulsuzdur!</strong>
          </p>

          <div className={styles.statsWrapper}>
            <CounterInfom />
          </div>

          <div className={styles.searchWrapper}>
            <Searchbox />
          </div>
        </div>

        <div className={styles.rightContent}>
          <img src={bannerImg} alt="Marketplace" className={styles.mainImg} />
        </div>
      </div>
    </section>
  );
};

export default Banner;
