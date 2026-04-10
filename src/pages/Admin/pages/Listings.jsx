import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchAdminListings, approveListing, rejectListing } from "../../../redux/thunks/adminThunk";
import ListingsTable from "../components/ListingsTable";
import ListingDetailModal from "../components/ListingDetailModal";
import styles from "../styles/Dashboard.module.scss";

const Listings = () => {
  const dispatch = useDispatch();
  const { listings, loading } = useSelector((state) => state.admin);
  const [selectedListing, setSelectedListing] = React.useState(null);
  const [isModalOpen, setIsModalOpen] = React.useState(false);
  const [processingId, setProcessingId] = React.useState(null);
  const [activeTab, setActiveTab] = React.useState(() => {
    return localStorage.getItem("admin_listings_tab") || "PENDING";
  });

  useEffect(() => {
    console.log("DEBUG: Fetching Admin Listings...");
    dispatch(fetchAdminListings()).unwrap().then(data => {
      console.log("DEBUG: Listings fetched:", data.length, "items");
      console.log("DEBUG: Unique statuses in DB:", [...new Set(data.map(l => l.status))]);
    });
  }, [dispatch]);

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    localStorage.setItem("admin_listings_tab", tab);
  };

  const filteredListings = React.useMemo(() => {
    if (activeTab === "ALL") return listings;
    
    return listings.filter(l => {
      const status = (l.status || "PENDING").toUpperCase();
      if (activeTab === "ACTIVE") {
        return status === "ACTIVE" || status === "APPROVED";
      }
      return status === activeTab;
    });
  }, [listings, activeTab]);

  const getCounts = React.useMemo(() => {
    return {
      PENDING: listings.filter(l => (l.status || "PENDING").toUpperCase() === "PENDING").length,
      ACTIVE: listings.filter(l => {
        const s = (l.status || "").toUpperCase();
        return s === "ACTIVE" || s === "APPROVED";
      }).length,
      REJECTED: listings.filter(l => (l.status || "").toUpperCase() === "REJECTED").length,
      ALL: listings.length
    };
  }, [listings]);

  const handleUpdateStatus = async (id, actionType) => {
    setProcessingId(id);
    try {
      if (actionType === "approve") {
        await dispatch(approveListing(id)).unwrap();
        alert("Elan uğurla təsdiqləndi!");
      } else {
        if (window.confirm("Bu elanı rədd etmək istədiyinizə əminsiniz?")) {
          await dispatch(rejectListing(id)).unwrap();
          alert("Elan uğurla rədd edildi!");
        } else {
          setProcessingId(null);
          return;
        }
      }
    } catch (error) {
      console.error("Moderation Error:", error);
      const errorMsg = typeof error === "string" ? error : (error.message || JSON.stringify(error));
      alert("Xəta baş verdi: " + errorMsg);
    } finally {
      setProcessingId(null);
    }
  };

  const handleViewListing = (listing) => {
    setSelectedListing(listing);
    setIsModalOpen(true);
  };

  if (loading && listings.length === 0) {
    return (
      <div className={styles.loadingState}>
        <div className={styles.spinner}></div>
        <p>Loading Listings...</p>
      </div>
    );
  }

  return (
    <div className={styles.pageContainer}>
      <header className={styles.pageHeader}>
        <h1>Listings Moderation</h1>
        <p>Review and manage marketplace listings for quality and safety.</p>
      </header>

      <div className={styles.tabsContainer}>
        <button 
          className={`${styles.tab} ${activeTab === "PENDING" ? styles.activeTab : ""}`}
          onClick={() => handleTabChange("PENDING")}
        >
          Gözləyənlər <span className={styles.tabCount}>{getCounts.PENDING}</span>
        </button>
        <button 
          className={`${styles.tab} ${activeTab === "ACTIVE" ? styles.activeTab : ""}`}
          onClick={() => handleTabChange("ACTIVE")}
        >
          Təsdiqlənənlər <span className={styles.tabCount}>{getCounts.ACTIVE}</span>
        </button>
        <button 
          className={`${styles.tab} ${activeTab === "REJECTED" ? styles.activeTab : ""}`}
          onClick={() => handleTabChange("REJECTED")}
        >
          Rədd edilənlər <span className={styles.tabCount}>{getCounts.REJECTED}</span>
        </button>
        <button 
          className={`${styles.tab} ${activeTab === "ALL" ? styles.activeTab : ""}`}
          onClick={() => handleTabChange("ALL")}
        >
          Hamısı <span className={styles.tabCount}>{getCounts.ALL}</span>
        </button>
      </div>

      <ListingsTable 
        listings={filteredListings} 
        onUpdateStatus={handleUpdateStatus} 
        onView={handleViewListing}
        processingId={processingId}
      />

      {isModalOpen && (
        <ListingDetailModal 
          listing={selectedListing} 
          onClose={() => setIsModalOpen(false)} 
        />
      )}
    </div>
  );
};

export default Listings;
