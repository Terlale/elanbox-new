import { Outlet } from "react-router-dom";
import Header from "../../components/layout/header/Header";
import Footer from "../../components/layout/footer/Footer";
import SettingsSidebar from "./SettingsSidebar";
import styles from "./settings.module.scss";

const Setting = () => {
  return (
    <>
      <Header />

      <section className={styles.settings}>

        <div className={styles.layout}>
          <SettingsSidebar />
          <div className={styles.panel}>
            <Outlet />
          </div>
        </div>
      </section>

      <Footer />
    </>
  );
};

export default Setting;
