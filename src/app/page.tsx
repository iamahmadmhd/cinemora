import { Header } from '@/components/header';
import { Button } from '@heroui/button';
import { Link } from '@heroui/link';
import NextLink from 'next/link';
import { TrendingSection } from '@/components/trending-section';
import { Image } from '@heroui/image';
import NextImage from 'next/image';

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
                <section className='py-20 relative min-h-96'>
                    <div className='max-w-[800px] relative z-30 mx-auto px-6 flex flex-col justify-center items-center'>
                        <h1 className='text-4xl text-center font-bold mb-8'>
                            Welcome to Cinemora
                        </h1>
                        <p className='mb-8 text-center'>
                            Discover the latest movies and TV shows, all in one
                            place. Add your favorites to your watchlist and
                            never miss a release!
                        </p>
                        <Button
                            as={NextLink}
                            href='/signup'
                            color='primary'
                        >
                            Get Started
                        </Button>
                    </div>
                    <div className='absolute inset-0 bg-gradient-to-b from-background to-background/60 z-20' />
                    <Image
                        as={NextImage}
                        src='/images/hero-image.jpg'
                        alt='cinemora hero section'
                        className='object-cover'
                        fill
                        removeWrapper
                    />
                </section>
                <div className='max-w-[1200px] mx-auto px-6'>
                    <TrendingSection />
                </div>
            </main>
        </>
    );
}
