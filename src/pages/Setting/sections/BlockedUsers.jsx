import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchBlockedUsers, unblockUser } from "../../../redux/thunks/blockThunks";
import Avatar from "../../../components/ui/button/Avatar/Avatar";
import { FaBan, FaUserCheck, FaExclamationCircle } from "react-icons/fa";
import styles from "../settings.module.scss";

const BlockedUsers = () => {
    const dispatch = useDispatch();
    const { blockedUsers, loading, error } = useSelector((s) => s.blocks);

    useEffect(() => {
        dispatch(fetchBlockedUsers());
    }, [dispatch]);

    const handleUnblock = (userId) => {
        if (window.confirm("Bu istifadəçini blokdan çıxarmaq istəyirsiniz?")) {
            dispatch(unblockUser(userId));
        }
    };

    if (loading && blockedUsers.length === 0) {
        return (
            <div className={styles.loadingWrapper}>
                <div className={styles.spinner} />
                <p>Məlumatlar yüklənir...</p>
            </div>
        );
    }

    return (
        <div className={styles.myAdsWrapper}>
            <h2 className={styles.sectionTitle}>Bloklanmış şəxslər</h2>
            <p className={styles.sectionDesc}>Sizin tərəfinizdən bloklanmış şəxslərin siyahısı</p>

            {error && (
                <div className={styles.errorAlert}>
                    <FaExclamationCircle />
                    <span>{error}</span>
                </div>
            )}

            <div className={styles.adsGrid}>
                {blockedUsers.length === 0 ? (
                    <div className={styles.emptyState}>
                        <p>Hələ bloklanmış şəxslər yoxdur</p>
                    </div>
                ) : (
                    <div className={styles.blockList}>
                        {blockedUsers.map((item) => {
                            const blockedUser = item.blocked || item;
                            return (
                                <div key={item.id} className={styles.blockItem}>
                                    <div className={styles.blockUser}>
                                        <Avatar
                                            src={blockedUser.profileImage}
                                            size={48}
                                            username={blockedUser.fullName || blockedUser.username}
                                        />
                                        <div className={styles.userInfo}>
                                            <div className={styles.userName}>
                                                {blockedUser.fullName || blockedUser.username || "İstifadəçi"}
                                            </div>
                                            <div className={styles.userStatus}>Bloklanıb</div>
                                        </div>
                                    </div>
                                    <button
                                        className={styles.unblockBtn}
                                        onClick={() => handleUnblock(blockedUser.id)}
                                        title="Blokdan çıxar"
                                    >
                                        <FaBan />
                                        <span>Blokdan çıxar</span>
                                    </button>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>
        </div>
    );
};

export default BlockedUsers;
