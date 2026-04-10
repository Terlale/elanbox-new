import React from "react";
import { NavLink, useNavigate } from "react-router-dom";
import {
  FaChartPie,
  FaUsers,
  FaList,
  FaFlag,
  FaChartLine,
  FaBars,
  FaChevronCircleLeft,
  FaUserShield,
  FaCogs,
  FaFolderOpen
} from "react-icons/fa";
import styles from "../styles/AdminSidebar.module.scss";
import Logo from "../../../assets/images/logo-elanbox.png";

const AdminSidebar = ({ isOpen, toggleSidebar }) => {
  const navigate = useNavigate();

  const navItems = [
    { name: "İdarəetmə Paneli", path: "/admin/dashboard", icon: <FaChartPie /> },
    { name: "İstifadəçilər", path: "/admin/users", icon: <FaUsers /> },
    { name: "Elanlar", path: "/admin/listings", icon: <FaList /> },
    { name: "Şikayətlər", path: "/admin/reports", icon: <FaFlag /> },
    { name: "Kateqoriyalar", path: "/admin/categories", icon: <FaFolderOpen /> },
    { name: "Dinamik Sahələr", path: "/admin/dynamic-fields", icon: <FaCogs /> },
    { name: "Rollar", path: "/admin/roles", icon: <FaUserShield /> },
    { name: "Analitika", path: "/admin/analytics", icon: <FaChartLine /> },
  ];

  return (
    <aside className={`${styles.sidebar} ${isOpen ? styles.open : styles.closed}`}>
      <div className={styles.logoSection}>
        {isOpen && (
          <img
            src={Logo}
            alt="logo"
            className={styles.logo}
            style={{ 
              maxWidth: '140px', 
              maxHeight: '40px', 
              width: 'auto', 
              height: 'auto', 
              objectFit: 'contain',
              display: 'block'
            }}
            onClick={() => navigate("/")}
          />
        )}
        <button className={styles.toggleBtn} onClick={toggleSidebar}>
          {isOpen ? <FaChevronCircleLeft /> : <FaBars />}
        </button>
      </div>

      <nav className={styles.navMenu}>
        {navItems.map((item) => (
          <NavLink
            key={item.name}
            to={item.path}
            className={({ isActive }) =>
              `${styles.navItem} ${isActive ? styles.active : ""}`
            }
          >
            <span className={styles.navIcon}>{item.icon}</span>
            {isOpen && <span className={styles.navText}>{item.name}</span>}
          </NavLink>
        ))}
      </nav>
    </aside>
  );
};

export default AdminSidebar;
