import { VerifyForm } from '@/components/forms/verify-form';
import { ResendOTP } from '@/components/ui/resend-otp';

export default async function LoginPage({
    searchParams,
}: {
    searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
    const { email } = await searchParams;
    return (
        <div className='flex flex-col items-center justify-center gap-8 w-full'>
            <h1 className='text-2xl font-bold'>Verify Email</h1>
            <VerifyForm email={email as string} />
            <p className='text-sm text-default-500'>
                Didn&apos;t receive an email? <ResendOTP email={email as string} />
            </p>
        </div>
    );
}
