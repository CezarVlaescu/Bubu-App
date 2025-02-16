import { FixLinksHelper } from "../shared/helpers/fixLinksHelper.ts";
import { mapStatus, type TLinkCheckerResponse } from "../shared/types/labelProps.type.ts";

export const checkLinks = async (links: string) : Promise<TLinkCheckerResponse[]> => {
    const cleanedLinks = FixLinksHelper(links);
    const response = await fetch("http://localhost:5000/api/check-links", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            links: cleanedLinks
        })
    })
    const data = await response.json();

    console.log(data);
    
    return data.map((item: TLinkCheckerResponse) => ({
        link: item.link,
        status: mapStatus(item.status)
    }));
}