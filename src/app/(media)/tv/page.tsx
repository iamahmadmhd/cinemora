import { fetchTVShows } from '@/app/actions';
import { MediaListingSection } from '@/components/media-listing-section';

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
