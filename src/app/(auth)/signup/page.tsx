import { SignupForm } from '@/components/forms/signup-form';
import { Link } from '@heroui/link';
import NextLink from 'next/link';

export default function SignUpPage() {
    return (
        <div className='flex flex-col items-center justify-center gap-8 w-full'>
            <h1 className='text-2xl font-bold'>Sign Up</h1>
            <SignupForm />
            <p className='text-sm text-default-500'>
                Already have an account?{' '}
                <Link
                    as={NextLink}
                    href='/login'
                    className='text-primary-500 hover:underline'
                >
                    Login
                </Link>
            </p>
        </div>
    );
}
