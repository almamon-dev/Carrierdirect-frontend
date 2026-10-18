import React from 'react';
import Badge from '@/components/ui/badge';

interface MemberRulesMatrixProps {
    roleName: string;
}

export const MemberRulesMatrix: React.FC<MemberRulesMatrixProps> = ({ roleName }) => {
    const roleLower = (roleName || '').toLowerCase();

    const quotesRules = [
        { id: 'q_view', name: 'View Quote Requests', desc: 'Browse shipper freight requests', allowed: true },
        { id: 'q_sub', name: 'Submit Price Bids', desc: 'Send bids & submit freight quotes', allowed: ['admin', 'operations', 'dispatcher', 'sales'].some((r) => roleLower.includes(r)) },
        { id: 'q_neg', name: 'Live Negotiation Chat', desc: 'Counter-offer live chat with shippers', allowed: ['admin', 'operations', 'dispatcher', 'sales', 'support'].some((r) => roleLower.includes(r)) },
        { id: 'q_arc', name: 'Won & Lost Archives', desc: 'Track winning bids & archive logs', allowed: true },
    ];

    const ordersRules = [
        { id: 'o_act', name: 'Active Jobs Tracking', desc: 'Monitor on-road transport jobs', allowed: true },
        { id: 'o_dsp', name: 'Dispatch Drivers & Fleet', desc: 'Assign fleet resources to shipments', allowed: ['admin', 'operations', 'dispatcher', 'driver'].some((r) => roleLower.includes(r)) },
        { id: 'o_pod', name: 'Verify Delivery POD', desc: 'Upload POD receipts & confirm delivery', allowed: ['admin', 'operations', 'dispatcher', 'driver'].some((r) => roleLower.includes(r)) },
        { id: 'o_sch', name: 'Availability & Lanes', desc: 'Publish available vehicles and lanes', allowed: ['admin', 'operations', 'dispatcher', 'driver'].some((r) => roleLower.includes(r)) },
    ];

    const adminRules = [
        { id: 'a_fin', name: 'Earnings & Payout Ledger', desc: 'View withdrawal requests and revenue', allowed: ['admin', 'finance', 'billing'].some((r) => roleLower.includes(r)) },
        { id: 'a_cfg', name: 'Organization Settings', desc: 'Configure organization preferences & roles', allowed: roleLower.includes('admin') },
    ];

    return (
        <div className="flex-1 w-full min-w-0 bg-white dark:bg-[#12161c] rounded-[3px] border border-slate-200 dark:border-slate-800 shadow-none h-auto">
            <div className="p-4 space-y-3">
                <div className="flex items-center justify-between pb-1">
                    <div>
                        <h3 className="text-xs font-bold text-slate-900 dark:text-slate-100 tracking-tight">
                            Assigned System Rules & Permissions
                        </h3>
                        <p className="text-[11px] text-slate-500 dark:text-slate-400">
                            Governed by <span className="font-semibold text-slate-700 dark:text-slate-300">{roleName}</span> role configuration.
                        </p>
                    </div>
                    <Badge variant="secondary" className="bg-orange-50 dark:bg-[#ff4a1f]/15 text-[#ff4a1f] text-[10px] font-bold px-1.5 py-0">
                        RBAC Assigned
                    </Badge>
                </div>

                {/* Flat 3 Columns with Hairline Row Dividers */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-1">
                    {/* Column 1: Quotes */}
                    <div className="space-y-1">
                        <h4 className="text-[11px] font-bold text-slate-800 dark:text-slate-200 pb-1.5 border-b border-slate-200 dark:border-slate-700">
                            Quotes & Bidding
                        </h4>
                        <div className="divide-y divide-slate-100 dark:divide-slate-800">
                            {quotesRules.map((rule) => (
                                <div key={rule.id} className="py-2 flex items-center justify-between gap-2 text-xs">
                                    <span className="text-slate-700 dark:text-slate-300 font-medium truncate">{rule.name}</span>
                                    <span className={`text-[10px] font-bold shrink-0 px-1.5 py-0.5 rounded ${rule.allowed ? 'text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40' : 'text-slate-400 bg-slate-100 dark:bg-slate-800'}`}>
                                        {rule.allowed ? '✓ Yes' : '✕ No'}
                                    </span>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Column 2: Orders */}
                    <div className="space-y-1">
                        <h4 className="text-[11px] font-bold text-slate-800 dark:text-slate-200 pb-1.5 border-b border-slate-200 dark:border-slate-700">
                            Orders & Fleet
                        </h4>
                        <div className="divide-y divide-slate-100 dark:divide-slate-800">
                            {ordersRules.map((rule) => (
                                <div key={rule.id} className="py-2 flex items-center justify-between gap-2 text-xs">
                                    <span className="text-slate-700 dark:text-slate-300 font-medium truncate">{rule.name}</span>
                                    <span className={`text-[10px] font-bold shrink-0 px-1.5 py-0.5 rounded ${rule.allowed ? 'text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40' : 'text-slate-400 bg-slate-100 dark:bg-slate-800'}`}>
                                        {rule.allowed ? '✓ Yes' : '✕ No'}
                                    </span>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Column 3: Finance & Admin */}
                    <div className="space-y-1">
                        <h4 className="text-[11px] font-bold text-slate-800 dark:text-slate-200 pb-1.5 border-b border-slate-200 dark:border-slate-700">
                            Finance & Admin
                        </h4>
                        <div className="divide-y divide-slate-100 dark:divide-slate-800">
                            {adminRules.map((rule) => (
                                <div key={rule.id} className="py-2 flex items-center justify-between gap-2 text-xs">
                                    <span className="text-slate-700 dark:text-slate-300 font-medium truncate">{rule.name}</span>
                                    <span className={`text-[10px] font-bold shrink-0 px-1.5 py-0.5 rounded ${rule.allowed ? 'text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40' : 'text-slate-400 bg-slate-100 dark:bg-slate-800'}`}>
                                        {rule.allowed ? '✓ Yes' : '✕ No'}
                                    </span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
