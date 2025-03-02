import { useState } from "react";
import React from "react";
import './investigationHelper.styles.css';

export default function InvestigationHelper() {
    const [analysis, setAnalysis] = useState("");
    const [loading, setLoading] = useState(false);
    const [question, setQuestion] = useState("");

    async function handleFileUpload(event: React.ChangeEvent<HTMLInputElement>) {
        const file = event.target.files?.[0];
        if (!file) return;

        setLoading(true);

        try {
            const reader = new FileReader();
            reader.readAsDataURL(file);

            reader.onload = async () => {
                const base64File = reader.result?.toString().split(",")[1];
                const requestData = {
                    fileData: base64File,
                    question: question || "Extrage toate procentele din acest document și explică la ce se referă."
                };

                const response = await fetch("/.netlify/functions/extractPdf", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(requestData),
                });

                const data = await response.json();
                setAnalysis(data.answer || "Nu s-au găsit informații relevante.");
                setLoading(false);
            };
        } catch (error) {
            console.error("Eroare:", error);
            setAnalysis("Eroare la procesarea documentului.");
            setLoading(false);
        }
    }

    return (
        <div className="container">
            <h2 className="title">Investigation Helper</h2>
            <input type="file" accept="application/pdf" onChange={handleFileUpload} className="fileInput"/>
            <input 
                type="text" 
                placeholder="Introdu întrebarea (ex: Care este procentul deținut de stat?)" 
                value={question}
                onChange={(e) => setQuestion(e.target.value)}
                style={{ width: "100%", marginTop: "10px" }}
                className="input"
            />
            {loading ? <p>Procesare...</p> : <textarea  className="textarea" value={analysis} readOnly rows={10} style={{ width: "100%" }} />}
        </div>
    );
}








