'use client';

import { Form } from '@heroui/form';
import { Button } from '@heroui/button';
import { InputOtp } from '@heroui/input-otp';
import { useForm } from 'react-hook-form';
import { useRouter } from 'next/navigation';
import { useEffect, useState, useTransition } from 'react';
import { verifyEmail } from '@/app/actions';

interface VerifyFormValues {
    email: string;
    token: string;
}

export function VerifyForm({ email }: { email: string }) {
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

    const {
        register,
        handleSubmit,
        reset,
        formState: { isSubmitting },
    } = useForm<VerifyFormValues>({
        mode: 'onBlur',
        defaultValues: {
            email,
            token: '',
        },
    });

    useEffect(() => {
        console.log({ email });
    }, [email]);

    const onSubmit = async (data: VerifyFormValues) => {
        setResponse({ visible: false, error: false, message: '' });

        try {
            const result = await verifyEmail(data.email, data.token);

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
            console.error('Veify form error:', error);
            setResponse({
                visible: true,
                error: true,
                message: 'An unexpected error occurred. Please try again.',
            });
        }
    };

    const isLoading = isPending || isSubmitting;

    return (
        <Form
            className='w-full justify-center items-center space-y-4'
            onSubmit={handleSubmit(onSubmit)}
        >
            <div className='flex flex-col items-center gap-6 w-full max-w-sm backdrop-blur-lg shadow-lg p-6 rounded-3xl bg-foreground/5'>
                <InputOtp
                    isRequired
                    aria-label='OTP input field'
                    length={6}
                    placeholder='Enter code'
                    {...register('token')}
                />
                <Button
                    className='w-full'
                    color='primary'
                    type='submit'
                    isLoading={isLoading}
                    isDisabled={isLoading}
                >
                    {isLoading ? 'Verifying...' : 'Verify'}
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
