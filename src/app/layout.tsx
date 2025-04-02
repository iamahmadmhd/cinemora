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
            <body>
                <Providers>{children}</Providers>
            </body>
        </html>
    );
}
