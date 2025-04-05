import { Header } from '@/components/header';
import { Button } from '@heroui/button';
import { Link } from '@heroui/link';
import NextLink from 'next/link';
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
            <main className='max-w-[1200px] mx-auto px-6'>
                <section className='py-20'>
                    <h1 className='text-4xl font-bold mb-8'>
                        Welcome to Cinemora
                    </h1>
                    <p className='mb-8'>
                        Discover the latest movies and TV shows, all in one
                        place. Add your favorites to your lists, share your
                        lists with your friends and never miss a release!
                    </p>
                    <Button
                        as={NextLink}
                        href='/signup'
                        color='primary'
                    >
                        Get Started
                    </Button>
                </section>
                <TrendingSection />
            </main>
        </>
    );
}
