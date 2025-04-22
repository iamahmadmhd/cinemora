'use client';

import {
    Navbar,
    NavbarBrand,
    NavbarContent,
    NavbarItem,
    NavbarMenu,
    NavbarMenuItem,
    NavbarMenuToggle,
} from '@heroui/navbar';
import { Link } from '@heroui/link';
import NextLink from 'next/link';
import { ComponentProps, ReactNode, useState } from 'react';
import { ThemeSwitcher } from '@/ui/theme-switcher';
import { Button } from '@heroui/button';
import { useAuth } from '../providers/use-auth';

type NavItem = {
    label: string;
    href: string;
};

interface HeaderProps {
    logo?: ReactNode;
    navItems?: NavItem[];
    showButton?: boolean;
    className?: string;
    props?: ComponentProps<'nav'>;
}

const Header: React.FC<HeaderProps> = ({
    logo,
    navItems = [],
    showButton = true,
    className,
    ...props
}) => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const { isLoggedIn } = useAuth();

    const renderNavItems = (items: NavItem[], className: string) =>
        items.map((item, index) => (
            <NavbarItem
                key={`${item.label}-${index}`}
                className={className}
            >
                <Link
                    as={NextLink}
                    color='foreground'
                    size='sm'
                    href={item.href}
                >
                    {item.label}
                </Link>
            </NavbarItem>
        ));

    const renderMenuItems = (items: NavItem[]) =>
        items.map((item, index) => (
            <NavbarMenuItem key={`${item.label}-${index}`}>
                <Link
                    as={NextLink}
                    className='w-full'
                    color='foreground'
                    href={item.href}
                    size='md'
                >
                    {item.label}
                </Link>
            </NavbarMenuItem>
        ));

    const renderButton = () => {
        if (!showButton) return null;
        return isLoggedIn ? (
            <Button
                as={NextLink}
                href='/dashboard'
                color='primary'
                variant='flat'
                size='sm'
            >
                Dashboard
            </Button>
        ) : (
            <Button
                as={NextLink}
                href='/login'
                color='primary'
                variant='flat'
                size='sm'
            >
                Login
            </Button>
        );
    };

    return (
        <Navbar
            isBordered
            onMenuOpenChange={setIsMenuOpen}
            className={className}
            classNames={{
                wrapper: 'max-w-[1200px] mx-auto px-6 py-4',
            }}
            {...props}
        >
            <NavbarContent>
                {navItems.length > 0 && (
                    <NavbarMenuToggle
                        aria-label={isMenuOpen ? 'Close menu' : 'Open menu'}
                        className='sm:hidden'
                    />
                )}
                {logo && <NavbarBrand>{logo}</NavbarBrand>}
            </NavbarContent>
            <NavbarContent justify='end'>
                {renderNavItems(navItems, 'hidden sm:flex')}
                {renderButton()}
                <ThemeSwitcher />
            </NavbarContent>
            {navItems.length > 0 && (
                <NavbarMenu className='p-8'>
                    {renderMenuItems(navItems)}
                </NavbarMenu>
            )}
        </Navbar>
    );
};

export { type NavItem, type HeaderProps, Header };
