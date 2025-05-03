import type { Metadata } from 'next';
import '@fontsource-variable/open-sans';
import '@/styles/globals.css';
import { Providers } from '../providers/providers';
import { AuthProvider } from 'src/providers/use-auth';
import { fetchProfile, fetchUser } from '@/app/actions';

export const metadata: Metadata = {
    title: 'Cinemora',
    description: 'Your favorite app for listing your favorite movies and shows',
};

export default async function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    const userPromise = fetchUser();
    const profilePromise = fetchProfile();
    return (
        <html lang='en'>
            <body className='min-h-lvh'>
                <AuthProvider
                    userPromise={userPromise}
                    profilePromise={profilePromise}
                >
                    <Providers
                        themeProps={{
                            attribute: 'class',
                            defaultTheme: 'system',
                            disableTransitionOnChange: true,
                        }}
                    >
                        {children}
                    </Providers>
                </AuthProvider>
            </body>
        </html>
    );
}
