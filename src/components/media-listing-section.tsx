'use client';

import useSWR from 'swr';
import { GenreType, MediaBaseInterface } from 'src/types/types';
import { useState } from 'react';
import { FilterDrawer } from './ui/filter-drawer';
import { FormProvider, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { fetchGenres } from '@/app/actions';
import { cn } from '@/utils/classname';
import { MediaGrid } from './media-grid';
import { SortPopover } from './ui/sort-popover';

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

interface MediaListingSectionProps {
    headline?: string;
    mediaType: string;
    fetchKey: string;
    fetchFunction: (searchParams?: SearchParams) => Promise<MediaResponse>;
    className?: string;
}

const sortingOptions = [
    {
        key: 'original_title',
        name: 'Original Title',
    },
    {
        key: 'popularity',
        name: 'Popularity',
    },
    {
        key: 'primary_release_date',
        name: 'Release Date',
    },
    {
        key: 'title',
        name: 'Title',
    },
    {
        key: 'vote_average',
        name: 'Vote Average',
    },
];

export type SearchParams = {
    genres?: string;
    releaseYear?: string;
    language?: string;
    country?: string;
    sort?: {
        name: string;
        order: 'desc' | 'asc';
    };
    page?: string;
};

const MediaListingSection: React.FC<MediaListingSectionProps> = ({
    headline,
    mediaType,
    fetchKey,
    fetchFunction,
    className,
}) => {
    const [searchParams, setSearchParams] = useState<SearchParams>({});

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
            <div
                className={cn(
                    'grid grid-cols-1 lg:grid-cols-3 justify-between items-center gap-y-8',
                    className
                )}
            >
                {headline && <h1 className='text-2xl font-bold'>{headline}</h1>}
                <div className='md:col-span-2 flex flex-wrap justify-end items-center gap-2'>
                    <SortPopover
                        sortingOptions={sortingOptions}
                        searchParams={searchParams ?? {}}
                        setSearchParams={setSearchParams}
                    />
                    <FormProvider {...methods}>
                        <FilterDrawer
                            genres={genres ?? []}
                            searchParams={searchParams}
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
