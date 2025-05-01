import { fetchTVShowById } from '@/app/actions';
import { HeroDetailSection } from '@/components/hero-detail-section';
import { MediaDetailSection } from '@/components/media-detail-section';
import { getDisplayCountryNames } from '@/utils/helpers';

export default async function MoviePage({ params }: { params: Promise<{ id: string }> }) {
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
            <HeroDetailSection
                id={showId as unknown as number}
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
                numberOfSeasons={numberOfSeasons}
                numberOfEpisodes={numberOfEpisodes}
                originCountry={countryNames}
            />
        </div>
    );
}
