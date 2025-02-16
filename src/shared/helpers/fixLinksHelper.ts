export const FixLinksHelper = (text: string): string[] => {
    return text
        .replace(/(https?:\/\/)(?=\S)/g, " $1")
        .split(/[\s,;|]+/) 
        .map(link => link.trim())
        .filter(link => link.length > 0)
        .map(link => link.startsWith("http") ? link : `https://${link}`);
};

