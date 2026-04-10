import React from "react";
import { useNavigate } from "react-router-dom";
import { FaArrowLeft } from "react-icons/fa";
import styles from "./topbar.module.scss";

const TopBar = ({ currentPage = "Səhifə" }) => {
    const navigate = useNavigate();

    return (
        <div className={styles.topBar}>
            <div className={styles.breadcrumb}>
                <span onClick={() => navigate("/")}>Ana Səhifə</span>
                <FaArrowLeft style={{ transform: "rotate(180deg)" }} />
                <span>{currentPage}</span>
            </div>

            <button className={styles.backBtn} onClick={() => navigate(-1)}>
                <FaArrowLeft />
                Geri qayıt
            </button>
        </div>
    );
};

export default TopBar;
