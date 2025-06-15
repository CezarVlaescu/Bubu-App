// import { TConsulResponse } from "../shared/types/reponse.type";

// export const fetchConsulData = async (country: string): Promise<TConsulResponse | null> => {
//   const res = await fetch("/.netlify/functions/consulsCreator", {
//     method: "POST",
//     headers: { "Content-Type": "application/json" },
//     body: JSON.stringify({ country: country.trim() })
//   });

//   const data = await res.json();

//   if (data.error) {
//     console.error("❌ Error from consulsCreator:", data.error);
//     return null;
//   }

//   return data as TConsulResponse;
// };
