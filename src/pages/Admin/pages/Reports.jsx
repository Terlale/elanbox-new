import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { 
  fetchAdminReports, 
  resolveAdminReport, 
  updateAdminUserStatus, 
  deleteListingAdmin 
} from "../../../redux/thunks/adminThunk";
import ReportsTable from "../components/ReportsTable";
import ReportDetailModal from "../components/ReportDetailModal";
import styles from "../styles/Dashboard.module.scss";

const Reports = () => {
  const dispatch = useDispatch();
  const { reports, loading } = useSelector((state) => state.admin);

  const [processingId, setProcessingId] = React.useState(null);
  const [selectedReport, setSelectedReport] = React.useState(null);
  const [isModalOpen, setIsModalOpen] = React.useState(false);

  useEffect(() => {
    dispatch(fetchAdminReports());
  }, [dispatch]);

  const handleAction = async (report, action) => {
    const reportId = report.id;
    setProcessingId(reportId);
    
    try {
      if (action === "RESOLVE") {
        await dispatch(resolveAdminReport(reportId)).unwrap();
        alert("Şikayət həll edildi!");
      } else if (action === "BLOCK") {
        const reportedUserId = report.listing?.user?.id;
        if (!reportedUserId) return alert("İstifadəçi tapılmadı");
        if (window.confirm("Bu istifadəçini bloklamaq istədiyinizə əminsiniz?")) {
          await dispatch(updateAdminUserStatus({ id: reportedUserId, status: "INACTIVE" })).unwrap();
          alert("İstifadəçi bloklandı!");
        }
      } else if (action === "DELETE") {
        const listingId = report.listing?.id;
        if (!listingId) return alert("Elan tapılmadı");
        if (window.confirm("Bu elanı silmək istədiyinizə əminsiniz?")) {
          await dispatch(deleteListingAdmin(listingId)).unwrap();
          await dispatch(resolveAdminReport(reportId)).unwrap();
          alert("Məzmun silindi və şikayət bağlandı!");
        }
      }
    } catch (err) {
      console.error("Report Action Error:", err);
      alert("Xəta baş verdi: " + (err.message || err));
    } finally {
      setProcessingId(null);
    }
  };

  const handleViewReport = (report) => {
    setSelectedReport(report);
    setIsModalOpen(true);
  };

  if (loading && reports.length === 0) {
    return (
      <div className={styles.loadingState}>
        <div className={styles.spinner}></div>
        <p>Şikayətlər yüklənir...</p>
      </div>
    );
  }

  return (
    <div className={styles.pageContainer}>
      <header className={styles.pageHeader}>
        <h1>Şikayətlərin İdarə Edilməsi</h1>
        <p>İstifadəçi şikayətlərinə və bildirilən məzmunlara baxın.</p>
      </header>

      <ReportsTable 
        reports={reports} 
        onAction={handleAction} 
        onView={handleViewReport}
        processingId={processingId}
      />

      {isModalOpen && (
        <ReportDetailModal 
          report={selectedReport} 
          onClose={() => setIsModalOpen(false)} 
        />
      )}
    </div>
  );
};

export default Reports;
