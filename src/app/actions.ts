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

interface IAPIResponse {
    page: number;
    results: Media[];
}

interface IMedia {
    id: number;
    title: string;
    overview: string;
    mediaType: 'movie' | 'tv';
    genres: string[];
    imageUrl: string;
    href: string;
    releaseDate?: string;
}

const fetchTrendingMedia = async (): Promise<IMedia[]> => {
    const genreUrl = `${process.env.NEXT_PUBLIC_TMDB_API_URL}/genre/movie/list`;
    const mediaUrl = `${process.env.NEXT_PUBLIC_TMDB_API_URL}/trending/all/day`;
    const options = {
        method: 'GET',
        headers: {
            accept: 'application/json',
            Authorization: `Bearer ${process.env.TMDB_API_TOKEN}`,
        },
    };

    try {
        // Fetch genres and media in parallel
        const [genreResponse, mediaResponse] = await Promise.all([
            fetch(genreUrl, options),
            fetch(mediaUrl, options),
        ]);

        if (!genreResponse.ok || !mediaResponse.ok) {
            const errorMessage = !genreResponse.ok
                ? 'Failed to fetch genres'
                : 'Failed to fetch media';
            throw new Error(errorMessage);
        }

        const [genreData, mediaData]: [
            { genres: { id: number; name: string }[] },
            IAPIResponse,
        ] = await Promise.all([genreResponse.json(), mediaResponse.json()]);

        // Map genre IDs to names
        const genreMap = genreData.genres.reduce(
            (
                acc: Record<number, string>,
                { id, name }: { id: number; name: string }
            ) => {
                acc[id] = name;
                return acc;
            },
            {}
        );

        // Append additional details to media
        return mediaData.results
            .filter(
                (media) =>
                    media.media_type === 'movie' || media.media_type === 'tv'
            )
            .map((media) => ({
                id: media.id,
                title: media.media_type === 'movie' ? media.title : media.name,
                overview: media.overview
                    ? `${media.overview.substring(0, 120)}...`
                    : 'No overview available',
                mediaType: media.media_type,
                genres: media.genre_ids?.map(
                    (id: number) => genreMap[id] || 'Unknown'
                ),
                imageUrl: `${process.env.NEXT_PUBLIC_TMDB_IMAGES_URL}/w342${media.poster_path}`,
                //imageUrl: '/images/2149946322.jpg',
                href: `/details/${media.id}`,
            }))
            .slice(0, 5);
    } catch (error) {
        console.error('Error fetching media:', error);
        throw new Error('Failed to fetch media');
    }
};

const fetchLatestMovies = async (): Promise<IMedia[]> => {
    const genreUrl = `${process.env.NEXT_PUBLIC_TMDB_API_URL}/genre/movie/list`;
    const today = new Date();
    const lastMonth = new Date();
    lastMonth.setMonth(today.getMonth());

    const formatDate = (date: Date) => date.toISOString().split('T')[0];

    const latestMoviesUrl = `${process.env.NEXT_PUBLIC_TMDB_API_URL}/discover/movie?release_date.gte=${formatDate(lastMonth)}&release_date.lte=${formatDate(today)}&sort_by=primary_release_date.desc`;
    const options = {
        method: 'GET',
        headers: {
            accept: 'application/json',
            Authorization: `Bearer ${process.env.TMDB_API_TOKEN}`,
        },
    };

    try {
        // Fetch genres and latest movies in parallel
        const [genreResponse, latestMoviesResponse] = await Promise.all([
            fetch(genreUrl, options),
            fetch(latestMoviesUrl, options),
        ]);

        if (!genreResponse.ok || !latestMoviesResponse.ok) {
            const errorMessage = !genreResponse.ok
                ? 'Failed to fetch genres'
                : 'Failed to fetch latest movies';
            throw new Error(errorMessage);
        }

        const [genreData, latestMovieData]: [
            { genres: { id: number; name: string }[] },
            {
                page: number;
                results: IMovie[];
                total_pages: number;
                total_results: number;
            },
        ] = await Promise.all([
            genreResponse.json(),
            latestMoviesResponse.json(),
        ]);

        // Map genre IDs to names
        const genreMap = genreData.genres.reduce(
            (
                acc: Record<number, string>,
                { id, name }: { id: number; name: string }
            ) => {
                acc[id] = name;
                return acc;
            },
            {}
        );

        // Transform the latest movie data into IMedia format
        return latestMovieData.results
            .map((movie) => ({
                id: movie.id,
                title: movie.title,
                overview: movie.overview
                    ? `${movie.overview.substring(0, 120)}...`
                    : 'No overview available',
                mediaType: 'movie' as IMedia['mediaType'],
                genres: movie.genre_ids?.map(
                    (id: number) => genreMap[id] || 'Unknown'
                ),
                imageUrl: `${process.env.NEXT_PUBLIC_TMDB_IMAGES_URL}/w342${movie.poster_path}`,
                //imageUrl: '/images/2149946322.jpg',
                releaseDate: movie.release_date,
                href: `/details/${movie.id}`,
            }))
            .slice(0, 5);
    } catch (error) {
        console.error('Error fetching latest movies:', error);
        throw new Error('Failed to fetch latest movies');
    }
};

export { fetchTrendingMedia, fetchLatestMovies, type IMedia };
