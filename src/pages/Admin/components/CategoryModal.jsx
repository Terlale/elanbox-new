import React, { useState, useEffect } from "react";
import { FaTimes, FaSave } from "react-icons/fa";
import styles from "../styles/Modal.module.scss";

const CategoryModal = ({ category, categories, initialParentId, onClose, onSave, loading }) => {
  const [formData, setFormData] = useState({
    name: "",
    slug: "",
    parentId: ""
  });

  useEffect(() => {
    if (category) {
      setFormData({
        name: category.name || "",
        slug: category.slug || "",
        parentId: category.parentId || ""
      });
    } else if (initialParentId) {
      setFormData(prev => ({
        ...prev,
        parentId: initialParentId
      }));
    }
  }, [category, initialParentId]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
      slug: name === "name" && !category ? value.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '') : prev.slug
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.name.trim()) return alert("Ad daxil edilməlidir!");
    
    onSave({
      ...formData,
      parentId: formData.parentId ? Number(formData.parentId) : null
    });
  };

  const potentialParents = categories.filter(c => !category || c.id !== category.id);

  return (
    <div className={styles.modalOverlay} onClick={onClose}>
      <div className={styles.modalContent} onClick={(e) => e.stopPropagation()} style={{ maxWidth: "500px" }}>
        <button className={styles.closeBtn} onClick={onClose}>
          <FaTimes />
        </button>

        <div className={styles.modalHeader}>
          <h2>{category ? "Kateqoriyanı Redaktə Et" : "Yeni Kateqoriya"}</h2>
        </div>

        <form onSubmit={handleSubmit} className={styles.modalBody}>
          <div className={styles.formGroup}>
            <label>Kateqoriya Adı *</label>
            <input 
              type="text" 
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Məs: Elektronika"
              required
            />
          </div>

          <div className={styles.formGroup}>
            <label>Slug (URL dostu ad)</label>
            <input 
              type="text" 
              name="slug"
              value={formData.slug}
              onChange={handleChange}
              placeholder="Məs: elektronika"
            />
          </div>

          <div className={styles.formGroup}>
            <label>Üst Kateqoriya (Parent)</label>
            <select 
              name="parentId" 
              value={formData.parentId} 
              onChange={handleChange}
            >
              <option value="">Yoxdur (Əsas kateqoriya)</option>
              {potentialParents.map(cat => (
                <option key={cat.id} value={cat.id}>{cat.name}</option>
              ))}
            </select>
          </div>

          <div className={styles.modalFooter}>
            <button type="button" className={styles.secondaryBtn} onClick={onClose} disabled={loading}>Ləğv et</button>
            <button type="submit" className={styles.primaryBtn} disabled={loading}>
              {loading ? <div className={styles.btnSpinner} /> : <FaSave />}
              <span>Yadda saxla</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CategoryModal;
