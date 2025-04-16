'use client';

import { Button } from '@heroui/button';
import NextLink from 'next/link';
import useSWR from 'swr';
import { cn } from '@/utils/classname';
import { MediaCard } from './ui/media-card';
import { Skeleton } from './ui/skeleton';
import { MediaBaseInterface } from 'src/types';

interface MediaGridProps {
    headline?: string;
    link?: string;
    fetchKey: string; // fetchKey for reusability
    fetchFunction: () => Promise<MediaBaseInterface[]>; // fetchFunction for reusability
    className?: string;
}

const MediaGrid: React.FC<MediaGridProps> = ({
    headline,
    link = '/',
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
                    <h4 className='text-lg font-bold'>{headline}</h4>
                    <Button
                        as={NextLink}
                        href={link}
                        variant='light'
                        color='primary'
                    >
                        Show All
                    </Button>
                </div>
            )}
            <div className='grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4'>
                {isLoading
                    ? [...Array(8)].map((_, index) => <Skeleton key={index} />)
                    : data?.map((item) => (
                          <MediaCard
                              key={item.id}
                              content={item}
                          />
                      ))}
            </div>
        </div>
    );
};

export { MediaGrid };
