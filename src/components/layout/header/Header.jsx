import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { fetchUnreadCount } from "../../../redux/thunks/messageThunks";
import { useActionGuard } from "../../../guards/useActionGuard";

import Logo from "../../../assets/images/logo-elanbox.png";
import AddProduct from "../../ui/button/AddProductButton/AddProduct";
import UserButton from "../../ui/button/Userbutton/UserButton";
import AuthButton from "../../ui/button/AuthButton/AuthButton";
import Avatar from "../../ui/button/Avatar/Avatar";

import { FaBars, FaXmark, FaEnvelope, FaChevronDown } from "react-icons/fa6";
import styles from "./header.module.scss";

const Header = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();
  const guard = useActionGuard();

  const { isAuth, user } = useSelector((state) => state.auth);
  const { unreadCount } = useSelector((state) => state.messages || { unreadCount: 0 });
  const dispatch = useDispatch();

  React.useEffect(() => {
    if (isAuth && user?.id) {
      dispatch(fetchUnreadCount(user.id));
      const interval = setInterval(() => {
        dispatch(fetchUnreadCount(user.id));
      }, 30000);
      return () => clearInterval(interval);
    }
  }, [isAuth, user?.id, dispatch]);

  return (
    <div className={styles.headerWrapper}>
      <div className={styles.topBar}>
        <div className={styles.topBarLeft}>
          <a href="mailto:admin@elanbox.az">admin@elanbox.az</a>
          <span className={styles.topBarDivider}>|</span>
          <a href="tel:+994555555555">(+994) 55 555 55 55</a>
        </div>
        <div className={styles.topBarRight}>
          <span>Welcome to our site</span>
          <span className={styles.topBarDivider}>|</span>
          <div className={styles.dropdown}>
            <span>Azerbaijan</span>
            <FaChevronDown size={9} />
          </div>
        </div>
      </div>
      <header className={styles.header}>
        {}
        <div className={styles.left}>
          <img
            src={Logo}
            alt="logo"
            className={styles.logo}
            onClick={() => navigate("/")}
          />
        </div>

        {}
        <div className={styles.right}>
          <div className={styles.desktopGroup}>
            {isAuth && (
              <div className={styles.msgIconWrapper} onClick={() => navigate("/messages")}>
                <FaEnvelope size={20} className={styles.msgIcon} />
                {unreadCount > 0 && <span className={styles.badge}>{unreadCount}</span>}
              </div>
            )}
            <AddProduct onClick={() => guard(() => navigate("/add-product"))} />
            {isAuth ? <UserButton /> : <AuthButton />}
          </div>

          <button
            className={styles.burgerBtn}
            onClick={() => setMenuOpen((p) => !p)}
          >
            {menuOpen ? <FaXmark /> : <FaBars />}
          </button>
        </div>

        {}
        <div
          className={`${styles.backdrop} ${menuOpen ? styles.active : ""}`}
          onClick={() => setMenuOpen(false)}
        />

        {}
        <div className={`${styles.mobileMenu} ${menuOpen ? styles.open : ""}`}>
          <div className={styles.menuContent}>
            {isAuth && (
              <div
                className={styles.userSection}
                onClick={() => {
                  setMenuOpen(false);
                  navigate("/settings");
                }}
              >
                <Avatar size={50} />
                <div className={styles.userInfo}>
                  <strong>
                    {user?.fullName ||
                      user?.firstName ||
                      user?.username ||
                      "İstifadəçi"}
                  </strong>
                  <span>Hesab ayarları</span>
                </div>
              </div>
            )}
            <div className={styles.menuLinks}>
              <div className={styles.authSpace}>
                {!isAuth && <AuthButton />}
              </div>

              <AddProduct
                onClick={() =>
                  guard(() => {
                    setMenuOpen(false);
                    navigate("/add-product");
                  })
                }
              />
              {isAuth && (
                <button
                  className={styles.mobileLogout}
                  onClick={() => {
                    localStorage.removeItem("access_token");
                    localStorage.removeItem("refresh_token");
                    window.location.href = "/";
                  }}
                >
                  Çıxış
                </button>
              )}
            </div>
          </div>
        </div>
      </header>
    </div>
  );
};

export default Header;
