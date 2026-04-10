import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import styles from "./informcard.module.scss";

import Header from "../../components/layout/header/Header";
import Footer from "../../components/layout/footer/Footer";
import ListingCard from "../../components/cards/listingCard/ListingCard";
import FavoriteButton from "../../components/common/FavoriteButton/FavoriteButton";
import QuickMessagesModal from "../Messages/components/QuickMessagesModal";
import ReportModal from "./components/ReportModal";

import {
    fetchListingById,
    fetchSimilarListings,
    fetchFavorites,
} from "../../redux/thunks/listingThunks";

import {
    FaMapMarkerAlt,
    FaTag,
    FaCheckCircle,
    FaStar,
    FaImage,
    FaFlag,
    FaEdit,
    FaEnvelope,
} from "react-icons/fa";
import { FaLayerGroup } from "react-icons/fa6";

const InformCard = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const { currentListing, detailLoading, similarItems } =
        useSelector((s) => s.listings || {});
    const { isAuth, user } = useSelector((s) => s.auth);
    const { blockedUsers } = useSelector((s) => s.blocks);

    const isOwnerBlocked = blockedUsers?.some(
        (b) => b.blocked?.id === currentListing?.user?.id || b.blocked?.id === currentListing?.userId
    );

    const [activeImg, setActiveImg] = useState(0);
    const [isMsgModalOpen, setIsMsgModalOpen] = useState(false);
    const [isReportModalOpen, setIsReportModalOpen] = useState(false);

    useEffect(() => {
        window.scrollTo(0, 0);
        if (id) {
            dispatch(fetchListingById(id));
        }
    }, [id, dispatch]);

    useEffect(() => {
        const catId = currentListing?.category?.id || currentListing?.categoryId;
        if (catId && currentListing?.id) {
            dispatch(
                fetchSimilarListings({
                    categoryId: catId,
                    excludeId: currentListing.id,
                })
            );
        }
        setActiveImg(0);
    }, [currentListing, dispatch]);

    useEffect(() => {
        if (isAuth && user?.id) {
            dispatch(fetchFavorites(user.id));
        }
    }, [isAuth, user, dispatch]);

    const resolveImage = (imgData) => {
        if (!imgData) return null;
        if (typeof imgData === "string" && imgData.startsWith("http")) return imgData;
        const obj = typeof imgData === "object" ? imgData : null;
        const path =
            obj?.url || obj?.imageUrl || obj?.imagePath || obj?.imageName || obj?.path ||
            (typeof imgData === "string" ? imgData : "");
        if (!path) return null;
        if (path.startsWith("http")) return path;
        return `http://localhost:8080/api/v1/listings/images/${path}`;
    };

    const getImages = () => {
        if (!currentListing) return [];
        const raw =
            currentListing.listingImages ||
            (currentListing.image ? [currentListing.image] : []) ||
            (currentListing.imageUrl ? [currentListing.imageUrl] : []) ||
            [];
        return raw.map(resolveImage).filter(Boolean);
    };

    const isPremium = () => {
        if (!currentListing) return false;
        const vals = [
            currentListing.premium,
            currentListing.isPremium,
            currentListing.premiumListing,
            currentListing.premiumStatus,
        ];
        return vals.some((v) => {
            if (v === true) return true;
            if (typeof v === "string") return ["true", "active", "premium"].includes(v.toLowerCase());
            if (typeof v === "number") return v === 1;
            return false;
        });
    };

    const images = getImages();
    const condLabel =
        currentListing?.condition === "NEW"
            ? "Yeni"
            : currentListing?.condition === "USED"
                ? "İşlənmiş"
                : currentListing?.condition || "—";

    if (detailLoading) {
        return (
            <div className={styles.page}>
                <Header />
                <div className={styles.loadingState}>
                    <div className={styles.spinner} />
                    <p>Elan yüklənir...</p>
                </div>
                <Footer />
            </div>
        );
    }

    if (isOwnerBlocked) {
        return (
            <div className={styles.page}>
                <Header />
                <div className={styles.errorState}>
                    <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🚫</div>
                    <p>Bu elanın sahibi sizin tərəfinizdən bloklanıb.</p>
                    <button className={styles.backBtn} onClick={() => navigate(-1)}>
                        ← Geri qayıt
                    </button>
                </div>
                <Footer />
            </div>
        );
    }

    if (!currentListing && !detailLoading) {
        return (
            <div className={styles.page}>
                <Header />
                <div className={styles.errorState}>
                    <FaImage />
                    <p>Elan tapılmadı</p>
                    <button className={styles.backBtn} onClick={() => navigate(-1)}>
                        ← Geri qayıt
                    </button>
                </div>
                <Footer />
            </div>
        );
    }

    return (
        <div className={styles.page}>
            <Header />

            <div className={styles.wrapper}>
                <div className={styles.mainGrid}>

                    {}
                    <div>
                        {}
                        <div className={styles.gallery}>
                            <div className={styles.mainImage}>
                                {images.length > 0 ? (
                                    <>
                                        {isPremium() && (
                                            <span className={styles.premiumBadge}>⭐ Premium</span>
                                        )}
                                        <img
                                            src={images[activeImg]}
                                            alt={currentListing?.title}
                                        />
                                    </>
                                ) : (
                                    <div className={styles.noImage}>
                                        <FaImage />
                                        <p>Şəkil yoxdur</p>
                                    </div>
                                )}
                            </div>

                            {images.length > 1 && (
                                <div className={styles.thumbRow}>
                                    {images.map((src, i) => (
                                        <div
                                            key={i}
                                            className={`${styles.thumb} ${i === activeImg ? styles.active : ""}`}
                                            onClick={() => setActiveImg(i)}
                                        >
                                            <img src={src} alt={`thumb-${i}`} />
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>

                        {}
                        {currentListing?.description && (
                            <div className={styles.descSection}>
                                <h2>Açıqlama</h2>
                                <p>{currentListing.description}</p>
                            </div>
                        )}

                        {}
                        {currentListing?.attributes?.length > 0 && (
                            <div className={styles.descSection} style={{ marginTop: 16 }}>
                                <h2>Xüsusiyyətlər</h2>
                                <div className={styles.attrGrid}>
                                    {currentListing.attributes.map((attr, i) => (
                                        <div className={styles.attrItem} key={i}>
                                            <div className={styles.attrLabel}>{attr.fieldName || attr.name || `Xüsusiyyət ${i + 1}`}</div>
                                            <div className={styles.attrValue}>{attr.value}</div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>

                    {}
                    <div className={styles.detailCard}>
                        {}
                        <div className={styles.titleRow}>
                            <h1>{currentListing?.title}</h1>
                            <FavoriteButton listingId={currentListing?.id} variant="button" />
                        </div>

                        {}
                        <div className={styles.price}>
                            {currentListing?.price ? `${currentListing.price} AZN` : "Qiymət yoxdur"}
                        </div>

                        <div className={styles.divider} />

                        {}
                        <div className={styles.metaList}>
                            {currentListing?.city && (
                                <div className={styles.metaItem}>
                                    <div className={styles.metaIcon}>
                                        <FaMapMarkerAlt />
                                    </div>
                                    <div>
                                        <div className={styles.metaLabel}>Şəhər</div>
                                        <div className={styles.metaValue}>{currentListing.city}</div>
                                    </div>
                                </div>
                            )}

                            {currentListing?.condition && (
                                <div className={styles.metaItem}>
                                    <div className={styles.metaIcon}>
                                        <FaCheckCircle />
                                    </div>
                                    <div>
                                        <div className={styles.metaLabel}>Vəziyyət</div>
                                        <div className={styles.metaValue}>
                                            <span
                                                className={`${styles.conditionBadge} ${currentListing.condition === "NEW"
                                                    ? styles.new
                                                    : styles.used
                                                    }`}
                                            >
                                                {condLabel}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {(currentListing?.categoryName || currentListing?.category?.name) && (
                                <div className={styles.metaItem}>
                                    <div className={styles.metaIcon}>
                                        <FaLayerGroup />
                                    </div>
                                    <div>
                                        <div className={styles.metaLabel}>Kateqoriya</div>
                                        <div className={styles.metaValue}>{currentListing.categoryName || currentListing.category?.name}</div>
                                    </div>
                                </div>
                            )}

                            {isPremium() && (
                                <div className={styles.metaItem}>
                                    <div className={styles.metaIcon} style={{ background: "rgba(245,158,11,0.15)", color: "#f59e0b" }}>
                                        <FaStar />
                                    </div>
                                    <div>
                                        <div className={styles.metaLabel}>Status</div>
                                        <div className={styles.metaValue}>Premium Elan</div>
                                    </div>
                                </div>
                            )}

                            {currentListing?.id && (
                                <div className={styles.metaItem}>
                                    <div className={styles.metaIcon}>
                                        <FaTag />
                                    </div>
                                    <div>
                                        <div className={styles.metaLabel}>Elan kodu</div>
                                        <div className={styles.metaValue}># {currentListing.id}</div>
                                    </div>
                                </div>
                            )}
                        </div>

                        <div className={styles.divider} />

                        {}
                        {user?.id === currentListing?.user?.id ? (
                            <button
                                className={styles.contactBtn}
                                style={{ background: "#f1f5f9", color: "#1e293b" }}
                                onClick={() => navigate(`/edit-listing/${currentListing.id}`)}
                            >
                                <FaEdit />
                                Elanı redaktə et
                            </button>
                        ) : (
                            <div className={styles.actionRow}>
                                <button
                                    className={styles.contactBtn}
                                    onClick={() => {
                                        if (!isAuth) {
                                            alert("Mesaj yazmaq üçün giriş etməlisiniz");
                                            navigate("/login");
                                            return;
                                        }
                                        setIsMsgModalOpen(true);
                                    }}
                                >
                                    <FaEnvelope />
                                    Mesaj yaz
                                </button>
                                <button
                                    className={styles.reportBtn}
                                    onClick={() => {
                                        if (!isAuth) {
                                            alert("Şikayet etmək üçün giriş etməlisiniz");
                                            navigate("/login");
                                            return;
                                        }
                                        setIsReportModalOpen(true);
                                    }}
                                    title="Elanı şikayet et"
                                >
                                    <FaFlag size={13} />
                                    Şikayet et
                                </button>
                            </div>
                        )}
                    </div>
                </div>

                <QuickMessagesModal
                    isOpen={isMsgModalOpen}
                    onClose={() => setIsMsgModalOpen(false)}
                    listing={currentListing}
                    seller={currentListing?.user}
                />

                <ReportModal
                    isOpen={isReportModalOpen}
                    onClose={() => setIsReportModalOpen(false)}
                    listingId={currentListing?.id}
                />

                {}
                <div className={styles.similarSection}>
                    <div className={styles.sectionHead}>
                        <h2>
                            Oxşar <span>elanlar</span>
                        </h2>
                    </div>
                    {similarItems?.length > 0 ? (
                        <div className={styles.similarGrid}>
                            {similarItems.map((item) => (
                                <ListingCard key={item.id} listing={item} />
                            ))}
                        </div>
                    ) : (
                        <p className={styles.noSimilar}>Oxşar elan yoxdur</p>
                    )}
                </div>
            </div>

            <Footer />

        </div>
    );
};

export default InformCard;
