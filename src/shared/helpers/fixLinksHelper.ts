export const FixLinksHelper = (text: string): string[] => {
   return text
   .split(/[\s]+/)
   .map(link => link.trim())
   .filter(link => link.length > 0)
   .map(link => link.startsWith("http") ? link : `https://${link}`)
} 