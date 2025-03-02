import './linkChecker.style.css';
import React, { useState } from 'react';
import { checkLinks } from '../../api/linkCheckerCalls.ts';
import { StatusEnum, TLinkCheckerResponse } from '../../shared/types/labelProps.type.ts';
import { useNavigate } from 'react-router-dom';

export default function LinkChecker() {
    const [links, setLinks] = useState("");
    const [results, setResults] = useState<TLinkCheckerResponse[]>([]);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleCheckLinks = async () => {
        setLoading(true);
        const data = await checkLinks(links);
        setResults(data);
        setLoading(false);
    }

    return (
        <div className="link-checker-container">
            <h1 style={{color: 'white', fontStyle: 'italic', fontSize: '80px'}}>Link Checker</h1>
            <textarea
                rows={5}
                value={links}
                onChange={(e: { target: { value: string; }; }) => setLinks(e.target.value)}
                placeholder="Introdu linkurile separate prin Enter..."
                className="link-checker-textarea"
            />
            <div className="link-checker-container__buttons">
                <button onClick={handleCheckLinks} disabled={loading} className="link-checker-button">
                    {loading ? "Verificare..." : "Verifică linkurile"}
                </button>
                <button onClick={() => navigate("/")} className="link-checker-button">
                    {"Intoarcere acasa"}
                </button>
            </div>
            {results?.length > 0 && (
                <table className="link-checker-table">
                    <thead>
                        <tr>
                            <th style={{color: 'white'}}>Link</th>
                            <th style={{color: 'white'}}>Status</th>
                        </tr>
                    </thead>
                    <tbody>
                        {results.map((r, index: number) => (
                            <tr key={index}>
                                <td>
                                    <a href={r.link} target="_blank" rel="noopener noreferrer" style={{ color: "white", textDecoration: "underline" }}>
                                        {r.link}
                                    </a>
                                </td>
                                <td className={r.status === StatusEnum.VALID ? "valid" : "invalid"}>
                                    {r.status === StatusEnum.VALID ? "✅ VALID" : "❌ INVALID"}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}
        </div>
    );
}