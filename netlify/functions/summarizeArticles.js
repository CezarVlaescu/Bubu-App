const { OpenAI } = require("openai");
require("dotenv").config();

exports.handler = async function (event) {
    if (event.httpMethod !== "POST") {
        return {
            statusCode: 405,
            body: JSON.stringify({ error: "Method not allowed" })
        }
    }

    const { text } = JSON.parse(event.body);
    if (!text) {
        return {
            statusCode: 400,
            body: JSON.stringify({ error: "Missing text input "})
        }
    }

    const openai = new OpenAI({
        apiKey: process.env.OPENAI_API_KEY,
    });

    try {
        const response = await openai.chat.completions.create({
            model: 'gpt-4o',
            messages: [
                { role: "system", content: "Vei rezuma textele primite." },
                { role: "user", content: `Rezumă acest text:\n\n${text}` }
            ],
            max_tokens: 150,
            stream: true
        }).withResponse();

        return response.json();
    } catch (error) {
        return {
            statusCode: 500,
            body: JSON.stringify( {error: error.message })
        }
    }
}