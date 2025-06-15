const axios = require("axios");
const cheerio = require("cheerio");
const puppeteer = require("puppeteer");
const { GoogleGenerativeAI } = require("@google/generative-ai");
require("dotenv").config();

exports.handler = async function (event) {
  if (event.httpMethod !== "POST") {
    return {
      statusCode: 405,
      body: JSON.stringify({ error: "Method not allowed" }),
      headers: { "Content-Type": "application/json" }
    };
  }

  const { country, city, embassyUrl } = JSON.parse(event.body);
  if (!country || !city || !embassyUrl) {
    return {
      statusCode: 400,
      body: JSON.stringify({ error: "Missing country, city or embassyUrl" }),
      headers: { "Content-Type": "application/json" }
    };
  }

  try {
    const browser = await puppeteer.launch({ headless: "new" });
    const page = await browser.newPage();
    await page.goto(embassyUrl, { waitUntil: "domcontentloaded" });

    await page.evaluate(() => {
      document.querySelectorAll('.accordion-block__list__item__header__title').forEach(button => button.click());
    });

    await new Promise(resolve => setTimeout(resolve, 1000));

    const content = await page.content();
    const $ = cheerio.load(content);
    await browser.close();

    const cityHeader = $(`.accordion-block__list__item__header__title__text:contains(${city})`).first();
    const cityContent = cityHeader.closest('.accordion-block__list__item').find('.accordion-block__list__item__content__inner');

    let person = "Not found on page";
    let title = "";
    let address = "Not found on page";
    const otherPersons = [];
    const details = [];

    const pTags = cityContent.find("p").toArray();

    for (let i = 0; i < pTags.length; i++) {
      const current = $(pTags[i]).text().trim();
      const next = $(pTags[i + 1])?.text().trim();

      // Try to extract the full address block
      if (!current && $(pTags[i]).hasClass('consulate-info-block__content__value')) {
        const rawHtml = $(pTags[i]).html();
        if (rawHtml?.includes('<br>')) {
          const cleanAddress = rawHtml
            .split(/<br\s*\/?>/gi)
            .map(line => line.replace(/\"/g, '').trim())
            .filter(Boolean)
            .join(', ');
          if (cleanAddress.length > 0) {
            address = cleanAddress;
          }
        }
        continue;
      }

      if (/honorary consul/i.test(current)) {
        title = current;
        if (next && !/assistant/i.test(current)) person = next;
      } else if (/consul general/i.test(current)) {
        title = current;
        if (next && !/assistant/i.test(current)) person = next;
      } else if (/assistant/i.test(current)) {
        if (next) {
          otherPersons.push({ title: current, name: next });
        }
      } else if (/consul/i.test(current) && next && (!person || person === "Not found on page")) {
        person = next;
      }

      details.push(current);
    }

    const emailIndex = details.findIndex(line => /@/.test(line));
    const addressDetails = emailIndex >= 0 ? details.slice(emailIndex + 1) : [];

    // Use AI fallback for address if still not found
    if (address === "Not found on page" && addressDetails.length > 0) {
      try {
        const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

        const prompt = `Extract only the address from this text:
${addressDetails.join("\n")}
Return just the address as a one-line string.`;

        const result = await model.generateContent(prompt);
        const aiText = result.response.text().trim();

        if (aiText && aiText.length > 5) {
          address = aiText.replace(/^\"|\"$/g, "");
        }
      } catch (err) {
        console.warn("⚠️ AI fallback failed:", err.message);
      }
    }

    console.log("📤 Final result:", { city, type: title || "Not found", address, person, others: otherPersons, addressDetails });

    return {
      statusCode: 200,
      body: JSON.stringify({ city, type: title || "Not found", address, person, others: otherPersons, addressDetails }),
      headers: { "Content-Type": "application/json" }
    };
  } catch (err) {
    console.error("❌ Error occurred:", err.message);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: err.message }),
      headers: { "Content-Type": "application/json" }
    };
  }
};




