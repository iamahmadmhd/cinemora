import { fetchTVShows } from '@/app/actions';
import { MediaGrid } from '@/components/media-grid';

export default async function TVShowsPage() {
    return (
        <div className='flex flex-col gap-8 mb-8'>
            <h1 className='text-2xl font-bold'>TV Shows</h1>
            <MediaGrid
                fetchKey='tv'
                fetchFunction={fetchTVShows}
            />
        </div>
    );
}
