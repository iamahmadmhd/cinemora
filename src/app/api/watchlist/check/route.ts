import { NextResponse } from 'next/server';
import { createClient } from '@/utils/supabase/server';

export async function GET(req: Request) {
    const supabase = await createClient();
    const { searchParams } = new URL(req.url);
    const movieId = searchParams.get('movie_id');

    if (!movieId) {
        return NextResponse.json(
            { message: 'Movie id is required.' },
            { status: 401 }
        );
    }

    const {
        data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
        return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    // Check if item exists
    const { data, error } = await supabase
        .from('watchlists')
        .select('id')
        .eq('user_id', user?.id)
        .eq('movie_id', movieId)
        .single();

    if (error) {
        return NextResponse.json({ message: error.message }, { status: 500 });
    }

    const listId = data?.id;

    if (!listId) {
        return NextResponse.json(
            { message: 'Item does not exist in watchlist' },
            { status: 404 }
        );
    }

    return NextResponse.json(
        { message: 'Item exists in watchlist' },
        { status: 200 }
    );
}
