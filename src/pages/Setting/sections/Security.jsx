import { useState } from "react";
import styles from "../settings.module.scss";

const Security = () => {
  const [form, setForm] = useState({
    oldPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const handleSave = () => {
    console.log("Saving new password...");
  };

  return (
    <div>
      <h2 className={styles.sectionTitle}>Təhlükəsizlik</h2>
      <p className={styles.sectionDesc}>
        Parolunuzu buradan yeniləyə bilərsiniz
      </p>

      <div className={styles.profileCard}>
        <div className={styles.form}>
          <div className={`${styles.field} ${styles.full}`}>
            <label>Köhnə parol</label>
            <input
              type="password"
              placeholder="Köhnə parolunuzu daxil edin"
              value={form.oldPassword}
              onChange={(e) => setForm({ ...form, oldPassword: e.target.value })}
            />
          </div>

          <div className={styles.field}>
            <label>Yeni parol</label>
            <input
              type="password"
              placeholder="Yeni parolunuzu daxil edin"
              value={form.newPassword}
              onChange={(e) => setForm({ ...form, newPassword: e.target.value })}
            />
          </div>

          <div className={styles.field}>
            <label>Yeni parol (təkrar)</label>
            <input
              type="password"
              placeholder="Yeni parolu təkrarlayın"
              value={form.confirmPassword}
              onChange={(e) => setForm({ ...form, confirmPassword: e.target.value })}
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

export default Security;
