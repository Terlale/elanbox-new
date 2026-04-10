import React from "react";
import styles from "./categorybox.module.scss";
import { useNavigate } from "react-router-dom";
import { useActionGuard } from "../../../../guards/useActionGuard";

import {
  FaHome,
  FaCar,
  FaLaptop,
  FaMobileAlt,
  FaBriefcase,
  FaFileAlt,
} from "react-icons/fa";

const categories = [
  { icon: <FaHome />, name: "Əmlak", link: "/category/emlak" },
  { icon: <FaCar />, name: "Nəqliyyat", link: "/category/transport" },
  { icon: <FaLaptop />, name: "Elektronika", link: "/category/elektronika" },
  { icon: <FaMobileAlt />, name: "Telefonlar", link: "/category/telefon" },
  { icon: <FaBriefcase />, name: "Vakansiyalar", link: "/category/vakansiya" },
  { icon: <FaFileAlt />, name: "Xidmətlər", link: "/category/xidmet" },
];

const CategoryBox = () => {
  const navigate = useNavigate();
  const guard = useActionGuard();

  const handleClick = (link) => {
    guard(() => navigate(link));
  };

  return (
    <div className={styles.categoryBox}>
      {categories.map((cat, index) => (
        <div
          key={index}
          className={styles.cat}
          onClick={() => handleClick(cat.link)}
        >
          {cat.icon}
          <span>{cat.name}</span>
        </div>
      ))}
    </div>
  );
};

export default CategoryBox;
