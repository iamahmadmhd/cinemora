import { MediaBaseInterface, MovieMedia } from '@/types/types';
import { getGenres } from '@/utils/helpers';
import axios from 'axios';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
    const searchParams = request.nextUrl.searchParams.toString();
    try {
        const options = {
            headers: {
                accept: 'application/json',
                Authorization: `Bearer ${process.env.TMDB_API_KEY}`,
            },
        };
        const moviesUrl = `${process.env.NEXT_PUBLIC_TMDB_API_URL}/discover/movie?${searchParams}`;
        const genreUrl = `${process.env.NEXT_PUBLIC_TMDB_API_URL}/genre/movie/list`;
        const [moviesResponse, genreResponse] = await Promise.all([
            axios.get(moviesUrl, options),
            axios.get(genreUrl, options),
        ]);
        const genres = getGenres(genreResponse.data.genres);
        const data = moviesResponse.data;
        if (moviesResponse.status === 200) {
            const movies: MediaBaseInterface = data.results.map((movie: MovieMedia) => ({
                id: movie.id,
                title: movie.title,
                overview: movie.overview,
                backdropUrl: movie.backdrop_path
                    ? `${process.env.NEXT_PUBLIC_TMDB_IMAGES_URL}/w780${movie.backdrop_path}`
                    : null,
                posterUrl: movie.poster_path
                    ? `${process.env.NEXT_PUBLIC_TMDB_IMAGES_URL}/w342${movie.poster_path}`
                    : null,
                releaseDate: movie.release_date,
                mediaType: 'movie',
                href: `/${'movie'}/${movie.id}`,
                genres: movie.genre_ids?.map((id: number) => genres[id] || 'Unknown') ?? [],
                voteAverage: movie.vote_average,
                status: movie.status,
                originCountry: movie.origin_country,
                voteCount: movie.vote_count,
                popularity: movie.popularity,
                tagline: movie.tagline,
            }));
            const response = {
                page: data.page,
                results: movies,
                totalPages: data.total_pages,
                totalResults: data.total_results,
            };
            return NextResponse.json(response, {
                status: 200,
            });
        } else {
            return NextResponse.json(
                { message: data.statusText },
                {
                    status: data.status,
                }
            );
        }
    } catch {
        return NextResponse.error();
    }
}
