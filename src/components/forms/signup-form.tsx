'use client';

import { Form, Input, Checkbox, Button } from '@heroui/react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useState, useTransition } from 'react';
import * as z from 'zod';
import { signup } from '@/app/actions';
import { useRouter } from 'next/navigation';
import { Eye, EyeOff } from 'lucide-react';

// Password validation rules
const passwordRules = {
    minLength: 8,
    requireUppercase: true,
    requireLowercase: true,
    requireNumber: true,
    requireSpecial: true,
};

// Validation schema
const signupSchema = z
    .object({
        firstname: z
            .string()
            .min(1, 'First name is required')
            .min(2, 'First name must be at least 2 characters')
            .max(50, 'First name must be less than 50 characters')
            .regex(/^[a-zA-Z\s-']+$/, 'First name contains invalid characters')
            .trim(),
        lastname: z
            .string()
            .min(1, 'Last name is required')
            .min(2, 'Last name must be at least 2 characters')
            .max(50, 'Last name must be less than 50 characters')
            .regex(/^[a-zA-Z\s-']+$/, 'Last name contains invalid characters')
            .trim(),
        email: z
            .string()
            .min(1, 'Email is required')
            .email('Invalid email address')
            .toLowerCase()
            .trim(),
        password: z
            .string()
            .min(
                passwordRules.minLength,
                `Password must be at least ${passwordRules.minLength} characters`
            )
            .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
            .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
            .regex(/[0-9]/, 'Password must contain at least one number')
            .regex(/[^A-Za-z0-9]/, 'Password must contain at least one special character'),
        confirmPassword: z.string().min(1, 'Please confirm your password'),
        terms: z.boolean().refine((val) => val === true, {
            message: 'You must accept the terms and conditions',
        }),
    })
    .refine((data) => data.password === data.confirmPassword, {
        message: 'Passwords do not match',
        path: ['confirmPassword'],
    });

type SignupFormValues = z.infer<typeof signupSchema>;

export function SignupForm() {
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
        watch,
        formState: { errors, isSubmitting },
    } = useForm<SignupFormValues>({
        resolver: zodResolver(signupSchema),
        mode: 'onBlur',
    });

    // Watch password for strength indicator
    const password = watch('password', '');

    const getPasswordStrength = (pwd: string): number => {
        let strength = 0;
        if (pwd.length >= passwordRules.minLength) strength++;
        if (/[A-Z]/.test(pwd)) strength++;
        if (/[a-z]/.test(pwd)) strength++;
        if (/[0-9]/.test(pwd)) strength++;
        if (/[^A-Za-z0-9]/.test(pwd)) strength++;
        return strength;
    };

    const passwordStrength = getPasswordStrength(password);

    const onSubmit = async (data: SignupFormValues) => {
        setResponse({ visible: false, error: false, message: '' });

        try {
            const result = await signup(data);
            console.log({ result });
            if (result.status === 200) {
                startTransition(() => {
                    reset();
                    router.push(`/verify?email=${data.email}`);
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
            console.error('Signup form error:', error);
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
            <div className='flex flex-col gap-6 w-full max-w-sm backdrop-blur-lg shadow-lg p-6 rounded-3xl bg-foreground/5'>
                <Input
                    isRequired
                    autoComplete='given-name'
                    errorMessage={errors.firstname?.message}
                    isInvalid={!!errors.firstname}
                    isDisabled={isLoading}
                    label='First name'
                    labelPlacement='outside'
                    placeholder='Enter your first name'
                    variant='bordered'
                    {...register('firstname')}
                />

                <Input
                    isRequired
                    autoComplete='family-name'
                    errorMessage={errors.lastname?.message}
                    isInvalid={!!errors.lastname}
                    isDisabled={isLoading}
                    label='Last name'
                    labelPlacement='outside'
                    placeholder='Enter your last name'
                    variant='bordered'
                    {...register('lastname')}
                />

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

                <div className='space-y-2'>
                    <Input
                        isRequired
                        autoComplete='new-password'
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
                    {password && !errors.password && (
                        <div className='space-y-1'>
                            <div className='flex gap-1'>
                                {[...Array(5)].map((_, i) => (
                                    <div
                                        key={i}
                                        className={`h-1 flex-1 rounded-full transition-colors ${
                                            i < passwordStrength
                                                ? passwordStrength <= 2
                                                    ? 'bg-danger'
                                                    : passwordStrength <= 3
                                                      ? 'bg-warning'
                                                      : 'bg-success'
                                                : 'bg-default-200'
                                        }`}
                                    />
                                ))}
                            </div>
                            <p className='text-xs text-default-500'>
                                {passwordStrength <= 2 && 'Weak password'}
                                {passwordStrength === 3 && 'Moderate password'}
                                {passwordStrength === 4 && 'Good password'}
                                {passwordStrength === 5 && 'Strong password'}
                            </p>
                        </div>
                    )}
                </div>

                <Input
                    isRequired
                    autoComplete='new-password'
                    errorMessage={errors.confirmPassword?.message}
                    isInvalid={!!errors.confirmPassword}
                    isDisabled={isLoading}
                    label='Confirm Password'
                    labelPlacement='outside'
                    placeholder='Re-enter your password'
                    type={isVisible ? 'text' : 'password'}
                    variant='bordered'
                    {...register('confirmPassword')}
                />

                <div className='flex flex-col gap-2'>
                    <Checkbox
                        color='primary'
                        classNames={{
                            label: 'text-small',
                            wrapper: 'before:border-foreground',
                        }}
                        isDisabled={isLoading}
                        {...register('terms')}
                    >
                        I agree to the terms and conditions
                    </Checkbox>
                    {errors.terms?.message && (
                        <span className='text-danger text-xs ml-6'>{errors.terms.message}</span>
                    )}
                </div>

                <Button
                    className='w-full'
                    color='primary'
                    type='submit'
                    isLoading={isLoading}
                    isDisabled={isLoading}
                >
                    {isLoading ? 'Creating account...' : 'Sign Up'}
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
