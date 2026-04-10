import React from "react";
import { FaEdit, FaShieldAlt } from "react-icons/fa";
import styles from "../styles/Table.module.scss";

const RolesTable = ({ roles, onEdit }) => {
  return (
    <div className={styles.tableContainer}>
      <div className={styles.tableHeader}>
        <h3>Admin Rolları</h3>
      </div>
      <div className={styles.tableWrapper}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>Rol Adı</th>
              <th>İcazələr</th>
              <th>Əməliyyatlar</th>
            </tr>
          </thead>
          <tbody>
            {roles.length > 0 ? (
              roles.map((role) => (
                <tr key={role.name}>
                  <td>
                    <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                      <FaShieldAlt style={{ color: "#17a6f5" }} />
                      <span style={{ fontWeight: 600 }}>{role.name}</span>
                    </div>
                  </td>
                  <td>
                    <div style={{ display: "flex", flexWrap: "wrap", gap: "5px" }}>
                      {role.permissions?.map((p, idx) => (
                        <span 
                          key={idx} 
                          style={{ 
                            fontSize: "11px", 
                            background: "#f1f5f9", 
                            padding: "2px 8px", 
                            borderRadius: "4px",
                            color: "#475569",
                            border: "1px solid #e2e8f0"
                          }}
                        >
                          {p.name}
                        </span>
                      ))}
                    </div>
                  </td>
                  <td>
                    <div className={styles.actions}>
                      <button 
                        className={styles.actionBtn} 
                        title="Redaktə et"
                        onClick={() => onEdit(role)}
                      >
                        <FaEdit />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="3" style={{ textAlign: "center", padding: "2rem" }}>
                  Heç bir rol tapılmadı.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default RolesTable;
