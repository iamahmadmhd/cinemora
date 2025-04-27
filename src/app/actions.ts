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
} from 'src/types/types';
import { SignupFormProps } from '@/components/forms/signup-form';
import { LoginFormProps } from '@/components/forms/login-form';
import { User } from '@supabase/supabase-js';
import { Profile } from '@/providers/use-auth';

const TMDB_API_URL = process.env.NEXT_PUBLIC_TMDB_API_URL!;
const TMDB_API_TOKEN = process.env.TMDB_API_TOKEN!;
const TMDB_IMAGES_URL = process.env.NEXT_PUBLIC_TMDB_IMAGES_URL!;

const handleSupabaseError = (error: unknown, action: string): never => {
    console.error(`Error during ${action}:`, error);
    throw new Error(String(error) || `Failed to ${action}`);
};

const login = async (formData: LoginFormProps) => {
    const supabase = await createClient();

    try {
        const { error } = await supabase.auth.signInWithPassword({
            email: formData.email,
            password: formData.password,
        });

        if (error) handleSupabaseError(error, 'login');

        revalidatePath('/');
        return { status: 200, message: 'Login successful' };
    } catch (error) {
        handleSupabaseError(error, 'login');
    }
};

const signup = async (formData: SignupFormProps) => {
    const supabase = await createClient();

    try {
        const { error } = await supabase.auth.signUp({
            email: formData.email,
            password: formData.password,
            options: {
                data: {
                    firstname: formData.firstname,
                    lastname: formData.lastname,
                },
                emailRedirectTo: '/login',
            },
        });

        if (error) handleSupabaseError(error, 'signup');

        revalidatePath('/');
        return {
            status: 200,
            message: 'Please check your email to verify your account.',
        };
    } catch (error) {
        handleSupabaseError(error, 'signup');
    }
};

const signout = async () => {
    const supabase = await createClient();
    const { error } = await supabase.auth.signOut();
    if (error) handleSupabaseError(error, 'signout');
    revalidatePath('/');
    redirect('/login');
};

const fetchUser = async (): Promise<User | null> => {
    const supabase = await createClient();

    try {
        const {
            data: { user },
        } = await supabase.auth.getUser();
        return user || null;
    } catch (error) {
        handleSupabaseError(error, 'fetch user');
        return null;
    }
};

const fetchProfile = async (): Promise<Profile | null> => {
    const supabase = await createClient();

    try {
        const {
            data: { user },
        } = await supabase.auth.getUser();
        if (!user) return null;

        const { data } = await supabase
            .from('profiles')
            .select()
            .eq('id', user.id)
            .single();

        return data || null;
    } catch (error) {
        handleSupabaseError(error, 'fetch profile');
    }

    return null;
};

const fetchTrendingMedia = async (
    mediaType: MediaTypes
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
                    posterUrl: `${TMDB_IMAGES_URL}/w342${media.poster_path}`,
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

export {
    login,
    signup,
    signout,
    fetchUser,
    fetchProfile,
    fetchTrendingMedia,
    fetchMovieById,
    fetchTVShowById,
};
