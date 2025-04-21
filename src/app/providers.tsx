import {
    Profile,
    ProfileProvider,
} from '@/components/providers/profile-provider';
import { createClient } from '@/utils/supabase/server';
import { ToastProvider } from '@heroui/toast';
import { HeroUIProvider } from '@heroui/system';
import { ThemeProvider as NextThemesProvider } from 'next-themes';

export async function Providers({ children }: { children: React.ReactNode }) {
    const supabase = await createClient();
    const {
        data: { user },
    } = await supabase.auth.getUser();
    const { data } = await supabase
        .from('profiles')
        .select()
        .eq('user_id', user?.id);
    const profile = data as Profile;

    return (
        <HeroUIProvider>
            <NextThemesProvider
                attribute='class'
                defaultTheme='system'
            >
                <ProfileProvider initialProfile={profile}>
                    <ToastProvider />
                    {children}
                </ProfileProvider>
            </NextThemesProvider>
        </HeroUIProvider>
    );
}
