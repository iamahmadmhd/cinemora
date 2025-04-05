'use client';

import { Button, ButtonGroup, PressEvent } from '@heroui/button';
import { fetchTrendingMedia } from '@/app/actions';
import { MediaGrid } from '@/components/media-grid';
import { useState } from 'react';

export enum MediaTypes {
    all = 'Movies and TV Shows',
    movie = 'Movies',
    tv = 'TV Shows',
}

const TrendingSection = () => {
    const [mediaType, setMediaType] = useState<keyof typeof MediaTypes>('all');
    const fetchKey = `trending-${mediaType}`;

    const handleButtonClick = (e: PressEvent) => {
        const selectedType = (e.target as HTMLButtonElement).value;
        setMediaType(selectedType as keyof typeof MediaTypes);
    };

    console.log(MediaTypes);
    return (
        <section className=''>
            <div className='mb-8'>
                <ButtonGroup
                    variant='flat'
                >
                    <Button
                        onPress={handleButtonClick}
                        value='all'
                        color={mediaType === 'all' ? 'secondary' : 'default'}
                        className='w-full'
                    >
                        All
                    </Button>
                    <Button
                        onPress={handleButtonClick}
                        value='movie'
                        color={mediaType === 'movie' ? 'secondary' : 'default'}
                        className='w-full'
                    >
                        Movies
                    </Button>
                    <Button
                        onPress={handleButtonClick}
                        value='tv'
                        color={mediaType === 'tv' ? 'secondary' : 'default'}
                        className='w-full'
                    >
                        TV Shows
                    </Button>
                </ButtonGroup>
            </div>
            <MediaGrid
                headline={`Trending ${MediaTypes[mediaType]}`}
                fetchKey={fetchKey}
                fetchFunction={() => fetchTrendingMedia(mediaType)}
            />
        </section>
    );
};
export { TrendingSection };
