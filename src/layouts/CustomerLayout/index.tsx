import React, { useState, useRef, useEffect } from 'react';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import Sidebar from './Sidebar';
import { CustomerHeader } from './CustomerHeader';
import GlobalSearch from '@/components/GlobalSearch';
import NegotiationChatWidget from '@/components/NegotiationChatWidget';
import { useUserHeartbeat } from '@/hooks/useUserHeartbeat';
import { TOKEN_CONFIG } from '@/config/auth';
import { CustomerChatSkeletonLoader } from '@/modules/Customer/QuoteManagement/Negotiation/Chat/components/CustomerChatSkeletonLoader';
import { RouteLoadingFallback } from '@/layouts/common/RouteLoadingFallback';

function getAuthUser() {
    try {
        const raw = localStorage.getItem(TOKEN_CONFIG.userKey);
        if (!raw) return null;
        return JSON.parse(raw) as { name?: string; email?: string; user_type?: string; profile_picture?: string };
    } catch {
        return null;
    }
}

function initials(name?: string): string {
    if (!name) return 'U';
    return name
        .split(' ')
        .filter(Boolean)
        .slice(0, 2)
        .map(w => w[0].toUpperCase())
        .join('');
}

export default function CustomerLayout() {
    useUserHeartbeat(true);
    const [isSidebarOpen, setIsSidebarOpen] = useState(() => {
        if (typeof window !== 'undefined') {
            return window.innerWidth >= 1024;
        }
        return true;
    });
    const [isSearchOpen, setIsSearchOpen] = useState(false);
    const [isProfileOpen, setIsProfileOpen] = useState(false);
    const [authUser, setAuthUser] = useState(getAuthUser);

    const location = useLocation();
    const navigate = useNavigate();

    const profileRef = useRef<HTMLDivElement>(null);
    const mainRef = useRef<HTMLElement>(null);

    useEffect(() => {
        if (window.innerWidth < 1024) {
            setIsSidebarOpen(false);
        }
    }, [location.pathname]);

    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'Escape' && isSidebarOpen && window.innerWidth < 1024) {
                setIsSidebarOpen(false);
            }
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [isSidebarOpen]);

    useEffect(() => {
        if (isSidebarOpen && window.innerWidth < 1024) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = '';
        }
        return () => {
            document.body.style.overflow = '';
        };
    }, [isSidebarOpen]);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (profileRef.current && !profileRef.current.contains(event.target as Node)) {
                setIsProfileOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    useEffect(() => {
        const sync = (e?: Event) => {
            if ((e as CustomEvent)?.detail) {
                setAuthUser((prev: any) => ({ ...prev, ...(e as CustomEvent).detail }));
            } else {
                setAuthUser(getAuthUser());
            }
        };
        window.addEventListener('storage', sync);
        window.addEventListener('user-profile-updated', sync);
        return () => {
            window.removeEventListener('storage', sync);
            window.removeEventListener('user-profile-updated', sync);
        };
    }, []);

    const handleLogout = () => {
        localStorage.removeItem(TOKEN_CONFIG.accessTokenKey);
        localStorage.removeItem(TOKEN_CONFIG.userKey);
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        navigate('/web/login');
    };

    const pathParts = location.pathname.split('/').filter(Boolean);
    const currentModuleLabel = pathParts[1] ? pathParts[1].replace(/-/g, ' ') : 'Dashboard';

    const isFullHeightChat =
        location.pathname.includes('/messages') ||
        location.pathname.includes('/negotiation/conversation') ||
        location.pathname.includes('/negotiation/view');
    const isNegotiationChat =
        location.pathname.includes('/negotiation/conversation') ||
        location.pathname.includes('/negotiation/view');

    return (
        <div className="flex h-screen bg-[#f8fafc] dark:bg-[#12161c] overflow-hidden font-sans antialiased">
            {isSidebarOpen && (
                <div
                    className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs z-20 lg:hidden"
                    onClick={() => setIsSidebarOpen(false)}
                />
            )}

            <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />

            <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
                <CustomerHeader
                    isSidebarOpen={isSidebarOpen}
                    onToggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)}
                    currentModuleLabel={currentModuleLabel}
                    onOpenSearch={() => setIsSearchOpen(true)}
                    authUser={authUser}
                    isProfileOpen={isProfileOpen}
                    setIsProfileOpen={setIsProfileOpen}
                    profileRef={profileRef}
                    onLogout={handleLogout}
                    initials={initials}
                />

                <main
                    ref={mainRef}
                    className={`flex-1 ${
                        isFullHeightChat ? 'overflow-hidden h-[calc(100vh-56px)]' : 'overflow-y-auto overflow-x-hidden'
                    } bg-[#f8fafc] dark:bg-[#12161c] [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]`}
                >
                    <React.Suspense fallback={isNegotiationChat ? <CustomerChatSkeletonLoader /> : <RouteLoadingFallback />}>
                        <div className={`w-full ${isFullHeightChat ? 'h-full pb-0' : 'pb-16'}`}>
                            <Outlet />
                        </div>
                    </React.Suspense>
                </main>
            </div>

            <GlobalSearch isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />

            {!isFullHeightChat && <NegotiationChatWidget />}
        </div>
    );
}
