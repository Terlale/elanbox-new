import React from "react";
import styles from "./AboutSection.module.scss";

const AboutSection = ({ description }) => {
    if (!description) return null;

    return (
        <section className={styles.aboutContainer}>
            <h2>Haqqında</h2>
            <p>{description}</p>
        </section>
    );
};

export default AboutSection;
