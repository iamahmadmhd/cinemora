'use client';

import { Form, Input, Checkbox, Button } from '@heroui/react';
import * as z from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { signup } from '@/app/actions';
import { useEffect, useState } from 'react';

// Define the schema for form validation using Zod
const schema = z
    .object({
        firstname: z.string().min(1, 'First name is required'),
        lastname: z.string().min(1, 'Last name is required'),
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

export type SignupFormProps = z.infer<typeof schema>;

export function SignupForm() {
    const {
        register,
        handleSubmit,
        reset,
        formState: { errors, isLoading },
    } = useForm({
        resolver: zodResolver(schema),
    });
    const [response, setResponse] = useState({
        visible: false,
        error: false,
        message: '',
    });

    const onSubmit = async (data: SignupFormProps) => {
        const { status, message } = await signup(data);
        if (status === 'error') {
            setResponse({
                visible: true,
                error: true,
                message: message,
            });
        } else {
            setResponse({
                visible: true,
                error: false,
                message: message,
            });
        }
    };

    useEffect(() => {
        if (!response.error) reset();
    }, [response]);

    return (
        <Form
            className='w-full justify-center items-center space-y-4'
            onSubmit={handleSubmit(onSubmit)}
        >
            <div className='flex flex-col gap-8 w-full max-w-sm backdrop-blur-lg shadow-lg p-6 rounded-3xl bg-background/20'>
                <Input
                    isRequired
                    errorMessage={errors.firstname?.message}
                    label='First name'
                    labelPlacement='outside'
                    placeholder='Enter your last name'
                    variant='underlined'
                    {...register('firstname')}
                />

                <Input
                    isRequired
                    errorMessage={errors.lastname?.message}
                    label='Last name'
                    labelPlacement='outside'
                    placeholder='Enter your last name'
                    variant='underlined'
                    {...register('lastname')}
                />

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

                <Input
                    isRequired
                    errorMessage={errors.confirmPassword?.message}
                    label='Confirm Password'
                    labelPlacement='outside'
                    placeholder='Re-enter your password'
                    type='password'
                    variant='underlined'
                    {...register('confirmPassword')}
                />

                <div className='flex flex-col gap-2'>
                    <Checkbox
                        color='primary'
                        classNames={{
                            label: 'text-small',
                            wrapper: 'before:border-foreground',
                        }}
                        {...register('terms')}
                    >
                        I agree to the terms and conditions
                    </Checkbox>
                    {errors.terms?.message && (
                        <span className='text-danger text-sm'>
                            {errors.terms.message}
                        </span>
                    )}
                </div>

                <div className='flex gap-4'>
                    <Button
                        className='w-full'
                        color='primary'
                        type='submit'
                        isLoading={isLoading}
                    >
                        Submit
                    </Button>
                </div>
            </div>
            {response.visible && (
                <div className='text-small text-default-500 mt-4'>
                    <span
                        className={
                            response.error ? 'text-danger' : 'text-success'
                        }
                    >
                        {response.message}
                    </span>
                </div>
            )}
        </Form>
    );
}
