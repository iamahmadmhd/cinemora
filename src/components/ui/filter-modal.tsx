'use client';

import {
    Drawer,
    DrawerContent,
    DrawerHeader,
    DrawerBody,
    DrawerFooter,
    DrawerBodyProps,
} from '@heroui/drawer';
import { Button } from '@heroui/button';
import { Input } from '@heroui/input';
import { countries, languages } from 'countries-list';
import { Select, SelectItem } from '@heroui/select';
import { Controller, useFormContext } from 'react-hook-form';
import React, { useEffect } from 'react';
import { Form } from '@heroui/react';
import { FilterFormValues } from '../media-grid';
import { GenreType } from '@/types/types';

interface FilterModalProps extends DrawerBodyProps {
    isOpen: boolean;
    onOpenChange: (isOpen: boolean) => void;
    genres: GenreType[];
    searchParams?: Record<string, string>;
    setSearchParams: (items: Record<string, string>) => void;
    className?: string;
}

const FilterModal = ({
    isOpen,
    onOpenChange,
    genres,
    searchParams,
    setSearchParams,
    className,
    ...props
}: FilterModalProps) => {
    const { control, handleSubmit } = useFormContext<FilterFormValues>();

    const handleFilterSubmit = (data: FilterFormValues) => {
        console.log('Form submitted:', data);
        setSearchParams(Object.fromEntries(Object.entries(data)));
    };

    useEffect(() => {
        console.log({ genres });
    });

    return (
        <Drawer
            isOpen={isOpen}
            onOpenChange={onOpenChange}
            {...props}
        >
            <DrawerContent>
                {(onClose) => (
                    <Form onSubmit={handleSubmit(handleFilterSubmit)}>
                        <DrawerHeader className='flex flex-col gap-1 w-full'>
                            Filter
                        </DrawerHeader>
                        <DrawerBody className='w-full'>
                            <Controller
                                name='genres'
                                control={control}
                                render={({
                                    field: {
                                        name,
                                        value,
                                        onChange,
                                        onBlur,
                                        ref,
                                    },
                                    fieldState: { invalid, error },
                                }) => (
                                    <Select
                                        items={genres}
                                        ref={ref}
                                        errorMessage={error?.message}
                                        validationBehavior='aria'
                                        isInvalid={invalid}
                                        name={name}
                                        defaultSelectedKeys={value?.split(',')}
                                        onBlur={onBlur}
                                        onChange={onChange}
                                        label='Genres'
                                        placeholder='Select genres'
                                        variant='faded'
                                        selectionMode='multiple'
                                    >
                                        {genres.map((genre) => (
                                            <SelectItem key={genre.id}>
                                                {genre.name}
                                            </SelectItem>
                                        ))}
                                    </Select>
                                )}
                            />
                            <Controller
                                name='releaseYear'
                                control={control}
                                render={({
                                    field: {
                                        name,
                                        value,
                                        onChange,
                                        onBlur,
                                        ref,
                                    },
                                    fieldState: { invalid, error },
                                }) => (
                                    <Input
                                        ref={ref}
                                        errorMessage={error?.message}
                                        validationBehavior='aria'
                                        isInvalid={invalid}
                                        name={name}
                                        defaultValue={value}
                                        onBlur={onBlur}
                                        onChange={onChange}
                                        label='Release Year'
                                        placeholder='Enter release year'
                                        variant='faded'
                                        type='text'
                                    />
                                )}
                            />
                            <Controller
                                name='language'
                                control={control}
                                render={({
                                    field: {
                                        name,
                                        value,
                                        onChange,
                                        onBlur,
                                        ref,
                                    },
                                    fieldState: { invalid, error },
                                }) => (
                                    <Select
                                        items={Object.keys(languages)
                                            .map((key) => ({ key }))
                                            .sort((a, b) =>
                                                languages[
                                                    a.key as keyof typeof languages
                                                ].name.localeCompare(
                                                    languages[
                                                        b.key as keyof typeof languages
                                                    ].name
                                                )
                                            )}
                                        ref={ref}
                                        errorMessage={error?.message}
                                        validationBehavior='aria'
                                        isInvalid={invalid}
                                        name={name}
                                        defaultSelectedKeys={value?.split(',')}
                                        onBlur={onBlur}
                                        onChange={onChange}
                                        label='Language'
                                        placeholder='Select language'
                                        variant='faded'
                                    >
                                        {Object.keys(languages)
                                            .sort((a, b) =>
                                                languages[
                                                    a as keyof typeof languages
                                                ].name.localeCompare(
                                                    languages[
                                                        b as keyof typeof languages
                                                    ].name
                                                )
                                            )
                                            .map((lang) => (
                                                <SelectItem key={lang}>
                                                    {
                                                        languages[
                                                            lang as keyof typeof languages
                                                        ].name
                                                    }
                                                </SelectItem>
                                            ))}
                                    </Select>
                                )}
                            />
                            <Controller
                                name='country'
                                control={control}
                                render={({
                                    field: {
                                        name,
                                        value,
                                        onChange,
                                        onBlur,
                                        ref,
                                    },
                                    fieldState: { invalid, error },
                                }) => (
                                    <Select
                                        items={Object.keys(countries)
                                            .map((key) => ({ key }))
                                            .sort((a, b) =>
                                                countries[
                                                    a.key as keyof typeof countries
                                                ].name.localeCompare(
                                                    countries[
                                                        b.key as keyof typeof countries
                                                    ].name
                                                )
                                            )}
                                        ref={ref}
                                        errorMessage={error?.message}
                                        validationBehavior='aria'
                                        isInvalid={invalid}
                                        name={name}
                                        defaultSelectedKeys={value?.split(',')}
                                        onBlur={onBlur}
                                        onChange={onChange}
                                        label='Country'
                                        placeholder='Select country'
                                        variant='faded'
                                    >
                                        {Object.keys(countries)
                                            .sort((a, b) =>
                                                countries[
                                                    a as keyof typeof countries
                                                ].name.localeCompare(
                                                    countries[
                                                        b as keyof typeof countries
                                                    ].name
                                                )
                                            )
                                            .map((country) => (
                                                <SelectItem key={country}>
                                                    {
                                                        countries[
                                                            country as keyof typeof countries
                                                        ].name
                                                    }
                                                </SelectItem>
                                            ))}
                                    </Select>
                                )}
                            />
                        </DrawerBody>
                        <DrawerFooter className='w-full'>
                            <Button
                                color='danger'
                                variant='flat'
                                onPress={onClose}
                            >
                                Close
                            </Button>
                            <Button
                                color='primary'
                                type='submit'
                            >
                                Apply
                            </Button>
                        </DrawerFooter>
                    </Form>
                )}
            </DrawerContent>
        </Drawer>
    );
};

export { FilterModal };
