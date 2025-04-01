import { Header, HeaderContentProps } from '@/components/header';
import { EmblaCarousel } from '@/components/trending';
import { Button } from '@heroui/button';
import { Link } from '@heroui/link';
import { EmblaOptionsType } from 'embla-carousel';
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

const OPTIONS: EmblaOptionsType = {
    align: 'start',
    dragFree: true,
    loop: true,
};

const SLIDE_COUNT = 5;
const SLIDES = Array.from(Array(SLIDE_COUNT).keys());

export default function Home() {
    return (
        <>
            <Header content={headerContent} />
            <main className='h-[300vh]'>
                <div className='container max-w-[1024px] mx-auto pt-80 px-6'>
                    <EmblaCarousel
                        slides={SLIDES}
                        options={OPTIONS}
                    />
                </div>
            </main>
        </>
    );
}
