import React, { useState, useEffect, useRef } from "react";
import { FaPaperPlane, FaPaperclip, FaMicrophone, FaStop } from "react-icons/fa";
import styles from "../messages.module.scss";

const MessageInput = ({ text, setText, onSend, onKeyDown, sending, inputRef }) => {
    const [isListening, setIsListening] = useState(false);
    const recognitionRef = useRef(null);

    useEffect(() => {
        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
        if (SpeechRecognition) {
            recognitionRef.current = new SpeechRecognition();
            recognitionRef.current.continuous = true;
            recognitionRef.current.interimResults = true;
            recognitionRef.current.lang = "az-AZ";

            recognitionRef.current.onresult = (event) => {
                let interimTranscript = "";
                let finalTranscript = "";

                for (let i = event.resultIndex; i < event.results.length; ++i) {
                    if (event.results[i].isFinal) {
                        finalTranscript += event.results[i][0].transcript;
                    } else {
                        interimTranscript += event.results[i][0].transcript;
                    }
                }

                if (finalTranscript) {
                    setText((prev) => (prev ? prev + " " + finalTranscript : finalTranscript));
                }
            };

            recognitionRef.current.onend = () => {
                setIsListening(false);
            };

            recognitionRef.current.onerror = (event) => {
                console.error("Speech recognition error", event.error);
                setIsListening(false);
            };
        }

        return () => {
            if (recognitionRef.current) {
                recognitionRef.current.stop();
            }
        };
    }, [setText]);

    const toggleListening = () => {
        if (!recognitionRef.current) {
            alert("Brauzeriniz səs tanıma funksiyasını dəstəkləmir.");
            return;
        }

        if (isListening) {
            recognitionRef.current.stop();
            setIsListening(false);
        } else {
            try {
                recognitionRef.current.start();
                setIsListening(true);
            } catch (err) {
                console.error("Could not start recognition", err);
                setIsListening(false);
            }
        }
    };

    return (
        <form className={styles.inputArea} onSubmit={onSend}>
            <div className={styles.inputActions}>
                <button 
                    type="button" 
                    className={styles.toolBtn} 
                    title="Fayl əlavə et (Tezliklə)"
                    onClick={() => alert("Fayl göndərmə hazırda aktiv deyil")}
                >
                    <FaPaperclip />
                </button>
                <button 
                    type="button" 
                    className={`${styles.toolBtn} ${isListening ? styles.listening : ""}`} 
                    title={isListening ? "Dayandır" : "Səsli daxiletmə (STT)"}
                    onClick={toggleListening}
                >
                    {isListening ? <FaStop /> : <FaMicrophone />}
                </button>
            </div>

            <div className={styles.inputWrap}>
                <textarea
                    ref={inputRef}
                    placeholder={isListening ? "Sizi dinləyirəm..." : "Mesajınızı yazın..."}
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                    onKeyDown={onKeyDown}
                    disabled={sending}
                    rows={1}
                    className={styles.textarea}
                />
            </div>
            
            <button
                type="submit"
                className={styles.sendBtn}
                disabled={!text.trim() || sending || isListening}
                title="Göndər"
            >
                {sending ? (
                    <div className={styles.smallSpinner} />
                ) : (
                    <FaPaperPlane />
                )}
            </button>
        </form>
    );
};

export default MessageInput;
