import { Header } from '@/components/header';
import { Button, ButtonGroup } from '@heroui/button';
import { Link } from '@heroui/link';
import NextLink from 'next/link';
import { fetchTrendingMedia } from './actions';
import { MediaGrid } from '@/components/media-grid';
import { TrendingSection } from '@/components/trending-section';

const navItems = [
    { label: 'Movies', href: '/movie' },
    { label: 'TV Shows', href: '/tv' },
];

export default function Home() {
    return (
        <>
            <Header
                navItems={navItems}
                logo={
                    <Link
                        as={NextLink}
                        href='/'
                        color='foreground'
                        size='sm'
                    >
                        Cinemora
                    </Link>
                }
                button={
                    <Button
                        as={NextLink}
                        href='/login'
                        color='primary'
                        variant='flat'
                        size='sm'
                    >
                        Login
                    </Button>
                }
            />
            <main className='max-w-[1200px] mx-auto px-6 py-20'>
                <TrendingSection />
            </main>
        </>
    );
}
