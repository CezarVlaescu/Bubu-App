import React, { useState } from "react";
import './pepCreator.styles.css';
import { TPoliticalProfileResponse } from "../../shared/types/reponse.type.ts";
import { fetchPoliticalProfile } from "../../api/pepCreatorCalls.ts";
import { formatPositionDates } from "../../shared/helpers/formatPositionDatesHelpers.ts";

export default function PEPCreator() {
    const [politician, setPolitician] = useState("");
    const [customSource, setCustomSource] = useState("");
    const [profile, setProfile] = useState<TPoliticalProfileResponse | null>(null);
    const [loading, setLoading] = useState(false);

    const handleSearch = async () => {
        if (!politician.trim()) {
            alert("❌ Te rog introdu numele politicianului!");
            return;
        }
    
        setLoading(true);
        const result = await fetchPoliticalProfile(politician, customSource);
        setProfile(result);
        setLoading(false);
    };

    return (
        <div className="profile-container">
            <h2>🔍 Caută un politician</h2>
            <input
                type="text"
                value={politician}
                onChange={(e) => setPolitician(e.target.value)}
                placeholder="Introdu numele politicianului..."
                className="profile-input"
            />
            <input
                type="text"
                value={customSource}
                onChange={(e) => setCustomSource(e.target.value)}
                placeholder="Introdu un site pentru research (opțional)"
                className="profile-input"
            />
            <button onClick={handleSearch} disabled={loading} className="profile-button">
                {loading ? "Se caută..." : "📌 Caută"}
            </button>

            {profile && profile.name ? (
                <div className="profile-result">
                    <h3>{profile.name}</h3>
                    <h4>📌 Poziții deținute:</h4>
                    {profile.positions.length > 0 ? (
                        <ul>
                            {profile.positions.map((pos, index) => (
                                <li key={index}>
                                    <strong>{pos.title}</strong> - {pos.status} <br />
                                    🗓 {formatPositionDates(pos.status, pos.start_date, pos.end_date)}
                                </li>
                            ))}
                        </ul>
                    ) : (
                        <p>❌ Nu există date despre poziții.</p>
                    )}
                    
                    <h4>🔗 Surse:</h4>
                    {profile.parties && profile.sources.length > 0 ? (
                          <><>
                            <h4>🏛️ Afilieri politice:</h4>
                            <ul>
                                {profile.parties.map((party, index) => (
                                    <li key={index}>{party}</li>
                                ))}
                            </ul>
                        </><ul>
                                {profile.sources.map((url, index) => (
                                    <li key={index}><a href={url} target="_blank" rel="noopener noreferrer">{url}</a></li>
                                ))}
                            </ul></>
                    ) : (
                        <p>⚠️ Nu există surse disponibile.</p>
                    )}
                </div>
            ) : (
                profile === null && <p>❌ Nu s-au găsit informații.</p>
            )}
        </div>
    );
}
