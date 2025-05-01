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
import { Form } from '@heroui/react';
import { GenreType } from '@/types/types';
import { cn } from '@/utils/classname';
import { FilterFormValues } from '../media-listing-section';
import { FormEvent } from 'react';

interface FilterDrawerProps extends DrawerBodyProps {
    isOpen: boolean;
    onOpenChange: (isOpen: boolean) => void;
    genres: GenreType[];
    setSearchParams: (items: Record<string, string>) => void;
    className?: string;
}

const FilterDrawer = ({
    isOpen,
    onOpenChange,
    genres,
    setSearchParams,
    className,
    ...props
}: FilterDrawerProps) => {
    const { control, handleSubmit, reset, getValues } = useFormContext<FilterFormValues>();

    const onSubmit = (data: FilterFormValues) => {
        setSearchParams(Object.fromEntries(Object.entries(data)));
    };

    const onReset = (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        reset();
        setSearchParams({});
    };

    return (
        <Drawer
            isOpen={isOpen}
            onOpenChange={onOpenChange}
            className={cn(className)}
            {...props}
        >
            <DrawerContent>
                <Form
                    onReset={onReset}
                    onSubmit={handleSubmit(onSubmit)}
                >
                    <DrawerHeader className='flex flex-col gap-1 w-full'>Filter</DrawerHeader>
                    <DrawerBody className='w-full'>
                        <Controller
                            name='keywords'
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
                                    label='Search term'
                                    placeholder='Enter search term'
                                    variant='faded'
                                    type='text'
                                />
                            )}
                        />
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
                                <Select
                                    items={Object.keys(languages)
                                        .map((key) => ({ key }))
                                        .sort((a, b) =>
                                            languages[
                                                a.key as keyof typeof languages
                                            ].name.localeCompare(
                                                languages[b.key as keyof typeof languages].name
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
                                                languages[b as keyof typeof languages].name
                                            )
                                        )
                                        .map((lang) => (
                                            <SelectItem key={lang}>
                                                {languages[lang as keyof typeof languages].name}
                                            </SelectItem>
                                        ))}
                                </Select>
                            )}
                        />
                        <Controller
                            name='country'
                            control={control}
                            render={({
                                field: { name, value, onChange, onBlur, ref },
                                fieldState: { invalid, error },
                            }) => (
                                <Select
                                    items={Object.keys(countries)
                                        .map((key) => ({ key }))
                                        .sort((a, b) =>
                                            countries[
                                                a.key as keyof typeof countries
                                            ].name.localeCompare(
                                                countries[b.key as keyof typeof countries].name
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
                                                countries[b as keyof typeof countries].name
                                            )
                                        )
                                        .map((country) => (
                                            <SelectItem key={country}>
                                                {countries[country as keyof typeof countries].name}
                                            </SelectItem>
                                        ))}
                                </Select>
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
            </DrawerContent>
        </Drawer>
    );
};

export { FilterDrawer };
