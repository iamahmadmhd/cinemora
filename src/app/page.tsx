import { Header } from '@/components/header';
import { Button, ButtonGroup } from '@heroui/button';
import { Link } from '@heroui/link';
import { EmblaOptionsType } from 'embla-carousel';
import NextLink from 'next/link';
import { fetchTrendingMedia } from './actions';
import { MediaGrid } from '@/components/media-grid';

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
            <main>
                <div className='max-w-[1200px] mx-auto px-6 py-20'>
                    <MediaGrid
                        headline='Trending Now'
                        fetchKey='trending-media'
                        fetchFunction={fetchTrendingMedia}
                    />
                </div>
            </main>
        </>
    );
}
