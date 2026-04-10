import React from "react";
import styles from "./footer.module.scss";
import Logo from "../../../assets/images/logo-elanbox.png"
import { useNavigate } from "react-router-dom";

const Footer = () => {
     const navigate = useNavigate();
  return (
    <footer className={styles.footer}>
      <div className={styles.top}>
        <div className={styles.brandSide}>
          <img
            src={Logo}
            alt="logo"
            className={styles.logo}
            onClick={() => navigate("/")}
          />
          <p className={styles.description}>
            ElanBox — Azərbaycanın ən müasir və etibarlı elan platforması. 
            Burada hər şey tapmaq və ya satmaq çox asandır.
          </p>
        </div>

        <div className={styles.columns}>
          <div>
            <span className={styles.title}>Platforma</span>
            <a>Elanlar</a>
            <a>Kateqoriyalar</a>
            <a>Premium</a>
            <a>Vakansiyalar</a>
          </div>

          <div>
            <span className={styles.title}>Şirkət</span>
            <a>Haqqımızda</a>
            <a>Əlaqə</a>
            <a>Qaydalar</a>
            <a>Gizlilik</a>
          </div>

          <div>
            <span className={styles.title}>Sosial</span>
            <a>Instagram</a>
            <a>Telegram</a>
            <a>LinkedIn</a>
            <a>Facebook</a>
          </div>
        </div>
      </div>

      <div className={styles.bottom}>
        <p>
          © {new Date().getFullYear()} ElanBox — Etibarlı elan platforması
        </p>
      </div>
    </footer>
  );
};

export default Footer;
