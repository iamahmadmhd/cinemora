import { NextResponse } from 'next/server';
import { createClient } from '@/utils/supabase/server';
import { Database } from '@/types/supabase';
import { getErrorStatusCode } from '@/utils/helpers';

type Watchlist = Database['public']['Tables']['watchlists']['Row'];

export async function POST(req: Request) {
    const supabase = await createClient();
    const {
        data: { user },
    } = await supabase.auth.getUser();

    const { id, title, overview, posterUrl, releaseDate, mediaType, href, genres, voteAverage } =
        await req.json();

    if (!id) {
        return NextResponse.json({ message: 'Movie id is required.' }, { status: 400 });
    }

    if (!user) {
        return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    // Insert item
    const { data, error } = await supabase
        .from('watchlists')
        .insert<Watchlist>([
            {
                user_id: user.id,
                media_id: id as string, // Ensure media_id is a string
                title: title as string, // Ensure title is a string
                overview: overview as string | null, // Allow null for optional fields
                media_type: mediaType as 'movie' | 'tv' | null, // Restrict to valid enum values
                href: href as string | null,
                status: 'not watched',
                poster_url: posterUrl as string | null,
                release_date: releaseDate as string | null,
                genres: genres as string[] | null, // Ensure genres is an array or null
                vote_average: voteAverage as number | null, // Ensure vote_average is a number or null
            },
        ])
        .select();

    if (error) {
        return NextResponse.json(
            { message: error.message },
            { status: getErrorStatusCode(error as unknown as string) }
        );
    }

    return NextResponse.json({ message: 'Item added successfully', data }, { status: 200 });
}
