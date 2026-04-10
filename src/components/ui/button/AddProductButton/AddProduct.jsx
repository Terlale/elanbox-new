import React from "react";
import { FaPlus } from "react-icons/fa6";
import styles from "./addProduct.module.scss";

const AddProduct = ({ onClick }) => {
  return (
    <button className={styles.addBtn} onClick={onClick}>
      <FaPlus />
      <span>Elan Yerləşdir</span>
    </button>
  );
};

export default AddProduct;
