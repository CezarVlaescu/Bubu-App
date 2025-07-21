import React, { useState } from "react";
import "./consulsCreator.styles.css";

export default function ConsulsCreator() {
  const [country, setCountry] = useState("");
  const [cities, setCities] = useState<string[]>([]);
  const [selectedCity, setSelectedCity] = useState("");
  const [embassyUrl, setEmbassyUrl] = useState("");
  const [loadingCities, setLoadingCities] = useState(false);
  const [loadingDetails, setLoadingDetails] = useState(false);
  const [error, setError] = useState("");
  const [career, setCareer] = useState<string | null>(null);
  const [loadingCareer, setLoadingCareer] = useState(false);
  const [result, setResult] = useState<null | {
    city: string;
    type: string;
    address: string;
    person: string;
    others: string;
  }>(null);

  const handleGetCities = async () => {
    if (!country.trim()) return alert("Te rog introdu o țară!");

    setLoadingCities(true);
    setError("");
    setCities([]);
    setSelectedCity("");
    setResult(null);

    try {
      const res = await fetch(
        "/.netlify/functions/getCitiesFromCountryConsul",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ country: country.trim().toLowerCase() }),
        },
      );
      const data = await res.json();

      if (data.error || !Array.isArray(data.cities))
        throw new Error(data.error || "Nicio ambasadă găsită.");
      setCities(data.cities);
      setEmbassyUrl(data.embassyUrl); // trimitem mai târziu pentru identificare
    } catch (err: any) {
      setError(err.message || "Eroare la încărcarea orașelor.");
    } finally {
      setLoadingCities(false);
    }
  };

  const handleGetDetails = async (city: string) => {
    setSelectedCity(city);
    setLoadingDetails(true);
    setResult(null);
    setError("");

    try {
      const res = await fetch("/.netlify/functions/getDetailsByCityConsul", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ country, city, embassyUrl }),
      });
      const data = await res.json();

      if (data.error) throw new Error(data.error);
      setResult(data);
    } catch (err: any) {
      setError(err.message || "Eroare la extragerea detaliilor.");
    } finally {
      setLoadingDetails(false);
    }
  };

  const handleGetCareer = async (name: string) => {
    setLoadingCareer(true);
    setCareer(null);

    try {
      const res = await fetch("/.netlify/functions/getAmbassadorCareer", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name }),
      });
      const data = await res.json();

      if (data.error) throw new Error(data.error);
      setCareer(data.career || "No information found.");
    } catch (err: any) {
      setCareer("Eroare la extragerea carierei.");
    } finally {
      setLoadingCareer(false);
    }
  };

  return (
    <div className="ambassador-container">
      <h2>🌍 Caută Ambasade/Consulate ale Suediei</h2>

      <input
        type="text"
        value={country}
        onChange={(e) => setCountry(e.target.value)}
        placeholder="ex: romania, albania, germany"
        className="ambassador-input"
      />
      <button
        onClick={handleGetCities}
        disabled={loadingCities}
        className="ambassador-button"
      >
        {loadingCities ? "Caut orașe..." : "🔍 Caută orașe"}
      </button>

      {error && <p className="ambassador-error">❌ {error}</p>}

      {cities.length > 0 && (
        <div className="city-list">
          <h4>📍 Alege un oraș:</h4>
          <ul>
            {cities.map((city) => (
              <li key={city}>
                <button
                  onClick={() => handleGetDetails(city)}
                  disabled={loadingDetails || city === selectedCity}
                >
                  {city}
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}

      {result && (
        <div className="ambassador-result">
          <h3>🏙️ {result.city}</h3>
          <p>
            <strong>🏛️ Tip:</strong> {result.type}
          </p>
          <p>
            <strong>📌 Adresă:</strong> {result.address}
          </p>
          <p>
            <strong>👤 Reprezentant:</strong>{" "}
            <button
              className="ambassador-name-link"
              onClick={() => handleGetCareer(result.person)}
              disabled={loadingCareer}
              title="Află mai multe despre cariera acestuia"
            >
              {result.person}
            </button>
          </p>
          {loadingCareer && <p>🔄 Caut informații despre carieră...</p>}
          {career && (
            <div className="ambassador-career">
              <h4>📘 Cariera diplomatului:</h4>
              <p>{career}</p>
            </div>
          )}
        </div>
      )}
      {Array.isArray(result?.others) && result.others.length > 0 && (
        <div className="ambassador-others">
          <h4>🧑‍💼 Alte persoane:</h4>
          <ul>
            {result.others.map((item, idx) => (
              <li key={idx}>
                <strong>{item.title}</strong>: {item.name}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
