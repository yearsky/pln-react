import { useState } from 'react';
import { Link } from '@inertiajs/react';
import { ChevronDown, ChevronRight } from 'lucide-react';
import { Icon } from '@/components/icon';
import { SidebarGroup, SidebarGroupContent, SidebarMenu, SidebarMenuItem } from '@/components/ui/sidebar';
import { type NavItem } from '@/types';
import { type ComponentPropsWithoutRef } from 'react';

export function NavFooter({
    items,
    className,
    ...props
}: ComponentPropsWithoutRef<typeof SidebarGroup> & {
    items: NavItem[];
}) {
    const [openMenus, setOpenMenus] = useState<{ [key: number]: boolean }>({});

    const toggleMenu = (index: number) => {
        setOpenMenus((prev) => ({
            ...prev,
            [index]: !prev[index],
        }));
    };

    return (
        <SidebarGroup {...props} className={`group-data-[collapsible=icon]:p-0 ${className || ''}`}>
            <SidebarGroupContent>
                <SidebarMenu>
                    {items.map((item, index) => (
                        <SidebarMenuItem key={item.title}>
                            {item.items ? (
                                <div>
                                    {/* Menu utama dengan tombol toggle */}
                                    <button
                                        onClick={() => toggleMenu(index)}
                                        className={`flex items-center gap-2 w-full p-2 text-sm font-medium rounded-md text-neutral-600 hover:text-neutral-800 hover:bg-gray-100 dark:text-neutral-300 dark:hover:text-neutral-100 dark:hover:bg-gray-700 ${
                                            item.isActive ? 'bg-gray-200 dark:bg-gray-600' : ''
                                        }`}
                                    >
                                        {item.icon && <Icon iconNode={item.icon} className="h-5 w-5" />}
                                        <span>{item.title}</span>
                                        {openMenus[index] ? (
                                            <ChevronDown className="h-4 w-4 ml-auto" />
                                        ) : (
                                            <ChevronRight className="h-4 w-4 ml-auto" />
                                        )}
                                    </button>
                                    {/* Submenu dengan indentasi */}
                                    {openMenus[index] && (
                                        <div className="ml-6 flex flex-col gap-1 mt-1">
                                            {item.items.map((subItem, subIndex) => (
                                                <Link
                                                    key={subIndex}
                                                    href={subItem.href}
                                                    className={`flex items-center gap-2 p-2 text-sm rounded-md text-neutral-600 hover:text-neutral-800 hover:bg-gray-100 dark:text-neutral-300 dark:hover:text-neutral-100 dark:hover:bg-gray-700 ${
                                                        subItem.isActive ? 'bg-gray-200 dark:bg-gray-600' : ''
                                                    }`}
                                                >
                                                    <span>{subItem.title}</span>
                                                </Link>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            ) : (
                                <Link
                                    href={item.href}
                                    className={`flex items-center gap-2 w-full p-2 text-sm font-medium rounded-md text-neutral-600 hover:text-neutral-800 hover:bg-gray-100 dark:text-neutral-300 dark:hover:text-neutral-100 dark:hover:bg-gray-700 ${
                                        item.isActive ? 'bg-gray-200 dark:bg-gray-600' : ''
                                    }`}
                                >
                                    {item.icon && <Icon iconNode={item.icon} className="h-5 w-5" />}
                                    <span>{item.title}</span>
                                </Link>
                            )}
                        </SidebarMenuItem>
                    ))}
                </SidebarMenu>
            </SidebarGroupContent>
        </SidebarGroup>
    );
}
