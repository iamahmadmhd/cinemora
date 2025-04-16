'use client';

import { Button, ButtonGroup, PressEvent } from '@heroui/button';
import { fetchTrendingMedia } from '@/app/actions';
import { useState, useCallback } from 'react';
import { cn } from '@/utils/classname';
import { MediaSlider } from './media-slider';

interface ContentType {
    headline: string;
    button: string;
    link: string;
}

const content: Record<'all' | 'movie' | 'tv', ContentType> = {
    all: {
        headline: 'Trending Movies and TV Shows',
        button: 'All',
        link: '/trending/all',
    },
    movie: {
        headline: 'Trending Movies',
        button: 'Movies',
        link: '/trending/movie',
    },
    tv: {
        headline: 'Trending TV Shows',
        button: 'TV Shows',
        link: '/trending/tv',
    },
};

type MediaTypes = keyof typeof content;

interface TrendingSectionProps {
    className?: string;
}

const TrendingSection = ({ className }: TrendingSectionProps) => {
    const [mediaType, setMediaType] = useState<MediaTypes>('all');
    const fetchKey = `trending-${mediaType}`;

    const handleButtonClick = useCallback((e: PressEvent) => {
        const selectedType = (e.target as HTMLButtonElement)
            .value as MediaTypes;
        if (content[selectedType]) {
            setMediaType(selectedType);
        }
    }, []);

    return (
        <section className={cn('py-20', className)}>
            <div className='mb-8'>
                <ButtonGroup
                    variant='flat'
                    className='w-full md:w-auto'
                >
                    {(Object.keys(content) as MediaTypes[]).map((item) => (
                        <Button
                            key={item}
                            onPress={handleButtonClick}
                            value={item}
                            color={mediaType === item ? 'secondary' : 'default'}
                            className='w-full'
                        >
                            {content[item].button}
                        </Button>
                    ))}
                </ButtonGroup>
            </div>
            <MediaSlider
                sliderOptions={{
                    slidesToScroll: 1,
                    align: 'start',
                    container: 'carousel-container',
                }}
                fetchKey={fetchKey}
                fetchFunction={() => fetchTrendingMedia(mediaType)}
                className='mb-8'
                headline={content[mediaType].headline}
                link={content[mediaType].link}
            />
        </section>
    );
};

export { TrendingSection };
export type { MediaTypes };
