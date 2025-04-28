import { NextResponse } from 'next/server';
import { createClient } from '@/utils/supabase/server';
import { getErrorStatusCode } from '@/utils/helpers';

export async function POST(req: Request) {
    const supabase = await createClient();
    const { id } = await req.json();

    const {
        data: { user },
    } = await supabase.auth.getUser();

    if (!id) {
        return NextResponse.json(
            {
                message: 'Movie id is required.',
            },
            { status: 401 }
        );
    }

    const { error } = await supabase
        .from('watchlists')
        .delete()
        .eq('user_id', user?.id)
        .eq('media_id', id);

    if (error) {
        return NextResponse.json(
            {
                message: error.message,
            },
            { status: getErrorStatusCode(error as unknown as string) }
        );
    }

    return NextResponse.json(
        {
            message: 'Item deleted successfully',
        },
        { status: 200 }
    );
}
