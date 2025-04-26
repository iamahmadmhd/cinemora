import { NextResponse } from 'next/server';
import { createClient } from '@/utils/supabase/server';

export async function POST(req: Request) {
    const supabase = await createClient();
    const {
        data: { user },
    } = await supabase.auth.getUser();

    const { movieId, title, description } = await req.json();

    if (!movieId) {
        return NextResponse.json(
            { message: 'Movie id is required.' },
            { status: 400 }
        );
    }

    if (!user) {
        return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    // Insert item
    const { error } = await supabase.from('watchlists').insert([
        {
            user_id: user.id,
            movie_id: movieId,
            title: title,
            description: description,
        },
    ]);

    if (error) {
        return NextResponse.json(
            { message: error.message },
            { status: error.code as unknown as number }
        );
    }

    return NextResponse.json(
        { message: 'Item added successfully' },
        { status: 200 }
    );
}
