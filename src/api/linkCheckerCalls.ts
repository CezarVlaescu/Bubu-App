import { FixLinksHelper } from "../shared/helpers/fixLinksHelper.ts";
import { type TLinkCheckerResponse } from "../shared/types/labelProps.type.ts";
import { mapStatusHelper } from "../shared/helpers/mapStatusHelper.ts";

export const checkLinks = async (
  links: string,
): Promise<TLinkCheckerResponse[]> => {
  const cleanedLinks = FixLinksHelper(links);
  const response = await fetch("/.netlify/functions/checkLinks", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ links: cleanedLinks }),
  });
  const data = await response.json();

  const mappedData = data.map((item: TLinkCheckerResponse) => ({
    link: item.link,
    status: mapStatusHelper(item.status),
  }));

  return mappedData;
};
