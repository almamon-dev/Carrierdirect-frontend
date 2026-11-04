import React, { useState, useEffect } from 'react';
import { User, Truck, Navigation, Zap } from 'lucide-react';
import apiClient from '@/lib/axios';
import { ENDPOINTS } from '@/config/api';

interface DemoAccount {
    id: number | string;
    name?: string;
    email: string;
    role?: 'customer' | 'supplier' | 'driver' | string;
    badge?: string | null;
    label?: string;
    password?: string;
}

interface DemoCredentialsData {
    customers: DemoAccount[];
    suppliers: DemoAccount[];
    drivers: DemoAccount[];
}

interface DemoCredentialsProps {
    onSelect: (email: string, pass: string) => void;
}

const DEFAULT_CREDENTIALS: DemoCredentialsData = {
    customers: [
        { id: 2, name: 'Customer One', email: 'aidanalltrainedup@gmail.com', role: 'customer', label: 'Customer', badge: null, password: 'password' }
    ],
    suppliers: [
        { id: 3, name: 'Freightmover One', email: 'freightforwarder78@gmail.com', role: 'supplier', label: 'Supplier 1', badge: '1', password: 'password' },
        { id: 4, name: 'Carrier Two', email: 'aidan@alltrainedup.ie', role: 'supplier', label: 'Supplier 2', badge: '2', password: 'password' }
    ],
    drivers: [
        { id: 5, name: 'Aidan Moroney', email: 'balbrigganconnected@gmail.com', role: 'driver', label: 'Driver', badge: null, password: 'password' }
    ]
};

export default function DemoCredentials({ onSelect }: DemoCredentialsProps) {
    const [credentials, setCredentials] = useState<DemoCredentialsData>(DEFAULT_CREDENTIALS);
    const [activeEmail, setActiveEmail] = useState<string>('');

    useEffect(() => {
        let isMounted = true;
        apiClient.get(ENDPOINTS.AUTH.DEMO_CREDENTIALS || '/auth/demo-credentials')
            .then((res: any) => {
                if (!isMounted) return;
                const data = res.data?.data || res.data;
                if (data && (data.customers || data.suppliers || data.drivers)) {
                    setCredentials({
                        customers: Array.isArray(data.customers) && data.customers.length > 0
                            ? data.customers
                            : DEFAULT_CREDENTIALS.customers,
                        suppliers: Array.isArray(data.suppliers) && data.suppliers.length > 0
                            ? data.suppliers
                            : DEFAULT_CREDENTIALS.suppliers,
                        drivers: Array.isArray(data.drivers) && data.drivers.length > 0
                            ? data.drivers
                            : DEFAULT_CREDENTIALS.drivers,
                    });
                }
            })
            .catch(() => {
                // Silently keep default
            });

        return () => {
            isMounted = false;
        };
    }, []);

    const allAccounts: DemoAccount[] = [
        ...credentials.customers,
        ...credentials.suppliers,
        ...credentials.drivers,
    ];

    const handleSelect = (email: string, pass: string = 'password') => {
        setActiveEmail(email);
        onSelect(email, pass);
    };

    const getRoleTheme = (role?: string) => {
        const r = (role || '').toLowerCase();
        if (r === 'supplier') {
            return {
                icon: <Truck size={12} />,
                iconBg: 'bg-amber-500 text-white',
                buttonBg: 'bg-amber-50/70 hover:bg-amber-100/80 border-amber-200/90 hover:border-amber-400 dark:bg-amber-950/25 dark:border-amber-800/60 dark:hover:border-amber-600',
                badgeBg: 'bg-amber-500 text-white dark:bg-amber-600',
                activeRing: 'ring-2 ring-amber-500/50 border-amber-500 dark:border-amber-500 bg-amber-100/70 dark:bg-amber-950/40',
                roleTitle: 'Supplier',
            };
        }
        if (r === 'driver') {
            return {
                icon: <Navigation size={12} />,
                iconBg: 'bg-emerald-600 text-white',
                buttonBg: 'bg-emerald-50/70 hover:bg-emerald-100/80 border-emerald-200/90 hover:border-emerald-400 dark:bg-emerald-950/25 dark:border-emerald-800/60 dark:hover:border-emerald-600',
                badgeBg: 'bg-emerald-600 text-white dark:bg-emerald-600',
                activeRing: 'ring-2 ring-emerald-500/50 border-emerald-500 dark:border-emerald-500 bg-emerald-100/70 dark:bg-emerald-950/40',
                roleTitle: 'Driver',
            };
        }
        // Customer default
        return {
            icon: <User size={12} />,
            iconBg: 'bg-blue-600 text-white',
            buttonBg: 'bg-blue-50/70 hover:bg-blue-100/80 border-blue-200/90 hover:border-blue-400 dark:bg-blue-950/25 dark:border-blue-800/60 dark:hover:border-blue-600',
            badgeBg: 'bg-blue-600 text-white dark:bg-blue-600',
            activeRing: 'ring-2 ring-blue-500/50 border-blue-500 dark:border-blue-500 bg-blue-100/70 dark:bg-blue-950/40',
            roleTitle: 'Customer',
        };
    };

    return (
        <div className="mt-4 pt-3 border-t border-dashed border-gray-200 dark:border-[#384150]">
            <div className="flex items-center justify-between mb-2">
                <span className="text-[10.5px] font-bold text-gray-500 dark:text-slate-400 tracking-wider flex items-center gap-1.5">
                    <Zap size={11} className="text-amber-500 fill-amber-500" /> Demo Credentials
                </span>
                <span className="text-[10px] text-gray-400 dark:text-slate-500 font-medium">Click to fill</span>
            </div>

            {/* Vertical list (niche niche) with max height scroll */}
            <div className="flex flex-col gap-1.5 max-h-[175px] overflow-y-auto pr-0.5 scrollbar-thin scrollbar-thumb-slate-200 dark:scrollbar-thumb-slate-700">
                {allAccounts.map((acc, idx) => {
                    const theme = getRoleTheme(acc.role);
                    const isSelected = activeEmail === acc.email;

                    return (
                        <button
                            key={acc.id || idx}
                            type="button"
                            onClick={() => handleSelect(acc.email, acc.password || 'password')}
                            className={`w-full h-8 sm:h-8.5 px-2.5 flex items-center justify-between rounded-[4px] border transition-all cursor-pointer text-left shadow-2xs ${theme.buttonBg} ${
                                isSelected ? theme.activeRing : ''
                            }`}
                            title={`${acc.label || theme.roleTitle}: ${acc.email}${acc.name ? ' (' + acc.name + ')' : ''} • Click to fill`}
                        >
                            <div className="flex items-center gap-2 min-w-0">
                                <div className={`w-5 h-5 rounded-[3px] flex items-center justify-center shrink-0 shadow-2xs ${theme.iconBg}`}>
                                    {theme.icon}
                                </div>
                                <span className="text-[11.5px] font-bold text-slate-800 dark:text-slate-100 shrink-0 leading-none">
                                    {theme.roleTitle}
                                </span>
                                {acc.badge && (
                                    <span className={`text-[9.5px] font-extrabold px-1.5 py-0.5 rounded-[2px] leading-none shrink-0 shadow-2xs ${theme.badgeBg}`}>
                                        #{acc.badge}
                                    </span>
                                )}
                            </div>

                            <div className="flex items-center gap-1.5 min-w-0 pl-2">
                                <span className="text-[10.5px] text-slate-500 dark:text-slate-400 font-mono truncate">
                                    {acc.email}
                                </span>
                            </div>
                        </button>
                    );
                })}
            </div>
        </div>
    );
}
