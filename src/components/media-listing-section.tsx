'use client';

import { Button } from '@heroui/button';
import useSWR from 'swr';
import { GenreType, MediaBaseInterface } from 'src/types/types';
import { ArrowUpDown, SlidersHorizontal } from 'lucide-react';
import { useState } from 'react';
import { useDisclosure } from '@heroui/use-disclosure';
import { FilterDrawer } from './ui/filter-drawer';
import { FormProvider, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { fetchGenres } from '@/app/actions';
import { cn } from '@/utils/classname';
import { MediaGrid } from './media-grid';

const filterSchema = z.object({
    keywords: z.string().optional(),
    genres: z.string().optional(),
    releaseYear: z
        .string()
        .regex(/^\d{4}$|^$/, 'Invalid year')
        .optional(),
    language: z.string().optional(),
    country: z.string().optional(),
});

export type FilterFormValues = z.infer<typeof filterSchema>;

interface MediaResponse {
    page: number;
    results: MediaBaseInterface[];
    totalPages: number;
    totalResults: number;
}

interface MediaGridProps {
    headline?: string;
    mediaType: string;
    fetchKey: string;
    fetchFunction: (searchParams?: Record<string, string>) => Promise<MediaResponse>;
    className?: string;
}

const MediaListingSection: React.FC<MediaGridProps> = ({
    headline,
    mediaType,
    fetchKey,
    fetchFunction,
    className,
}) => {
    const [searchParams, setSearchParams] = useState<Record<string, string> | undefined>(undefined);

    const {
        isOpen: FilterDrawerIsOpen,
        onOpen: onFilterDrawerOpen,
        onOpenChange: onFilterDrawerOpenChange,
    } = useDisclosure();

    const methods = useForm<FilterFormValues>({
        resolver: zodResolver(filterSchema),
        defaultValues: {},
    });

    const {
        data: genres,
        error: genresError,
        isLoading: genresIsLoading,
    } = useSWR<GenreType[]>('genres', () => fetchGenres(mediaType));

    const { data, error, isLoading } = useSWR<MediaResponse>([fetchKey, searchParams], () =>
        fetchFunction(searchParams)
    );

    if (error || genresError) return <p className='text-red-500'>Error: {error.message}</p>;

    if ((!isLoading && !data) || (!genresIsLoading && !genres))
        return <p className='text-red-500'>No data found</p>;

    return (
        <>
            <div className={cn('flex justify-between items-center', className)}>
                {headline && <h1 className='text-2xl font-bold'>{headline}</h1>}
                <div className='flex items-center gap-2'>
                    <Button
                        startContent={<SlidersHorizontal size={16} />}
                        onPress={onFilterDrawerOpen}
                    >
                        Filter
                    </Button>

                    <FormProvider {...methods}>
                        <FilterDrawer
                            isOpen={FilterDrawerIsOpen}
                            onOpenChange={onFilterDrawerOpenChange}
                            genres={genres ?? []}
                            setSearchParams={setSearchParams}
                        />
                    </FormProvider>
                </div>
            </div>
            <MediaGrid
                isLoading={isLoading}
                data={data?.results ?? []}
                pagination={{
                    total: data?.totalPages ?? 0,
                    page: data?.page ?? 1,
                    onChange: (page: string) => setSearchParams({ ...searchParams, page }),
                }}
            />
        </>
    );
};

export { MediaListingSection };
