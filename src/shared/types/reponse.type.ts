export type TPdfExtractResponse = {
    searchTerm: string;
    foundText: string;
    percentage: string;
};

export type TPoliticalProfileResponse = {
    name: string;
    parties?: string[];
    positions: {
        title: string;
        status: string;
        start_date: string;
        end_date: string;
    }[];
    sources: string[];
}

export type Entry = {
  city: string;
  type: string;
  address: string;
  person: string;
};

export type TConsulResponseData = {
  embassyUrl: string;
  entries: Entry[];
};

