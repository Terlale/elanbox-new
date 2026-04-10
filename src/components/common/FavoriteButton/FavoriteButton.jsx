import React, { useState } from "react";
import ReactDOM from "react-dom";
import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { FaHeart, FaTimes } from "react-icons/fa";
import { toggleFavorite, fetchFavorites } from "../../../redux/thunks/listingThunks";
import { useActionGuard } from "../../../guards/useActionGuard";
import styles from "./favoritebutton.module.scss";

const ConfirmModal = ({ onConfirm, onCancel }) => (
    <div className={styles.overlay} onClick={onCancel}>
        <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
            <FaTimes className={styles.closeIcon} onClick={onCancel} />
            <FaHeart className={styles.heartIcon} />
            <h3>Favoritlərdən sil</h3>
            <p>Bu elanı favoritlərdən silmək istədiyinizdən əminsinizmi?</p>
            <div className={styles.btns}>
                <button className={styles.cancelBtn} onClick={onCancel}>Xeyr</button>
                <button className={styles.confirmBtn} onClick={onConfirm}>Sil</button>
            </div>
        </div>
    </div>
);

const FavoriteButton = ({ listingId, variant = "icon", className = "" }) => {
    const [showConfirm, setShowConfirm] = useState(false);
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const guard = useActionGuard();
    const { isAuth, user } = useSelector((s) => s.auth);
    const { favoriteItems = [] } = useSelector((s) => s.listings || {});

    const isFavorite =
        listingId &&
        Array.isArray(favoriteItems) &&
        favoriteItems.some((f) => String(f.id) === String(listingId));

    const doToggle = () => {
        dispatch(
            toggleFavorite({ listingId, userId: user?.id, isFavorite })
        ).then(() => {
            if (user?.id) dispatch(fetchFavorites(user.id));
        });
    };

    const handleClick = (e) => {
        e.stopPropagation();
        if (!listingId) return;

        guard(() => {
            if (isFavorite) {
                setShowConfirm(true);
            } else {
                doToggle();
            }
        });
    };

    const isIcon = variant === "icon";

    return (
        <>
            {isIcon ? (
                <FaHeart
                    className={`${styles.favIcon} ${isFavorite ? styles.active : ""} ${className}`}
                    onClick={handleClick}
                />
            ) : (
                <button
                    className={`${styles.favBtn} ${isFavorite ? styles.active : ""} ${className}`}
                    onClick={handleClick}
                    title={isFavorite ? "Favoritdən çıxar" : "Favoritə əlavə et"}
                >
                    <FaHeart />
                </button>
            )}

            {showConfirm && ReactDOM.createPortal(
                <ConfirmModal
                    onConfirm={() => { setShowConfirm(false); doToggle(); }}
                    onCancel={() => setShowConfirm(false)}
                />,
                document.body
            )}
        </>
    );
};

export default FavoriteButton;
