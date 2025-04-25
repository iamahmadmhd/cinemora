import { NextResponse } from 'next/server';
import { createClient } from '@/utils/supabase/server';

export async function POST(req: Request) {
    const supabase = await createClient();
    const { movieId } = await req.json();

    const {
        data: { user },
    } = await supabase.auth.getUser();

    if (!movieId) {
        return NextResponse.json(
            {
                message: 'Please provide an external id.',
            },
            { status: 400 }
        );
    }

    const { error } = await supabase
        .from('watchlists')
        .delete()
        .eq('user_id', user?.id)
        .eq('movie_id', movieId);

    if (error) {
        return NextResponse.json(
            {
                message: error.message,
            },
            { status: error.code as unknown as number }
        );
    }

    return NextResponse.json(
        {
            message: 'Item deleted successfully',
        },
        { status: 200 }
    );
}
