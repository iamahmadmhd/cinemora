'use client';

import { createClient } from '@/utils/supabase/client';
import { createContext, useContext, useState, useEffect } from 'react';
import type { Database } from '@/types/supabase';

type Profile = Database['public']['Tables']['profiles']['Row'] | null

const ProfileContext = createContext<{
    profile: Profile | null;
    setProfile: (p: Profile) => void;
}>({
    profile: null,
    setProfile: () => { },
});

const ProfileProvider = ({
    initialProfile,
    children,
}: {
    initialProfile: Profile;
    children: React.ReactNode;
}) => {
    const supabase = createClient();
    const [profile, setProfile] = useState<Profile>(initialProfile);

    // Optionally re-fetch on auth change
    useEffect(() => {
        const {
            data: { subscription },
        } = supabase.auth.onAuthStateChange(async (_event, session) => {
            if (session?.user) {
                const { data } = await supabase
                    .from('profiles')
                    .select('*')
                    .eq('user_id', session.user.id)
                    .single();
                setProfile(data);
            } else {
                setProfile(null);
            }
        });

        return () => subscription.unsubscribe();
    }, []);

    return (
        <ProfileContext.Provider value={{ profile, setProfile }}>
            {children}
        </ProfileContext.Provider>
    );
};

const useProfile = () => useContext(ProfileContext);

export { ProfileProvider, useProfile };
export type { Profile };
