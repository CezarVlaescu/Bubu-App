import React, { useState } from "react";
import { summarizeArticles } from "../../api/summarizeArticlesCalls.ts";
import "./summarizeArticles.styles.css";
import { useNavigate } from "react-router-dom";

export default function SummarizeArticles() {
  const [input, setInput] = useState("");
  const [question, setQuestion] = useState("");
  const [summary, setSummary] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSummarize = async () => {
    if (!input.trim()) return;
    setLoading(true);
    const result = await summarizeArticles(input, question);
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
      <input
        type="text"
        value={question}
        onChange={(e) => setQuestion(e.target.value)}
        placeholder="Ce vrei să afli? (Opțional)"
        className="summarizer-input"
      />
      <div className="summarizer-container__buttons">
        <button
          onClick={handleSummarize}
          disabled={loading}
          className="summarizer-button"
        >
          {loading ? "Se procesează..." : "🔍 Rezumă sau Caută răspuns"}
        </button>
        <button onClick={() => navigate("/")} className="summarizer-button">
          {"Intoarcere acasa"}
        </button>
      </div>
      {summary && (
        <div className="summarizer-result">
          <h3>📌 Răspuns:</h3>
          <p>{summary}</p>
        </div>
      )}
    </div>
  );
}
