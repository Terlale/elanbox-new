import React from "react";
import {
  BarChart, Bar, LineChart, Line, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend, PieChart, Pie, Cell
} from "recharts";
import styles from "../styles/DashboardCharts.module.scss";

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className={styles.customTooltip}>
        <p className={styles.label}>{label}</p>
        <div className={styles.divider}></div>
        {payload.map((entry, index) => (
          <div key={index} className={styles.tooltipItem}>
            <span className={styles.dot} style={{ backgroundColor: entry.color }}></span>
            <span className={styles.name}>{entry.name}:</span>
            <span className={styles.value}>{entry.value}</span>
          </div>
        ))}
      </div>
    );
  }
  return null;
};

const EmptyState = ({ message }) => (
  <div className={styles.emptyState}>
    <p>{message || "Məlumat tapılmadı"}</p>
  </div>
);

export const ActiveUsersChart = ({ data }) => {
  if (!data || data.length === 0) return <div className={styles.chartCard}><h3>İstifadəçi Aktivliyi</h3><EmptyState /></div>;
  
  return (
    <div className={styles.chartCard}>
      <h3>İstifadəçi Aktivliyi</h3>
      <div className={styles.chartContainer}>
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
            <XAxis 
              dataKey="date" 
              axisLine={false} 
              tickLine={false} 
              tick={{ fill: '#94a3b8', fontSize: 12 }} 
              dy={10} 
            />
            <YAxis 
              axisLine={false} 
              tickLine={false} 
              tick={{ fill: '#94a3b8', fontSize: 12 }} 
            />
            <Tooltip content={<CustomTooltip />} />
            <Line 
              type="monotone" 
              dataKey="count" 
              name="İstifadəçi"
              stroke="#6366f1" 
              strokeWidth={4} 
              dot={{ r: 4, fill: '#fff', strokeWidth: 3, stroke: '#6366f1' }} 
              activeDot={{ r: 6, strokeWidth: 0, fill: '#6366f1' }} 
              animationDuration={1500}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export const ListingsGrowthChart = ({ data }) => {
  if (!data || data.length === 0) return <div className={styles.chartCard}><h3>Elan Sayının Dinamikası</h3><EmptyState /></div>;

  return (
    <div className={styles.chartCard}>
      <h3>Elan Sayının Dinamikası</h3>
      <div className={styles.chartContainer}>
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <defs>
              <linearGradient id="colorCount" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#10b981" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
            <XAxis 
              dataKey="date" 
              axisLine={false} 
              tickLine={false} 
              tick={{ fill: '#94a3b8', fontSize: 12 }} 
              dy={10} 
            />
            <YAxis 
              axisLine={false} 
              tickLine={false} 
              tick={{ fill: '#94a3b8', fontSize: 12 }} 
            />
            <Tooltip content={<CustomTooltip />} />
            <Area 
              type="monotone" 
              dataKey="count" 
              name="Elanlar"
              stroke="#10b981" 
              strokeWidth={4} 
              fillOpacity={1} 
              fill="url(#colorCount)" 
              animationDuration={1500}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export const CategoriesBarChart = ({ data }) => {
  if (!data || data.length === 0) return <div className={styles.chartCard}><h3>Kateqoriya üzrə Paylanma</h3><EmptyState /></div>;

  return (
    <div className={styles.chartCard}>
      <h3>Kateqoriya üzrə Paylanma</h3>
      <div className={styles.chartContainer}>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
            <XAxis 
              dataKey="category" 
              axisLine={false} 
              tickLine={false} 
              tick={{ fill: '#64748b', fontSize: 11, fontWeight: 500 }} 
              dy={10} 
            />
            <YAxis axisLine={false} tickLine={false} hide />
            <Tooltip cursor={{ fill: '#f8fafc' }} content={<CustomTooltip />} />
            <Bar 
              dataKey="count" 
              name="Elan Sayı" 
              fill="#8b5cf6" 
              radius={[6, 6, 0, 0]} 
              barSize={32} 
              animationDuration={1500}
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={['#6366f1', '#8b5cf6', '#ec4899', '#f43f5e', '#f59e0b'][index % 5]} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

const PIE_COLORS = ["#6366f1", "#10b981", "#f59e0b", "#f43f5e", "#8b5cf6", "#06b6d4"];

export const PopularCitiesChart = ({ data }) => {
  if (!data || data.length === 0) return <div className={styles.chartCard}><h3>Şəhərlər üzrə Populyarlıq</h3><EmptyState /></div>;

  return (
    <div className={styles.chartCard}>
      <h3>Şəhərlər üzrə Populyarlıq</h3>
      <div className={styles.chartContainer}>
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius="65%"
              outerRadius="90%"
              paddingAngle={8}
              dataKey="count"
              nameKey="city"
              stroke="none"
              animationDuration={1500}
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={PIE_COLORS[index % PIE_COLORS.length]} />
              ))}
            </Pie>
            <Tooltip content={<CustomTooltip />} />
            <Legend 
              verticalAlign="bottom" 
              align="center" 
              iconType="circle" 
              wrapperStyle={{ paddingTop: '20px', fontSize: '12px' }} 
            />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};
