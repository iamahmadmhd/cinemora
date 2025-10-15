'use client';

import { resendVerificationEmail } from '@/app/actions';

export function ResendOTP({ email }: { email: string }) {
    return (
        <button
            className='text-primary-500 hover:underline'
            onClick={() => resendVerificationEmail(email as string)}
        >
            Resend
        </button>
    );
}
