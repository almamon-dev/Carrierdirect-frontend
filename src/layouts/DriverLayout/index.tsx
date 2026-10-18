import React, { useState, useRef, useEffect } from 'react';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import Sidebar from './Sidebar';
import { DriverHeader } from './DriverHeader';
import GlobalSearch from '@/components/GlobalSearch';
import { useUserHeartbeat } from '@/hooks/useUserHeartbeat';
import { TOKEN_CONFIG } from '@/config/auth';
import {
    useDriverCompliance,
    DriverComplianceModal,
    DriverVerificationRequiredModal,
} from '@/modules/Driver/Compliance';
import { RouteLoadingFallback } from '@/layouts/common/RouteLoadingFallback';
import { getAuthUser, initials } from './driverAuthUtils';

export default function DriverLayout() {
    useUserHeartbeat(true);
    const [isSidebarOpen, setIsSidebarOpen] = useState(() => {
        if (typeof window !== 'undefined') {
            return window.innerWidth >= 1024;
        }
        return false;
    });
    const [isSearchOpen, setIsSearchOpen] = useState(false);
    const [isProfileOpen, setIsProfileOpen] = useState(false);
    const [authUser, setAuthUser] = useState(getAuthUser);
    const [isScrolled, setIsScrolled] = useState(false);

    const {
        isVerified,
        verificationStatus,
        complianceData,
        isLoading,
        reloadCompliance,
        isVerificationModalOpen,
        setIsVerificationModalOpen,
        isLockPromptOpen,
        setIsLockPromptOpen,
        completeCompliance,
    } = useDriverCompliance();

    const location = useLocation();
    const isChatRoute = location.pathname.includes('/chat') || location.pathname.includes('/messages');
    const navigate = useNavigate();

    const profileRef = useRef<HTMLDivElement>(null);
    const mainRef = useRef<HTMLElement>(null);

    const [lockFeature, setLockFeature] = useState<string>('Dispatch Notifications & Load Actions');

    const pathParts = location.pathname.split('/').filter(Boolean);
    const currentModuleLabel = pathParts[1] ? pathParts[1].replace(/-/g, ' ') : 'Dashboard';

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
        const handleOpenCompliance = () => setIsVerificationModalOpen(true);
        const handleOpenLock = (e: any) => {
            if (e.detail?.featureName) {
                setLockFeature(e.detail.featureName);
            }
            setIsLockPromptOpen(true);
        };

        window.addEventListener('open-driver-compliance', handleOpenCompliance);
        window.addEventListener('open-driver-lock-prompt', handleOpenLock as EventListener);
        return () => {
            window.removeEventListener('open-driver-compliance', handleOpenCompliance);
            window.removeEventListener('open-driver-lock-prompt', handleOpenLock as EventListener);
        };
    }, [setIsVerificationModalOpen, setIsLockPromptOpen]);

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
        const sync = () => setAuthUser(getAuthUser());
        window.addEventListener('storage', sync);
        window.addEventListener('user-profile-updated', sync);
        window.addEventListener('driver-profile-updated', sync);
        return () => {
            window.removeEventListener('storage', sync);
            window.removeEventListener('user-profile-updated', sync);
            window.removeEventListener('driver-profile-updated', sync);
        };
    }, []);

    useEffect(() => {
        const mainEl = mainRef.current;
        if (!mainEl) return;
        const handleScroll = () => {
            setIsScrolled(mainEl.scrollTop > 5);
        };
        handleScroll();
        mainEl.addEventListener('scroll', handleScroll, { passive: true });
        return () => mainEl.removeEventListener('scroll', handleScroll);
    }, []);

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
        navigate('/web/login');
    };

    const isUnverifiedBlocked = !isLoading && !isVerified && location.pathname !== '/driver/profile';
    const showLockModal = isUnverifiedBlocked || isLockPromptOpen;

    return (
        <div className="flex h-screen bg-[#f8fafc] dark:bg-[#12161c] overflow-hidden">
            {isSidebarOpen && (
                <div
                    className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs z-20 lg:hidden"
                    onClick={() => setIsSidebarOpen(false)}
                />
            )}

            <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />

            <div className="flex-1 flex flex-col min-w-0 h-screen overflow-hidden">
                <DriverHeader
                    isScrolled={isScrolled}
                    isSidebarOpen={isSidebarOpen}
                    onToggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)}
                    currentModuleLabel={currentModuleLabel}
                    isVerified={isVerified}
                    verificationStatus={verificationStatus}
                    onOpenSearch={() => setIsSearchOpen(true)}
                    authUser={authUser}
                    isProfileOpen={isProfileOpen}
                    setIsProfileOpen={setIsProfileOpen}
                    profileRef={profileRef}
                    complianceData={complianceData}
                    onOpenVerificationModal={() => setIsVerificationModalOpen(true)}
                    onLockAssignedShipments={() => {
                        setLockFeature('Assigned Shipments');
                        setIsLockPromptOpen(true);
                    }}
                    onLogout={handleLogout}
                    initials={initials}
                />

                <main
                    ref={mainRef}
                    className={`flex-1 ${
                        isChatRoute ? 'overflow-hidden h-[calc(100vh-64px)]' : 'overflow-y-auto overflow-x-hidden'
                    } bg-[#f8fafc] dark:bg-[#12161c] [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]`}
                >
                    <React.Suspense fallback={<RouteLoadingFallback />}>
                        <div className={`w-full ${isChatRoute ? 'h-full pb-0' : 'pb-16'}`}>
                            <Outlet />
                        </div>
                    </React.Suspense>
                </main>
            </div>

            <DriverVerificationRequiredModal
                isOpen={showLockModal}
                status={verificationStatus}
                rejectionReason={complianceData?.rejectionReason}
                featureName={lockFeature}
                canDismiss={!isUnverifiedBlocked}
                complianceData={complianceData}
                                onClose={() => setIsLockPromptOpen(false)}
                onStartVerification={() => {
                    setIsLockPromptOpen(false);
                    setIsVerificationModalOpen(true);
                }}
                onReloadStatus={reloadCompliance}
                onComplete={completeCompliance}
            />

            {!showLockModal && (
                <DriverComplianceModal
                    isOpen={isVerificationModalOpen}
                    initialData={complianceData}
                    canDismiss={true}
                                        onClose={() => setIsVerificationModalOpen(false)}
                    onComplete={completeCompliance}
                />
            )}

            <GlobalSearch isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />
        </div>
    );
}
