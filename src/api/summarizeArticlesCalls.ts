export const summarizeArticles = async (input: string): Promise<string> => {
    const response = await fetch("/.netlify/functions/summarizeArticles", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ input })
    });

    const data = await response.json();
    return data;
}