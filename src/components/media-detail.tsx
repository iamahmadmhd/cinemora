import { Image } from '@heroui/image';
import { Chip } from '@heroui/chip';
import { Star } from 'lucide-react';
import NextImage from 'next/image';
import React from 'react';
import { TVShowInterface } from 'src/types/types';

enum MediaType {
    movie = 'Movie',
    tv = 'TV Serie',
}

type MediaDetailProps = Omit<
    TVShowInterface,
    'id' | 'backdropUrl' | 'href' | 'voteCount' | 'popularity'
>;

const MediaDetail = (props: MediaDetailProps) => {
    const {
        title,
        tagline,
        overview,
        mediaType,
        genres,
        releaseDate,
        posterUrl,
        voteAverage,
        status,
        numberOfSeasons,
        numberOfEpisodes,
        originCountry,
    } = props;
    return (
        <div className='max-w-2xl mx-auto'>
            <div className='flex flex-col gap-y-6'>
                <h2 className='text-xl'>{tagline}</h2>
                <p>{overview}</p>
                <Chip
                    startContent={<Star size={18} />}
                    variant='shadow'
                    color='warning'
                >
                    {voteAverage?.toFixed(1)}
                </Chip>
                <div className='grid grid-cols-2 space-x-4 space-y-4'>
                    <ul>
                        <li className='mb-2 text-gray-500'>Type</li>
                        <li>{MediaType[mediaType]}</li>
                    </ul>
                    <ul>
                        <li className='mb-2 text-gray-500'>Countries</li>
                        <li>{originCountry?.join(', ')}</li>
                    </ul>
                    <ul>
                        <li className='mb-2 text-gray-500'>
                            {mediaType === 'movie'
                                ? 'Release Date'
                                : 'First Air Date'}
                        </li>
                        <li>{releaseDate}</li>
                    </ul>
                    <ul>
                        <li className='mb-2 text-gray-500'>Status</li>
                        <li>{status}</li>
                    </ul>
                    {mediaType === 'tv' && (
                        <ul>
                            <li className='mb-2 text-gray-500'>Seasons</li>
                            <li>{numberOfSeasons}</li>
                        </ul>
                    )}
                    {mediaType === 'tv' && (
                        <ul>
                            <li className='mb-2 text-gray-500'>Episodes</li>
                            <li>{numberOfEpisodes}</li>
                        </ul>
                    )}
                    <ul>
                        <li className='mb-2 text-gray-500'>Genres</li>
                        <li>{genres?.join(', ')}</li>
                    </ul>
                </div>
            </div>
        </div>
    );
};

export { MediaDetail };
