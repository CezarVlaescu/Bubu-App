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
