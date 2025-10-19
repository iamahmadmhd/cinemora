import { fetchMovieById } from '@/app/actions';
import { HeroDetailSection } from '@/components/hero-detail-section';
import { MediaDetailSection } from '@/components/media-detail-section';
import { getDisplayCountryNames } from '@/utils/helpers';

export async function generateMetadata({ params }: { params: { id: string } }) {
    const { id: movieId } = params;
    const { title, overview } = await fetchMovieById(movieId);
    return {
        title: `${title} - Cinemora`,
        description: overview,
    };
}

export default async function MoviePage({ params }: { params: Promise<{ id: string }> }) {
    const { id: movieId } = await params;
    const {
        mediaType,
        title,
        backdropUrl,
        posterUrl,
        overview,
        voteAverage,
        releaseDate,
        genres,
        tagline,
        status,
        originCountry,
    } = await fetchMovieById(movieId);

    const countryNames = getDisplayCountryNames(originCountry);

    return (
        <div className='grid gap-y-20'>
            <HeroDetailSection
                id={movieId as unknown as number}
                mediaType={mediaType}
                title={title}
                posterUrl={posterUrl}
                backdropUrl={backdropUrl}
                overview={overview}
                voteAverage={voteAverage}
                releaseDate={releaseDate}
                genres={genres}
            />
            <MediaDetailSection
                mediaType={mediaType}
                title={title}
                posterUrl={posterUrl}
                overview={overview}
                tagline={tagline}
                genres={genres}
                releaseDate={releaseDate}
                voteAverage={voteAverage}
                status={status}
                numberOfSeasons={0}
                numberOfEpisodes={0}
                originCountry={countryNames}
            />
        </div>
    );
}
