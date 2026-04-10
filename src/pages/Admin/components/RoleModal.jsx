import React, { useState, useEffect } from "react";
import { FaTimes, FaSave } from "react-icons/fa";
import styles from "../styles/Modal.module.scss";

const RoleModal = ({ role, onClose, onSave, loading }) => {
  const [name, setName] = useState("");
  const [selectedPermissions, setSelectedPermissions] = useState([]);

  const availablePermissions = [
    "MANAGE_USERS",
    "MANAGE_LISTINGS",
    "MANAGE_REPORTS",
    "MANAGE_ROLES",
    "VIEW_ANALYTICS",
    "MANAGE_SETTINGS"
  ];

  useEffect(() => {
    if (role) {
      setName(role.name);
      setSelectedPermissions(role.permissions?.map(p => p.name) || []);
    } else {
      setName("");
      setSelectedPermissions([]);
    }
  }, [role]);

  const togglePermission = (perm) => {
    if (selectedPermissions.includes(perm)) {
      setSelectedPermissions(selectedPermissions.filter(p => p !== perm));
    } else {
      setSelectedPermissions([...selectedPermissions, perm]);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name.trim()) return alert("Rol adı daxil edilməlidir!");
    
    onSave({
      name,
      permissions: selectedPermissions.map(p => availablePermissions.indexOf(p))
    });
  };

  return (
    <div className={styles.modalOverlay} onClick={onClose}>
      <div className={styles.modalContent} onClick={(e) => e.stopPropagation()} style={{ maxWidth: "500px" }}>
        <button className={styles.closeBtn} onClick={onClose}>
          <FaTimes />
        </button>

        <div className={styles.modalHeader}>
          <h2>{role ? "Rolu Redaktə Et" : "Yeni Rol Yarat"}</h2>
        </div>

        <form onSubmit={handleSubmit} className={styles.modalBody}>
          <div className={styles.formGroup} style={{ marginBottom: "20px" }}>
            <label style={{ display: "block", marginBottom: "8px", fontWeight: 600 }}>Rolun Adı</label>
            <input 
              type="text" 
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Məs: Moderator"
              className={styles.modalInput}
              disabled={!!role}
              style={{ width: "100%", padding: "12px", borderRadius: "8px", border: "1px solid #e2e8f0" }}
            />
          </div>

          <div className={styles.formGroup}>
            <label style={{ display: "block", marginBottom: "12px", fontWeight: 600 }}>İcazələr Seçin</label>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px" }}>
              {availablePermissions.map(perm => (
                <div 
                  key={perm}
                  onClick={() => togglePermission(perm)}
                  style={{
                    padding: "10px",
                    borderRadius: "8px",
                    border: "1px solid",
                    borderColor: selectedPermissions.includes(perm) ? "#17a6f5" : "#e2e8f0",
                    background: selectedPermissions.includes(perm) ? "#f0f9ff" : "white",
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    gap: "8px",
                    fontSize: "13px",
                    transition: "0.2s"
                  }}
                >
                  <input 
                    type="checkbox" 
                    checked={selectedPermissions.includes(perm)}
                    readOnly
                  />
                  {perm}
                </div>
              ))}
            </div>
          </div>

          <div className={styles.modalFooter} style={{ marginTop: "30px", padding: 0, border: "none" }}>
            <button 
              type="button" 
              className={styles.secondaryBtn} 
              onClick={onClose}
              disabled={loading}
            >
              Ləğv et
            </button>
            <button 
              type="submit" 
              className={styles.primaryBtn}
              disabled={loading}
              style={{ background: "#17a6f5", color: "white", padding: "10px 24px", borderRadius: "8px", display: "flex", alignItems: "center", gap: "8px" }}
            >
              {loading ? <div className={styles.btnSpinner} /> : <FaSave />}
              Yadda saxla
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default RoleModal;
