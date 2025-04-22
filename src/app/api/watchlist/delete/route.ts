import { NextResponse } from 'next/server';
import { createClient } from '@/utils/supabase/server';

export async function POST(req: Request) {
    const supabase = await createClient();
    const { externalId } = await req.json();

    const {
        data: { user },
    } = await supabase.auth.getUser();

    if (!externalId) {
        return NextResponse.json({
            status: 'error',
            message: 'Please provide an external id.',
        });
    }

    const { data: watchlist } = await supabase
        .from('watchlists')
        .select()
        .eq('user_id', user?.id)
        .single();

    const { data, error } = await supabase
        .from('list_items')
        .delete()
        .eq('user_id', user?.id)
        .eq('list_id', watchlist.id);

    if (!data || error) {
        return NextResponse.json({
            status: 'error',
            message: 'An error occured',
        });
    }

    return NextResponse.json({
        status: 'success',
        message: 'Item deleted successfully',
    });
}
