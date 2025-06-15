const axios = require("axios");
const cheerio = require("cheerio");

exports.handler = async function (event) {
  if (event.httpMethod !== "POST") {
    return {
      statusCode: 405,
      body: JSON.stringify({ error: "Method not allowed" }),
      headers: { "Content-Type": "application/json" }
    };
  }

  const { country } = JSON.parse(event.body);
  if (!country) {
    return {
      statusCode: 400,
      body: JSON.stringify({ error: "Missing country" }),
      headers: { "Content-Type": "application/json" }
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
      if (label.startsWith(country.toLowerCase()) && href?.includes("/en/embassies/")) {
        embassyUrl = `${baseUrl}${href}`;
        return false;
      }
    });

    if (!embassyUrl) {
      return {
        statusCode: 404,
        body: JSON.stringify({ error: "Embassy not found for this country." }),
        headers: { "Content-Type": "application/json" }
      };
    }

    // 🧠 Fetch HTML fără Puppeteer
    const pageHtml = await axios.get(embassyUrl);
    const $$ = cheerio.load(pageHtml.data);

    // 🧠 Extragem orașul principal (din URL)
    const urlParts = embassyUrl.split("/").filter(Boolean);
    const lastPart = urlParts[urlParts.length - 1];
    const slugParts = lastPart.split("-");
    const capitalCity = slugParts.length > 1
      ? slugParts.slice(1).join(" ").replace(/\b\w/g, l => l.toUpperCase())
      : "Unknown";

    const cities = [capitalCity];

    // 🧠 Extragem din conținut tot ce arată ca nume de orașe
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

    return {
      statusCode: 200,
      body: JSON.stringify({ cities, embassyUrl }),
      headers: { "Content-Type": "application/json" }
    };
  } catch (err) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: err.message }),
      headers: { "Content-Type": "application/json" }
    };
  }
};

