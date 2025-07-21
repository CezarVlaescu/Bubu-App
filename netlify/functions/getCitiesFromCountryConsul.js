const axios = require("axios");
const cheerio = require("cheerio");
const { GoogleGenerativeAI } = require("@google/generative-ai");
require("dotenv").config();

exports.handler = async function (event) {
  if (event.httpMethod !== "POST") {
    return {
      statusCode: 405,
      body: JSON.stringify({ error: "Method not allowed" }),
      headers: { "Content-Type": "application/json" },
    };
  }

  const { country } = JSON.parse(event.body);
  if (!country) {
    return {
      statusCode: 400,
      body: JSON.stringify({ error: "Missing country" }),
      headers: { "Content-Type": "application/json" },
    };
  }

  const baseUrl = "https://www.swedenabroad.se";
  const listUrl = `${baseUrl}/en/embassies/`;

  try {
    const listPage = await axios.get(listUrl);
    const $ = cheerio.load(listPage.data);
    let embassyUrl = "";

    $("a").each((_, el) => {
      const label = $(el).text().trim().toLowerCase();
      const href = $(el).attr("href");
      if (
        label.startsWith(country.toLowerCase()) &&
        href?.includes("/en/embassies/")
      ) {
        embassyUrl = `${baseUrl}${href}`;
        return false;
      }
    });

    if (!embassyUrl) {
      return {
        statusCode: 404,
        body: JSON.stringify({ error: "Embassy not found for this country." }),
        headers: { "Content-Type": "application/json" },
      };
    }

    const pageHtml = await axios.get(embassyUrl);
    const $$ = cheerio.load(pageHtml.data);

    const urlParts = embassyUrl.split("/").filter(Boolean);
    const lastPart = urlParts[urlParts.length - 1];
    const slugParts = lastPart.split("-");
    const capitalCity =
      slugParts.length > 1
        ? slugParts
            .slice(1)
            .join(" ")
            .replace(/\b\w/g, (l) => l.toUpperCase())
        : "Unknown";

    const cities = [capitalCity];

    $$(".accordion-block__list__item__header__title__text").each((_, el) => {
      const city = $$(el).text().trim();
      if (
        city &&
        city.length <= 60 &&
        /[A-Za-zÀ-ÿ]{2,}/.test(city) &&
        !city.includes("?") &&
        !cities.includes(city)
      ) {
        cities.push(city);
      }
    });

    // 🔮 AI Filtering
    let formattedCities = [];

    if (cities.length > 0) {
      try {
        const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

        const prompt = `
From the list below, return only valid cities or city and country pairs.
Ignore anything that is not a city (questions, statements, services).
Respond one per line in the format: City, Country

List:
${cities.join("\n")}
`;

        const result = await model.generateContent(prompt);
        const aiText = result.response.text().trim();

        // Extrage doar liniile corecte "City, Country"
        formattedCities = aiText
          .split("\n")
          .map((line) => line.trim())
          .filter((line) => /^[A-Z][^,]+,\s*[A-Z]/.test(line));

        console.log("✅ Gemini AI output:\n", aiText);
      } catch (err) {
        console.warn("⚠️ AI filtering failed:", err.message);
        formattedCities = cities.map((c) => `${c}, ${country}`);
      }
    }

    return {
      statusCode: 200,
      body: JSON.stringify({ cities: formattedCities, embassyUrl }),
      headers: { "Content-Type": "application/json" },
    };
  } catch (err) {
    console.error("❌ Error occurred:", err.message);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: err.message }),
      headers: { "Content-Type": "application/json" },
    };
  }
};
