// components/AuthProvider.tsx
'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import type { User } from '@supabase/supabase-js';

type AuthContextType = {
    user: User | null;
    isLoggedIn: boolean;
};

const AuthContext = createContext<AuthContextType>({
    user: null,
    isLoggedIn: false,
});

export const AuthProvider = ({
    children,
    user,
}: {
    children: React.ReactNode;
    user: User | null;
}) => {
    const [isLoggedIn, setIsLoggedIn] = useState(false);

    useEffect(() => {
        if (user) {
            setIsLoggedIn(true);
        } else {
            setIsLoggedIn(false);
        }
    }, [user]);

    return (
        <AuthContext.Provider value={{ user, isLoggedIn: isLoggedIn }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
