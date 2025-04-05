'use server';

import { getGenres } from '@/utils/helpers';
import axios from 'axios';

type Genre = {
    id: number;
    name: string;
};

type BaseMedia = {
    backdrop_path: string;
    id: number;
    overview: string;
    poster_path: string;
    adult: boolean;
    original_language: string;
    origin_country: string[];
    genre_ids?: number[];
    genres?: Genre[];
    popularity: number;
    vote_average: number;
    vote_count: number;
    tagline?: string;
    status: string;
};

type TMDBMovie = {
    title: string;
    original_title: string;
    release_date: string;
    video: boolean;
    media_type: 'movie';
} & BaseMedia;

type TMDBTVShow = {
    name: string;
    original_name: string;
    first_air_date: string;
    media_type: 'tv';
    number_of_seasons: number;
    number_of_episodes: number;
} & BaseMedia;

type Media = TMDBMovie | TMDBTVShow;

interface IBaseMedia {
    id: number;
    title: string;
    overview: string;
    mediaType: 'movie' | 'tv';
    genres: string[];
    posterUrl: string;
    backdropUrl?: string;
    href?: string;
    releaseDate: string;
    voteAverage: number;
    voteCount: number;
    popularity: number;
    tagline: string;
    status: string;
    originCountry: string[];
}

interface ITVSerie extends IBaseMedia {
    numberOfSeasons: number;
    numberOfEpisodes: number;
}

const TMDB_API_URL = process.env.NEXT_PUBLIC_TMDB_API_URL;
const TMDB_API_TOKEN = process.env.TMDB_API_TOKEN;
const TMDB_IMAGES_URL = process.env.NEXT_PUBLIC_TMDB_IMAGES_URL;

const fetchTrendingMedia = async (): Promise<IBaseMedia[]> => {
    const genreUrl = `${TMDB_API_URL}/genre/movie/list`;
    const mediaUrl = `${TMDB_API_URL}/trending/all/day`;
    const options = {
        headers: {
            accept: 'application/json',
            Authorization: `Bearer ${TMDB_API_TOKEN}`,
        },
    };

    try {
        const [genreResponse, mediaResponse] = await Promise.all([
            axios.get(genreUrl, options),
            axios.get(mediaUrl, options),
        ]);

        const genres = getGenres(genreResponse.data.genres);

        return mediaResponse.data.results
            .filter((media: Media): media is Media =>
                ['movie', 'tv'].includes(media.media_type)
            )
            .map(
                (media: Media): IBaseMedia => ({
                    id: media.id,
                    title:
                        media.media_type === 'movie' ? media.title : media.name,
                    overview: media.overview
                        ? `${media.overview.substring(0, 120)}...`
                        : 'No overview available',
                    mediaType: media.media_type,
                    genres:
                        media.genre_ids?.map(
                            (id: number) => genres[id] || 'Unknown'
                        ) ?? [],
                    posterUrl:
                        process.env.NODE_ENV !== 'development'
                            ? '/images/2149946322.jpg'
                            : `${TMDB_IMAGES_URL}/w342${media.poster_path}`,
                    href: `/${media.media_type}/${media.id}`,
                    releaseDate:
                        media.media_type === 'movie'
                            ? media.release_date
                            : media.first_air_date,
                    voteAverage: media.vote_average,
                    voteCount: media.vote_count,
                    popularity: media.popularity,
                    tagline:
                        media.tagline ??
                        (media.media_type === 'movie'
                            ? media.title
                            : media.name),
                    status: media.status,
                    originCountry: media.origin_country,
                })
            )
            .slice(0, 8);
    } catch (error) {
        console.error('Error fetching trending media:', error);
        throw new Error('Failed to fetch trending media');
    }
};

const fetchLatestMovies = async (): Promise<IBaseMedia[]> => {
    const genreUrl = `${TMDB_API_URL}/genre/movie/list`;
    const today = new Date();
    const lastMonth = new Date(today.setMonth(today.getMonth() - 1));
    const formatDate = (date: Date) => date.toISOString().split('T')[0];

    const latestMoviesUrl = `${TMDB_API_URL}/discover/movie?release_date.gte=${formatDate(lastMonth)}&release_date.lte=${formatDate(new Date())}&sort_by=primary_release_date.desc`;
    const options = {
        headers: {
            accept: 'application/json',
            Authorization: `Bearer ${TMDB_API_TOKEN}`,
        },
    };

    try {
        const [genreResponse, latestMoviesResponse] = await Promise.all([
            axios.get(genreUrl, options),
            axios.get(latestMoviesUrl, options),
        ]);

        const genres = getGenres(genreResponse.data.genres);

        return latestMoviesResponse.data.results
            .map(
                (movie: TMDBMovie): IBaseMedia => ({
                    id: movie.id,
                    title: movie.title,
                    overview: movie.overview
                        ? `${movie.overview.substring(0, 120)}...`
                        : 'No overview available',
                    mediaType: 'movie',
                    genres:
                        movie.genre_ids?.map(
                            (id: number) => genres[id] || 'Unknown'
                        ) ?? [],
                    posterUrl:
                        process.env.NODE_ENV !== 'development'
                            ? '/images/2149946322.jpg'
                            : `${TMDB_IMAGES_URL}/w342${movie.poster_path}`,
                    releaseDate: movie.release_date,
                    href: `/movies/${movie.id}`,
                    tagline: movie.tagline?.length
                        ? movie.tagline
                        : movie.title,
                    voteAverage: movie.vote_average,
                    voteCount: movie.vote_count,
                    popularity: movie.popularity,
                    status: movie.status,
                    originCountry: movie.origin_country,
                })
            )
            .slice(0, 5);
    } catch (error) {
        console.error('Error fetching latest movies:', error);
        throw new Error('Failed to fetch latest movies');
    }
};

const fetchMovieById = async (movieId: string): Promise<IBaseMedia> => {
    const movieUrl = `${TMDB_API_URL}/movie/${movieId}`;
    const options = {
        headers: {
            accept: 'application/json',
            Authorization: `Bearer ${TMDB_API_TOKEN}`,
        },
    };

    try {
        const movieResponse: TMDBMovie = (await axios.get(movieUrl, options))
            .data;

        return {
            id: movieResponse.id,
            title: movieResponse.title,
            overview: movieResponse.overview,
            mediaType: 'movie',
            genres:
                movieResponse.genres?.map(
                    (genre: Genre) => genre.name || 'Unknown'
                ) ?? [],
            posterUrl: `${TMDB_IMAGES_URL}/w780${movieResponse.poster_path}`,
            backdropUrl: `${TMDB_IMAGES_URL}/w1280${movieResponse.backdrop_path}`,
            releaseDate: movieResponse.release_date,
            voteAverage: movieResponse.vote_average,
            voteCount: movieResponse.vote_count,
            popularity: movieResponse.popularity,
            tagline: movieResponse.tagline?.length
                ? movieResponse.tagline
                : movieResponse.title,
            status: movieResponse.status,
            originCountry: movieResponse.origin_country,
        };
    } catch (error) {
        console.error('Error fetching trending media:', error);
        throw new Error('Failed to fetch trending media');
    }
};

const fetchTVShowById = async (showId: string): Promise<ITVSerie> => {
    const movieUrl = `${TMDB_API_URL}/tv/${showId}`;
    const options = {
        headers: {
            accept: 'application/json',
            Authorization: `Bearer ${TMDB_API_TOKEN}`,
        },
    };

    try {
        const showResponse: TMDBTVShow = (await axios.get(movieUrl, options))
            .data;

        return {
            id: showResponse.id,
            title: showResponse.name,
            overview: showResponse.overview,
            mediaType: 'tv',
            genres:
                showResponse.genres?.map(
                    (genre: Genre) => genre.name || 'Unknown'
                ) ?? [],
            posterUrl: `${TMDB_IMAGES_URL}/w780${showResponse.poster_path}`,
            backdropUrl: `${TMDB_IMAGES_URL}/w1280${showResponse.backdrop_path}`,
            releaseDate: showResponse.first_air_date,
            voteAverage: showResponse.vote_average,
            voteCount: showResponse.vote_count,
            popularity: showResponse.popularity,
            tagline: showResponse.tagline ?? showResponse.name,
            status: showResponse.status,
            numberOfSeasons: showResponse.number_of_seasons,
            numberOfEpisodes: showResponse.number_of_episodes,
            originCountry: showResponse.origin_country,
        };
    } catch (error) {
        console.error('Error fetching trending media:', error);
        throw new Error('Failed to fetch TV Show');
    }
};

export {
    fetchTrendingMedia,
    fetchLatestMovies,
    fetchMovieById,
    fetchTVShowById,
};
export type { IBaseMedia, TMDBMovie, TMDBTVShow, ITVSerie };
