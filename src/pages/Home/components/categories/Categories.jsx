import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import {
  FaCar,
  FaHouse,
  FaMobileScreenButton,
  FaChair,
  FaBriefcase,
  FaEllipsis,
  FaChevronRight,
  FaShirt,
  FaPaw,
  FaGamepad,
  FaHeartPulse,
  FaBook,
  FaBasketShopping,
  FaBaby,
  FaWrench,
  FaPlane,
  FaSeedling,
  FaCamera,
  FaMusic,
  FaDumbbell,
  FaUtensils,
  FaTruck,
  FaGraduationCap,
  FaLaptop,
  FaHandshake,
  FaHammer,
  FaBicycle,
  FaCouch,
} from "react-icons/fa6";
import { fetchMainCategories } from "../../../../redux/thunks/categoryThunks";
import styles from "./categories.module.scss";

const iconMap = {
  "Nəqliyyat":        <FaCar />,
  "Avtomobillər":     <FaCar />,
  "Motosiklet":       <FaBicycle />,
  "Daşınmaz əmlak":  <FaHouse />,
  "Mənzillər":        <FaHouse />,
  "Evlər":            <FaHouse />,
  "Elektronika":      <FaMobileScreenButton />,
  "Telefonlar":       <FaMobileScreenButton />,
  "Kompüterlər":      <FaLaptop />,
  "Ev və bağ":        <FaCouch />,
  "Mebel":            <FaChair />,
  "Xidmətlər":        <FaBriefcase />,
  "Biznes xidmətlər": <FaHandshake />,
  "Geyim":            <FaShirt />,
  "Paltar":           <FaShirt />,
  "Uşaq məhsulları":  <FaBaby />,
  "Heyvanlar":        <FaPaw />,
  "Oyun və əyləncə":  <FaGamepad />,
  "Sağlamlıq":        <FaHeartPulse />,
  "İdman":            <FaDumbbell />,
  "Kitab":            <FaBook />,
  "Alış-veriş":       <FaBasketShopping />,
  "Usta xidməti":     <FaWrench />,
  "Tikinti":          <FaHammer />,
  "Səyahət":          <FaPlane />,
  "Kənd təsərrüfatı": <FaSeedling />,
  "Foto və video":    <FaCamera />,
  "Musiqi":           <FaMusic />,
  "Qida":             <FaUtensils />,
  "Nəqliyyat xidmətləri": <FaTruck />,
  "Təhsil":           <FaGraduationCap />,
  "Digər":            <FaEllipsis />,
};

const colorMap = {
  "Nəqliyyat":        { bg: "#fff3e0", color: "#f57c00", hoverBg: "#f57c00", shadow: "rgba(245,124,0,0.25)" },
  "Avtomobillər":     { bg: "#fff3e0", color: "#f57c00", hoverBg: "#f57c00", shadow: "rgba(245,124,0,0.25)" },
  "Motosiklet":       { bg: "#fce4ec", color: "#e91e63", hoverBg: "#e91e63", shadow: "rgba(233,30,99,0.25)" },
  "Daşınmaz əmlak":  { bg: "#e3f2fd", color: "#1565c0", hoverBg: "#1565c0", shadow: "rgba(21,101,192,0.25)" },
  "Mənzillər":        { bg: "#e3f2fd", color: "#1565c0", hoverBg: "#1565c0", shadow: "rgba(21,101,192,0.25)" },
  "Evlər":            { bg: "#e3f2fd", color: "#1565c0", hoverBg: "#1565c0", shadow: "rgba(21,101,192,0.25)" },
  "Elektronika":      { bg: "#ede7f6", color: "#6200ea", hoverBg: "#6200ea", shadow: "rgba(98,0,234,0.25)" },
  "Telefonlar":       { bg: "#ede7f6", color: "#6200ea", hoverBg: "#6200ea", shadow: "rgba(98,0,234,0.25)" },
  "Kompüterlər":      { bg: "#e8eaf6", color: "#3949ab", hoverBg: "#3949ab", shadow: "rgba(57,73,171,0.25)" },
  "Ev və bağ":        { bg: "#e8f5e9", color: "#2e7d32", hoverBg: "#2e7d32", shadow: "rgba(46,125,50,0.25)" },
  "Mebel":            { bg: "#efebe9", color: "#5d4037", hoverBg: "#5d4037", shadow: "rgba(93,64,55,0.25)" },
  "Xidmətlər":        { bg: "#e0f7fa", color: "#00838f", hoverBg: "#00838f", shadow: "rgba(0,131,143,0.25)" },
  "Biznes xidmətlər": { bg: "#e0f7fa", color: "#00838f", hoverBg: "#00838f", shadow: "rgba(0,131,143,0.25)" },
  "Geyim":            { bg: "#fce4ec", color: "#c2185b", hoverBg: "#c2185b", shadow: "rgba(194,24,91,0.25)" },
  "Paltar":           { bg: "#fce4ec", color: "#c2185b", hoverBg: "#c2185b", shadow: "rgba(194,24,91,0.25)" },
  "Uşaq məhsulları":  { bg: "#fff9c4", color: "#f9a825", hoverBg: "#f9a825", shadow: "rgba(249,168,37,0.25)" },
  "Heyvanlar":        { bg: "#f1f8e9", color: "#558b2f", hoverBg: "#558b2f", shadow: "rgba(85,139,47,0.25)" },
  "Oyun və əyləncə":  { bg: "#f3e5f5", color: "#7b1fa2", hoverBg: "#7b1fa2", shadow: "rgba(123,31,162,0.25)" },
  "Sağlamlıq":        { bg: "#fbe9e7", color: "#bf360c", hoverBg: "#bf360c", shadow: "rgba(191,54,12,0.25)" },
  "İdman":            { bg: "#e0f2f1", color: "#00695c", hoverBg: "#00695c", shadow: "rgba(0,105,92,0.25)" },
  "Kitab":            { bg: "#fff8e1", color: "#ff8f00", hoverBg: "#ff8f00", shadow: "rgba(255,143,0,0.25)" },
  "Alış-veriş":       { bg: "#fce4ec", color: "#ad1457", hoverBg: "#ad1457", shadow: "rgba(173,20,87,0.25)" },
  "Usta xidməti":     { bg: "#eceff1", color: "#455a64", hoverBg: "#455a64", shadow: "rgba(69,90,100,0.25)" },
  "Tikinti":          { bg: "#fff3e0", color: "#e65100", hoverBg: "#e65100", shadow: "rgba(230,81,0,0.25)" },
  "Səyahət":          { bg: "#e1f5fe", color: "#0277bd", hoverBg: "#0277bd", shadow: "rgba(2,119,189,0.25)" },
  "Kənd təsərrüfatı": { bg: "#f1f8e9", color: "#33691e", hoverBg: "#33691e", shadow: "rgba(51,105,30,0.25)" },
  "Foto və video":    { bg: "#fafafa", color: "#212121", hoverBg: "#212121", shadow: "rgba(33,33,33,0.25)" },
  "Musiqi":           { bg: "#f3e5f5", color: "#6a1b9a", hoverBg: "#6a1b9a", shadow: "rgba(106,27,154,0.25)" },
  "Qida":             { bg: "#fff3e0", color: "#e64a19", hoverBg: "#e64a19", shadow: "rgba(230,74,25,0.25)" },
  "Nəqliyyat xidmətləri": { bg: "#e8eaf6", color: "#283593", hoverBg: "#283593", shadow: "rgba(40,53,147,0.25)" },
  "Təhsil":           { bg: "#e8f5e9", color: "#1b5e20", hoverBg: "#1b5e20", shadow: "rgba(27,94,32,0.25)" },
  "Digər":            { bg: "#f5f5f5", color: "#757575", hoverBg: "#757575", shadow: "rgba(117,117,117,0.25)" },
};

const defaultColor = { bg: "#f0f7ff", color: "#2563eb", hoverBg: "#2563eb", shadow: "rgba(37,99,235,0.25)" };

const Categories = () => {
  const dispatch = useDispatch();
  const { mainCategories, mainLoading } = useSelector((state) => state.categories);

  useEffect(() => {
    dispatch(fetchMainCategories());
  }, [dispatch]);

  if (mainLoading && mainCategories.length === 0) {
    return (
      <section className={styles.categoriesSection}>
        <div className={styles.container}>
          <div className={styles.header}>
            <h2 className={styles.title}>Kateqoriyalar</h2>
            <div className={styles.viewAllPlaceholder} />
          </div>
          <div className={styles.grid}>
            {[1, 2, 3, 4, 5, 6].map((n) => (
              <div key={n} className={styles.skeletonCard} />
            ))}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className={styles.categoriesSection}>
      <div className={styles.container}>
        <div className={styles.header}>
          <h2 className={styles.title}>Kateqoriyalar</h2>
          <Link to="/categories" className={styles.viewAllBtn}>
            Hamısına bax <FaChevronRight className={styles.btnIcon} />
          </Link>
        </div>

        <div className={styles.grid}>
          {mainCategories.map((cat, idx) => {
            const theme = colorMap[cat.name] || defaultColor;
            return (
              <Link
                to={`/search?category=${cat.id}`}
                key={cat.id}
                className={styles.categoryCard}
                style={{
                  "--cat-bg": theme.bg,
                  "--cat-color": theme.color,
                  "--cat-hover-bg": theme.hoverBg,
                  "--cat-shadow": theme.shadow,
                }}
              >
                <div className={styles.iconContainer}>
                  <div className={styles.iconBackground}>
                    {iconMap[cat.name] || <FaEllipsis />}
                  </div>
                </div>
                <div className={styles.content}>
                  <h3 className={styles.catName}>{cat.name}</h3>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default Categories;
