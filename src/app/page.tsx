import { Header } from '@/components/header';
import { MediaSlider } from '@/components/media-slider';
import { Button } from '@heroui/button';
import { Link } from '@heroui/link';
import { EmblaOptionsType } from 'embla-carousel';
import NextLink from 'next/link';
import { fetchLatestMovies, fetchTrendingMedia } from './actions';

const navItems = [
    { label: 'Profile', href: '/profile' },
    { label: 'Dashboard', href: '/dashboard' },
    { label: 'Activity', href: '/activity' },
    { label: 'Analytics', href: '/analytics' },
];

const trendingSliderOptions: EmblaOptionsType = {
    dragFree: true,
    loop: true,
};

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
                <div className='max-w-[1024px] mx-auto py-20 px-6'>
                    <MediaSlider
                        headline='Trending now'
                        fetchKey='trinding-media'
                        sliderOptions={trendingSliderOptions}
                        fetchFunction={fetchTrendingMedia}
                    />
                </div>
                <div className='max-w-[1024px] mx-auto py-20 px-6'>
                    <MediaSlider
                        headline='Latest movies'
                        fetchKey='latest-movies'
                        sliderOptions={trendingSliderOptions}
                        fetchFunction={fetchLatestMovies}
                    />
                </div>
            </main>
        </>
    );
}
