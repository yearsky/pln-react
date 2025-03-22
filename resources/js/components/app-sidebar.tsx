import { NavMain } from '@/components/nav-main';
import { Sidebar, SidebarContent,  SidebarFooter,  SidebarHeader, SidebarMenu, SidebarMenuButton, SidebarMenuItem } from '@/components/ui/sidebar';
import { type NavItem } from '@/types';
import { Link } from '@inertiajs/react';
import { LayoutGrid,PersonStanding,Settings } from 'lucide-react';
import AppLogo from './app-logo';
import {NavUser} from './nav-user';

const mainNavItems: NavItem[] = [
    {
        title: 'Dashboard',
        href: '/dashboard',
        icon: LayoutGrid,
    },
    {
        title: 'Pelanggan',
        href: '',
        icon: PersonStanding,
        items: [
            {
                title: 'Kolektif',
                href: '/pelanggan/kolektif',
            },
            {
                title: 'Escrow',
                href: '/pelanggan/escrow',
            },
        ],
    },
    {
        title: 'Maintenance',
        href: '',
        icon: Settings,
        items: [
            {
                title: 'User',
                href: '/maintenance/user',
            },
            {
                title: 'Vendor',
                href: '/maintenance/vendor',
            },
        ],
    },
];

export function AppSidebar() {
    return (
        <Sidebar collapsible="icon" variant="inset">
            <SidebarHeader>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton size="lg" asChild>
                            <Link href="/dashboard" prefetch>
                                <AppLogo />
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarHeader>

            <SidebarContent>
                <NavMain items={mainNavItems} />
            </SidebarContent>

            <SidebarFooter>
                {/* <NavFooter items={footerNavItems} className="mt-auto" /> */}
                <NavUser />
            </SidebarFooter>
        </Sidebar>
    );
}
