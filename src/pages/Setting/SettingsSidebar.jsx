import { NavLink, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import {
  FaUser,
  FaBullhorn,
  FaHeart,
  FaShieldAlt,
  FaSignOutAlt,
  FaBan,
  FaFlag,
} from "react-icons/fa";
import styles from "./settings.module.scss";
import Avatar from "../../components/ui/button/Avatar/Avatar";
import { logout } from "../../redux/slices/authSlice";

const SettingsSidebar = () => {
  const { user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const nameToDisplay = user?.fullName || user?.firstName || user?.username || "İstifadəçi";

  const handleLogout = (e) => {
    e.preventDefault();
    dispatch(logout());
    navigate("/");
  };

  return (
    <aside className={styles.sidebar}>
      <div className={styles.userBox}>
        <Avatar size={44} />

        <div>
          <strong>{nameToDisplay}</strong>
          <span>Hesab ayarları</span>
        </div>
      </div>

      <nav className={styles.menu}>
        <NavLink end to="/settings">
          <FaUser /> <span>Şəxsi məlumatlar</span>
        </NavLink>

        <NavLink to="my-ads">
          <FaBullhorn /> <span>Elanlarım</span>
        </NavLink>

        <NavLink to="favorites">
          <FaHeart />  <span>Favoritlər</span>
        </NavLink>

        <NavLink to="blocked-users">
          <FaBan /> <span>Bloklanmış şəxslər</span>
        </NavLink>

        <NavLink to="my-reports">
          <FaFlag /> <span>Şikayətlərim</span>
        </NavLink>

        <NavLink to="security">
          <FaShieldAlt /> <span>Təhlükəsizlik</span>
        </NavLink>
      </nav>

      <a href="/" onClick={handleLogout} className={styles.logout}>
        <FaSignOutAlt /> <span>Çıxış</span>
      </a>
    </aside>
  );
};

export default SettingsSidebar;
