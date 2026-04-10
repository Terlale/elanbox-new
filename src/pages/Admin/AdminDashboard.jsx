import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchDashboardStats, fetchAllAnalytics } from "../../redux/thunks/adminThunk";
import AdminStatsCard from "./components/AdminStatsCard";
import { ActiveUsersChart, ListingsGrowthChart, CategoriesBarChart, PopularCitiesChart } from "./components/DashboardCharts";
import { FaUsers, FaList, FaRegHandshake, FaFlag } from "react-icons/fa";
import styles from "./styles/Dashboard.module.scss";

const AdminDashboard = () => {
  const dispatch = useDispatch();
  const { dashboardStats, analyticsData, loading } = useSelector((state) => state.admin);

  useEffect(() => {
    dispatch(fetchDashboardStats());
    dispatch(fetchAllAnalytics());
  }, [dispatch]);

  const stats = dashboardStats || {
    totalUsers: 0, activeUsers: 0, totalListings: 0, completedDeals: 0, reportsCount: 0,
    trends: { activeUsers: "+0", listings: "+0", deals: "+0" }
  };

  const transformData = (data, nameKey, valueKey = 'count') => {
    if (!Array.isArray(data) || data.length === 0) return [];
    return data.map(item => {
      if (typeof item === 'string') return { [nameKey]: item, [valueKey]: 1 };
      if (typeof item === 'object' && item !== null) {
        const name = item[nameKey] || item.name || item.label || item.key || item.date || item.city || item.category || 'Naməlum';
        const value = item[valueKey] || item.value || item.amount || item.total || item.count || 0;
        return { [nameKey]: name, [valueKey]: Number(value) || 0 };
      }
      return { [nameKey]: 'Naməlum', [valueKey]: 0 };
    });
  };

  const activeUsersData = transformData(analyticsData?.activeUsers, 'date');
  const listingsGrowthData = transformData(analyticsData?.listingsCount, 'date');
  const categoriesData = transformData(analyticsData?.categoriesStats, 'category');
  const citiesData = transformData(analyticsData?.popularCities, 'city');

  if (loading) {
    return (
      <div className={styles.loadingState}>
        <div className={styles.spinner}></div>
        <p>Analitika məlumatları yüklənir...</p>
      </div>
    );
  }

  return (
    <div className={styles.dashboard}>
      <header className={styles.pageHeader}>
        <h1>İdarəetmə Paneli</h1>
        <p>Xoş gəldiniz! Bu gün platformanızda baş verənlər:</p>
      </header>

      <section className={styles.statsGrid}>
        <AdminStatsCard
          title="Ümumi İstifadəçilər"
          value={stats.totalUsers}
          icon={<FaUsers />}
          trend="up"
          trendValue={stats.trends?.activeUsers}
          colorClass="blue"
        />
        <AdminStatsCard
          title="Aktiv Elanlar"
          value={stats.totalListings}
          icon={<FaList />}
          trend="up"
          trendValue={stats.trends?.listings}
          colorClass="purple"
        />
        <AdminStatsCard
          title="Tamamlanmış Razılaşmalar"
          value={stats.completedDeals}
          icon={<FaRegHandshake />}
          trend="up"
          trendValue={stats.trends?.deals}
          colorClass="green"
        />
        <AdminStatsCard
          title="Gözləyən Şikayətlər"
          value={stats.reportsCount}
          icon={<FaFlag />}
          trend="down"
          trendValue="-2"
          colorClass="red"
        />
      </section>

      <div className={styles.chartsLayout}>
        <div className={styles.mainCharts}>
          <ActiveUsersChart data={activeUsersData} />
          <ListingsGrowthChart data={listingsGrowthData} />
        </div>
        <div className={styles.sideCharts}>
          <CategoriesBarChart data={categoriesData} />
          <PopularCitiesChart data={citiesData} />
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
