'use client';

import { useTheme } from 'next-themes';
import { useEffect, useState } from 'react';
import { Button } from '@heroui/button';
import { Moon, Sun } from 'lucide-react';

export function ThemeSwitcher() {
    const [mounted, setMounted] = useState(false);
    const { resolvedTheme, setTheme } = useTheme();

    useEffect(() => {
        setMounted(true);
    }, []);

    if (!mounted) return null;

    return (
        <Button
            isIconOnly
            onPress={() => {
                setTheme(resolvedTheme === 'dark' ? 'light' : 'dark');
            }}
            variant='light'
            radius='full'
        >
            {resolvedTheme === 'dark' ? <Moon /> : <Sun />}
        </Button>
    );
}
