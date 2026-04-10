import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import Header from "../../components/layout/header/Header";
import styles from "./home.module.scss";
import { fetchCategories } from "../../redux/thunks/categoryThunks";
import Banner from "./components/banner/Banner";
import PremiumListings from "./sections/premiumlistings/PremiumListings";
import SearchResults from "./sections/searchresults/SearchResults";
import LatestListings from "./sections/latestlistings/LatestListings";
import Footer from "../../components/layout/footer/Footer";

import Categories from "./components/categories/Categories";

const Home = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchCategories());
  }, [dispatch]);

  return (
    <div className={styles.container}>
      <Header variant="home" />
      <Banner />
      
      <Categories />

      <SearchResults />
      <PremiumListings />
      <LatestListings />
      <Footer />
    </div>
  );
};

export default Home;
