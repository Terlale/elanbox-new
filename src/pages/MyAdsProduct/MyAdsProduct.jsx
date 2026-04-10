import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import styles from "./myAdsProduct.module.scss";
import Header from "../../components/layout/header/Header";
import Footer from "../../components/layout/footer/Footer";
import { FaImage, FaCheck, FaChevronRight } from "react-icons/fa6";

import { fetchCategories } from "../../redux/thunks/categoryThunks";
import { fetchDynamicFieldsByCategory } from "../../redux/thunks/dynamicFieldThunks";
import {
  createListing,
  updateListing,
  uploadListingImages,
  fetchListingById
} from "../../redux/thunks/listingThunks";

const MyAdsProduct = () => {
  const { id } = useParams();
  const isEdit = Boolean(id);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { items: categories = [] } = useSelector((s) => s.categories || {});
  const { items: dynamicFields = [] } = useSelector((s) => s.dynamicFields || {});
  const { user } = useSelector((s) => s.auth);

  const [selectedPath, setSelectedPath] = useState([]);
  const [attributes, setAttributes] = useState({});
  const [images, setImages] = useState([]);
  const [premium, setPremium] = useState(false);
  const [status, setStatus] = useState("PENDING");
  const [errors, setErrors] = useState({});

  const [form, setForm] = useState({
    title: "",
    description: "",
    price: "",
    condition: "",
    city: "",
  });

  useEffect(() => {
    dispatch(fetchCategories());
    if (isEdit) {
      dispatch(fetchListingById(id)).unwrap().then((data) => {
        setForm({
          title: data.title || "",
          description: data.description || "",
          price: data.price || "",
          condition: data.condition || "",
          city: data.city || "",
        });
        const catId = data.category?.id || data.categoryId || null;
        if (catId) {
          dispatch(fetchCategories()).unwrap().then((allCats) => {
            const path = [];
            let current = allCats.find(c => c.id === catId);
            while (current) {
              path.unshift({ id: current.id, name: current.name });
              const parentId = current.parentId;
              current = allCats.find(c => c.id === parentId);
            }
            setSelectedPath(path);
          });
        }

        setPremium(data.premium || false);
        setStatus(data.status || "ACTIVE");

        if (data.listingImages || data.images) {
          const existing = (data.listingImages || data.images).map(img => {
            const path = typeof img === 'string' ? img : (img.path || img.imageName || img.url);
            return {
              isExisting: true,
              path: path,
              url: path.startsWith('http') ? path : `http://localhost:8080/api/v1/listings/images/${path}`
            };
          });
          setImages(existing);
        }

        if (data.attributes) {
          const attrMap = {};
          data.attributes.forEach(a => {
            const fieldId = a.dynamicFieldId || a.dynamicField?.id || a.fieldId;
            if (fieldId) attrMap[fieldId] = a.value;
          });
          setAttributes(attrMap);
        }
      });
    }
  }, [dispatch, id, isEdit]);

  useEffect(() => {
    const lastCatId = selectedPath.length > 0 ? selectedPath[selectedPath.length - 1].id : null;
    if (lastCatId) {
      const hasChildren = categories.some(c => c.parentId === lastCatId);
      if (!hasChildren) {
        dispatch(fetchDynamicFieldsByCategory(lastCatId));
      }
    }
  }, [selectedPath, categories, dispatch]);

  const handleCategorySelect = (cat) => {
    setSelectedPath(prev => [...prev, { id: cat.id, name: cat.name }]);
  };

  const navigateToPathStep = (index) => {
    if (index === -1) {
      setSelectedPath([]);
    } else {
      setSelectedPath(prev => prev.slice(0, index + 1));
    }
  };

  const currentCategoryId = selectedPath.length > 0 ? selectedPath[selectedPath.length - 1].id : null;
  const visibleCategories = categories.filter(c => 
    selectedPath.length === 0 ? !c.parentId : c.parentId === currentCategoryId
  );
  const isFinalCategory = visibleCategories.length === 0 && selectedPath.length > 0;

  const handleFormChange = (key, value) => {
    setForm((prev) => ({ ...prev, [key]: value }));
    if (value && value !== "Seç") {
      setErrors((prev) => ({ ...prev, [key]: false }));
    }
  };

  const handleAttrChange = (id, value) => {
    setAttributes((prev) => ({ ...prev, [id]: value }));
  };

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    if (files.length + images.length > 10) {
      alert("Maksimum 10 şəkil seçilə bilər!");
      return;
    }
    const previews = files.map((file) => ({
      file,
      url: URL.createObjectURL(file),
      isExisting: false
    }));
    setImages((prev) => [...prev, ...previews]);
  };

  const removeImage = (idx) => {
    setImages((prev) => prev.filter((_, i) => i !== idx));
  };

  const handleSubmit = async () => {
    const descLen = form.description.trim().length;
    const newErrors = {
      title: !form.title,
      description: descLen < 10 || descLen > 1000,
      price: !form.price || isNaN(Number(form.price)),
      city: !form.city,
      condition: !form.condition || form.condition === "Seç",
      categoryId: !isFinalCategory,
    };

    setErrors(newErrors);
    if (Object.values(newErrors).some((v) => v)) {
      alert("Xahiş edirik qırmızı ilə işarələnmiş sahələri düzgün doldurun.");
      return;
    }

    try {
      const attributesPayload = Object.entries(attributes)
        .filter(([_, value]) => value !== "" && value !== null)
        .map(([dynamicFieldId, value]) => ({
          dynamicFieldId: Number(dynamicFieldId),
          value: String(value),
        }));

      const listingData = {
        title: form.title.trim(),
        description: form.description.trim(),
        price: Number(form.price),
        condition: form.condition,
        city: form.city.trim(),
        userId: Number(user.id),
        categoryId: Number(currentCategoryId),
        premium: Boolean(premium),
        status: status,
        attributes: attributesPayload
      };

      let listingId = id;
      if (isEdit) {
        await dispatch(updateListing({ id, payload: listingData })).unwrap();
        alert("Elan məlumatları uğurla yeniləndi 🎉");
      } else {
        const formData = new FormData();
        const jsonBlob = new Blob([JSON.stringify(listingData)], { type: "application/json" });
        formData.append("listing", jsonBlob);

        const result = await dispatch(createListing(formData)).unwrap();
        listingId = result?.id || result;

        console.log("DEBUG: Listing created with ID:", listingId);
        alert("Elan uğurla yaradıldı 🎉");
      }

      const newImages = images.filter(img => !img.isExisting);
      if (newImages.length > 0 && listingId) {
        console.log("DEBUG: Uploading images for listingId:", listingId);
        await dispatch(uploadListingImages({ listingId, images: newImages })).unwrap();
        alert("Şəkillər uğurla yükləndi 📸");
      }

      navigate("/settings/my-ads");
    } catch (err) {
      console.error("Update/Create Error:", err);
      const msg = err?.message || (typeof err === 'string' ? err : "Əməliyyat uğursuz oldu");
      alert(msg);
    }
  };

  return (
    <div className={`${styles.page} ${styles.muted}`}>
      <Header />
      <div className={styles.wrapper}>
        <div className={styles.head}>
          <h1>{isEdit ? "Elanı redaktə et" : "Yeni elan yerləşdir"}</h1>
          <p>{isEdit ? "Elan məlumatlarını yeniləyin" : "Məlumatları doldurun, elanınızı asanlıqla paylaşın"}</p>
        </div>

        {}
        <section className={styles.card}>
          <div className={styles.cardHead}>
            <span>1</span>
            <h3>Əsas məlumatlar</h3>
          </div>
          <div className={styles.field}>
            <label>Elanın adı</label>
            <input
              className={errors.title ? styles.fieldError : ""}
              value={form.title}
              placeholder="MacBook Pro M1 16GB"
              onChange={(e) => handleFormChange("title", e.target.value)}
            />
          </div>
          <div className={styles.field}>
            <label>Açıqlama</label>
            <textarea
              className={errors.description ? styles.fieldError : ""}
              value={form.description}
              placeholder="Məhsulun vəziyyəti, istifadə müddəti və s."
              onChange={(e) => handleFormChange("description", e.target.value)}
            />
          </div>
          <div className={styles.field}>
            <label>Şəhər</label>
            <input
              className={errors.city ? styles.fieldError : ""}
              value={form.city}
              placeholder="Məsələn: Bakı"
              onChange={(e) => handleFormChange("city", e.target.value)}
            />
          </div>
          <div className={styles.row}>
            <div className={styles.field}>
              <label>Qiymət (AZN)</label>
              <input
                className={errors.price ? styles.fieldError : ""}
                type="number"
                value={form.price}
                placeholder="2500"
                onChange={(e) => handleFormChange("price", e.target.value)}
              />
            </div>
            <div className={styles.field}>
              <label>Vəziyyət</label>
              <select
                className={errors.condition ? styles.fieldError : ""}
                value={form.condition}
                onChange={(e) => handleFormChange("condition", e.target.value)}
              >
                <option value="Seç">Seç</option>
                <option value="NEW">Yeni</option>
                <option value="USED">İşlənmiş</option>
              </select>
            </div>
          </div>
        </section>

        {}
        <section className={styles.card}>
          <div className={styles.cardHead}>
            <span>2</span>
            <h3>Kateqoriya seçimi</h3>
          </div>
          
          <div className={styles.breadcrumb}>
            <span onClick={() => navigateToPathStep(-1)} className={styles.crumb}>Kateqoriyalar</span>
            {selectedPath.map((step, i) => (
              <React.Fragment key={step.id}>
                <span className={styles.separator}>&gt;</span>
                <span 
                  className={`${styles.crumb} ${i === selectedPath.length - 1 ? styles.activeCrumb : ""}`}
                  onClick={() => navigateToPathStep(i)}
                >
                  {step.name}
                </span>
              </React.Fragment>
            ))}
          </div>

          {!isFinalCategory ? (
            <div className={styles.categoryGrid}>
              {visibleCategories.map((cat) => (
                <button
                  key={cat.id}
                  className={errors.categoryId ? styles.fieldError : ""}
                  onClick={() => handleCategorySelect(cat)}
                >
                  {cat.name}
                  <FaChevronRight style={{ fontSize: "10px", marginLeft: "auto", opacity: 0.5 }} />
                </button>
              ))}
            </div>
          ) : (
            <div className={styles.selectionComplete}>
              <FaCheck />
              <span>Kateqoriya seçildi: <strong>{selectedPath[selectedPath.length - 1].name}</strong></span>
              <button onClick={() => setSelectedPath(prev => prev.slice(0, -1))}>Dəyişdir</button>
            </div>
          )}
        </section>

        {}
        {isFinalCategory && dynamicFields.length > 0 && (
          <section className={styles.card}>
            <div className={styles.cardHead}>
              <span>3</span>
              <h3>Xüsusiyyətlər</h3>
            </div>
            <div className={styles.attrGrid}>
              {dynamicFields.map((field) => (
                <div className={styles.field} key={field.id}>
                  <label>{field.name} {field.isRequired && <span style={{ color: "red" }}>*</span>}</label>
                  
                  {field.fieldType === "SELECT" ? (
                    <select
                      value={attributes[field.id] || ""}
                      onChange={(e) => handleAttrChange(field.id, e.target.value)}
                    >
                      <option value="">Seçilməyib</option>
                      {field.options?.map((opt, i) => (
                        <option key={i} value={opt}>{opt}</option>
                      ))}
                    </select>
                  ) : field.fieldType === "NUMBER" ? (
                    <input
                      type="number"
                      value={attributes[field.id] || ""}
                      placeholder={field.name}
                      onChange={(e) => handleAttrChange(field.id, e.target.value)}
                    />
                  ) : (
                    <input
                      type="text"
                      value={attributes[field.id] || ""}
                      placeholder={field.name}
                      onChange={(e) => handleAttrChange(field.id, e.target.value)}
                    />
                  )}
                </div>
              ))}
            </div>
          </section>
        )}

        {}
        <section className={styles.card}>
          <div className={styles.cardHead}>
            <span>4</span>
            <h3>Şəkillər</h3>
          </div>
          <div className={styles.uploadArea} onClick={() => document.getElementById("fileInput").click()}>
            <FaImage />
            <p>Şəkilləri əlavə edin</p>
            <input id="fileInput" type="file" multiple accept="image/*" hidden onChange={handleImageChange} />
          </div>
          {images.length > 0 && (
            <div className={styles.thumbGrid}>
              {images.map((img, idx) => (
                <div className={styles.thumb} key={idx}>
                  <img src={img.url} alt="" />
                  <button onClick={() => removeImage(idx)}>✕</button>
                </div>
              ))}
            </div>
          )}
        </section>

        <div className={styles.actionBar}>
          <button className={styles.submit} onClick={handleSubmit}>
            {isEdit ? "Dəyişiklikləri yadda saxla" : "Elanı yerləşdir"}
          </button>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default MyAdsProduct;
