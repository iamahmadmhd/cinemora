import { fetchUser } from '@/app/actions';
import { WatchlistTable } from '@/components/watchlist-table';
import { createClient } from '@/utils/supabase/server';
import { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Watchlist - Cinemora',
    description: 'Browse your favorite movies and shows on Cinemora and add them to your watchlist',
};

export default async function WatchlistPage() {
    const supabase = await createClient();
    const user = await fetchUser();
    const { data } = await supabase.from('watchlists').select().eq('user_id', user?.id);

    const watchlist = (data ?? []).map((item) => ({
        id: item.media_id,
        title: item.title,
        overview: item.overview,
        releaseDate: item.release_date,
        genres: item.genres,
        mediaType: item.media_type ?? '',
        voteAverage: item.vote_average,
        posterUrl: item.poster_url,
        status: item.status ?? '',
        href: item.href ?? '',
    }));

    return (
        <div className='flex flex-col gap-4'>
            <h1 className='text-2xl font-bold'>Watchlist</h1>
            <WatchlistTable items={watchlist} />
        </div>
    );
}
