import { MediaBaseInterface, TVShowMedia } from '@/types/types';
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
        const showsUrl = `${process.env.NEXT_PUBLIC_TMDB_API_URL}/discover/tv?${searchParams}`;
        const genreUrl = `${process.env.NEXT_PUBLIC_TMDB_API_URL}/genre/tv/list`;
        const [showsResponse, genreResponse] = await Promise.all([
            axios.get(showsUrl, options),
            axios.get(genreUrl, options),
        ]);
        const genres = getGenres(genreResponse.data.genres);
        const data = showsResponse.data;
        if (showsResponse.status === 200) {
            const shows: MediaBaseInterface = data.results.map((show: TVShowMedia) => ({
                id: show.id,
                title: show.name,
                overview: show.overview,
                backdropUrl: show.backdrop_path
                    ? `${process.env.NEXT_PUBLIC_TMDB_IMAGES_URL}/w780${show.backdrop_path}`
                    : null,
                posterUrl: show.poster_path
                    ? `${process.env.NEXT_PUBLIC_TMDB_IMAGES_URL}/w342${show.poster_path}`
                    : null,
                releaseDate: show.first_air_date,
                mediaType: 'tv',
                href: `/${'tv'}/${show.id}`,
                genres: show.genre_ids?.map((id: number) => genres[id] || 'Unknown') ?? [],
                voteAverage: show.vote_average,
                status: show.status,
                originCountry: show.origin_country,
                voteCount: show.vote_count,
                popularity: show.popularity,
                tagline: show.tagline,
            }));
            const response = {
                page: data.page,
                results: shows,
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
