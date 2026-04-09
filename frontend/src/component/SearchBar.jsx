import { useState } from "react";
import PropTypes from "prop-types";

function SearchBar({ onSearch, loading }) {
  const [city, setCity] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    const trimmedCity = city.trim();
    if (!trimmedCity) return;
    // Validazione semplice: solo lettere, spazi, trattini, apostrofi
    if (!/^[a-zA-Z\s\-']+$/.test(trimmedCity)) {
      alert("Inserisci una città valida (solo lettere, spazi, trattini o apostrofi).");
      return;
    }
    onSearch(trimmedCity);
  };

  return (
    <form onSubmit={handleSubmit} style={{ marginBottom: "20px", display: "flex", gap: "10px", flexWrap: "wrap" }}>
      <input
        type="text"
        placeholder="Inserisci una città..."
        value={city}
        onChange={(e) => setCity(e.target.value)}
        style={{
          flex: 1,
          minWidth: "200px",
        }}
      />
      <button
        type="submit"
        disabled={loading}
        style={{
          backgroundColor: loading ? "var(--border)" : "var(--primary)",
          color: "white",
        }}
      >
        {loading ? "Caricamento..." : "Cerca"}
      </button>
    </form>
  );
}

SearchBar.propTypes = {
  onSearch: PropTypes.func.isRequired,
  loading: PropTypes.bool.isRequired,
};

export default SearchBar;