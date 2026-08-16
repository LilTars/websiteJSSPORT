import { Link, usePage } from '@inertiajs/react';
import { FileText, Footprints, Image, LayoutGrid, Package, Tags, Users } from 'lucide-react';
import AppLogo from '@/components/app-logo';
import { NavFooter } from '@/components/nav-footer';
import { NavMain } from '@/components/nav-main';
import { NavUser } from '@/components/nav-user';
import { TeamSwitcher } from '@/components/team-switcher';
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
} from '@/components/ui/sidebar';
import { dashboard } from '@/routes';
import type { NavItem } from '@/types';

export function AppSidebar() {
    const page = usePage();
    const teamSlug = page.props.currentTeam?.slug;
    const dashboardUrl = teamSlug ? dashboard(teamSlug) : '/';
    const backofficePath = (module: string): string => (teamSlug ? `/${teamSlug}/backoffice/${module}` : '#');

    const mainNavItems: NavItem[] = [
        {
            title: 'Dashboard',
            href: dashboardUrl,
            icon: LayoutGrid,
        },
        {
            title: 'จัดการผู้ใช้งาน',
            href: backofficePath('members'),
            icon: Users,
        },
        {
            title: 'จัดการแบร์นเนอร์',
            href: backofficePath('banners'),
            icon: Image,
        },
        {
            title: 'จัดการประเภทสินค้า',
            href: backofficePath('product-categories'),
            icon: Tags,
        },
        {
            title: 'จัดการแบร์นสินค้า',
            href: backofficePath('brands'),
            icon: Footprints,
        },
        {
            title: 'จัดการข้อมูลสินค้า',
            href: backofficePath('products'),
            icon: Package,
        },
        {
            title: 'ประกาศรับสมัคร',
            href: backofficePath('job-postings'),
            icon: FileText,
        },
    ];

    const footerNavItems: NavItem[] = [];

    return (
        <Sidebar collapsible="icon" variant="inset">
            <SidebarHeader>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton size="lg" asChild>
                            <Link href={dashboardUrl} prefetch>
                                <AppLogo />
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <TeamSwitcher disabled />
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarHeader>

            <SidebarContent>
                <NavMain items={mainNavItems} />
            </SidebarContent>

            <SidebarFooter>
                <NavFooter items={footerNavItems} className="mt-auto" />
                <NavUser />
            </SidebarFooter>
        </Sidebar>
    );
}
