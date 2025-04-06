'use server';

import { MediaTypes } from '@/components/trending-section';
import { getGenres } from '@/utils/helpers';
import axios from 'axios';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { createClient } from '@/utils/supabase/server';
import {
    MediaBaseInterface,
    MediaType,
    MovieMedia,
    TVShowInterface,
    TVShowMedia,
} from 'src/types';
import { SignupFormProps } from '@/components/forms/signup-form';
import { LoginFormProps } from '@/components/forms/login-form';

const TMDB_API_URL = process.env.NEXT_PUBLIC_TMDB_API_URL;
const TMDB_API_TOKEN = process.env.TMDB_API_TOKEN;
const TMDB_IMAGES_URL = process.env.NEXT_PUBLIC_TMDB_IMAGES_URL;

const login = async (formData: LoginFormProps) => {
    const supabase = await createClient();

    const data = {
        email: formData.email,
        password: formData.password,
    };

    const { error } = await supabase.auth.signInWithPassword(data);

    if (error) {
        return {
            status: 'error',
            message: 'Something went wrong, please try again later.',
        };
    }

    revalidatePath('/', 'layout');
    redirect('/dashboard');
};

const signup = async (formData: SignupFormProps) => {
    const supabase = await createClient();

    const data = {
        email: formData.email,
        password: formData.password,
        options: {
            data: {
                firstname: formData.firstname,
                lastname: formData.lastname,
            },
            emailRedirectTo: '/login',
        },
    };

    const { error } = await supabase.auth.signUp(data);

    if (error) {
        return {
            status: 'error',
            message: 'Something went wrong, please try again later.',
        };
    }

    revalidatePath('/', 'layout');
    return {
        status: 'success',
        message: 'Please check your email to verify your account.',
    };
};

const fetchTrendingMedia = async (
    mediaType: keyof typeof MediaTypes
): Promise<MediaBaseInterface[]> => {
    const genreUrl = `${TMDB_API_URL}/genre/movie/list`;
    console.log({ mediaType });
    const mediaUrl = `${TMDB_API_URL}/trending/${mediaType}/week`;
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
            .filter((media: MediaType): media is MediaType =>
                ['movie', 'tv'].includes(media.media_type)
            )
            .map(
                (media: MediaType): MediaBaseInterface => ({
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
                        process.env.NODE_ENV === 'development'
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

const fetchMovieById = async (movieId: string): Promise<MediaBaseInterface> => {
    const movieUrl = `${TMDB_API_URL}/movie/${movieId}`;
    const options = {
        headers: {
            accept: 'application/json',
            Authorization: `Bearer ${TMDB_API_TOKEN}`,
        },
    };

    try {
        const movieResponse: MovieMedia = (await axios.get(movieUrl, options))
            .data;

        return {
            id: movieResponse.id,
            title: movieResponse.title,
            overview: movieResponse.overview,
            mediaType: 'movie',
            genres:
                movieResponse.genres?.map((genre) => genre.name || 'Unknown') ??
                [],
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

const fetchTVShowById = async (showId: string): Promise<TVShowInterface> => {
    const movieUrl = `${TMDB_API_URL}/tv/${showId}`;
    const options = {
        headers: {
            accept: 'application/json',
            Authorization: `Bearer ${TMDB_API_TOKEN}`,
        },
    };

    try {
        const showResponse: TVShowMedia = (await axios.get(movieUrl, options))
            .data;

        return {
            id: showResponse.id,
            title: showResponse.name,
            overview: showResponse.overview,
            mediaType: 'tv',
            genres:
                showResponse.genres?.map((genre) => genre.name || 'Unknown') ??
                [],
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

export { login, signup, fetchTrendingMedia, fetchMovieById, fetchTVShowById };
