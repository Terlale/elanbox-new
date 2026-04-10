import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { 
  fetchAdminDynamicFields, 
  createAdminDynamicField, 
  updateAdminDynamicField, 
  deleteAdminDynamicField 
} from "../../../redux/thunks/adminThunk";
import { fetchCategories } from "../../../redux/thunks/categoryThunks";
import DynamicFieldModal from "../components/DynamicFieldModal";
import { FaPlus, FaEdit, FaTrash, FaCogs, FaFilter, FaLayerGroup } from "react-icons/fa";
import styles from "../styles/Dashboard.module.scss";
import tableStyles from "../styles/Table.module.scss";

const DynamicFields = () => {
  const dispatch = useDispatch();
  const { dynamicFields, loading } = useSelector((state) => state.admin);
  const { items: categories = [] } = useSelector((state) => state.categories);
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedField, setSelectedField] = useState(null);
  const [selectedCategoryId, setSelectedCategoryId] = useState("all");
  const [actionLoading, setActionLoading] = useState(false);

  useEffect(() => {
    dispatch(fetchAdminDynamicFields());
    dispatch(fetchCategories());
  }, [dispatch]);

  const handleCreate = () => {
    setSelectedField(null);
    setIsModalOpen(true);
  };

  const handleEdit = (field) => {
    setSelectedField(field);
    setIsModalOpen(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm("Bu dinamik sahəni silmək istədiyinizə əminsiniz?")) {
      try {
        await dispatch(deleteAdminDynamicField(id)).unwrap();
        alert("Sahə silindi!");
      } catch (error) {
        const errorMsg = typeof error === "string" ? error : (error.message || JSON.stringify(error));
        alert("Xəta baş verdi: " + errorMsg);
      }
    }
  };

  const handleSave = async (data) => {
    setActionLoading(true);
    try {
      if (selectedField) {
        await dispatch(updateAdminDynamicField({ id: selectedField.id, data })).unwrap();
        alert("Sahə yeniləndi!");
      } else {
        await dispatch(createAdminDynamicField(data)).unwrap();
        alert("Yeni sahə yaradıldı!");
      }
      setIsModalOpen(false);
    } catch (error) {
      const errorMsg = typeof error === "string" ? error : (error.message || JSON.stringify(error));
      alert("Xəta baş verdi: " + errorMsg);
    } finally {
      setActionLoading(false);
    }
  };

  const filteredFields = selectedCategoryId === "all" 
    ? dynamicFields 
    : dynamicFields.filter(f => f.category?.id === Number(selectedCategoryId) || f.categoryId === Number(selectedCategoryId));

  const groupedFields = filteredFields.reduce((acc, field) => {
    const catName = field.category?.name || "Kategoriyasız";
    if (!acc[catName]) acc[catName] = [];
    acc[catName].push(field);
    return acc;
  }, {});

  if (loading && dynamicFields.length === 0) {
    return (
      <div className={styles.loadingState}>
        <div className={styles.spinner}></div>
        <p>Məlumatlar yüklənir...</p>
      </div>
    );
  }

  return (
    <div className={styles.pageContainer}>
      <header className={styles.pageHeader}>
        <div>
          <h1>Dinamik Sahələr</h1>
    <p>Hər kateqoriya üçün xüsusi elan xüsusiyyətlərini idarə edin.</p>
  </div>
  <div style={{ display: "flex", gap: "12px", alignItems: "center" }}>
    <div style={{ 
      display: "flex", 
      alignItems: "center", 
      gap: "8px", 
      background: "rgba(255, 255, 255, 0.8)", 
      padding: "6px 14px", 
      borderRadius: "12px", 
      border: "1px solid rgba(226, 232, 240, 0.8)",
      boxShadow: "0 2px 4px rgba(0,0,0,0.02)"
    }}>
      <FaFilter style={{ color: "#64748b", fontSize: "13px" }} />
      <select 
        value={selectedCategoryId} 
        onChange={(e) => setSelectedCategoryId(e.target.value)}
        style={{ border: "none", background: "transparent", fontSize: "13px", fontWeight: 600, color: "#475569", outline: "none", cursor: "pointer" }}
      >
        <option value="all">Bütün Kateqoriyalar</option>
        {categories.map(cat => (
          <option key={cat.id} value={cat.id}>{cat.name}</option>
        ))}
      </select>
    </div>
    <button className={styles.primaryBtn} onClick={handleCreate}>
      <FaPlus />
      <span>Yeni Sahə</span>
    </button>
  </div>
</header>

<div className={tableStyles.tableContainer}>
  <div className={tableStyles.tableWrapper}>
    <table className={tableStyles.table}>
      <thead>
        <tr>
          <th>Sahə Adı</th>
          <th>Kateqoriya</th>
          <th>Növü</th>
          <th>Vacib?</th>
          <th>Seçimlər</th>
          <th>Əməliyyatlar</th>
        </tr>
      </thead>
      <tbody>
        {Object.keys(groupedFields).length > 0 ? (
          Object.entries(groupedFields).map(([catName, fields]) => (
            <React.Fragment key={catName}>
              <tr>
                <td colSpan="6" style={{ padding: "0" }}>
                  <div style={{ 
                    margin: "12px 1.5rem",
                    padding: "10px 20px",
                    background: "rgba(37, 99, 235, 0.05)",
                    backdropFilter: "blur(4px)",
                    borderRadius: "12px",
                    border: "1px solid rgba(37, 99, 235, 0.1)",
                    display: "flex", 
                    alignItems: "center", 
                    gap: "12px", 
                    color: "#2563eb"
                  }}>
                    <FaLayerGroup style={{ fontSize: "14px" }} />
                    <span style={{ fontSize: "12px", fontWeight: 800, textTransform: "uppercase", letterSpacing: "1px" }}>{catName}</span>
                    <span style={{ 
                      marginLeft: "auto",
                      fontSize: "10.5px", 
                      background: "white", 
                      padding: "2px 10px", 
                      borderRadius: "20px", 
                      fontWeight: 700,
                      boxShadow: "0 2px 5px rgba(37, 99, 235, 0.1)"
                    }}>{fields.length} AKTİV SAHƏ</span>
                  </div>
                </td>
              </tr>
              {fields.map((field) => (
                <tr key={field.id} style={{ borderLeft: "4px solid transparent", transition: "all 0.2s" }}>
                  <td style={{ paddingLeft: "2.5rem" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                      <div style={{ width: "8px", height: "8px", borderRadius: "50%", background: "#e2e8f0" }} />
                      <span style={{ fontWeight: 600, color: "#1e293b" }}>{field.name}</span>
                    </div>
                  </td>
                  <td>
                    <span style={{ fontSize: "12px", color: "#64748b", fontWeight: 500 }}>
                      {field.category?.name || "-"}
                    </span>
                  </td>
                  <td>
                    <span style={{ 
                      fontSize: "11px", 
                      padding: "4px 10px", 
                      borderRadius: "8px", 
                      background: "rgba(241, 245, 249, 0.8)",
                      color: "#475569",
                      fontWeight: 700,
                      border: "1px solid rgba(226, 232, 240, 0.5)"
                    }}>
                      {field.fieldType}
                    </span>
                  </td>
                  <td>
                    {field.isRequired ? (
                      <span style={{ color: "#ef4444", display: "flex", alignItems: "center", gap: "4px", fontSize: "12px", fontWeight: 600 }}>
                        <div style={{ width: "5px", height: "5px", borderRadius: "50%", background: "#ef4444" }} />
                        Mütləq
                      </span>
                    ) : (
                      <span style={{ color: "#94a3b8", fontSize: "12px" }}>Könüllü</span>
                    )}
                  </td>
                  <td>
                    {field.fieldType === "SELECT" ? (
                      <div style={{ display: "flex", flexWrap: "wrap", gap: "6px", maxWidth: "250px" }}>
                        {field.options?.map((opt, i) => (
                          <span key={i} style={{ 
                            fontSize: "10px", 
                            background: "white", 
                            color: "#059669", 
                            padding: "2px 8px", 
                            borderRadius: "6px", 
                            border: "1px solid #d1fae5",
                            boxShadow: "0 1px 2px rgba(0,0,0,0.02)"
                          }}>{opt}</span>
                        ))}
                      </div>
                    ) : (
                      <span style={{ color: "#cbd5e1" }}>---</span>
                    )}
                  </td>
                  <td>
                    <div className={tableStyles.actions}>
                      <button className={tableStyles.actionBtn} onClick={() => handleEdit(field)} title="Redaktə"><FaEdit /></button>
                      <button className={`${tableStyles.actionBtn} ${tableStyles.delete}`} onClick={() => handleDelete(field.id)} title="Sil"><FaTrash /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </React.Fragment>
          ))
        ) : (
          <tr>
            <td colSpan="6" style={{ textAlign: "center", padding: "60px" }}>
              <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "10px", color: "#94a3b8" }}>
                <FaCogs style={{ fontSize: "40px", opacity: 0.2 }} />
                <p>Bu kateqoriya üçün hələ heç bir sahə təyin edilməyib.</p>
              </div>
            </td>
          </tr>
        )}
      </tbody>
    </table>
  </div>
</div>

      {isModalOpen && (
        <DynamicFieldModal 
          field={selectedField} 
          onClose={() => setIsModalOpen(false)} 
          onSave={handleSave}
          loading={actionLoading}
        />
      )}
    </div>
  );
};

export default DynamicFields;
