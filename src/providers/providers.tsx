'use client';

import type { ThemeProviderProps } from 'next-themes';

import * as React from 'react';
import { HeroUIProvider } from '@heroui/system';
import { useRouter } from 'next/navigation';
import { ThemeProvider as NextThemesProvider } from 'next-themes';
import { ToastProvider } from '@heroui/toast';
import { AuthProvider } from 'src/providers/use-auth';
import { createClient } from '@/utils/supabase/client';
import { useEffect, useState } from 'react';
import { User } from '@supabase/supabase-js';

export interface ProvidersProps {
    children: React.ReactNode;
    themeProps?: ThemeProviderProps;
}

declare module '@react-types/shared' {
    interface RouterConfig {
        routerOptions: NonNullable<
            Parameters<ReturnType<typeof useRouter>['push']>[1]
        >;
    }
}

export function Providers({ children, themeProps }: ProvidersProps) {
    const supabase = createClient();
    const [user, setUser] = useState<User | null>(null);

    useEffect(() => {
        const fetchUser = async () => {
            const { data } = await supabase.auth.getUser();
            if (data) {
                setUser(data.user);
            }
        };
        fetchUser();
    });
    return (
        <AuthProvider user={user}>
            <HeroUIProvider>
                <NextThemesProvider {...themeProps}>
                    <ToastProvider />
                    {children}
                </NextThemesProvider>
            </HeroUIProvider>
        </AuthProvider>
    );
}
