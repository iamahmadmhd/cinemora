import { Header } from '@/components/header';
import { Button } from '@heroui/button';
import { Link } from '@heroui/link';
import NextLink from 'next/link';

const navItems = [
    { label: 'Movies', href: '/movie' },
    { label: 'TV Shows', href: '/tv' },
];

export default function Layout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
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
                    {children}
                </div>
            </main>
        </>
    );
}
