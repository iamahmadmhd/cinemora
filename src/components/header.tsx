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

type HeaderContentProps = {
    logo?: ReactNode;
    nav?: NavItem[];
    button?: ReactNode;
};

interface HeaderProps {
    content: HeaderContentProps;
    className?: string;
    props?: ComponentProps<'nav'>;
}

const Header: React.FC<HeaderProps> = ({ content, className, ...props }) => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    return (
        <Navbar
            isBordered
            onMenuOpenChange={setIsMenuOpen}
            className={className}
            {...props}
        >
            <NavbarContent>
                {content?.nav?.length && (
                    <NavbarMenuToggle
                        aria-label={isMenuOpen ? 'Close menu' : 'Open menu'}
                        className='sm:hidden'
                    />
                )}
                {content.logo && <NavbarBrand>{content.logo}</NavbarBrand>}
            </NavbarContent>
            <NavbarContent justify='end'>
                {content?.nav?.map((item, index) => (
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
                {content.button && <NavbarItem>{content.button}</NavbarItem>}
            </NavbarContent>
            {content?.nav?.length && (
                <NavbarMenu className='p-8'>
                    {content?.nav?.map((item, index) => (
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

export { type NavItem, type HeaderContentProps, type HeaderProps, Header };
