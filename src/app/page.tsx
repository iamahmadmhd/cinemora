import { Header, HeaderContentProps } from '@/components/header';
import { Button } from '@heroui/button';
import { Link } from '@heroui/link';
import NextLink from 'next/link';

const headerContent: HeaderContentProps = {
    logo: (
        <Link
            as={NextLink}
            href='/'
            color='foreground'
            size='sm'
        >
            Cinemora
        </Link>
    ),
    nav: [
        { label: 'Profile', href: '/profile' },
        { label: 'Dashboard', href: '/dashboard' },
        { label: 'Activity', href: '/activity' },
        { label: 'Analytics', href: '/analytics' },
    ],
    button: (
        <Button
            as={NextLink}
            href='/login'
            color='primary'
            variant='flat'
            size='sm'
        >
            Login
        </Button>
    ),
};

export default function Home() {
    return (
        <>
            <Header content={headerContent} />
            <main className='h-[300vh]'>
                <div className='container max-w-4xl mx-auto pt-80 grid grid-cols-3 gap-2 text-background'></div>
            </main>
        </>
    );
}
