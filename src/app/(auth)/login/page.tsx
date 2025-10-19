import { LoginForm } from '@/components/forms/login-form';
import { Link } from '@heroui/link';
import { Metadata } from 'next';
import NextLink from 'next/link';

export const metadata: Metadata = {
    title: 'Login - Cinemora',
    description: 'Browse your favorite TV shows on Cinemora and add them to your watchlist',
};

export default function LoginPage() {
    return (
        <div className='flex flex-col items-center justify-center gap-8 w-full'>
            <h1 className='text-2xl font-bold'>Login</h1>
            <LoginForm />
            <p className='text-sm text-default-500'>
                Don&apos;t have an account?{' '}
                <Link
                    as={NextLink}
                    href='/signup'
                    className='text-primary-500 hover:underline'
                >
                    Sign up
                </Link>
            </p>
        </div>
    );
}
