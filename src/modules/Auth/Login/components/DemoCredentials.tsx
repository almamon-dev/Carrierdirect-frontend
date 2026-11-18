import React, { useState, useEffect } from 'react';
import { User, Truck, Navigation, Zap } from 'lucide-react';
import apiClient from '@/lib/axios';
import { ENDPOINTS } from '@/config/api';

interface DemoAccount {
    id: number | string;
    name?: string;
    email: string;
    role?: 'customer' | 'supplier' | 'driver' | string;
    profile?: 'developer' | 'client' | string;
    country?: string;
    badge?: string | null;
    label?: string;
    password?: string;
}

interface ProfileGroupData {
    label: string;
    country: string;
    customers: DemoAccount[];
    suppliers: DemoAccount[];
    drivers: DemoAccount[];
}

interface ProfilesMap {
    developer?: ProfileGroupData;
    client?: ProfileGroupData;
}

interface DemoCredentialsProps {
    onSelect: (email: string, pass: string) => void;
}

type ProfileFilter = 'both' | 'developer' | 'client';

function flattenGroupAccounts(group?: ProfileGroupData): DemoAccount[] {
    if (!group) return [];
    return [
        ...(Array.isArray(group.customers) ? group.customers : []),
        ...(Array.isArray(group.suppliers) ? group.suppliers : []),
        ...(Array.isArray(group.drivers) ? group.drivers : []),
    ];
}

function buildProfilesFromFlat(data: any): ProfilesMap {
    const all: DemoAccount[] = [
        ...(Array.isArray(data?.customers) ? data.customers : []),
        ...(Array.isArray(data?.suppliers) ? data.suppliers : []),
        ...(Array.isArray(data?.drivers) ? data.drivers : []),
    ];

    const splitByProfile = (key: 'developer' | 'client', label: string, country: string): ProfileGroupData => {
        const subset = all.filter((a) => a.profile === key);
        return {
            label,
            country,
            customers: subset.filter((a) => a.role === 'customer'),
            suppliers: subset.filter((a) => a.role === 'supplier'),
            drivers: subset.filter((a) => a.role === 'driver'),
        };
    };

    const dev = splitByProfile('developer', 'Developer Testing (Bangladesh)', 'Bangladesh');
    const cli = splitByProfile('client', 'Client UAT Testing (Ireland)', 'Ireland');

    const result: ProfilesMap = {};
    if (flattenGroupAccounts(dev).length > 0) result.developer = dev;
    if (flattenGroupAccounts(cli).length > 0) result.client = cli;

    // Legacy fallback if response had no `profile` field on accounts
    if (!result.developer && !result.client && all.length > 0) {
        result.client = {
            label: 'Test Accounts',
            country: 'Demo',
            customers: Array.isArray(data?.customers) ? data.customers : [],
            suppliers: Array.isArray(data?.suppliers) ? data.suppliers : [],
            drivers: Array.isArray(data?.drivers) ? data.drivers : [],
        };
    }

    return result;
}

export default function DemoCredentials({ onSelect }: DemoCredentialsProps) {
    const [profiles, setProfiles] = useState<ProfilesMap | null>(null);
    const [activeFilter, setActiveFilter] = useState<ProfileFilter>('both');
    const [activeEmail, setActiveEmail] = useState<string>('');

    useEffect(() => {
        let isMounted = true;
        apiClient.get(ENDPOINTS.AUTH.DEMO_CREDENTIALS || '/auth/demo-credentials')
            .then((res: any) => {
                if (!isMounted) return;
                const data = res.data?.data || res.data;
                if (!data) return;

                if (data.profiles && (data.profiles.developer || data.profiles.client)) {
                    setProfiles(data.profiles);
                    return;
                }

                const constructed = buildProfilesFromFlat(data);
                if (constructed.developer || constructed.client) {
                    setProfiles(constructed);
                }
            })
            .catch(() => {
                // Disabled in production (404/403): hide widget and never expose fallback secrets
                if (isMounted) setProfiles(null);
            });

        return () => {
            isMounted = false;
        };
    }, []);

    if (!profiles) {
        return null;
    }

    const groups = [
        activeFilter === 'both' || activeFilter === 'developer'
            ? {
                  key: 'developer',
                  title: `BD · ${profiles.developer?.country || 'Bangladesh'} (Developer)`,
                  badgeClass:
                      'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/50 dark:text-emerald-300 dark:border-emerald-800/70',
                  accounts: flattenGroupAccounts(profiles.developer),
              }
            : null,
        activeFilter === 'both' || activeFilter === 'client'
            ? {
                  key: 'client',
                  title: `IE · ${profiles.client?.country || 'Ireland'} (Client)`,
                  badgeClass:
                      'bg-sky-50 text-sky-700 border-sky-200 dark:bg-sky-950/50 dark:text-sky-300 dark:border-sky-800/70',
                  accounts: flattenGroupAccounts(profiles.client),
              }
            : null,
    ].filter((g): g is NonNullable<typeof g> => Boolean(g && g.accounts.length > 0));

    if (groups.length === 0) {
        return null;
    }

    const handleSelect = (email: string, pass: string = '') => {
        setActiveEmail(email);
        onSelect(email, pass);
    };

    const getRoleTheme = (role?: string) => {
        const r = (role || '').toLowerCase();
        if (r === 'supplier') {
            return {
                icon: <Truck size={12} />,
                iconBg: 'bg-amber-500 text-white',
                buttonBg:
                    'bg-amber-50/70 hover:bg-amber-100/80 border-amber-200/90 hover:border-amber-400 dark:bg-amber-950/25 dark:border-amber-800/60 dark:hover:border-amber-600',
                activeRing:
                    'ring-2 ring-amber-500/50 border-amber-500 dark:border-amber-500 bg-amber-100/70 dark:bg-amber-950/40',
                roleTitle: 'Supplier',
            };
        }
        if (r === 'driver') {
            return {
                icon: <Navigation size={12} />,
                iconBg: 'bg-emerald-600 text-white',
                buttonBg:
                    'bg-emerald-50/70 hover:bg-emerald-100/80 border-emerald-200/90 hover:border-emerald-400 dark:bg-emerald-950/25 dark:border-emerald-800/60 dark:hover:border-emerald-600',
                activeRing:
                    'ring-2 ring-emerald-500/50 border-emerald-500 dark:border-emerald-500 bg-emerald-100/70 dark:bg-emerald-950/40',
                roleTitle: 'Driver',
            };
        }
        return {
            icon: <User size={12} />,
            iconBg: 'bg-blue-600 text-white',
            buttonBg:
                'bg-blue-50/70 hover:bg-blue-100/80 border-blue-200/90 hover:border-blue-400 dark:bg-blue-950/25 dark:border-blue-800/60 dark:hover:border-blue-600',
            activeRing:
                'ring-2 ring-blue-500/50 border-blue-500 dark:border-blue-500 bg-blue-100/70 dark:bg-blue-950/40',
            roleTitle: 'Customer',
        };
    };

    return (
        <div className="mt-4 pt-3 border-t border-dashed border-gray-200 dark:border-[#384150]">
            <div className="flex items-center justify-between gap-2 mb-2">
                <span className="text-[10.5px] font-bold text-gray-500 dark:text-slate-400 tracking-wider flex items-center gap-1.5">
                    <Zap size={11} className="text-amber-500 fill-amber-500" /> Quick Test Login
                </span>

                <div className="inline-flex rounded-md bg-gray-100 dark:bg-[#232732] p-0.5 text-[10px] font-semibold">
                    {[
                        { id: 'both' as ProfileFilter, label: 'Both' },
                        { id: 'developer' as ProfileFilter, label: 'Dev (BD)' },
                        { id: 'client' as ProfileFilter, label: 'Client (IE)' },
                    ].map((tab) => (
                        <button
                            key={tab.id}
                            type="button"
                            onClick={() => setActiveFilter(tab.id)}
                            className={`px-2 py-0.5 rounded transition cursor-pointer ${
                                activeFilter === tab.id
                                    ? 'bg-white dark:bg-[#181a20] text-slate-900 dark:text-white shadow-xs'
                                    : 'text-gray-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200'
                            }`}
                        >
                            {tab.label}
                        </button>
                    ))}
                </div>
            </div>

            {/* Scrollable Developer (Bangladesh) & Client (Ireland) Accounts */}
            <div className="max-h-[215px] overflow-y-auto pr-1 space-y-3 scrollbar-thin scrollbar-thumb-slate-200 dark:scrollbar-thumb-slate-700">
                {groups.map((group) => (
                    <div key={group.key} className="space-y-1.5">
                        <div className="flex items-center justify-between">
                            <span className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold border ${group.badgeClass}`}>
                                {group.title}
                            </span>
                            <span className="text-[9.5px] text-gray-400 dark:text-slate-500">
                                Click to fill
                            </span>
                        </div>

                        <div className="flex flex-col gap-1.5">
                            {group.accounts.map((acc, idx) => {
                                const theme = getRoleTheme(acc.role);
                                const isSelected = activeEmail === acc.email;

                                return (
                                    <button
                                        key={`${group.key}-${acc.id || acc.email}-${idx}`}
                                        type="button"
                                        onClick={() => handleSelect(acc.email, acc.password || '')}
                                        className={`w-full px-2.5 py-1.5 flex items-center justify-between gap-2 rounded-[5px] border transition-all cursor-pointer text-left shadow-2xs ${theme.buttonBg} ${
                                            isSelected ? theme.activeRing : ''
                                        }`}
                                        title={`${acc.label || theme.roleTitle}: ${acc.email}${acc.name ? ' (' + acc.name + ')' : ''} • Click to fill`}
                                    >
                                        <div className="flex items-center gap-2 min-w-0">
                                            <div className={`w-5 h-5 rounded-[3px] flex items-center justify-center shrink-0 shadow-2xs ${theme.iconBg}`}>
                                                {theme.icon}
                                            </div>
                                            <div className="min-w-0">
                                                <div className="flex items-center gap-1.5">
                                                    <span className="text-[11px] font-bold text-slate-800 dark:text-slate-100 leading-none shrink-0">
                                                        {theme.roleTitle}
                                                    </span>
                                                    {acc.name && (
                                                        <span className="text-[10.5px] text-slate-600 dark:text-slate-300 font-medium truncate">
                                                            · {acc.name}
                                                        </span>
                                                    )}
                                                </div>
                                                <div className="text-[10px] text-slate-500 dark:text-slate-400 font-mono truncate mt-0.5">
                                                    {acc.email}
                                                </div>
                                            </div>
                                        </div>

                                        {acc.badge && (
                                            <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-white/80 dark:bg-black/30 text-slate-600 dark:text-slate-300 border border-slate-200/80 dark:border-slate-700 shrink-0">
                                                {acc.badge}
                                            </span>
                                        )}
                                    </button>
                                );
                            })}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
