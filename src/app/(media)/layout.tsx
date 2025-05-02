import { Header } from '@/components/header';
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
                showButton
            />
            <main className='max-w-[1200px] mx-auto px-6 py-20'>{children}</main>
        </>
    );
}
