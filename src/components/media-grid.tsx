'use client';

import { MediaCard } from './ui/media-card';
import { Skeleton } from './ui/skeleton';
import { MediaBaseInterface } from '@/types/types';
import { cn } from '@/utils/classname';

interface MediaGridProps {
    isLoading: boolean;
    data: MediaBaseInterface[];
    className?: string;
}

const MediaGrid: React.FC<MediaGridProps> = ({ isLoading, data, className }) => {
    return (
        <div className={cn('grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4', className)}>
            {isLoading
                ? Array.from({ length: 8 }, (_, index) => <Skeleton key={index} />)
                : data?.map((item: MediaBaseInterface) => (
                      <MediaCard
                          key={item.id}
                          content={item}
                      />
                  ))}
        </div>
    );
};

export { MediaGrid };
