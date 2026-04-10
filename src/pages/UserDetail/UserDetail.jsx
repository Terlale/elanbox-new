import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import styles from "./UserDetail.module.scss";

import Header from "../../components/layout/header/Header";
import Footer from "../../components/layout/footer/Footer";

import UserHeader from "./components/UserHeader/UserHeader";
import StatsGrid from "./components/StatsGrid/StatsGrid";
import ListingGrid from "./components/ListingGrid/ListingGrid";
import AboutSection from "./components/AboutSection/AboutSection";
import ReportModal from "./components/ReportModal/ReportModal";

import { fetchUserListings } from "../../redux/thunks/listingThunks";
import { blockUser } from "../../redux/thunks/blockThunks";
import { submitReport } from "../../redux/thunks/reportThunks";
import { api } from "../../api/axios";

import {
    FaArrowLeft,
    FaChevronRight
} from "react-icons/fa";

const UserDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { blockedUsers } = useSelector((s) => s.blocks);

    const isUserBlocked = blockedUsers?.some(b => b.blocked?.id === Number(id));

    const [userData, setUserData] = useState(null);
    const [listings, setListings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isReportModalOpen, setIsReportModalOpen] = useState(false);

    useEffect(() => {
        window.scrollTo(0, 0);
        const loadData = async () => {
            setLoading(true);
            setError(null);
            try {
                const userRes = await api.get("/users/profile", {
                    params: { userId: id }
                });
                setUserData(userRes.data);

                const listingsRes = await dispatch(fetchUserListings(id)).unwrap();
                setListings(listingsRes || []);
            } catch (err) {
                console.error("UserDetail load error:", err);
                if (err?.response?.status === 401) {
                    setError("Bu istifadəçinin profilinə baxmaq üçün giriş etməlisiniz.");
                } else {
                    setError(err?.response?.data?.message || err?.message || "Məlumat yüklənmədi");
                }
            } finally {
                setLoading(false);
            }
        };

        if (id) loadData();
    }, [id, dispatch]);

    const handleFollow = () => {
        alert("Bu funksiya hələ işləmir");
    };

    const handleBlock = async () => {
        if (!id) return;
        if (window.confirm("Bu istifadəçini bloklamaq istəyirsiniz?")) {
            try {
                await dispatch(blockUser(id)).unwrap();
                alert("İstifadəçi bloklandı");
                navigate("/"); // Bloklanan şəxsin profilindən çıxırıq
            } catch (err) {
                alert("Xəta: " + (err?.message || "Bloklama alınmadı"));
            }
        }
    };

    const handleReportSubmit = async (reportData) => {
        try {
            await dispatch(submitReport({
                userId: id,
                listingId: 1, // User reports might need a dummy listingId if backend requires it
                reason: `${reportData.reason}: ${reportData.description}`
            })).unwrap();
            alert("Şikayətiniz qəbul olundu. Tezliklə araşdırılacaq.");
        } catch (err) {
            alert("Xəta: " + (err?.message || "Şikayət göndərilmədi"));
        }
    };

    if (loading) {
        return (
            <div className={styles.page}>
                <Header />
                <div className={styles.loaderArea}>
                    <div className={styles.spinner} />
                    <p>Məlumatlar yüklənir...</p>
                </div>
                <Footer />
            </div>
        );
    }

    if (isUserBlocked) {
        return (
            <div className={styles.page}>
                <Header />
                <div className={styles.errorArea}>
                    <div className={styles.errorArt}>
                        <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>🚫</div>
                        <h2>İstifadəçi bloklanıb</h2>
                        <p>Siz bu istifadəçini bloklamısınız. Onun məlumatlarını görmək üçün əvvəlcə blokdan çıxarmalısınız.</p>
                    </div>
                    <div className={styles.errorActions}>
                        <button onClick={handleBlock} className={styles.backBtnAction} style={{ border: '1px solid #ef4444', color: '#ef4444' }}>
                           Blokdan çıxar
                        </button>
                        <button onClick={() => navigate(-1)} className={styles.loginBtnAction}>
                            Geri qayıt
                        </button>
                    </div>
                </div>
                <Footer />
            </div>
        );
    }

    if (error && !userData) {
        return (
            <div className={styles.page}>
                <Header />
                <div className={styles.errorArea}>
                    <div className={styles.errorArt}>
                        <h2>Xəta baş verdi</h2>
                        <p>{error}</p>
                    </div>
                    <div className={styles.errorActions}>
                        <button onClick={() => navigate(-1)} className={styles.backBtnAction}>
                            <FaArrowLeft /> Geri qayıt
                        </button>
                        {error.includes("giriş") && (
                            <button onClick={() => navigate("/login")} className={styles.loginBtnAction}>
                                Giriş et <FaChevronRight />
                            </button>
                        )}
                    </div>
                </div>
                <Footer />
            </div>
        );
    }

    return (
        <div className={styles.page}>
            <Header />
            
            <div className={styles.container}>
                {}
                <UserHeader 
                    userData={userData}
                    listingsCount={listings.length}
                    onFollow={handleFollow}
                    onBlock={handleBlock}
                    onReport={() => setIsReportModalOpen(true)}
                />

                <StatsGrid 
                    rating={userData?.rating || 4.8}
                    reviewCount={userData?.reviewCount || listings.length * 2 + 5}
                    activeCount={listings.filter(l => l.status?.toLowerCase() !== 'sold').length}
                    totalSales={listings.filter(l => l.status?.toLowerCase() === 'sold').length + 3}
                />

                <AboutSection 
                    description={userData?.bio || userData?.description || `${userData?.fullName || 'İstifadəçi'} haqqında məlumat hələ əlavə edilməyib. Bu marketplace istifadəçisi müxtəlif növ elanlar paylaşır.`}
                />

                <ListingGrid 
                    listings={listings}
                />
            </div>

            <ReportModal 
                isOpen={isReportModalOpen}
                onClose={() => setIsReportModalOpen(false)}
                onSubmit={handleReportSubmit}
                userId={id}
            />

            <Footer />
        </div>
    );
};

export default UserDetail;
