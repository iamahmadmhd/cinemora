import { fetchTVShows } from '@/app/actions';
import { MediaListingSection } from '@/components/media-listing-section';
import { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'TV Shows - Cinemora',
    description: 'Browse your favorite TV shows on Cinemora and add them to your watchlist',
};

export default async function TVShowsPage() {
    return (
        <div className='flex flex-col gap-8 mb-8'>
            <MediaListingSection
                headline='TV Shows'
                mediaType='tv'
                fetchKey='tvshows'
                fetchFunction={fetchTVShows}
            />
        </div>
    );
}
