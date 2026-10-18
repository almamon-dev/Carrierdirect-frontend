import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { LogOut, LayoutDashboard, Settings, X } from 'lucide-react';
import LogoBlack from '@/assets/Images/LogoBlack.png';
import LogoWhite from '@/assets/Images/Logo.png';
import LogoIcon from '@/assets/Images/LogoIcon.png';
import { navigationMap } from '@/constants/navigation';
import { TOKEN_CONFIG } from '@/config/auth';
import { CustomerNavGroup } from './CustomerNavGroup';

interface SidebarProps {
    isOpen: boolean;
    onClose?: () => void;
}

export default function Sidebar({ isOpen, onClose }: SidebarProps) {
    const location = useLocation();
    const navigate = useNavigate();
    const currentModule = location.pathname.split('/')[1] || 'dashboard';

    const navItems = navigationMap[currentModule] || [
        { name: 'Dashboard', path: `/${currentModule}/dashboard`, icon: LayoutDashboard },
        { name: 'Settings', path: `/${currentModule}/settings`, icon: Settings },
    ];

    const handleLogout = () => {
        localStorage.removeItem(TOKEN_CONFIG.accessTokenKey);
        localStorage.removeItem(TOKEN_CONFIG.refreshTokenKey);
        localStorage.removeItem(TOKEN_CONFIG.userKey);
        localStorage.removeItem('carrierdirect_access_token');
        localStorage.removeItem('carrierdirect_user_data');
        localStorage.removeItem('erp_access_token');
        localStorage.removeItem('erp_user_data');
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        navigate('/');
    };

    return (
        <aside className={`fixed lg:static inset-y-0 left-0 z-50 lg:z-auto bg-white dark:bg-[#12161c] shadow-2xl lg:shadow-none border-r border-slate-200 dark:border-slate-800 transform transition-all duration-300 ease-in-out flex flex-col overflow-hidden ${isOpen ? 'w-64 translate-x-0' : '-translate-x-full lg:w-[72px] lg:translate-x-0'}`}>
            <div className="h-16 flex items-center justify-between lg:justify-start px-4 sm:px-5 border-b border-slate-200/80 dark:border-slate-800/80 shrink-0 whitespace-nowrap">
                <Link to="/" onClick={() => { if (window.innerWidth < 1024) onClose?.(); }}>
                    {isOpen ? (
                        <>
                            <img src={LogoBlack} alt="Get It Moving" className="h-10 max-w-[170px] object-contain transition-opacity duration-300 cursor-pointer dark:hidden" />
                            <img src={LogoWhite} alt="Get It Moving" className="h-10 max-w-[170px] object-contain transition-opacity duration-300 cursor-pointer hidden dark:block" />
                        </>
                    ) : (
                        <img src={LogoIcon} alt="Icon" className="w-10 h-10 object-contain shrink-0 cursor-pointer" />
                    )}
                </Link>
                {isOpen && (
                    <button
                        type="button"
                        onClick={onClose}
                        className="lg:hidden p-1.5 rounded-full border border-slate-200 dark:border-slate-700/80 bg-slate-50 dark:bg-slate-800 text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-100 hover:bg-slate-100 dark:hover:bg-slate-700/80 hover:border-slate-300 dark:hover:border-slate-600 transition-all cursor-pointer shadow-2xs flex items-center justify-center"
                        title="Close menu"
                        aria-label="Close menu"
                    >
                        <X size={17} strokeWidth={2} />
                    </button>
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
                                    <div className="px-3 mb-2 mt-4 text-[12px] font-semibold text-slate-500 dark:text-slate-400 capitalize whitespace-nowrap">
                                        {item.category}
                                    </div>
                                ) : (
                                    <div className="mb-2 mt-4 border-t border-slate-100 dark:border-slate-800 mx-2" />
                                )
                            )}

                            {item.group ? (
                                <CustomerNavGroup item={item} location={location} isOpen={isOpen} onClose={onClose} />
                            ) : (
                                <Link
                                    to={item.path}
                                    onClick={() => {
                                        if (window.innerWidth < 1024) {
                                            onClose?.();
                                        }
                                    }}
                                    title={!isOpen ? item.name : undefined}
                                    className={`flex items-center ${isOpen ? 'justify-between px-3' : 'justify-center'} py-2 rounded-lg text-[14px] font-medium transition-colors group mb-0.5 ${(location.pathname === item.path || (item.path !== '/' && location.pathname.startsWith(item.path)))
                                            ? 'text-[#ff4a1f] dark:text-orange-400 font-semibold bg-orange-50/70 dark:bg-slate-800/80'
                                            : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 hover:bg-slate-50/70 dark:hover:bg-slate-800/40'
                                        }`}
                                >
                                    <div className={`flex items-center ${isOpen ? 'gap-2.5' : 'justify-center'}`}>
                                        <item.icon
                                            size={20}
                                            strokeWidth={1.5}
                                            className={(location.pathname === item.path || (item.path !== '/' && location.pathname.startsWith(item.path))) ? 'text-[#ff4a1f] dark:text-orange-400' : 'text-slate-400 dark:text-slate-500 group-hover:text-slate-600 dark:group-hover:text-slate-300'}
                                        />
                                        {isOpen && <span className="whitespace-nowrap">{item.name}</span>}
                                    </div>
                                </Link>
                            )}
                        </React.Fragment>
                    );
                })}
            </div>

            <div className="p-4 border-t border-gray-100 dark:border-slate-800 shrink-0 space-y-2">
                <button
                    onClick={handleLogout}
                    title={!isOpen ? "Logout" : undefined}
                    className={`flex items-center ${isOpen ? 'gap-3 px-3' : 'justify-center'} py-2 w-full rounded-lg text-[13px] font-medium text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/40 transition-colors cursor-pointer`}
                >
                    <LogOut size={20} />
                    {isOpen && <span className="whitespace-nowrap">Logout</span>}
                </button>
            </div>
        </aside>
    );
}
