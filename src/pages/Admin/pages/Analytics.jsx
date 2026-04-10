import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchAllAnalytics } from "../../../redux/thunks/adminThunk";
import { ActiveUsersChart, ListingsGrowthChart, CategoriesBarChart, PopularCitiesChart } from "../components/DashboardCharts";
import styles from "../styles/Dashboard.module.scss";

const Analytics = () => {
  const dispatch = useDispatch();
  const { analyticsData, loading } = useSelector((state) => state.admin);

  useEffect(() => {
    dispatch(fetchAllAnalytics());
  }, [dispatch]);

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

  if (loading && !analyticsData) {
    return (
      <div className={styles.loadingState}>
        <div className={styles.spinner}></div>
        <p>Analitika məlumatları yüklənir...</p>
      </div>
    );
  }

  return (
    <div className={styles.pageContainer}>
      <header className={styles.pageHeader}>
        <h1>Platforma Analitikası</h1>
        <p>Elan artımı, istifadəçi davranışı və kateqoriya performansı haqqında ətraflı məlumatlar.</p>
      </header>

      <div className={styles.analyticsGrid} style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(500px, 1fr))', gap: '30px' }}>
        <ActiveUsersChart data={activeUsersData} />
        <ListingsGrowthChart data={listingsGrowthData} />
        <CategoriesBarChart data={categoriesData} />
        <PopularCitiesChart data={citiesData} />
      </div>
    </div>
  );
};

export default Analytics;
