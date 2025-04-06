'use client';

import { Form, Input, Button } from '@heroui/react';
import * as z from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { login } from '@/app/actions';
import { useState } from 'react';

// Define the schema for form validation using Zod
const schema = z.object({
    email: z.string().email({ message: 'Invalid email address' }),
    password: z
        .string()
        .min(8, 'Password must be at least 8 characters')
        .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
        .regex(/[^a-z]/gi, 'Password must contain at least one symbol'),
});

export type LoginFormProps = z.infer<typeof schema>;

export function LoginForm() {
    const {
        register,
        handleSubmit,
        formState: { errors, isLoading },
    } = useForm({
        resolver: zodResolver(schema),
    });
    const [response, setResponse] = useState({
        visible: false,
        error: false,
        message: '',
    });

    const onSubmit = async (data: LoginFormProps) => {
        const { status, message } = await login(data);
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
                        isLoading={isLoading}
                    >
                        Submit
                    </Button>
                </div>

                {response.visible && response.error && (
                    <div className='text-small text-default-500 mt-4'>
                        <span className='text-danger'>{response.message}</span>
                    </div>
                )}
            </div>
        </Form>
    );
}
