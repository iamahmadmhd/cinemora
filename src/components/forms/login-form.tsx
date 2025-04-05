'use client';

import React, { useState } from 'react';
import { Form, Input, Button } from '@heroui/react';
import * as z from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';

// Define the schema for form validation using Zod
const schema = z
    .object({
        name: z.string().min(1, 'Name is required'),
        email: z.string().email({ message: 'Invalid email address' }),
        password: z
            .string()
            .min(8, 'Password must be at least 8 characters')
            .regex(
                /[A-Z]/,
                'Password must contain at least one uppercase letter'
            )
            .regex(/[^a-z]/gi, 'Password must contain at least one symbol'),
        confirmPassword: z.string().min(8, 'Confirm Password is required'),
        terms: z.boolean().refine((val) => val === true, {
            message: 'You must accept the terms',
        }),
    })
    .refine((data) => data.password === data.confirmPassword, {
        message: 'Passwords must match',
        path: ['confirmPassword'],
    });

type FormData = z.infer<typeof schema>;

export function LoginForm() {
    const [submitted, setSubmitted] = useState<FormData | null>(null);
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm({
        resolver: zodResolver(schema),
    });

    const onSubmit = (data: FormData) => {
        setSubmitted(data);
    };

    return (
        <Form
            className='w-full justify-center items-center space-y-4'
            onSubmit={handleSubmit(onSubmit)}
        >
            <div className='flex flex-col gap-8 w-full max-w-sm backdrop-blur-lg shadow-lg p-6 rounded-3xl bg-background/20'>
                <Input
                    isRequired
                    errorMessage={errors.email?.message}
                    label='Email'
                    labelPlacement='outside'
                    placeholder='Enter your email'
                    type='email'
                    variant='underlined'
                    {...register('email')}
                />

                <Input
                    isRequired
                    errorMessage={errors.password?.message}
                    label='Password'
                    labelPlacement='outside'
                    placeholder='Enter your password'
                    type='password'
                    variant='underlined'
                    {...register('password')}
                />

                <div className='flex gap-4'>
                    <Button
                        className='w-full'
                        color='primary'
                        type='submit'
                    >
                        Submit
                    </Button>
                </div>
            </div>

            {submitted && (
                <div className='text-small text-default-500 mt-4'>
                    Submitted data:{' '}
                    <pre>{JSON.stringify(submitted, null, 2)}</pre>
                </div>
            )}
        </Form>
    );
}
