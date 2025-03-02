const { GoogleGenerativeAI } = require("@google/generative-ai");
require("dotenv").config();

exports.handler = async function (event) {
    if (event.httpMethod !== "POST") {
        return { statusCode: 405, body: JSON.stringify({ error: "Method not allowed" }) };
    }

    try {
        const { fileData, question } = JSON.parse(event.body);
        if (!fileData) {
            return { statusCode: 400, body: JSON.stringify({ error: "Missing file data" }) };
        }

        console.log("📌 Trimitem fișierul la Gemini AI...");

        const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

        const result = await model.generateContent({
            contents: [
                { role: "user", parts: [
                    { text: question || "Analizează acest document și extrage procentele." },
                    { inline_data: { mime_type: "application/pdf", data: fileData } }
                ] }
            ]
        });

        const answer = result.response.text();

        return {
            statusCode: 200,
            body: JSON.stringify({ answer }),
        };
    } catch (error) {
        console.error("❌ Eroare Gemini AI:", error.message);
        return {
            statusCode: 500,
            body: JSON.stringify({ error: error.message }),
        };
    }
};








