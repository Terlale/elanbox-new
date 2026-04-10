import React, { useState } from "react";
import styles from "./ReportModal.module.scss";

const ReportModal = ({ isOpen, onClose, onSubmit, userId }) => {
    const [reason, setReason] = useState("scam");
    const [description, setDescription] = useState("");

    if (!isOpen) return null;

    const handleSubmit = (e) => {
        e.preventDefault();
        onSubmit({ userId, reason, description });
        onClose();
    };

    return (
        <div className={styles.overlay} onClick={onClose}>
            <div className={styles.modal} onClick={e => e.stopPropagation()}>
                <div className={styles.header}>
                    <h2>İstifadəçini şikayət et</h2>
                    <p>Zəhmət olmasa şikayətinizin səbəbini və təsvirini daxil edin.</p>
                </div>

                <form className={styles.form} onSubmit={handleSubmit}>
                    <div className={styles.formGroup}>
                        <label>Şikayət səbəbi</label>
                        <select 
                            value={reason} 
                            onChange={e => setReason(e.target.value)}
                        >
                            <option value="scam">Fırıldaqçılıq</option>
                            <option value="spam">Spam / Arzuolunmaz mesaj</option>
                            <option value="fake">Saxta profil</option>
                            <option value="other">Digər</option>
                        </select>
                    </div>

                    <div className={styles.formGroup}>
                        <label>Şikayət təsviri</label>
                        <textarea 
                            placeholder="Şikayətiniz haqqında ətraflı məlumat yazın..."
                            value={description}
                            onChange={e => setDescription(e.target.value)}
                            required
                        />
                    </div>

                    <div className={styles.footer}>
                        <button type="button" className={styles.cancelBtn} onClick={onClose}>
                            Ləğv et
                        </button>
                        <button type="submit" className={styles.submitBtn}>
                            Göndər
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default ReportModal;
