import type { Metadata } from 'next';
import '@fontsource-variable/open-sans';
import '@/styles/globals.css';
import { Providers } from './providers';

export const metadata: Metadata = {
    title: 'Cinemora',
    description: 'Your favorite app for listing your favorite movies and shows',
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang='en'>
            <body className='bg-[url("/page-background.svg")] bg-fixed bg-cover min-h-lvh'>
                <Providers>{children}</Providers>
            </body>
        </html>
    );
}
