import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ArrowLeft, LogOut, LayoutDashboard, Settings, ChevronRight } from 'lucide-react';
import LogoBlack from '@/assets/Images/LogoBlack.png';
import LogoIcon from '@/assets/Images/LogoIcon.png';
import { navigationMap } from '@/constants/navigation';

interface SidebarProps {
    isOpen: boolean;
}

const NavGroup = ({ item, location, isOpen }: { item: any; location: any; isOpen: boolean }) => {
    const isActiveGroup = item.items.some((subItem: any) => 
        location.pathname === subItem.path || 
        (subItem.path !== '/' && location.pathname.startsWith(subItem.path))
    );

    const [isExpanded, setIsExpanded] = useState(false);

    return (
        <div className="mb-0.5">
            <button
                onClick={() => {
                    if (isOpen) setIsExpanded(!isExpanded);
                }}
                title={!isOpen ? item.group : undefined}
                className={`w-full flex items-center ${isOpen ? 'justify-between px-3' : 'justify-center'} py-2 rounded-lg text-[14px] font-medium transition-colors group ${
                    isActiveGroup 
                        ? 'text-slate-900 font-semibold' 
                        : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50/50'
                }`}
            >
                <div className={`flex items-center ${isOpen ? 'gap-2.5' : 'justify-center'}`}>
                    {item.icon && (
                        <item.icon 
                            size={20} 
                            strokeWidth={1.5}
                            className={isActiveGroup ? 'text-blue-600' : 'text-slate-400 group-hover:text-slate-600'} 
                        />
                    )}
                    {isOpen && <span className="whitespace-nowrap">{item.group}</span>}
                </div>
                {isOpen && (
                    <ChevronRight 
                        size={16} 
                        strokeWidth={1.5}
                        className={`text-slate-400 transition-transform duration-200 shrink-0 ${isExpanded ? 'rotate-90' : ''}`} 
                    />
                )}
            </button>
            
            {isOpen && isExpanded && (
                <div className="pl-[34px] pr-3 space-y-1 mb-1.5 mt-0.5">
                    {item.items.map((subItem: any) => {
                        const isActive = location.pathname === subItem.path || (subItem.path !== '/' && location.pathname.startsWith(subItem.path));
                        return (
                            <Link
                                key={subItem.name}
                                to={subItem.path}
                                className={`flex items-center justify-between py-1.5 rounded-md text-[13px] font-medium transition-colors group ${
                                    isActive 
                                        ? 'text-blue-600 font-semibold' 
                                        : 'text-slate-500 hover:text-slate-900'
                                }`}
                            >
                                <div className="flex items-center gap-3 whitespace-nowrap">
                                    <span className={`w-1 h-1 rounded-full shrink-0 ${isActive ? 'bg-blue-600' : 'bg-slate-300 group-hover:bg-slate-400'}`} />
                                    {subItem.name}
                                </div>
                            </Link>
                        );
                    })}
                </div>
            )}
        </div>
    );
};

export default function Sidebar({ isOpen }: SidebarProps) {
    const location = useLocation();
    const currentModule = location.pathname.split('/')[1] || 'dashboard';
    
    const navItems = navigationMap[currentModule] || [
        { name: 'Dashboard', path: `/${currentModule}`, icon: LayoutDashboard },
        { name: 'Settings', path: `/${currentModule}/settings`, icon: Settings },
    ];

    return (
        <aside className={`fixed lg:static inset-y-0 left-0 z-30 bg-white border-r border-slate-200 transform transition-all duration-300 ease-in-out flex flex-col overflow-hidden ${isOpen ? 'w-64 translate-x-0' : '-translate-x-full lg:w-[72px] lg:translate-x-0'}`}>
            <div className="h-16 flex items-center justify-center lg:justify-start px-5 border-b border-gray-100 shrink-0 whitespace-nowrap">
                {isOpen ? (
                    <img src={LogoBlack} alt="Get It Moving" className="h-8 max-w-[150px] object-contain transition-opacity duration-300" />
                ) : (
                    <img src={LogoIcon} alt="Icon" className="w-8 h-8 object-contain shrink-0" />
                )}
            </div>

            <div className="flex-1 overflow-y-auto overflow-x-hidden py-3 px-2 custom-scrollbar">
                {navItems.map((item, idx) => {
                    const prevCategory = idx > 0 ? navItems[idx - 1].category : null;
                    const showCategory = item.category && item.category !== prevCategory;

                    return (
                        <React.Fragment key={idx}>
                            {showCategory && (
                                isOpen ? (
                                    <div className="px-3 mb-2 mt-4 text-[12px] font-semibold text-slate-500 capitalize whitespace-nowrap">
                                        {item.category}
                                    </div>
                                ) : (
                                    <div className="mb-2 mt-4 border-t border-slate-100 mx-2" />
                                )
                            )}
                            
                            {item.group ? (
                                <NavGroup item={item} location={location} isOpen={isOpen} />
                            ) : (
                                <Link
                                    to={item.path}
                                    title={!isOpen ? item.name : undefined}
                                    className={`flex items-center ${isOpen ? 'justify-between px-3' : 'justify-center'} py-2 rounded-lg text-[14px] font-medium transition-colors group mb-0.5 ${
                                        (location.pathname === item.path || (item.path !== '/' && location.pathname.startsWith(item.path)))
                                            ? 'text-slate-900 font-semibold' 
                                            : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50/50'
                                    }`}
                                >
                                    <div className={`flex items-center ${isOpen ? 'gap-2.5' : 'justify-center'}`}>
                                        <item.icon 
                                            size={20} 
                                            strokeWidth={1.5}
                                            className={(location.pathname === item.path || (item.path !== '/' && location.pathname.startsWith(item.path))) ? 'text-blue-600' : 'text-slate-400 group-hover:text-slate-600'} 
                                        />
                                        {isOpen && <span className="whitespace-nowrap">{item.name}</span>}
                                    </div>
                                </Link>
                            )}
                        </React.Fragment>
                    );
                })}
            </div>

            <div className="p-4 border-t border-gray-100 shrink-0 space-y-2">
                <Link 
                    to="/modules" 
                    title={!isOpen ? "Modules" : undefined}
                    className={`flex items-center ${isOpen ? 'gap-3 px-3' : 'justify-center'} py-2 w-full rounded-lg text-[13px] font-medium text-slate-600 hover:bg-slate-50 hover:text-slate-900 transition-colors`}
                >
                    <ArrowLeft size={20} className="text-slate-400" />
                    {isOpen && <span className="whitespace-nowrap">Back to Modules</span>}
                </Link>
                <button 
                    title={!isOpen ? "Logout" : undefined}
                    className={`flex items-center ${isOpen ? 'gap-3 px-3' : 'justify-center'} py-2 w-full rounded-lg text-[13px] font-medium text-red-600 hover:bg-red-50 transition-colors`}
                >
                    <LogOut size={20} />
                    {isOpen && <span className="whitespace-nowrap">Logout</span>}
                </button>
            </div>
        </aside>
    );
}
