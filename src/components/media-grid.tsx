'use client';

import { Pagination } from '@heroui/react';
import { MediaCard } from './ui/media-card';
import { Skeleton } from './ui/skeleton';
import { MediaBaseInterface } from '@/types/types';
import { cn } from '@/utils/classname';

interface MediaGridProps {
    isLoading: boolean;
    data: MediaBaseInterface[];
    pagination?: {
        total: number;
        page: number;
        onChange: (page: string) => void;
    };
    className?: string;
}

const MediaGrid: React.FC<MediaGridProps> = ({ isLoading, data, pagination, className }) => {
    return (
        <div className='flex flex-col items-center justify-center gap-y-12'>
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
            {!isLoading && (
                <Pagination
                    showShadow
                    color='primary'
                    page={pagination?.page}
                    total={pagination?.total ?? 0}
                    size='lg'
                    onChange={(page) => pagination?.onChange(page.toString())}
                />
            )}
        </div>
    );
};

export { MediaGrid };
