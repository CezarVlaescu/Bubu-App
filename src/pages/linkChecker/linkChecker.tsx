import './linkChecker.style.css';
import React, { useState } from 'react';
import { checkLinks } from '../../api/linkCheckerCalls.ts';
import { StatusEnum } from '../../shared/types/labelProps.type.ts';

export default function LinkChecker() {
    const [links, setLinks] = useState("");
    const [results, setResults] = useState([]);
    const [loading, setLoading] = useState(false);

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
            <button onClick={handleCheckLinks} disabled={loading} className="link-checker-button">
                {loading ? "Verificare..." : "Verifică linkurile"}
            </button>
            {results.length > 0 && (
                <table className="link-checker-table">
                    <thead>
                        <tr>
                            <th>Link</th>
                            <th>Status</th>
                        </tr>
                    </thead>
                    <tbody>
                        {results.map((r: { link: string; status: StatusEnum; }, index: number) => (
                            <tr key={index}>
                                <td>{r.link}</td>
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