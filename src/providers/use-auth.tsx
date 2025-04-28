'use client';

import { createContext, useContext } from 'react';
import type { User } from '@supabase/supabase-js';
import { Database } from '@/types/supabase';

export type Profile = Database['public']['Tables']['profiles']['Row'] | null;

type AuthContextType = {
    userPromise: Promise<User | null>;
    profilePromise?: Promise<Profile | null>;
};

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider = ({
    children,
    userPromise,
    profilePromise,
}: {
    children: React.ReactNode;
    userPromise: Promise<User | null>;
    profilePromise?: Promise<Profile | null>;
}) => {
    return (
        <AuthContext.Provider value={{ userPromise, profilePromise }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === null) {
        throw new Error('useAuth must be used within a AuthProvider');
    }
    return context;
};
