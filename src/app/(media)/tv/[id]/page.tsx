import { fetchTVShowById } from '@/app/actions';
import { HeroDetail } from '@/components/hero-detail';
import { MediaDetail } from '@/components/media-detail';
import { getDisplayCountryNames } from '@/utils/helpers';

export default async function MoviePage({
    params,
}: {
    params: Promise<{ id: string }>;
}) {
    const { id: showId } = await params;
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
        numberOfSeasons,
        numberOfEpisodes,
        originCountry,
    } = await fetchTVShowById(showId);

    const countryNames = getDisplayCountryNames(originCountry);

    return (
        <div className='grid gap-y-20'>
            <HeroDetail
                id={showId}
                title={title}
                description={overview}
                backdropUrl={backdropUrl ?? ''}
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
                numberOfSeasons={numberOfSeasons}
                numberOfEpisodes={numberOfEpisodes}
                originCountry={countryNames}
            />
        </div>
    );
}
