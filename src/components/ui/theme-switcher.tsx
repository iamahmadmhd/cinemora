'use client';

import { useTheme } from 'next-themes';
import { useEffect, useState } from 'react';
import { Button } from '@heroui/button';
import { Moon, Sun } from 'lucide-react';

export function ThemeSwitcher() {
    const [mounted, setMounted] = useState(false);
    const { theme, setTheme } = useTheme();

    useEffect(() => {
        setMounted(true);
    }, []);

    if (!mounted) return null;

    return (
        <Button
            isIconOnly
            onPress={() => {
                setTheme(theme === 'dark' ? 'light' : 'dark');
            }}
            variant='light'
            color='secondary'
            size='sm'
        >
            {theme === 'dark' ? <Moon size='1rem' /> : <Sun size='1rem' />}
        </Button>
    );
}
