import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { submitReport } from "../../../redux/thunks/reportThunks";
import styles from "./ReportModal.module.scss";
import { FaFlag, FaTimes, FaCheckCircle } from "react-icons/fa";
import { MdOutlineReportProblem } from "react-icons/md";

const REASONS = [
    { value: "FAKE_PRODUCT", label: "Saxta məhsul / Fake product" },
    { value: "SPAM", label: "Spam" },
    { value: "WRONG_CATEGORY", label: "Yanlış kateqoriya" },
    { value: "MISLEADING_INFO", label: "Yanıltıcı məlumat" },
    { value: "PROHIBITED_ITEM", label: "Qadağan olunmuş məhsul" },
    { value: "OTHER", label: "Digər" },
];

const ReportModal = ({ isOpen, onClose, listingId }) => {
    const dispatch = useDispatch();
    const { user } = useSelector((s) => s.auth);

    const [selected, setSelected] = useState("");
    const [note, setNote] = useState("");
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState("");

    if (!isOpen) return null;

    const handleClose = () => {
        setSelected("");
        setNote("");
        setSuccess(false);
        setError("");
        onClose();
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!selected) {
            setError("Zəhmət olmasa bir səbəb seçin.");
            return;
        }

        setLoading(true);
        setError("");

        const reasonText = selected === "OTHER" && note.trim()
            ? `OTHER: ${note.trim()}`
            : selected;

        try {
            await dispatch(submitReport({
                userId: 0, // Listing reports target the listing primarily, userId might be 0 or derived in backend
                listingId: Number(listingId),
                reason: reasonText
            })).unwrap();
            setSuccess(true);
        } catch (err) {
            setError(
                err?.message || "Şikayət göndərilmədi. Yenidən cəhd edin."
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className={styles.overlay} onClick={handleClose}>
            <div
                className={styles.modal}
                onClick={(e) => e.stopPropagation()}
                role="dialog"
                aria-modal="true"
                aria-labelledby="report-title"
            >
                {}
                <div className={styles.header}>
                    <div className={styles.headerLeft}>
                        <div className={styles.headerIcon}>
                            <MdOutlineReportProblem size={20} />
                        </div>
                        <h2 id="report-title">Elanı Şikayet Et</h2>
                    </div>
                    <button className={styles.closeBtn} onClick={handleClose} title="Bağla">
                        <FaTimes />
                    </button>
                </div>

                {success ? (
                    
                    <div className={styles.successBox}>
                        <div className={styles.successIcon}>
                            <FaCheckCircle size={40} />
                        </div>
                        <h3>Şikayət göndərildi!</h3>
                        <p>
                            Şikayətiniz qəbul edildi. Admin tərəfindən yoxlanılacaq
                            və lazımi tədbirlər görüləcək.
                        </p>
                        <button className={styles.doneBtn} onClick={handleClose}>
                            Bağla
                        </button>
                    </div>
                ) : (
                    
                    <form onSubmit={handleSubmit}>
                        <div className={styles.body}>
                            <p className={styles.hint}>
                                Bu elanla bağlı problemi bildirin. Doğru səbəb seçmək şikayətin
                                daha tez nəzərə alınmasına kömək edir.
                            </p>

                            {}
                            <div className={styles.reasons}>
                                {REASONS.map((r) => (
                                    <label
                                        key={r.value}
                                        className={`${styles.reasonItem} ${selected === r.value ? styles.selectedReason : ""}`}
                                    >
                                        <input
                                            type="radio"
                                            name="reason"
                                            value={r.value}
                                            checked={selected === r.value}
                                            onChange={() => setSelected(r.value)}
                                        />
                                        <span className={styles.radioCustom} />
                                        <span className={styles.reasonLabel}>{r.label}</span>
                                    </label>
                                ))}
                            </div>

                            {}
                            {selected === "OTHER" && (
                                <div className={styles.noteWrap}>
                                    <label htmlFor="report-note">Əlavə qeyd (istəyə bağlı)</label>
                                    <textarea
                                        id="report-note"
                                        placeholder="Problemi qısaca izah edin..."
                                        value={note}
                                        onChange={(e) => setNote(e.target.value)}
                                        maxLength={500}
                                        rows={3}
                                    />
                                    <span className={styles.charCount}>{note.length}/500</span>
                                </div>
                            )}

                            {}
                            {error && <div className={styles.errorMsg}>{error}</div>}
                        </div>

                        {}
                        <div className={styles.footer}>
                            <button
                                type="button"
                                className={styles.cancelBtn}
                                onClick={handleClose}
                                disabled={loading}
                            >
                                Ləğv et
                            </button>
                            <button
                                type="submit"
                                className={styles.submitBtn}
                                disabled={loading || !selected}
                            >
                                {loading ? (
                                    <span className={styles.spinner} />
                                ) : (
                                    <>
                                        <FaFlag size={13} />
                                        Şikayet et
                                    </>
                                )}
                            </button>
                        </div>
                    </form>
                )}
            </div>
        </div>
    );
};

export default ReportModal;
