import { fetchMovies } from '@/app/actions';
import { MediaGrid } from '@/components/media-grid';

export default async function MoviePage() {
    return (
        <>
            <h1 className='text-2xl font-bold'>Movies</h1>
            <MediaGrid
                fetchKey='movie'
                fetchFunction={fetchMovies}
            />
        </>
    );
}
