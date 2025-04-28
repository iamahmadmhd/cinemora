import { fetchTVShows } from '@/app/actions';
import { MediaGrid } from '@/components/media-grid';

export default async function TVShowsPage() {
    return (
        <>
            <h1 className='text-2xl font-bold'>Movies</h1>
            <MediaGrid
                fetchKey='tv'
                fetchFunction={fetchTVShows}
            />
        </>
    );
}
