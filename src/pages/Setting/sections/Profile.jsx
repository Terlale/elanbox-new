import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import styles from "../settings.module.scss";
import avatarImg from "../../../assets/images/avatar.png";
import { updateProfileThunk, updateProfileImageThunk } from "../../../redux/thunks/authThunks";

const Profile = () => {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.auth.user);

  const [preview, setPreview] = useState(avatarImg);
  const [avatarFile, setAvatarFile] = useState(null);

  const [form, setForm] = useState({
    fullName: "",
    phone: "",
    city: "",
  });

  useEffect(() => {
    if (user) {
      setForm({
        fullName: user.fullName || "",
        phone: user.phone || "",
        city: user.city || "",
      });

      setPreview(user.avatarUrl || avatarImg);
    }
  }, [user]);

  const handleSave = async () => {
    try {
      await dispatch(
        updateProfileThunk({
          fullName: form.fullName,
          phone: form.phone,
          city: form.city,
        })
      ).unwrap();

      if (avatarFile) {
        await dispatch(updateProfileImageThunk(avatarFile)).unwrap();
        setAvatarFile(null);
      }

      alert("Məlumatlar uğurla yadda saxlanıldı!");
    } catch (err) {
      alert("Xəta baş verdi: " + (err || "Bilinməyən xəta"));
    }
  };

  return (
    <div>
      <h2 className={styles.sectionTitle}>Profil məlumatları</h2>
      <p className={styles.sectionDesc}>
        Bu məlumatlar profilində görünəcək
      </p>

      <div className={styles.profileCard}>
        {}
        <div className={styles.avatarRow}>
          <label className={styles.avatarWrap}>
            <img src={preview} alt="avatar" />
            <input
              type="file"
              accept="image/*"
              onChange={(e) => {
                const file = e.target.files[0];
                if (!file) return;
                setAvatarFile(file);
                const reader = new FileReader();
                reader.onloadend = () => setPreview(reader.result);
                reader.readAsDataURL(file);
              }}
            />
            <span>Dəyiş</span>
          </label>
        </div>

        {}
        <div className={styles.form}>
          <div className={styles.field}>
            <label>Ad Soyad</label>
            <input
              value={form.fullName}
              onChange={(e) =>
                setForm({ ...form, fullName: e.target.value })
              }
            />
          </div>

          <div className={styles.field}>
            <label>Email</label>
            <input value={user?.email || ""} disabled />
          </div>

          <div className={styles.field}>
            <label>Telefon</label>
            <input
              value={form.phone}
              onChange={(e) =>
                setForm({ ...form, phone: e.target.value })
              }
            />
          </div>

          <div className={styles.field}>
            <label>Şəhər</label>
            <input
              value={form.city}
              onChange={(e) =>
                setForm({ ...form, city: e.target.value })
              }
            />
          </div>
        </div>

        <button className={styles.saveBtn} onClick={handleSave}>
          Yadda saxla
        </button>
      </div>
    </div>
  );
};

export default Profile;
