'use client';

import { Form, Input, Button } from '@heroui/react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
import { useState, useTransition } from 'react';
import * as z from 'zod';
import { login } from '@/app/actions';
import { Eye, EyeOff } from 'lucide-react';

// Validation schema
const loginSchema = z.object({
    email: z
        .string()
        .min(1, 'Email is required')
        .email('Invalid email address')
        .toLowerCase()
        .trim(),
    password: z
        .string()
        .min(1, 'Password is required')
        .min(8, 'Password must be at least 8 characters'),
});

type LoginFormValues = z.infer<typeof loginSchema>;

export function LoginForm() {
    const router = useRouter();
    const [isPending, startTransition] = useTransition();
    const [response, setResponse] = useState<{
        visible: boolean;
        error: boolean;
        message: string;
    }>({
        visible: false,
        error: false,
        message: '',
    });
    const [isVisible, setIsVisible] = useState(false);

    const toggleVisibility = () => setIsVisible(!isVisible);

    const {
        register,
        handleSubmit,
        reset,
        formState: { errors, isSubmitting },
    } = useForm<LoginFormValues>({
        resolver: zodResolver(loginSchema),
        mode: 'onBlur',
    });

    const onSubmit = async (data: LoginFormValues) => {
        setResponse({ visible: false, error: false, message: '' });

        try {
            const result = await login(data);

            if (result.status === 200) {
                startTransition(() => {
                    reset();
                    router.push('/watchlist');
                    router.refresh();
                });
            } else {
                setResponse({
                    visible: true,
                    error: true,
                    message: result.message,
                });
            }
        } catch (error) {
            console.error('Login form error:', error);
            setResponse({
                visible: true,
                error: true,
                message: 'An unexpected error occurred. Please try again.',
            });
        }
    };

    const isLoading = isSubmitting || isPending;

    return (
        <Form
            className='w-full justify-center items-center space-y-4'
            onSubmit={handleSubmit(onSubmit)}
        >
            <div className='flex flex-col gap-8 w-full max-w-sm backdrop-blur-lg shadow-lg p-6 rounded-3xl bg-foreground/5'>
                <Input
                    isRequired
                    autoComplete='email'
                    errorMessage={errors.email?.message}
                    isInvalid={!!errors.email}
                    isDisabled={isLoading}
                    label='Email'
                    labelPlacement='outside'
                    placeholder='Enter your email'
                    type='email'
                    variant='bordered'
                    {...register('email')}
                />

                <Input
                    isRequired
                    autoComplete='current-password'
                    errorMessage={errors.password?.message}
                    isInvalid={!!errors.password}
                    isDisabled={isLoading}
                    label='Password'
                    labelPlacement='outside'
                    placeholder='Enter your password'
                    type={isVisible ? 'text' : 'password'}
                    variant='bordered'
                    endContent={
                        <button
                            aria-label='toggle password visibility'
                            className='focus:outline-solid outline-transparent'
                            type='button'
                            onClick={toggleVisibility}
                        >
                            {isVisible ? <EyeOff /> : <Eye />}
                        </button>
                    }
                    {...register('password')}
                />

                <Button
                    className='w-full'
                    color='primary'
                    type='submit'
                    isLoading={isLoading}
                    isDisabled={isLoading}
                >
                    {isLoading ? 'Signing in...' : 'Sign In'}
                </Button>

                {response.visible && (
                    <div
                        className={`text-sm text-center p-3 rounded-lg ${
                            response.error
                                ? 'bg-danger-50 text-danger'
                                : 'bg-success-50 text-success'
                        }`}
                        role='alert'
                        aria-live='polite'
                    >
                        {response.message}
                    </div>
                )}
            </div>
        </Form>
    );
}
