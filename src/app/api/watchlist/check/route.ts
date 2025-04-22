import { NextResponse } from 'next/server';
import { createClient } from '@/utils/supabase/server';

export async function GET(req: Request) {
    const supabase = await createClient();
    const { searchParams } = new URL(req.url);
    const externalId = searchParams.get('external_id');

    const {
        data: { user },
    } = await supabase.auth.getUser();

    if (!user || !externalId) {
        return NextResponse.json({ exists: false });
    }

    // Get user's watchlist
    const { data: watchlist } = await supabase
        .from('watchlists')
        .select()
        .eq('user_id', user.id)
        .single();

    const listId = watchlist?.id;

    // Check if item exists
    const { data } = await supabase
        .from('list_items')
        .select()
        .eq('list_id', listId)
        .eq('external_id', externalId)
        .maybeSingle();

    if (!data) {
        return NextResponse.json({ exists: false });
    }

    return NextResponse.json({ exists: true });
}
