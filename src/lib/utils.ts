
export const generateSlug = (text: string): string => {
    return text
        .toString()
        .normalize('NFD') // normalize accents
        .replace(/[\u0300-\u036f]/g, '') // remove accents
        .toLowerCase()
        .trim()
        .replace(/\s+/g, '-') // spaces to -
        .replace(/[^\a-z0-9-]/g, '') // remove special chars except -
        .replace(/-+/g, '-'); // collapse multiple -
};
