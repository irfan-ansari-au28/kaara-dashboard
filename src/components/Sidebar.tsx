import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from './ui/accordion';
import { ScrollArea } from './ui/scroll-area';
import { useMsal } from '@azure/msal-react';
import { ModeToggle } from './ModeToggle';
import { Cross2Icon } from '@radix-ui/react-icons';
import { Button } from './ui/button';

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
            { title: 'Leave', path: '/dashboard/leave' },
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

const Sidebar: React.FC<{ toggleDrawer: () => void }> = ({ toggleDrawer }) => {
    const location = useLocation();
    const { user } = useAuth();

    let sidebarItems: SidebarItem[] = userSidebarItems;

    if (user && user.role === 'admin') {
        sidebarItems = adminSidebarItems;
    }
    const { instance } = useMsal();

    const handleLogout = () => {
        console.log("MS Logout")
        instance.logoutRedirect({
            postLogoutRedirectUri: "/",
        });
    };

    return (
        <ScrollArea className="w-64 h-screen bg-secondary">
            <div className="p-4">
                <div className="p-2">
                    <div className='flex items-center justify-between'>
                        <img src="/src/assets/images/kaara-logo.png" alt="Kaara Logo" className="w-24  mb-4" />
                        <div className="block md:hidden">
                            <button className='' onClick={toggleDrawer}>
                                <Cross2Icon className="w-4 h-4 mr-2" />
                            </button>
                        </div>
                    </div>
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
                                            onClick={toggleDrawer}
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
                                onClick={toggleDrawer}
                            >
                                {item.title}
                            </Link>
                        )
                    ))}
                </Accordion>
            </div>
            <div className="p-2  mr-6 flex flex-col items-left absolute space-x-0 bottom-8 block md:hidden">
                <div className="flex items-center space-x-32 mt-2">
                    <Button variant="outline" onClick={handleLogout} >Logout</Button>
                    <ModeToggle />
                </div>
            </div>
        </ScrollArea>
    );
};

export default Sidebar;