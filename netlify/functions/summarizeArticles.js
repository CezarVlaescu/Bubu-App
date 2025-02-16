const { GoogleGenerativeAI } = require("@google/generative-ai");
const axios = require("axios");
const cheerio = require("cheerio");
require("dotenv").config();

exports.handler = async function (event) {
    if (event.httpMethod !== "POST") {
        return {
            statusCode: 405,
            body: JSON.stringify({ error: "Method not allowed" })
        };
    }

    const { input } = JSON.parse(event.body);
    if (!input) {
        return {
            statusCode: 400,
            body: JSON.stringify({ error: "Missing input text or URL" })
        };
    }

    let text = input;

    if (input.startsWith("http")) {
        try {
            console.log("🔍 Fetching article content from URL:", input);
            const response = await axios.get(input);
            const $ = cheerio.load(response.data);

            text = $("#mw-content-text p").text();

            if (!text) throw new Error("No article content found.");

            console.log("✅ Extracted text:", text.slice(0, 300) + "...");
        } catch (error) {
            console.error("❌ Failed to fetch article:", error);
            return {
                statusCode: 400,
                body: JSON.stringify({ error: "Failed to extract article content" })
            };
        }
    }

    try {
        const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

        console.log("🔹 Sending request to Gemini...");
        const result = await model.generateContent(`Rezumă acest text:\n\n${text}`);
        const summary = result.response.text();

        return {
            statusCode: 200,
            body: JSON.stringify(summary)
        };
    } catch (error) {
        console.error("❌ Gemini API error:", error.message);
        return {
            statusCode: 500,
            body: JSON.stringify({ error: error.message })
        };
    }
};
