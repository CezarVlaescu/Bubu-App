import React from "react";
import { useState } from "react";
import { summarizeArticles } from "../../api/summarizeArticlesCalls.ts";
import './summarizeArticles.styles.css'

export default function SummarizeArticles() {
    const [input, setInput] = useState("");
    const [summary, setSummary] = useState("");
    const [loading, setLoading] = useState(false);

    const handleSummarize = async () => {
        if (!input.trim()) return;
        setLoading(true);
        const result = await summarizeArticles(input);
        setSummary(result);
        setLoading(false);
    };

    return (
        <div className="summarizer-container">
            <h2>📄 Introdu un link sau un text pentru rezumat</h2>
            <textarea
                rows={5}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Scrie un text sau un link aici..."
                className="summarizer-textarea"
            />
            <button onClick={handleSummarize} disabled={loading} className="summarizer-button">
                {loading ? "Se procesează..." : "🔍 Rezumă"}
            </button>
            {summary && (
                <div className="summarizer-result">
                    <h3>📌 Rezumat:</h3>
                    <p>{summary}</p>
                </div>
            )}
        </div>
    );
}
