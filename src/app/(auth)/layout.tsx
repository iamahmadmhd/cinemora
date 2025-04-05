import { Header } from '@/components/header';
import { Button } from '@heroui/button';
import { Link } from '@heroui/link';
import NextLink from 'next/link';

export default function Layout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <>
            <Header
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
            />
            <main className='max-w-[1200px] mx-auto px-6 py-20'>
                {children}
            </main>
        </>
    );
}
