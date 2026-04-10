import React, { useState, useEffect, useRef } from "react";
import { useDispatch } from "react-redux";
import { FaChevronDown } from "react-icons/fa6";
import styles from "./searchbox.module.scss";
import { searchListings } from "../../../../redux/thunks/listingThunks";

const AZ_CITIES = [
  "Bakı", "Sumqayıt", "Gəncə", "Lənkəran", "Bərdə", "Xırdalan", "Mingəçevir",
  "Naxçıvan", "Şirvan", "Quba", "Qəbələ", "İsmayıllı", "Masallı", "Şəki",
  "Şərur", "Tovuz", "Şamaxı", "Balakən", "Qusar", "Xaçmaz", "Göyçay", "Lerin"
];

const Searchbox = () => {
  const dispatch = useDispatch();
  const [keyword, setKeyword] = useState("");
  const [cityInput, setCityInput] = useState("");
  const [filteredCities, setFilteredCities] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const suggestionRef = useRef(null);

  const handleSearch = () => {
    const filters = {};
    if (keyword.trim()) filters.title = keyword.trim();
    if (cityInput.trim()) filters.city = cityInput.trim();

    dispatch(searchListings(filters));
  };

  const handleCityChange = (e) => {
    const val = e.target.value;
    setCityInput(val);

    if (val.trim()) {
      const filtered = AZ_CITIES.filter(city =>
        city.toLowerCase().startsWith(val.toLowerCase())
      );
      setFilteredCities(filtered);
      setShowSuggestions(true);
    } else {
      setFilteredCities([]);
      setShowSuggestions(false);
    }
  };

  const handleSelectCity = (city) => {
    setCityInput(city);
    setShowSuggestions(false);
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (suggestionRef.current && !suggestionRef.current.contains(event.target)) {
        setShowSuggestions(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className={styles.searchCard}>
      <div className={styles.inputGroup}>
        <input
          type="text"
          placeholder="Nə axtarırsınız?"
          value={keyword}
          onChange={(e) => setKeyword(e.target.value)}
        />
      </div>

      <div className={styles.divider} />

      <div className={styles.selectGroup} ref={suggestionRef}>
        <input
          type="text"
          placeholder="Şəhər seçin..."
          value={cityInput}
          onChange={handleCityChange}
          onFocus={() => cityInput && setShowSuggestions(true)}
        />
        <FaChevronDown className={`${styles.selectIcon} ${showSuggestions ? styles.rotate : ""}`} />

        {showSuggestions && filteredCities.length > 0 && (
          <ul className={styles.suggestionsList}>
            {filteredCities.map((city, idx) => (
              <li key={idx} onClick={() => handleSelectCity(city)}>
                {city}
              </li>
            ))}
          </ul>
        )}
      </div>

      <button className={styles.searchBtn} onClick={handleSearch}>Axtar</button>
    </div>
  );
};

export default Searchbox;
