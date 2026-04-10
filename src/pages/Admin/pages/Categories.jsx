import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { 
  fetchAdminCategories, 
  createAdminCategory, 
  updateAdminCategory, 
  deleteAdminCategory 
} from "../../../redux/thunks/adminThunk";
import CategoryModal from "../components/CategoryModal";
import { FaPlus, FaEdit, FaTrash, FaFolder, FaChevronRight, FaChevronDown, FaFolderOpen } from "react-icons/fa";
import styles from "../styles/Dashboard.module.scss";
import tableStyles from "../styles/Table.module.scss";

const Categories = () => {
  const dispatch = useDispatch();
  const { categories, loading } = useSelector((state) => state.admin);
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [initialParentId, setInitialParentId] = useState(null);
  const [actionLoading, setActionLoading] = useState(false);
  const [expandedIds, setExpandedIds] = useState({});

  useEffect(() => {
    dispatch(fetchAdminCategories());
  }, [dispatch]);

  const handleCreate = (parentId = null) => {
    setSelectedCategory(null);
    setInitialParentId(parentId);
    setIsModalOpen(true);
  };

  const handleEdit = (category) => {
    setSelectedCategory(category);
    setInitialParentId(category.parentId);
    setIsModalOpen(true);
  };

  const toggleExpand = (id) => {
    setExpandedIds(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  const handleDelete = async (id) => {
    if (window.confirm("Bu kateqoriyanı silmək istədiyinizə əminsiniz? Alt-kateqoriyalar da silinə bilər.")) {
      try {
        await dispatch(deleteAdminCategory(id)).unwrap();
        alert("Kateqoriya silindi!");
      } catch (error) {
        const errorMsg = typeof error === "string" ? error : (error.message || JSON.stringify(error));
        alert("Xəta baş verdi: " + errorMsg);
      }
    }
  };

  const handleSave = async (data) => {
    setActionLoading(true);
    try {
      if (selectedCategory) {
        await dispatch(updateAdminCategory({ id: selectedCategory.id, data })).unwrap();
        alert("Kateqoriya yeniləndi!");
      } else {
        await dispatch(createAdminCategory(data)).unwrap();
        alert("Yeni kateqoriya yaradıldı!");
      }
      setIsModalOpen(false);
    } catch (error) {
      const errorMsg = typeof error === "string" ? error : (error.message || JSON.stringify(error));
      alert("Xəta baş verdi: " + errorMsg);
    } finally {
      setActionLoading(false);
    }
  };

  const buildTree = (items, parentId = null) => {
    return items
      .filter(item => item.parentId === parentId)
      .map(item => ({
        ...item,
        children: buildTree(items, item.id)
      }));
  };

  const categoryTree = buildTree(categories);

  const renderCategoryRow = (cat, depth = 0) => {
    const isExpanded = expandedIds[cat.id];
    const hasChildren = cat.children && cat.children.length > 0;
    const isRoot = depth === 0;

    return (
      <React.Fragment key={cat.id}>
        <tr className={isExpanded && hasChildren ? styles.expandedRow : ""}>
          <td>
            <div style={{ 
              display: "flex", 
              alignItems: "center", 
              gap: "12px", 
              paddingLeft: `${depth * 28}px`,
              position: "relative"
            }}>
              {}
              {depth > 0 && (
                <div style={{
                  position: "absolute",
                  left: `${(depth - 1) * 28 + 10}px`,
                  top: "-20px",
                  bottom: "50%",
                  width: "2px",
                  background: "rgba(37, 99, 235, 0.15)",
                  borderRadius: "2px"
                }} />
              )}
              {depth > 0 && (
                <div style={{
                  position: "absolute",
                  left: `${(depth - 1) * 28 + 10}px`,
                  bottom: "50%",
                  width: "12px",
                  height: "2px",
                  background: "rgba(37, 99, 235, 0.15)",
                  borderRadius: "2px"
                }} />
              )}

              <div 
                onClick={() => hasChildren && toggleExpand(cat.id)}
                style={{ 
                  cursor: hasChildren ? "pointer" : "default", 
                  display: "flex", 
                  alignItems: "center", 
                  justifyContent: "center",
                  width: "24px",
                  height: "24px",
                  borderRadius: "6px",
                  background: hasChildren ? "rgba(37, 99, 235, 0.05)" : "transparent",
                  transition: "all 0.2s"
                }}
              >
                {hasChildren ? (
                  isExpanded ? <FaChevronDown style={{ fontSize: "10px", color: "#2563eb" }} /> : <FaChevronRight style={{ fontSize: "10px", color: "#64748b" }} />
                ) : null}
              </div>
              
              <div style={{
                width: "32px",
                height: "32px",
                borderRadius: "8px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                background: isRoot ? "rgba(37, 99, 235, 0.1)" : "rgba(241, 245, 249, 0.8)",
                color: isRoot ? "#2563eb" : "#64748b"
              }}>
                {hasChildren ? (
                  isExpanded ? <FaFolderOpen /> : <FaFolder />
                ) : (
                  <FaFolder />
                )}
              </div>

              <span style={{ 
                fontWeight: isRoot ? 800 : 500, 
                color: isRoot ? "#0f172a" : "#475569",
                fontSize: isRoot ? "14px" : "13.5px"
              }}>
                {cat.name}
              </span>
            </div>
          </td>
          <td>
            <code style={{ 
              fontSize: "11px", 
              background: "rgba(241, 245, 249, 0.7)", 
              color: "#64748b",
              padding: "3px 8px", 
              borderRadius: "6px",
              fontWeight: 600
            }}>
              /{cat.slug}
            </code>
          </td>
          <td>
            <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
              <span style={{ 
                fontSize: "11px", 
                padding: "2px 8px",
                borderRadius: "10px",
                background: cat.children.length > 0 ? "#eff6ff" : "#f8fafc",
                color: cat.children.length > 0 ? "#2563eb" : "#94a3b8",
                fontWeight: 700
              }}>
                {cat.children.length} alt-kateqoriya
              </span>
            </div>
          </td>
          <td>
            <div className={tableStyles.actions}>
              <button 
                className={tableStyles.actionBtn} 
                onClick={() => handleCreate(cat.id)} 
                title="Alt-kateqoriya əlavə et"
                style={{ color: "#10b981", background: "rgba(16, 185, 129, 0.05)" }}
              >
                <FaPlus />
              </button>
              <button className={tableStyles.actionBtn} onClick={() => handleEdit(cat)} title="Redaktə"><FaEdit /></button>
              <button className={`${tableStyles.actionBtn} ${tableStyles.delete}`} onClick={() => handleDelete(cat.id)} title="Sil"><FaTrash /></button>
            </div>
          </td>
        </tr>
        {hasChildren && isExpanded && cat.children.map(child => renderCategoryRow(child, depth + 1))}
      </React.Fragment>
    );
  };

  if (loading && categories.length === 0) {
    return (
      <div className={styles.loadingState}>
        <div className={styles.spinner}></div>
        <p>Kateqoriyalar yüklənir...</p>
      </div>
    );
  }

  return (
    <div className={styles.pageContainer}>
      <header className={styles.pageHeader}>
        <div>
          <h1>Kateqoriyalar</h1>
          <p>Elan kateqoriyalarını iyerarxik şəkildə idarə edin.</p>
        </div>
        <button className={styles.primaryBtn} onClick={() => handleCreate()} style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          <FaPlus />
          <span>Yeni Əsas Kateqoriya</span>
        </button>
      </header>

      <div className={tableStyles.tableContainer}>
        <div className={tableStyles.tableWrapper}>
          <table className={tableStyles.table}>
            <thead>
              <tr>
                <th>Kateqoriya Adı</th>
                <th>Slug</th>
                <th>Məlumat</th>
                <th>Əməliyyatlar</th>
              </tr>
            </thead>
            <tbody>
              {categoryTree.map(cat => renderCategoryRow(cat))}
              {categories.length === 0 && (
                <tr>
                  <td colSpan="4" style={{ textAlign: "center", padding: "40px", color: "#94a3b8" }}>Heç bir kateqoriya tapılmadı.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {isModalOpen && (
        <CategoryModal 
          category={selectedCategory} 
          categories={categories}
          initialParentId={initialParentId}
          onClose={() => setIsModalOpen(false)} 
          onSave={handleSave}
          loading={actionLoading}
        />
      )}
    </div>
  );
};

export default Categories;
