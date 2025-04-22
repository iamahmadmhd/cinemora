import type { Metadata } from 'next';
import '@fontsource-variable/open-sans';
import '@/styles/globals.css';
import { Providers } from '../providers/providers';
import { AuthProvider } from 'src/providers/use-auth';
import { createClient } from '@/utils/supabase/server';

export const metadata: Metadata = {
    title: 'Cinemora',
    description: 'Your favorite app for listing your favorite movies and shows',
};

export default async function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang='en'>
            <body className='bg-[url("/page-background.svg")] bg-fixed bg-cover min-h-lvh'>
                <Providers
                    themeProps={{
                        attribute: 'class',
                        defaultTheme: 'system',
                    }}
                >
                    {children}
                </Providers>
            </body>
        </html>
    );
}
