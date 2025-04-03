import { Header } from '@/components/header';
import { MediaSlider } from '@/components/trending';
import { Button } from '@heroui/button';
import { Link } from '@heroui/link';
import { EmblaOptionsType } from 'embla-carousel';
import NextLink from 'next/link';

const navItems = [
    { label: 'Profile', href: '/profile' },
    { label: 'Dashboard', href: '/dashboard' },
    { label: 'Activity', href: '/activity' },
    { label: 'Analytics', href: '/analytics' },
];

const mediaSliderOptions: EmblaOptionsType = {
    //align: 'start',
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
            <main className='h-[300vh]'>
                <div className='max-w-[1024px] mx-auto pt-10 px-6'>
                    <MediaSlider options={mediaSliderOptions} />
                </div>
            </main>
        </>
    );
}
