import { type TPoliticalProfileResponse } from "../shared/types/reponse.type";

export const fetchPoliticalProfile = async (
  politician: string,
  customSource?: string,
): Promise<TPoliticalProfileResponse | null> => {
  const cleanedPolitician = politician.trim();
  const cleanedSource = customSource?.trim() || "";

  if (!cleanedPolitician) {
    console.error("❌ Politician name is missing in API call.");
    return null;
  }

  const response = await fetch("/.netlify/functions/pepCreator", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      politician: cleanedPolitician,
      customSource: cleanedSource,
    }),
  });

  const data = await response.json();

  if (!data || data.error) {
    console.error("❌ API returned empty or invalid data:", data);
    return null;
  }

  return {
    name: data.name,
    parties: data.parties,
    positions: Array.isArray(data.positions)
      ? data.positions.map((item: any) => ({
          title: item.title,
          status: item.status,
          start_date: item.start_date,
          end_date: item.end_date,
        }))
      : [],

    sources: Array.isArray(data.sources) ? data.sources : [],
  };
};
