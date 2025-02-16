const { GoogleGenerativeAI } = require("@google/generative-ai");
const puppeteer = require("puppeteer");
require("dotenv").config();

exports.handler = async function (event) {
    if (event.httpMethod !== "POST") {
        return {
            statusCode: 405,
            body: JSON.stringify({ error: "Method not allowed" })
        };
    }

    const { input, question } = JSON.parse(event.body);
    if (!input) {
        return {
            statusCode: 400,
            body: JSON.stringify({ error: "Missing input text or URL" })
        };
    }

    let text = input;

    // 🔹 Dacă input-ul este un URL, extragem conținutul folosind Puppeteer
    if (input.startsWith("http")) {
        try {
            console.log("🔍 Launching Puppeteer...");
            const browser = await puppeteer.launch({ headless: "new" });
            const page = await browser.newPage();
            await page.goto(input, { waitUntil: "domcontentloaded" });

            // 🔹 Extragem doar paragrafele de text
            text = await page.evaluate(() => {
                return Array.from(document.querySelectorAll("p"))
                    .map(p => p.innerText)
                    .join("\n");
            });

            await browser.close();

            if (!text) throw new Error("No article content found.");
            console.log("✅ Extracted text:", text.slice(0, 300) + "..."); // Log doar primele 300 caractere
        } catch (error) {
            console.error("❌ Failed to fetch article:", error);
            return {
                statusCode: 400,
                body: JSON.stringify({ error: "Failed to extract article content" })
            };
        }
    }

    try {
        // 🔹 Inițializează Google Gemini API
        const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

        let prompt;
        if (question) {
            prompt = `Text extras din articol:\n\n${text}\n\nÎntrebare: ${question}\n\nRăspunde clar și concis.`;
        } else {
            prompt = `Rezumă acest text:\n\n${text}`;
        }

        console.log("🔹 Sending request to Gemini...");
        const result = await model.generateContent(prompt);
        const answer = result.response.text();

        return {
            statusCode: 200,
            body: JSON.stringify(answer)
        };
    } catch (error) {
        console.error("❌ Gemini API error:", error.message);
        return {
            statusCode: 500,
            body: JSON.stringify({ error: error.message })
        };
    }
};
