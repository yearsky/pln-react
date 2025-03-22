import { useState } from 'react';
import { Link } from '@inertiajs/react';
import { ChevronDown, ChevronRight } from 'lucide-react';
import { NavItem } from '@/types';

export function NavMain({ items }: { items: NavItem[] }) {
    // State untuk melacak menu mana yang sedang dibuka
    const [openMenus, setOpenMenus] = useState<{ [key: number]: boolean }>({});

    // Fungsi untuk toggle submenu
    const toggleMenu = (index: number) => {
        setOpenMenus((prev) => ({
            ...prev,
            [index]: !prev[index],
        }));
    };

    return (
        <nav className="flex flex-col gap-1">
            {items.map((item, index) => (
                <div key={index} className="w-full">
                    {item.items ? (
                        <div>
                            {/* Menu utama dengan tombol toggle */}
                            <button
                                onClick={() => toggleMenu(index)}
                                className={`flex items-center gap-2 w-full p-2 text-sm font-medium rounded-md hover:bg-gray-100 ${
                                    item.isActive ? 'bg-gray-200' : ''
                                }`}
                            >
                                {item.icon && <item.icon className="h-4 w-4" />}
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
                                            className={`flex items-center gap-2 p-2 text-sm rounded-md hover:bg-gray-100 ${
                                                subItem.isActive ? 'bg-gray-200' : ''
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
                            className={`flex items-center gap-2 p-2 text-sm font-medium rounded-md hover:bg-gray-100 ${
                                item.isActive ? 'bg-gray-200' : ''
                            }`}
                        >
                            {item.icon && <item.icon className="h-4 w-4" />}
                            <span>{item.title}</span>
                        </Link>
                    )}
                </div>
            ))}
        </nav>
    );
}
