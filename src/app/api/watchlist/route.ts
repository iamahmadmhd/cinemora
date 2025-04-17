import { NextResponse } from 'next/server';
import { createClient } from '@/utils/supabase/server';

export async function POST(req: Request) {
    const supabase = await createClient();
    const {
        data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { externalId, title, description } = await req.json();
    if (!externalId) {
        return NextResponse.json(
            { error: 'Missing external id' },
            { status: 400 }
        );
    }

    const { data: watchlist } = await supabase
        .from('watchlists')
        .select()
        .eq('user_id', user.id)
        .single();

    const listId = watchlist?.id;
    if (!listId) {
        return NextResponse.json(
            { error: 'Watchlist not found' },
            { status: 404 }
        );
    }

    // Insert item
    const { error } = await supabase.from('list_items').insert([
        {
            list_id: listId,
            external_id: externalId,
            title: title,
            description: description,
        },
    ]);

    if (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true });
}
