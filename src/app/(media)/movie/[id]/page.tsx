import { fetchMovieById } from '@/app/actions';
import { HeroDetail } from '@/components/hero-detail';
import { MediaDetail } from '@/components/media-detail';
import { getDisplayCountryNames } from '@/utils/helpers';

export default async function MoviePage({
    params,
}: {
    params: Promise<{ id: string }>;
}) {
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
            <HeroDetail
                id={movieId}
                title={title}
                description={overview}
                backdropUrl={backdropUrl ?? ''}
                realeaseDate={releaseDate}
                genres={genres}
                voteAverage={voteAverage}
            />
            <MediaDetail
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
