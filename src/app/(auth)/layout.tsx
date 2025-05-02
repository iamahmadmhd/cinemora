import { Header } from '@/components/header';
import { createClient } from '@/utils/supabase/server';
import { Link } from '@heroui/link';
import NextLink from 'next/link';
import { redirect } from 'next/navigation';

export default async function Layout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    const supabase = await createClient();

    const { data } = await supabase.auth.getUser();
    if (data?.user) {
        redirect('/watchlist');
    }
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
                showButton={false}
            />
            <main className='max-w-[1200px] mx-auto px-6 py-20'>{children}</main>
        </>
    );
}
