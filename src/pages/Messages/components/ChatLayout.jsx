import React from "react";
import Header from "../../../components/layout/header/Header";
import Footer from "../../../components/layout/footer/Footer";
import styles from "../messages.module.scss";

const ChatLayout = ({ children, mobileView }) => {
    return (
        <div className={styles.page}>
            <Header />
            <div className={styles.wrapper}>
                <div className={`${styles.container} ${mobileView === "chat" ? styles.chatOpen : ""}`}>
                    {children}
                </div>
            </div>
            <Footer />
        </div>
    );
};

export default ChatLayout;
