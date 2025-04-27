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
import { ComponentProps, ReactNode, use, useState } from 'react';
import { ThemeSwitcher } from '@/ui/theme-switcher';
import { Button } from '@heroui/button';
import { useAuth } from '../providers/use-auth';
import { Avatar } from '@heroui/avatar';
import {
    Dropdown,
    DropdownItem,
    DropdownMenu,
    DropdownTrigger,
} from '@heroui/dropdown';
import { signout } from '@/app/actions';

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
    const { userPromise, profilePromise } = useAuth();
    const isLoggedIn = !!use(userPromise);
    const profile = profilePromise ? use(profilePromise) : undefined;

    const renderNavItems = (items: NavItem[], className: string) =>
        items.map((item, index) => (
            <NavbarItem
                key={`${item.label}-${index}`}
                className={className}
            >
                <Link
                    as={Link}
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
                    as={Link}
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
            <NavbarItem>
                <Dropdown placement='bottom-end'>
                    <DropdownTrigger>
                        <Avatar
                            isBordered
                            as='button'
                            size='sm'
                            className='transition-transform cursor-pointer'
                            src={profile?.avatar ?? undefined}
                        />
                    </DropdownTrigger>
                    <DropdownMenu
                        aria-label='Profile Actions'
                        variant='flat'
                    >
                        <DropdownItem
                            key='email'
                            className='data-[hover=true]:bg-transparent cursor-auto'
                        >
                            {profile?.email}
                        </DropdownItem>
                        <DropdownItem
                            key='watchlist'
                            href='/watchlist'
                        >
                            Watchlist
                        </DropdownItem>
                        <DropdownItem
                            key='profile'
                            href='/profile'
                        >
                            Profile
                        </DropdownItem>
                        <DropdownItem
                            key='settings'
                            href='/settings'
                        >
                            Settings
                        </DropdownItem>
                        <DropdownItem
                            key='logout'
                            color='danger'
                            onPress={signout}
                        >
                            Log Out
                        </DropdownItem>
                    </DropdownMenu>
                </Dropdown>
            </NavbarItem>
        ) : (
            <NavbarItem>
                <Button
                    as={Link}
                    href='/login'
                    color='primary'
                    variant='flat'
                    size='sm'
                >
                    Login
                </Button>
            </NavbarItem>
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
