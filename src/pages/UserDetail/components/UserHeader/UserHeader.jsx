import React from "react";
import styles from "./UserHeader.module.scss";
import Avatar from "../../../Messages/components/Avatar";
import { 
    FaCheckCircle, 
    FaRegCalendarAlt, 
    FaMapMarkerAlt,
    FaEnvelope,
    FaPhoneAlt,
    FaUserPlus,
    FaFlag,
    FaBan
} from "react-icons/fa";

const UserHeader = ({ userData, onReport, onFollow, onBlock, listingsCount }) => {
    return (
        <header className={styles.headerContainer}>
            <div className={styles.userMain}>
                <div className={styles.avatarWrapper}>
                    <Avatar 
                        src={userData?.avatarUrl || userData?.avatar || userData?.imagePath} 
                        name={userData?.fullName} 
                        size="lg"
                    />
                </div>
                <div className={styles.userInfo}>
                    <div className={styles.nameRow}>
                        <h1>{userData?.fullName || "İstifadəçi"}</h1>
                        {userData?.isVerified && (
                            <FaCheckCircle className={styles.verifiedIcon} title="Təsdiqlənmiş profil" />
                        )}
                    </div>
                    <div className={styles.metaInfo}>
                        <span>
                            <FaRegCalendarAlt />
                            Üzvlük: {userData?.createdAt ? new Date(userData.createdAt).toLocaleDateString("az-AZ", { month: 'long', year: 'numeric' }) : "—"}
                        </span>
                        <span>
                            <FaMapMarkerAlt />
                            Bakı, Azərbaycan
                        </span>
                    </div>
                </div>
            </div>

            <div className={styles.actions}>
                <button 
                    className={styles.btnPrimary} 
                    onClick={() => window.location.href = `mailto:${userData?.email || ''}`}
                    data-label="Mesaj göndər"
                >
                    <FaEnvelope />
                    <span>Mesaj göndər</span>
                </button>
                {userData?.phoneNumber && (
                    <button 
                        className={styles.btnPrimary} 
                        onClick={() => window.location.href = `tel:${userData.phoneNumber}`}
                        data-label="Zəng et"
                    >
                        <FaPhoneAlt />
                        <span>Zəng et</span>
                    </button>
                )}
                <button 
                    className={styles.btnSecondary} 
                    onClick={onFollow}
                    data-label="İzlə"
                >
                    <FaUserPlus />
                    <span>İzlə</span>
                </button>
                <button 
                    className={styles.btnDanger} 
                    onClick={onReport}
                    data-label="Şikayət"
                >
                    <FaFlag />
                    <span>Şikayət</span>
                </button>
                <button 
                    className={styles.btnDanger} 
                    onClick={onBlock}
                    data-label="Blok et"
                >
                    <FaBan />
                    <span>Blok et</span>
                </button>
            </div>
        </header>
    );
};

export default UserHeader;
