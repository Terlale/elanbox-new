import React, { useState, useEffect } from "react";
import { FaTimes, FaSave, FaPlus, FaTrash } from "react-icons/fa";
import { useSelector } from "react-redux";
import styles from "../styles/Modal.module.scss";

const DynamicFieldModal = ({ field, onClose, onSave, loading }) => {
  const { items: categories } = useSelector((state) => state.categories);
  const [formData, setFormData] = useState({
    name: "",
    categoryId: "",
    fieldType: "TEXT",
    isRequired: false,
    options: [""]
  });

  const fieldTypes = [
    { value: "TEXT", label: "Mətn (Text)" },
    { value: "NUMBER", label: "Rəqəm (Number)" },
    { value: "SELECT", label: "Seçim (Select)" },
    { value: "CHECKBOX", label: "Onay qutusu (Checkbox)" }
  ];

  useEffect(() => {
    if (field) {
      setFormData({
        name: field.name || "",
        categoryId: field.category?.id || field.categoryId || "",
        fieldType: field.fieldType || "TEXT",
        isRequired: field.isRequired || false,
        options: field.options?.length > 0 ? [...field.options] : [""]
      });
    }
  }, [field]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value
    }));
  };

  const handleOptionChange = (index, value) => {
    const newOptions = [...formData.options];
    newOptions[index] = value;
    setFormData(prev => ({ ...prev, options: newOptions }));
  };

  const addOption = () => {
    setFormData(prev => ({ ...prev, options: [...prev.options, ""] }));
  };

  const removeOption = (index) => {
    setFormData(prev => ({
      ...prev,
      options: prev.options.filter((_, i) => i !== index)
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.categoryId) {
      return alert("Zəhmət olmasa bütün vacib sahələri doldurun!");
    }
    
    const submittedData = {
      ...formData,
      categoryId: Number(formData.categoryId),
      options: formData.fieldType === "SELECT" ? formData.options.filter(o => o.trim()) : []
    };

    onSave(submittedData);
  };

  return (
    <div className={styles.modalOverlay} onClick={onClose}>
      <div className={styles.modalContent} onClick={(e) => e.stopPropagation()} style={{ maxWidth: "550px" }}>
        <button className={styles.closeBtn} onClick={onClose}>
          <FaTimes />
        </button>

        <div className={styles.modalHeader}>
          <h2>{field ? "Sahəni Redaktə Et" : "Yeni Dinamik Sahə"}</h2>
        </div>

        <form onSubmit={handleSubmit} className={styles.modalBody}>
          <div className={styles.formGroup}>
            <label>Sahə Adı *</label>
            <input 
              type="text" 
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Məs: Rəng, Marka, İl..."
              required
            />
          </div>

          <div className={styles.formGroup}>
            <label>Kateqoriya *</label>
            <select 
              name="categoryId" 
              value={formData.categoryId} 
              onChange={handleChange}
              required
            >
              <option value="">Kateqoriya seçin</option>
              {categories.map(cat => (
                <option key={cat.id} value={cat.id}>{cat.name}</option>
              ))}
            </select>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px" }}>
            <div className={styles.formGroup}>
              <label>Sahə Növü</label>
              <select name="fieldType" value={formData.fieldType} onChange={handleChange}>
                {fieldTypes.map(type => (
                  <option key={type.value} value={type.value}>{type.label}</option>
                ))}
              </select>
            </div>

            <div className={styles.formGroup} style={{ display: "flex", alignItems: "center", gap: "10px", marginTop: "25px" }}>
              <input 
                type="checkbox" 
                id="isRequired"
                name="isRequired"
                checked={formData.isRequired}
                onChange={handleChange}
                style={{ width: "20px", height: "20px" }}
              />
              <label htmlFor="isRequired" style={{ marginBottom: 0, cursor: "pointer" }}>Mütləq sahə</label>
            </div>
          </div>

          {formData.fieldType === "SELECT" && (
            <div className={styles.formGroup} style={{ marginTop: "20px" }}>
              <label style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <span>Seçimlər (Options)</span>
                <button type="button" onClick={addOption} className={styles.addOptionBtn} style={{ background: "#f0f9ff", color: "#17a6f5", border: "none", padding: "4px 8px", borderRadius: "4px", fontSize: "12px", cursor: "pointer" }}>
                  <FaPlus /> Əlavə et
                </button>
              </label>
              <div style={{ display: "flex", flexDirection: "column", gap: "8px", marginTop: "8px", maxHeight: "150px", overflowY: "auto", paddingRight: "5px" }}>
                {formData.options.map((opt, idx) => (
                  <div key={idx} style={{ display: "flex", gap: "8px" }}>
                    <input 
                      type="text" 
                      value={opt}
                      onChange={(e) => handleOptionChange(idx, e.target.value)}
                      placeholder={`Seçim ${idx + 1}`}
                      style={{ flex: 1 }}
                    />
                    {formData.options.length > 1 && (
                      <button type="button" onClick={() => removeOption(idx)} style={{ background: "#fee2e2", color: "#ef4444", border: "none", padding: "8px", borderRadius: "8px", cursor: "pointer" }}>
                        <FaTrash size={12} />
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

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

export default DynamicFieldModal;
