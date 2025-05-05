'use client';

import {
    Drawer,
    DrawerContent,
    DrawerHeader,
    DrawerBody,
    DrawerFooter,
    DrawerBodyProps,
} from '@heroui/drawer';
import { Autocomplete, AutocompleteSection, AutocompleteItem } from '@heroui/autocomplete';
import { Button } from '@heroui/button';
import { Input } from '@heroui/input';
import { countries, languages } from 'countries-list';
import { Select, SelectItem } from '@heroui/select';
import { Controller, useFormContext } from 'react-hook-form';
import { Form, useDisclosure } from '@heroui/react';
import { GenreType } from '@/types/types';
import { cn } from '@/utils/classname';
import { FilterFormValues, SearchParams } from '../media-listing-section';
import { FormEvent } from 'react';
import { SlidersHorizontal } from 'lucide-react';

interface FilterDrawerProps extends DrawerBodyProps {
    genres: GenreType[];
    searchParams: SearchParams;
    setSearchParams: (items: SearchParams) => void;
    className?: string;
}

const FilterDrawer = ({
    genres,
    searchParams,
    setSearchParams,
    className,
    ...props
}: FilterDrawerProps) => {
    const { isOpen, onOpen, onOpenChange } = useDisclosure();
    const { control, handleSubmit, reset } = useFormContext<FilterFormValues>();

    const onSubmit = (data: FilterFormValues, onClose: () => void) => {
        setSearchParams({ ...searchParams, ...Object.fromEntries(Object.entries(data)) });
        onClose();
    };

    const onReset = (event: FormEvent<HTMLFormElement>, onClose: () => void) => {
        event.preventDefault();
        reset();
        setSearchParams({});
        onClose();
    };

    return (
        <>
            <Button
                size='lg'
                startContent={<SlidersHorizontal />}
                onPress={onOpen}
                color='primary'
                className='w-full md:w-auto'
            >
                Filter
            </Button>
            <Drawer
                isOpen={isOpen}
                onOpenChange={onOpenChange}
                autoFocus={false}
                motionProps={{
                    variants: {
                        enter: {
                            opacity: 1,
                            x: 0,
                        },
                        exit: {
                            x: 100,
                            opacity: 0,
                        },
                    },
                }}
                className={cn(className)}
                {...props}
            >
                <DrawerContent>
                    {(onClose) => (
                        <Form
                            onReset={(data) => onReset(data, onClose)}
                            onSubmit={handleSubmit((data) => onSubmit(data, onClose))}
                        >
                            <DrawerHeader className='flex flex-col gap-1 w-full'>
                                Filter
                            </DrawerHeader>
                            <DrawerBody className='w-full'>
                                <Controller
                                    name='genres'
                                    control={control}
                                    render={({
                                        field: { name, value, onChange, onBlur, ref },
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
                                                <SelectItem key={genre.id}>{genre.name}</SelectItem>
                                            ))}
                                        </Select>
                                    )}
                                />
                                <Controller
                                    name='releaseYear'
                                    control={control}
                                    render={({
                                        field: { name, value, onChange, onBlur, ref },
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
                                            isClearable
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
                                        field: { name, value, onChange, onBlur, ref },
                                        fieldState: { invalid, error },
                                    }) => (
                                        <Autocomplete
                                            defaultItems={Object.keys(languages)
                                                .map((key) => ({ key }))
                                                .sort((a, b) =>
                                                    languages[
                                                        a.key as keyof typeof languages
                                                    ].name.localeCompare(
                                                        languages[b.key as keyof typeof languages]
                                                            .name
                                                    )
                                                )}
                                            ref={ref}
                                            errorMessage={error?.message}
                                            validationBehavior='aria'
                                            isInvalid={invalid}
                                            name={name}
                                            defaultSelectedKey={value ?? undefined}
                                            onSelectionChange={onChange}
                                            onBlur={onBlur}
                                            label='Language'
                                            placeholder='Select language'
                                            variant='faded'
                                        >
                                            {Object.keys(languages)
                                                .sort((a, b) =>
                                                    languages[
                                                        a as keyof typeof languages
                                                    ].name.localeCompare(
                                                        languages[b as keyof typeof languages].name
                                                    )
                                                )
                                                .map((lang) => (
                                                    <AutocompleteItem key={lang}>
                                                        {
                                                            languages[
                                                                lang as keyof typeof languages
                                                            ].name
                                                        }
                                                    </AutocompleteItem>
                                                ))}
                                        </Autocomplete>
                                    )}
                                />
                                <Controller
                                    name='country'
                                    control={control}
                                    render={({
                                        field: { name, value, onChange, onBlur, ref },
                                        fieldState: { invalid, error },
                                    }) => (
                                        <Autocomplete
                                            defaultItems={Object.keys(countries)
                                                .map((key) => ({ key }))
                                                .sort((a, b) =>
                                                    countries[
                                                        a.key as keyof typeof countries
                                                    ].name.localeCompare(
                                                        countries[b.key as keyof typeof countries]
                                                            .name
                                                    )
                                                )}
                                            ref={ref}
                                            errorMessage={error?.message}
                                            validationBehavior='aria'
                                            isInvalid={invalid}
                                            name={name}
                                            defaultSelectedKey={value ?? undefined}
                                            onBlur={onBlur}
                                            onSelectionChange={onChange}
                                            label='Country'
                                            placeholder='Select country'
                                            variant='faded'
                                        >
                                            {Object.keys(countries)
                                                .sort((a, b) =>
                                                    countries[
                                                        a as keyof typeof countries
                                                    ].name.localeCompare(
                                                        countries[b as keyof typeof countries].name
                                                    )
                                                )
                                                .map((country) => (
                                                    <AutocompleteItem key={country}>
                                                        {
                                                            countries[
                                                                country as keyof typeof countries
                                                            ].name
                                                        }
                                                    </AutocompleteItem>
                                                ))}
                                        </Autocomplete>
                                    )}
                                />
                            </DrawerBody>
                            <DrawerFooter className='w-full'>
                                <Button
                                    color='danger'
                                    variant='light'
                                    type='reset'
                                >
                                    Clear Filters
                                </Button>
                                <Button
                                    color='primary'
                                    variant='light'
                                    type='submit'
                                >
                                    Apply Filters
                                </Button>
                            </DrawerFooter>
                        </Form>
                    )}
                </DrawerContent>
            </Drawer>
        </>
    );
};

export { FilterDrawer };
