import Skeleton from '@/components/ui/skeleton';
import { ENDPOINTS } from '@/config/api';
import apiClient from '@/lib/axios';
import { Check, Mail, MousePointer2, Truck, User, Zap } from 'lucide-react';
import React, { useEffect, useState } from 'react';

interface DemoAccount {
    id: number | string;
    name?: string;
    email: string;
    role?: 'customer' | 'supplier' | 'driver' | string;
    badge?: string;
    country?: string;
    password?: string;
}

interface DemoCredentialsProps {
    onSelect: (email: string, pass: string) => void;
}

type RoleType = 'customer' | 'supplier' | 'driver';

const SteeringWheelIcon: React.FC<{ className?: string }> = ({ className = "w-3.5 h-3.5" }) => (
    <svg
        className={className}
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
    >
        <circle cx="12" cy="12" r="10" />
        <circle cx="12" cy="12" r="3" />
        <line x1="12" y1="2" x2="12" y2="9" />
        <line x1="4.93" y1="19.07" x2="9.88" y2="14.12" />
        <line x1="19.07" y1="19.07" x2="14.12" y2="14.12" />
    </svg>
);

const EMPTY_ACCOUNTS: Record<RoleType, DemoAccount[]> = {
    customer: [],
    supplier: [],
    driver: [],
};

const DEMO_CACHE_KEY = 'carrierdirect_demo_credentials_cache';
const DEMO_ROLE_KEY = 'carrierdirect_demo_active_role';

const getInitialAccounts = (): Record<RoleType, DemoAccount[]> => {
    try {
        const cached = localStorage.getItem(DEMO_CACHE_KEY);
        if (cached) {
            const parsed = JSON.parse(cached);
            if (
                parsed &&
                ((parsed.customer && parsed.customer.length > 0) ||
                    (parsed.supplier && parsed.supplier.length > 0) ||
                    (parsed.driver && parsed.driver.length > 0))
            ) {
                return {
                    customer: Array.isArray(parsed.customer) ? parsed.customer : [],
                    supplier: Array.isArray(parsed.supplier) ? parsed.supplier : [],
                    driver: Array.isArray(parsed.driver) ? parsed.driver : [],
                };
            }
        }
    } catch {
        // fallback to empty
    }
    return EMPTY_ACCOUNTS;
};

export const DemoCredentialsSkeleton: React.FC = () => {
    return (
        <div className="mt-4 pt-3 border-t border-dashed border-gray-200 dark:border-[#384150]">
            {/* Header: Title & Subtitle Skeleton */}
            <div className="mb-2.5">
                <div className="flex items-center gap-1.5">
                    <Skeleton className="w-3.5 h-3.5 rounded-[2px]" />
                    <Skeleton className="h-3.5 w-28 rounded-[2px]" />
                </div>
                <Skeleton className="h-2.5 w-44 rounded-[2px] mt-1" />
            </div>

            {/* 3 Role Tabs Skeleton */}
            <div className="grid grid-cols-3 gap-1.5 mb-2.5">
                <Skeleton className="h-7 w-full rounded-[2px]" />
                <Skeleton className="h-7 w-full rounded-[2px]" />
                <Skeleton className="h-7 w-full rounded-[2px]" />
            </div>

            {/* Account List Card Skeleton */}
            <div className="bg-white dark:bg-[#181a20] rounded-[2px] border border-slate-200/90 dark:border-slate-800 divide-y divide-slate-100 dark:divide-slate-800/80 shadow-2xs overflow-hidden">
                {[1, 2].map((idx) => (
                    <div
                        key={idx}
                        className="flex items-center justify-between p-2 sm:px-3 sm:py-2 gap-2"
                    >
                        <div className="flex items-center gap-2 min-w-0 flex-1">
                            {/* Avatar Box Skeleton */}
                            <Skeleton className="w-7 h-7 rounded-[2px] shrink-0" />

                            {/* Name + Email Skeleton */}
                            <div className="min-w-0 flex-1 space-y-1">
                                <Skeleton className="h-3 w-24 rounded-[2px]" />
                                <Skeleton className="h-2.5 w-36 sm:w-44 rounded-[2px]" />
                            </div>
                        </div>

                        {/* Click to Fill Button Skeleton */}
                        <Skeleton className="h-6 w-20 rounded-[2px] shrink-0" />
                    </div>
                ))}
            </div>
        </div>
    );
};

export default function DemoCredentials({ onSelect }: DemoCredentialsProps) {
    const initialAccounts = getInitialAccounts();
    const hasInitialAccounts =
        (initialAccounts.customer?.length || 0) +
        (initialAccounts.supplier?.length || 0) +
        (initialAccounts.driver?.length || 0) > 0;

    const [isLoading, setIsLoading] = useState<boolean>(!hasInitialAccounts);
    const [activeRole, setActiveRole] = useState<RoleType>(() => {
        try {
            const saved = localStorage.getItem(DEMO_ROLE_KEY) as RoleType;
            if (saved && ['customer', 'supplier', 'driver'].includes(saved)) {
                return saved;
            }
        } catch {
            // ignore
        }
        return 'customer';
    });
    const [accounts, setAccounts] = useState<Record<RoleType, DemoAccount[]>>(initialAccounts);
    const [filledEmail, setFilledEmail] = useState<string | null>(null);

    const handleRoleChange = (role: RoleType) => {
        setActiveRole(role);
        try {
            localStorage.setItem(DEMO_ROLE_KEY, role);
        } catch {
            // ignore
        }
    };

    useEffect(() => {
        let isMounted = true;

        const fetchCredentials = (isInitial = false) => {
            if (isInitial && !hasInitialAccounts) {
                setIsLoading(true);
            }

            apiClient
                .get(ENDPOINTS.AUTH.DEMO_CREDENTIALS || '/auth/demo-credentials')
                .then((res: any) => {
                    if (!isMounted) return;
                    const data = res.data?.data || res.data;
                    if (!data) return;

                    const getList = (raw: any): DemoAccount[] => {
                        if (Array.isArray(raw) && raw.length > 0) {
                            return raw.map((item: any) => ({
                                id: item.id || item.email,
                                name: item.name,
                                email: item.email,
                                role: item.role,
                                badge: item.badge,
                                country: item.country,
                                password: item.password || 'password',
                            }));
                        }
                        return [];
                    };

                    const apiCustomers = getList(data.customers);
                    const apiSuppliers = getList(data.suppliers);
                    const apiDrivers = getList(data.drivers);

                    const newAccounts: Record<RoleType, DemoAccount[]> = {
                        customer: apiCustomers,
                        supplier: apiSuppliers,
                        driver: apiDrivers,
                    };

                    setAccounts(newAccounts);

                    try {
                        localStorage.setItem(DEMO_CACHE_KEY, JSON.stringify(newAccounts));
                    } catch {
                        // ignore
                    }
                })
                .catch((err) => {
                    // Retain previously loaded/cached accounts on temporary network errors or rate limits
                    console.warn('Demo credentials fetch notice:', err?.message || err);
                })
                .finally(() => {
                    if (isMounted) {
                        setIsLoading(false);
                    }
                });
        };

        // Fetch on mount
        fetchCredentials(!hasInitialAccounts);

        // Auto-refresh in background every 20 seconds and on tab focus
        const pollTimer = setInterval(() => fetchCredentials(false), 20000);
        const onVisibilityOrFocus = () => {
            if (document.visibilityState === 'visible') {
                fetchCredentials(false);
            }
        };

        window.addEventListener('focus', onVisibilityOrFocus);
        document.addEventListener('visibilitychange', onVisibilityOrFocus);

        return () => {
            isMounted = false;
            clearInterval(pollTimer);
            window.removeEventListener('focus', onVisibilityOrFocus);
            document.removeEventListener('visibilitychange', onVisibilityOrFocus);
        };
    }, [hasInitialAccounts]);

    const handleFill = (account: DemoAccount) => {
        onSelect(account.email, account.password || 'password');
        setFilledEmail(account.email);
        setTimeout(() => {
            setFilledEmail((current) => (current === account.email ? null : current));
        }, 1600);
    };

    if (isLoading) {
        return <DemoCredentialsSkeleton />;
    }

    const totalAccounts =
        (accounts.customer?.length || 0) +
        (accounts.supplier?.length || 0) +
        (accounts.driver?.length || 0);

    if (totalAccounts === 0) {
        return (
            <div className="mt-4 pt-3 border-t border-dashed border-gray-200 dark:border-[#384150]">
                <div className="mb-2.5">
                    <div className="flex items-center gap-1.5 text-slate-900 dark:text-slate-100 font-bold text-xs sm:text-[13px]">
                        <Zap className="w-3.5 h-3.5 text-amber-500 fill-amber-500 shrink-0" />
                        <span>Quick Demo Login</span>
                    </div>
                </div>
                <div className="py-3 px-3 text-center rounded-[2px] bg-slate-50 dark:bg-[#181a20] border border-slate-200/90 dark:border-slate-800 text-[11px] text-slate-400">
                    No demo accounts available.
                </div>
            </div>
        );
    }

    const currentAccounts = accounts[activeRole] || [];

    const roleTabs: { key: RoleType; label: string; icon: React.ReactNode }[] = [
        {
            key: 'customer',
            label: `Customer (${accounts.customer?.length || 0})`,
            icon: <User className="w-3.5 h-3.5 shrink-0" />,
        },
        {
            key: 'supplier',
            label: `Supplier (${accounts.supplier?.length || 0})`,
            icon: <Truck className="w-3.5 h-3.5 shrink-0" />,
        },
        {
            key: 'driver',
            label: `Driver (${accounts.driver?.length || 0})`,
            icon: <SteeringWheelIcon className="w-3.5 h-3.5 shrink-0" />,
        },
    ];

    const getRoleAvatarIcon = () => {
        if (activeRole === 'supplier') {
            return <Truck className="w-4 h-4 text-white stroke-[2.2]" />;
        }
        if (activeRole === 'driver') {
            return <SteeringWheelIcon className="w-4 h-4 text-white stroke-[2.2]" />;
        }
        return <User className="w-4 h-4 text-white stroke-[2.2]" />;
    };

    return (
        <div className="mt-4 pt-3 border-t border-dashed border-gray-200 dark:border-[#384150]">
            {/* Header: Title & Subtitle (Compact) */}
            <div className="mb-2.5">
                <div className="flex items-center gap-1.5 text-slate-900 dark:text-slate-100 font-bold text-xs sm:text-[13px]">
                    <Zap className="w-3.5 h-3.5 text-amber-500 fill-amber-500 shrink-0" />
                    <span>Quick Demo Login</span>
                </div>
                <p className="text-[10px] sm:text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                    Choose a role to explore the platform
                </p>
            </div>

            {/* 3 Role Selection Tabs (Rounded-2px, Small & No Text Limit/Truncate) */}
            <div className="grid grid-cols-3 gap-1.5 mb-2.5">
                {roleTabs.map((tab) => {
                    const isActive = activeRole === tab.key;
                    return (
                        <button
                            key={tab.key}
                            type="button"
                            onClick={() => handleRoleChange(tab.key)}
                            className={`py-1.5 px-1 rounded-[2px] flex items-center justify-center gap-1 text-[10px] sm:text-[11px] font-semibold transition-all cursor-pointer select-none whitespace-nowrap ${isActive
                                ? 'bg-[#FF4A1F] text-white shadow-2xs border border-[#FF4A1F]'
                                : 'bg-white dark:bg-[#1e2329] text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800'
                                }`}
                        >
                            {tab.icon}
                            <span>{tab.label}</span>
                        </button>
                    );
                })}
            </div>

            {/* Account List Card (Rounded-2px / Compact, No Limit/Truncate on text) */}
            <div
                key={activeRole}
                className="bg-white dark:bg-[#181a20] rounded-[2px] border border-slate-200/90 dark:border-slate-800 divide-y divide-slate-100 dark:divide-slate-800/80 shadow-2xs overflow-hidden transition-all duration-200 animate-in fade-in"
            >
                {currentAccounts.length === 0 ? (
                    <div className="py-3 px-2 text-center text-[10.5px] text-slate-400">
                        No demo accounts available for this role.
                    </div>
                ) : (
                    currentAccounts.map((account) => {
                        const isFilled = filledEmail === account.email;
                        return (
                            <div
                                key={account.id || account.email}
                                className="flex items-center justify-between p-2 sm:px-3 sm:py-2 gap-2 hover:bg-slate-50/70 dark:hover:bg-slate-800/40 transition-colors"
                            >
                                {/* Left Avatar + Info Container */}
                                <div className="flex items-center gap-2 min-w-0 flex-1">
                                    <div className="w-7 h-7 rounded-[2px] bg-[#0080ff] flex items-center justify-center text-white shrink-0 shadow-2xs">
                                        {getRoleAvatarIcon()}
                                    </div>

                                    {/* Name and Email without truncate limits */}
                                    <div className="min-w-0 flex-1">
                                        <div className="flex items-center gap-1.5 flex-wrap">
                                            <h4 className="text-[11.5px] sm:text-xs font-bold text-slate-900 dark:text-slate-100 leading-tight">
                                                {account.name || 'Demo User'}
                                            </h4>
                                        </div>
                                        <div className="flex items-center gap-1 text-[10px] sm:text-[10.5px] text-slate-500 dark:text-slate-400 mt-0.5">
                                            <Mail className="w-3 h-3 text-slate-400 shrink-0" />
                                            <span className="font-normal break-all">{account.email}</span>
                                        </div>
                                    </div>
                                </div>

                                {/* Right Click to Fill Button (rounded-[2px]) */}
                                <button
                                    type="button"
                                    onClick={() => handleFill(account)}
                                    className={`inline-flex items-center gap-1 px-2 py-1 rounded-[2px] border text-[10.5px] font-semibold transition-all cursor-pointer shrink-0 shadow-2xs ${isFilled
                                        ? 'bg-emerald-50 border-emerald-500 text-emerald-600 dark:bg-emerald-950/40 dark:border-emerald-500 dark:text-emerald-400'
                                        : 'border-[#FF4A1F] text-[#FF4A1F] hover:bg-[#FF4A1F]/5 bg-transparent active:scale-95'
                                        }`}
                                >
                                    {isFilled ? (
                                        <>
                                            <Check className="w-3 h-3 text-emerald-600 dark:text-emerald-400" />
                                            <span>Filled!</span>
                                        </>
                                    ) : (
                                        <>
                                            <MousePointer2 className="w-3 h-3 rotate-[-20deg]" />
                                            <span>Click to Fill</span>
                                        </>
                                    )}
                                </button>
                            </div>
                        );
                    })
                )}
            </div>
        </div>
    );
}
