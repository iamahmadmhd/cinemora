'use client';

import { Button } from '@heroui/button';
import useSWR from 'swr';
import { MediaCard } from './ui/media-card';
import { Skeleton } from './ui/skeleton';
import { GenreType, MediaBaseInterface } from 'src/types/types';
import { ArrowUpDown, SlidersHorizontal } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useDisclosure } from '@heroui/use-disclosure';
import { FilterModal } from './ui/filter-modal';
import { FormProvider, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { fetchGenres } from '@/app/actions';

const filterSchema = z.object({
    genres: z.string().optional(),
    releaseYear: z
        .string()
        .regex(/^\d{4}$|^$/, 'Invalid year')
        .optional(),
    language: z.string().optional(),
    country: z.string().optional(),
});

export type FilterFormValues = z.infer<typeof filterSchema>;

interface MediaGridProps {
    headline?: string;
    fetchKey: string;
    fetchFunction: (
        searchParams?: Record<string, string>
    ) => Promise<MediaBaseInterface[]>;
    className?: string;
}

const MediaGrid: React.FC<MediaGridProps> = ({
    headline,
    fetchKey,
    fetchFunction,
    className,
}) => {
    const [searchParams, setSearchParams] = useState<
        Record<string, string> | undefined
    >(undefined);
    const {
        isOpen: filterModalIsOpen,
        onOpen: onFilterModalOpen,
        onOpenChange: onFilterModalOpenChange,
    } = useDisclosure();
    const methods = useForm<FilterFormValues>({
        resolver: zodResolver(filterSchema),
        values: { ...searchParams },
    });
    const {
        data: genres,
        error: genresError,
        isLoading: genresIsLoading,
    } = useSWR<GenreType[]>('genres', fetchGenres);
    const { data, error, isLoading } = useSWR<MediaBaseInterface[]>(
        [fetchKey, searchParams],
        () => fetchFunction(searchParams)
    );

    if (error || genresError)
        return <p className='text-red-500'>Error: {error.message}</p>;

    if (!isLoading && !genresIsLoading && !data && !genres)
        return <p className='text-red-500'>No data found</p>;

    return (
        <>
            {headline && (
                <div className='flex justify-between items-center'>
                    <h1 className='text-lg font-bold'>{headline}</h1>
                    <div className='flex items-center gap-2'>
                        <Button
                            startContent={<ArrowUpDown size={16} />}
                            onPress={onFilterModalOpen}
                        >
                            Sort
                        </Button>
                        <Button
                            startContent={<SlidersHorizontal size={16} />}
                            onPress={onFilterModalOpen}
                        >
                            Filter
                        </Button>

                        <FormProvider {...methods}>
                            <FilterModal
                                isOpen={filterModalIsOpen}
                                onOpenChange={onFilterModalOpenChange}
                                genres={genres || []}
                                searchParams={searchParams}
                                setSearchParams={setSearchParams}
                                className={className}
                            />
                        </FormProvider>
                    </div>
                </div>
            )}
            <div className='grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4'>
                {isLoading
                    ? Array.from({ length: 8 }, (_, index) => (
                          <Skeleton key={index} />
                      ))
                    : data?.map((item: MediaBaseInterface) => (
                          <MediaCard
                              key={item.id}
                              content={item}
                          />
                      ))}
            </div>
        </>
    );
};

export { MediaGrid };
