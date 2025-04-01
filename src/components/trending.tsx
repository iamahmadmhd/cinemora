'use client';

import { Card, CardBody } from '@heroui/card';
import { Image } from '@heroui/image';
import { Chip } from '@heroui/chip';
import NextLink from 'next/link';
import { useEffect, useState } from 'react';
import { EmblaOptionsType } from 'embla-carousel';
import { DotButton, useDotButton } from './ui/EmblaCarouselDotButton';
import {
    PrevButton,
    NextButton,
    usePrevNextButtons,
} from './ui/EmblaCarouselArrowButtons';
import useEmblaCarousel from 'embla-carousel-react';

enum MediaType {
    movie = 'Movie',
    tv = 'TV'
}

interface BaseMedia {
    backdrop_path: string;
    id: number;
    overview: string;
    poster_path: string;
    adult: boolean;
    original_language: string;
    genre_ids: number[];
    popularity: number;
    vote_average: number;
    vote_count: number;
}

interface Movie extends BaseMedia {
    title: string;
    original_title: string;
    release_date: string;
    video: boolean;
    media_type: 'movie';
}

interface TVShow extends BaseMedia {
    name: string;
    original_name: string;
    first_air_date: string;
    origin_country: string[];
    media_type: 'tv';
}

type Media = Movie | TVShow;

interface ApiResponse {
    page: number;
    results: Media[];
}

type PropType = {
    slides: number[];
    options?: EmblaOptionsType;
};

const fetchGenres = async (): Promise<Record<number, string>> => {
    const url = `${process.env.NEXT_PUBLIC_TMDB_API_URL}/genre/movie/list`;
    const options = {
        method: 'GET',
        headers: {
            accept: 'application/json',
            Authorization: `Bearer ${process.env.NEXT_PUBLIC_TMDB_API_TOKEN}`,
        },
    };

    const response = await fetch(url, options);
    if (!response.ok) {
        throw new Error('Failed to fetch genres');
    }

    const data = await response.json();
    return data.genres.reduce(
        (acc: Record<number, string>, genre: { id: number; name: string }) => {
            acc[genre.id] = genre.name;
            return acc;
        },
        {}
    );
};

const fetchTrendingMedia = async (): Promise<Media[]> => {
    const url = `${process.env.NEXT_PUBLIC_TMDB_API_URL}/trending/all/day`;
    const options = {
        method: 'GET',
        headers: {
            accept: 'application/json',
            Authorization: `Bearer ${process.env.NEXT_PUBLIC_TMDB_API_TOKEN}`,
        },
    };

    const response = await fetch(url, options);
    if (!response.ok) {
        throw new Error('Failed to fetch trending media');
    }

    const data: ApiResponse = await response.json();
    return data.results;
};

function Trending() {
    const [movies, setMovies] = useState<Media[]>([]);
    const [genres, setGenres] = useState<Record<number, string>>({});
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        Promise.all([fetchTrendingMedia(), fetchGenres()])
            .then(([movies, genres]) => {
                setMovies(movies);
                setGenres(genres);
            })
            .catch((err) => setError(err.message));
    }, []);

    if (error) {
        return <p className='text-red-500'>Error: {error}</p>;
    }

    return (
        <div className='flex flex-col gap-8'>
            <h2 className='text-2xl font-bold'>Trending</h2>
            <div className='grid grid-cols-1 md:grid-cols-4 gap-4'>
                {movies.length > 0 ? (
                    movies.map((media) => (
                        <MovieCard
                            key={media.id}
                            media={media}
                            genres={genres}
                        />
                    ))
                ) : (
                    <p>Loading...</p>
                )}
            </div>
        </div>
    );
}

const EmblaCarousel: React.FC<PropType> = (props) => {
    const { slides, options } = props;
    const [emblaRef, emblaApi] = useEmblaCarousel(options);
    const [movies, setMovies] = useState<Media[]>([]);
    const [genres, setGenres] = useState<Record<number, string>>({});
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        Promise.all([fetchTrendingMedia(), fetchGenres()])
            .then(([movies, genres]) => {
                setMovies(movies);
                setGenres(genres);
            })
            .catch((err) => setError(err.message));
    }, []);

    const { selectedIndex, scrollSnaps, onDotButtonClick } =
        useDotButton(emblaApi);

    const {
        prevBtnDisabled,
        nextBtnDisabled,
        onPrevButtonClick,
        onNextButtonClick,
    } = usePrevNextButtons(emblaApi);

    if (error) {
        return <p className='text-red-500'>Error: {error}</p>;
    }

    return (
        <div className='flex flex-col gap-8'>
            <h2 className='text-2xl font-bold'>Trending</h2>
            <div>
                <div
                    className='embla__viewport'
                    ref={emblaRef}
                >
                    <div className='flex -ml-4 touch-pan-y touch-pinch-zoom snap-x'>
                        {movies.length > 0 ? (
                            movies.map((media) => (
                                <div
                                    key={media.id}
                                    className='flex-[0_0_50%] md:flex-[0_0_25%] pl-4 snap-start'
                                >
                                    <MovieCard
                                        media={media}
                                        genres={genres}
                                    />
                                </div>
                            ))
                        ) : (
                            <p>Loading...</p>
                        )}
                    </div>
                </div>

                <div className='embla__controls'>
                    <div className='embla__buttons'>
                        <PrevButton
                            onClick={onPrevButtonClick}
                            disabled={prevBtnDisabled}
                        />
                        <NextButton
                            onClick={onNextButtonClick}
                            disabled={nextBtnDisabled}
                        />
                    </div>

                    <div className='embla__dots'>
                        {scrollSnaps.map((_, index) => (
                            <DotButton
                                key={index}
                                onClick={() => onDotButtonClick(index)}
                                className={'embla__dot'.concat(
                                    index === selectedIndex
                                        ? ' embla__dot--selected'
                                        : ''
                                )}
                            />
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

const MovieCard = ({
    media,
    genres,
}: {
    media: Media;
    genres: Record<number, string>;
}) => {
    const title = media.media_type === 'movie' ? media.title : media.name;
    const overview = media.overview.substring(0, 120).concat('...');
    const mediaType = media.media_type;
    const genreNames = media.genre_ids.map((id) => genres[id] || 'Unknown');
    const imageUrl = `https://media.themoviedb.org/t/p/w342${media.poster_path}`;

    return (
        <Card
            isFooterBlurred
            className='w-full overflow-hidden aspect-[2/3] group'
        >
            <Image
                removeWrapper
                alt={title}
                className='z-0 w-full h-full object-cover'
                src={imageUrl}
                loading='lazy'
            />
            <CardBody className='absolute flex-col items-start gap-3 backdrop-blur-xl bg-black/80 supports-backdrop-filter:bg-black/40 transition-normal duration-400 ease-in top-0 bottom-0 z-10 p-6 opacity-0 group-hover:opacity-100'>
                <div className='flex flex-wrap items-start gap-1'>
                    <Chip
                        size='sm'
                        color='primary'
                    >
                        {MediaType[mediaType]}
                    </Chip>
                    {genreNames.map((name, index) => (
                        <Chip
                            key={index}
                            size='sm'
                            color='secondary'
                        >
                            {name}
                        </Chip>
                    ))}
                </div>
                <div className='flex flex-col gap-1'>
                    <NextLink
                        href={`/details/${media.id}`}
                        className='text-lg font-medium text-white'
                    >
                        <span className='absolute inset-0' />
                        {title}
                    </NextLink>
                    <p className='text-tiny text-white/60'>{overview}</p>
                </div>
                <div className='mt-auto inline-flex items-center justify-center box-border select-none whitespace-nowrap font-normal subpixel-antialiased overflow-hidden outline-none text-tiny px-2 min-w-20 h-8 gap-2 rounded-medium transition-transform-colors-opacity motion-reduce:transition-none shadow-lg shadow-primary/40 bg-primary text-primary-foreground hover:opacity-hover'>
                    View details
                </div>
            </CardBody>
        </Card>
    );
};

export { Trending, EmblaCarousel };
