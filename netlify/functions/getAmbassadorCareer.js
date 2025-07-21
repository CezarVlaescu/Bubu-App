const { GoogleGenerativeAI } = require("@google/generative-ai");
require("dotenv").config();

exports.handler = async function (event) {
  if (event.httpMethod !== "POST") {
    return {
      statusCode: 405,
      body: JSON.stringify({ error: "Method not allowed" }),
    };
  }

  const { name } = JSON.parse(event.body);
  if (!name) {
    return {
      statusCode: 400,
      body: JSON.stringify({ error: "Missing ambassador name" }),
    };
  }

  try {
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    const prompt = `
Give me a short and professional biography for the Swedish diplomat ${name}. 
Include the **specific countries** where he served as ambassador, the **years** of his service in each country, and **any key achievements**.

Respond in 3 to 5 full sentences. Do not use placeholders like [Year] or [Country]. If information is missing, say "unknown".
`;

    const result = await model.generateContent(prompt);
    const bio = result.response.text().trim();

    return {
      statusCode: 200,
      body: JSON.stringify({ name, career: bio }),
    };
  } catch (err) {
    console.error("❌ Error fetching career info:", err.message);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "Failed to fetch career info" }),
    };
  }
};
