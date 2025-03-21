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

    const { politician, customSource } = JSON.parse(event.body);
    if (!politician) {
        return {
            statusCode: 400,
            body: JSON.stringify({ error: "Missing politician name" })
        };
    }

    let extraResearchText = "";

    if (customSource && customSource.startsWith("http")) {
        try {
            console.log(`🔍 Fetching data from ${customSource}...`);
            const browser = await puppeteer.launch({ headless: "new" });
            const page = await browser.newPage();
            await page.goto(customSource, { waitUntil: "domcontentloaded" });

            extraResearchText = await page.evaluate(() => {
                return Array.from(document.querySelectorAll("p"))
                    .map(p => p.innerText)
                    .join("\n");
            });

            await browser.close();
            console.log("✅ Extracted text from provided source.");
        } catch (error) {
            console.error("❌ Failed to fetch provided source:", error);
        }
    }

    try {
        const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

        const prompt = `
        Vreau să creezi un profil detaliat pentru ${politician}. 

        Dacă am text suplimentar, folosește-l ca sursă principală:
        ${extraResearchText ? `\n${extraResearchText}\n` : ""}

        Structura răspunsului trebuie să fie exact așa:

        {
            "name": "Numele politicianului",
            "positions": [
                {
                    "title": "Titlul funcției",
                    "status": "Elected/Appointed",
                    "start_date": "December 20, 2022",
                    "end_date": "Present / Data finală"
                }
            ],
            "sources": ["URL1", "URL2", "URL3"]
        }

        **IMPORTANT**:
        - Exclude orice sursă care conține "wikipedia.org".
        - Include doar surse externe verificate.
        - Dacă nu există informații, returnează un obiect gol.
        `;

        console.log("🔹 Sending request to Gemini...");
        const result = await model.generateContent(prompt);

        const rawText = await result.response.text();
        console.log("🔹 Gemini raw response:", rawText);
        
        // Eliminăm delimitatorii de cod, spațiile extra și caracterele nedorite
        const cleanedText = rawText
            .trim() // Elimină spațiile de la început și sfârșit
            .replace(/^```json\s*/, "") // Elimină ```json de la început
            .replace(/\s*```$/, ""); // Elimină ``` de la sfârșit
        
        console.log("🔹 Cleaned JSON response:", cleanedText);
        
        // Verificăm dacă este JSON valid
        let answer;
        try {
            answer = JSON.parse(cleanedText);
        
            // Dacă răspunsul nu conține nume sau poziții, returnăm eroare
            if (!answer.name || !Array.isArray(answer.positions)) {
                throw new Error("Invalid JSON structure");
            }
        } catch (error) {
            console.error("❌ Failed to parse JSON from Gemini:", error);
            return {
                statusCode: 500,
                body: JSON.stringify({ 
                    error: "Invalid JSON response from Gemini",
                    rawResponse: cleanedText // Acum trimitem versiunea curățată pentru debugging
                })
            };
        }

        // 🔹 Excludem linkurile de Wikipedia
        if (answer.sources) {
            answer.sources = answer.sources.filter(url => !url.includes("wikipedia.org"));
        }

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

