import { fetchMovies } from '@/app/actions';
import { MediaGrid } from '@/components/media-grid';

export default async function MoviePage() {
    return (
        <div className='flex flex-col gap-8 mb-8'>
            <MediaGrid
                headline='Movies'
                fetchKey='movie'
                fetchFunction={fetchMovies}
            />
        </div>
    );
}
