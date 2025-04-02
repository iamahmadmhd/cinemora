'use server';

interface IBaseMedia {
    backdrop_path: string;
    id: number;
    overview: string;
    poster_path: string;
    adult: boolean;
    original_language: string;
    genre_ids: number[];
    popularity: number;
    vote_average: number;
    vote_count: number;
}

interface IMovie extends IBaseMedia {
    title: string;
    original_title: string;
    release_date: string;
    video: boolean;
    media_type: 'movie';
}

interface ITVShow extends IBaseMedia {
    name: string;
    original_name: string;
    first_air_date: string;
    origin_country: string[];
    media_type: 'tv';
}

type Media = IMovie | ITVShow;

interface IApiResponse {
    page: number;
    results: Media[];
}

interface ITrendingMedia {
    id: number;
    title: string;
    overview: string;
    mediaType: 'movie' | 'tv';
    genres: string[];
    imageUrl: string;
    href: string;
}

const fetchTrendingMedia = async (): Promise<ITrendingMedia[]> => {
    const genreUrl = `${process.env.NEXT_PUBLIC_TMDB_API_URL}/genre/movie/list`;
    const trendingUrl = `${process.env.NEXT_PUBLIC_TMDB_API_URL}/trending/all/day`;
    const options = {
        method: 'GET',
        headers: {
            accept: 'application/json',
            Authorization: `Bearer ${process.env.TMDB_API_TOKEN}`,
        },
    };

    try {
        // Fetch genres and trending media in parallel
        const [genreResponse, trendingResponse] = await Promise.all([
            fetch(genreUrl, options),
            fetch(trendingUrl, options),
        ]);

        if (!genreResponse.ok) throw new Error('Failed to fetch genres');
        if (!trendingResponse.ok)
            throw new Error('Failed to fetch trending media');

        const genreData = await genreResponse.json();
        const trendingData: IApiResponse = await trendingResponse.json();

        // Map genre IDs to names
        const genreMap = genreData.genres.reduce(
            (
                acc: Record<number, string>,
                genre: { id: number; name: string }
            ) => {
                acc[genre.id] = genre.name;
                return acc;
            },
            {}
        );

        // Append additional details to trending media
        return trendingData.results.map((media) => ({
            id: media.id,
            title: media.media_type === 'movie' ? media.title : media.name,
            overview: media.overview.substring(0, 120).concat('...'),
            mediaType: media.media_type,
            genres: media.genre_ids.map(
                (id: number) => genreMap[id] || 'Unknown'
            ),
            //imageUrl: `${process.env.NEXT_PUBLIC_TMDB_IMAGES_URL}/w342${media.poster_path}`,
            imageUrl: '/images/18bb156d62382ba383341e4bc92be234.jpg',
            href: `/details/${media.id}`,
        }));
    } catch (error) {
        console.error(error);
        throw new Error('Failed to fetch trending media');
    }
};

export { fetchTrendingMedia, type ITrendingMedia };
