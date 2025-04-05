'use client';

import { Button, ButtonGroup, PressEvent } from '@heroui/button';
import { fetchTrendingMedia } from '@/app/actions';
import { MediaGrid } from '@/components/media-grid';
import { useState } from 'react';
import { cn } from '@/utils/classname';

export enum MediaTypes {
    all = 'Movies and TV Shows',
    movie = 'Movies',
    tv = 'TV Shows',
}

interface TrendingSectionProps {
    className?: string;
}

const TrendingSection = (props: TrendingSectionProps) => {
    const { className } = props;

    const [mediaType, setMediaType] = useState<keyof typeof MediaTypes>('all');
    const fetchKey = `trending-${mediaType}`;

    const handleButtonClick = (e: PressEvent) => {
        const selectedType = (e.target as HTMLButtonElement).value;
        setMediaType(selectedType as keyof typeof MediaTypes);
    };

    return (
        <section className={cn('py-20', className)}>
            <div className='mb-8'>
                <ButtonGroup variant='flat'>
                    {Object.keys(MediaTypes).map((type) => (
                        <Button
                            key={type}
                            onPress={handleButtonClick}
                            value={type}
                            color={mediaType === type ? 'secondary' : 'default'}
                            className='w-full'
                        >
                            {type === 'all'
                                ? 'All'
                                : MediaTypes[type as keyof typeof MediaTypes]}
                        </Button>
                    ))}
                </ButtonGroup>
            </div>
            <MediaGrid
                headline={`Trending ${MediaTypes[mediaType]}`}
                link={`/${mediaType}`}
                fetchKey={fetchKey}
                fetchFunction={() => fetchTrendingMedia(mediaType)}
            />
        </section>
    );
};

export { TrendingSection };
