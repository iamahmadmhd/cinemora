'use client';
import { Select, SelectItem } from '@heroui/select';
import { z } from 'zod';
import { Controller, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useEffect } from 'react';
import { SearchParams } from '../media-listing-section';

const sortSchema = z.object({
    name: z.string().optional(),
    order: z.enum(['asc', 'desc']),
});

type SortValues = z.infer<typeof sortSchema>;

interface SortPopoverProps {
    sortingOptions: Record<string, string>[];
    searchParams: SearchParams;
    setSearchParams: (items: SearchParams) => void;
}

const sortingOrders = [
    {
        key: 'asc',
        name: 'Ascending',
    },
    {
        key: 'desc',
        name: 'Descending',
    },
];

const SortPopover = ({ sortingOptions, searchParams, setSearchParams }: SortPopoverProps) => {
    const { control, watch } = useForm<SortValues>({
        resolver: zodResolver(sortSchema),
        defaultValues: {
            name: searchParams.sort?.name ?? '',
            order: searchParams.sort?.order ?? 'desc',
        },
    });

    useEffect(() => {
        const subscription = watch((values) => {
            setSearchParams({
                ...searchParams,
                sort: {
                    name: values.name ?? '',
                    order: values.order ?? 'desc',
                },
            });
        });
        return () => subscription.unsubscribe();
    }, [watch, searchParams, setSearchParams]);

    return (
        <>
            <Controller
                name='name'
                control={control}
                render={({
                    field: { name, value, onChange, onBlur, ref },
                    fieldState: { invalid, error },
                }) => (
                    <Select
                        items={sortingOptions}
                        validationBehavior='aria'
                        name={name}
                        ref={ref}
                        errorMessage={error?.message}
                        isInvalid={invalid}
                        defaultSelectedKeys={value?.split(',')}
                        onBlur={onBlur}
                        onChange={onChange}
                        label='Sort by'
                        placeholder='Select a sorting option'
                        variant='faded'
                        size='sm'
                        className='w-full md:w-3xs'
                    >
                        {sortingOptions.map((option) => (
                            <SelectItem key={option.key}>{option.name}</SelectItem>
                        ))}
                    </Select>
                )}
            />
            <Controller
                name='order'
                control={control}
                render={({
                    field: { name, value, onChange, onBlur, ref },
                    fieldState: { invalid, error },
                }) => {
                    return (
                        <Select
                            items={sortingOrders}
                            validationBehavior='aria'
                            name={name}
                            ref={ref}
                            errorMessage={error?.message}
                            isInvalid={invalid}
                            defaultSelectedKeys={value?.split(',')}
                            onBlur={onBlur}
                            onChange={onChange}
                            isDisabled={!searchParams.sort?.name.length}
                            label='Sort order'
                            placeholder='Select a sorting order'
                            variant='faded'
                            size='sm'
                            className='w-full md:w-3xs'
                        >
                            {sortingOrders.map((order) => (
                                <SelectItem key={order.key}>{order.name}</SelectItem>
                            ))}
                        </Select>
                    );
                }}
            />
        </>
    );
};

export { SortPopover };
