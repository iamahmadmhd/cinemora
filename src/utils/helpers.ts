import * as lookup from 'country-code-lookup';

const getGenres = (genres: { id: number; name: string }[]) => {
    return genres.reduce(
        (
            acc: Record<number, string>,
            { id, name }: { id: number; name: string }
        ) => {
            acc[id] = name;
            return acc;
        },
        {}
    );
};
const getDisplayCountryNames = (countryCodes: string[]) => {
    const countryNames: string[] = [];
    countryCodes?.forEach((countryCode) => {
        const countryName = lookup.byInternet(countryCode)?.country;
        if (countryName) {
            countryNames.push(countryName);
        }
    });
    return countryNames;
};

export { getGenres, getDisplayCountryNames };
