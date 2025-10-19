import { fetchMovies } from '@/app/actions';
import { MediaListingSection } from '@/components/media-listing-section';
import { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Movies - Cinemora',
    description: 'Browse your favorite movies on Cinemora and add them to your watchlist',
};

export default async function MoviePage() {
    return (
        <div className='flex flex-col gap-8 mb-8'>
            <MediaListingSection
                headline='Movies'
                mediaType='movie'
                fetchKey='movie'
                fetchFunction={fetchMovies}
            />
        </div>
    );
}
