import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchMyReports } from "../../../redux/thunks/reportThunks";
import { FaFlag, FaRegClock, FaCheckCircle, FaExclamationTriangle } from "react-icons/fa";
import styles from "../settings.module.scss";

const MyReports = () => {
    const dispatch = useDispatch();
    const { myReports, loading, error } = useSelector((s) => s.reports);

    useEffect(() => {
        dispatch(fetchMyReports());
    }, [dispatch]);

    const getStatusIcon = (status) => {
        switch (status?.toUpperCase()) {
            case "PENDING": return <FaRegClock className={styles.pending} />;
            case "REVIEWED": case "RESOLVED": return <FaCheckCircle className={styles.resolved} />;
            case "REJECTED": return <FaExclamationTriangle className={styles.rejected} />;
            default: return <FaFlag />;
        }
    };

    const getStatusLabel = (status) => {
        switch (status?.toUpperCase()) {
            case "PENDING": return "Gözləmədə";
            case "REVIEWED": return "Baxılıb";
            case "RESOLVED": return "Həll olundu";
            case "REJECTED": return "İmtina edildi";
            default: return status || "Göndərildi";
        }
    };

    if (loading && myReports.length === 0) {
        return (
            <div className={styles.loadingWrapper}>
                <div className={styles.spinner} />
                <p>Şikayətlər yüklənir...</p>
            </div>
        );
    }

    return (
        <div className={styles.myAdsWrapper}>
            <h2 className={styles.sectionTitle}>Şikayətlərim</h2>
            <p className={styles.sectionDesc}>Sizin tərəfinizdən göndərilmiş şikayətlər</p>

            <div className={styles.adsGrid}>
                {myReports.length === 0 ? (
                    <div className={styles.emptyState}>
                        <p>Hələ şikayətləriniz yoxdur</p>
                    </div>
                ) : (
                    <div className={styles.reportList}>
                        {myReports.map((report) => (
                            <div key={report.id} className={styles.reportItem}>
                                <div className={styles.reportInfo}>
                                    <div className={styles.reportSubject}>
                                        {report.listing ? (
                                            <span>Elan: <strong>{report.listing.title}</strong></span>
                                        ) : (
                                            <span>İstifadəçi ID: {report.userId}</span>
                                        )}
                                    </div>
                                    <div className={styles.reportReason}>
                                        {report.reason}
                                    </div>
                                    <div className={styles.reportDate}>
                                        {new Date(report.createdAt || Date.now()).toLocaleDateString("az-AZ")}
                                    </div>
                                </div>
                                <div className={`${styles.statusBadge} ${styles[report.status?.toLowerCase() || 'pending']}`}>
                                    {getStatusIcon(report.status)}
                                    <span>{getStatusLabel(report.status)}</span>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default MyReports;
