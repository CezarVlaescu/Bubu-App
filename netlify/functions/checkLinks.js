const fetch = require("node-fetch");

exports.handler = async function (event) {
  if (event.httpMethod !== "POST") {
    return {
      statusCode: 405,
      body: JSON.stringify({ error: "Method not allowed" }),
    };
  }

  const { links } = JSON.parse(event.body);

  if (!links || !Array.isArray(links)) {
    return {
      statusCode: 400,
      body: JSON.stringify({ error: "Invalid input" }),
    };
  }

  const results = await Promise.all(
    links.map(async (link) => {
      try {
        const response = await fetch(link, {
          method: "HEAD",
          headers: {
            "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64)",
          },
        });
        return { link, status: response.status === 200 ? "VALID" : "INVALID" };
      } catch (error) {
        return { link, status: "INVALID" };
      }
    }),
  );

  return {
    statusCode: 200,
    body: JSON.stringify(results),
  };
};
