import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from './ui/accordion';
import { ScrollArea } from './ui/scroll-area';

interface SidebarSubItem {
    title: string;
    path: string;
}

interface SidebarItem {
    title: string;
    path: string;
    subitems?: SidebarSubItem[];
}

const userSidebarItems: SidebarItem[] = [
 
    {
        title: 'Dashboard',
        path: '/dashboard',
        subitems: [
            { title: 'Overview', path: '/dashboard/overview' },
            { title: 'Analytics', path: '/dashboard/analytics' },
        ],
    },
    {
        title: 'Timesheet',
        path: '/timesheet',
    },

    // Add more user items here
];

const adminSidebarItems: SidebarItem[] = [
    {
        title: 'Admin Dashboard',
        path: '/admin/dashboard',
        subitems: [
            { title: 'Overview', path: '/admin/dashboard/overview' },
            { title: 'Analytics', path: '/admin/dashboard/analytics' },
        ],
    },
    // Add more admin items here
];

const Sidebar: React.FC = () => {
    const location = useLocation();
    const { user } = useAuth();

    let sidebarItems: SidebarItem[] = userSidebarItems;

    if (user && user.role === 'admin') {
        sidebarItems = adminSidebarItems;
    }

    return (
        <ScrollArea className="w-64 h-screen bg-secondary">
            <div className="p-4">
                <div className="p-2">
                    <img src="/src/assets/images/kaara-logo.png" alt="Kaara Logo" className="w-24  mb-4" />
                </div>

                {/* <h1 className="text-2xl font-bold mb-4">Kaara</h1> */}
                <Accordion type="single" collapsible>
                    {sidebarItems.map((item, index) => (
                        item.subitems ? (
                            <AccordionItem key={index} value={`item-${index}`}>
                                <AccordionTrigger>{item.title}</AccordionTrigger>
                                <AccordionContent>
                                    {item.subitems.map((subitem, subIndex) => (
                                        <Link
                                            key={subIndex}
                                            to={subitem.path}
                                            className={`block py-2 px-4 ${location.pathname === subitem.path ? 'bg-primary text-primary-foreground' : ''
                                                }`}
                                        >
                                            {subitem.title}
                                        </Link>
                                    ))}
                                </AccordionContent>
                            </AccordionItem>
                        ) : (
                            <Link
                                key={index}
                                to={item.path}
                                className={`block py-2 px-4 mb-2 ${location.pathname === item.path ? 'bg-primary text-primary-foreground' : ''
                                    }`}
                            >
                                {item.title}
                            </Link>
                        )
                    ))}
                </Accordion>
            </div>
        </ScrollArea>
    );
};

export default Sidebar;