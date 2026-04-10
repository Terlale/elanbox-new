import React, { useState, useRef, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { FaBell, FaSignOutAlt, FaSearch, FaBars } from "react-icons/fa";
import { logout } from "../../../redux/slices/authSlice";
import styles from "../styles/AdminHeader.module.scss";
import Logo from "../../../assets/images/logo-elanbox.png";

const AdminHeader = ({ isOpen, toggleSidebar }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = () => {
    dispatch(logout());
    navigate("/login");
  };

  return (
    <header className={styles.header}>
      <div className={styles.leftSection}>
        <button className={styles.mobileToggle} onClick={toggleSidebar}>
          <FaBars />
        </button>
        
        {!isOpen && (
          <div className={styles.logoSection} onClick={() => navigate("/")}>
            <img src={Logo} alt="ElanBox" className={styles.logo} />
          </div>
        )}
      </div>
      
      <div className={styles.searchBar}>
        <FaSearch className={styles.searchIcon} />
        <input type="text" placeholder="Search across dashboard..." className={styles.searchInput} />
      </div>

      <div className={styles.actions}>
        <button className={styles.iconBtn}>
          <FaBell />
          <span className={styles.badge}>3</span>
        </button>
        
        <div className={styles.profileWrapper} ref={dropdownRef}>
          <div 
            className={`${styles.profileSection} ${isDropdownOpen ? styles.active : ""}`} 
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
          >
            <div className={styles.avatar}>
              {user?.name ? user.name.charAt(0).toUpperCase() : "A"}
            </div>
            <div className={styles.userInfo}>
              <span className={styles.userName}>{user?.name || "Admin User"}</span>
              <span className={styles.userRole}>Administrator</span>
            </div>
          </div>

          {isDropdownOpen && (
            <div className={styles.dropdownMenu}>
              <div className={styles.dropdownHeader}>
                <p className={styles.dropdownLabel}>Hesab Tənzimlərim</p>
              </div>
              <button className={styles.dropdownItem} onClick={() => navigate("/settings")}>
                Profilə Bax
              </button>
              <div className={styles.divider}></div>
              <button className={`${styles.dropdownItem} ${styles.logout}`} onClick={handleLogout}>
                <FaSignOutAlt />
                <span>Çıxış</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default AdminHeader;
