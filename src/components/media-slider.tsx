'use client';

import { Button } from '@heroui/button';
import { EmblaOptionsType } from 'embla-carousel';
import { Carousel } from '@/ui/carousel';
import useSWR from 'swr';
import { cn } from '@/utils/classname';
import { MediaCard } from './ui/media-card';
import { MediaBaseInterface } from 'src/types/types';
import NextLink from 'next/link';

interface MediaSliderProps {
    headline?: string;
    link?: string;
    sliderOptions: EmblaOptionsType;
    fetchKey: string;
    fetchFunction: () => Promise<MediaBaseInterface[]>;
    className?: string;
}

const MediaSlider: React.FC<MediaSliderProps> = ({
    headline,
    link = '/',
    sliderOptions,
    fetchKey,
    fetchFunction,
    className,
}) => {
    const { data, error, isLoading } = useSWR(fetchKey, fetchFunction);

    if (error) {
        return <p className='text-red-500'>Error: {error.message}</p>;
    }

    if (!isLoading && !data) {
        return <p className='text-red-500'>No data found</p>;
    }

    return (
        <div className={cn('flex flex-col gap-8', className)}>
            {headline && (
                <div className='flex justify-between items-center'>
                    <h2 className='text-2xl font-bold'>{headline}</h2>
                    <Button
                        as={NextLink}
                        href={link}
                        variant='flat'
                        color='primary'
                    >
                        Show All
                    </Button>
                </div>
            )}
            <Carousel
                loading={isLoading}
                options={sliderOptions}
            >
                {data?.map((media) => (
                    <MediaCard
                        key={media.id}
                        content={media}
                    />
                ))}
            </Carousel>
        </div>
    );
};

export { MediaSlider };
