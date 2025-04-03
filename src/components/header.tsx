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
import { ComponentProps, ReactNode, useState } from 'react';

type NavItem = {
    label: string;
    href: string;
};

interface HeaderProps {
    logo?: ReactNode;
    navItems?: NavItem[];
    button?: ReactNode;
    className?: string;
    props?: ComponentProps<'nav'>;
}

const Header: React.FC<HeaderProps> = ({
    logo,
    navItems,
    button,
    className,
    ...props
}) => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    return (
        <Navbar
            isBordered
            onMenuOpenChange={setIsMenuOpen}
            className={className}
            {...props}
        >
            <NavbarContent>
                {navItems?.length && (
                    <NavbarMenuToggle
                        aria-label={isMenuOpen ? 'Close menu' : 'Open menu'}
                        className='sm:hidden'
                    />
                )}
                {logo && <NavbarBrand>{logo}</NavbarBrand>}
            </NavbarContent>
            <NavbarContent justify='end'>
                {navItems?.map((item, index) => (
                    <NavbarItem
                        key={`${item}-${index}`}
                        className='hidden sm:flex'
                    >
                        <Link
                            color='foreground'
                            size='sm'
                            href={item.href}
                        >
                            {item.label}
                        </Link>
                    </NavbarItem>
                ))}
                {button && <NavbarItem>{button}</NavbarItem>}
            </NavbarContent>
            {navItems?.length && (
                <NavbarMenu className='p-8'>
                    {navItems?.map((item, index) => (
                        <NavbarMenuItem key={`${item}-${index}`}>
                            <Link
                                className='w-full'
                                color='foreground'
                                href={item.href}
                                size='md'
                            >
                                {item.label}
                            </Link>
                        </NavbarMenuItem>
                    ))}
                </NavbarMenu>
            )}
        </Navbar>
    );
};

export { type NavItem, type HeaderProps, Header };
