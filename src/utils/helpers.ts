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
        const countryName = lookup.byIso(countryCode)?.country;
        if (countryName) {
            countryNames.push(countryName);
        }
    });
    return countryNames;
};

const getErrorStatusCode = (code: string) => {
    switch (code) {
        case '23505':
        case '23503':
            return 409; // Conflict
        case '23502':
        case '22P02':
        case '42601':
        case '42703':
            return 400; // Bad Request
        case '40001':
            return 503; // Service Unavailable
        case '42883':
            return 500; // Internal Server Error
        default:
            return 500; // Internal Server Error for unknown cases
    }
};

export { getGenres, getDisplayCountryNames, getErrorStatusCode };
