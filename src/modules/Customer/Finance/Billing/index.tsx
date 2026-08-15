import React, { useState, useEffect } from 'react';
import { Download, Clock, Receipt } from 'lucide-react';
import Badge from '@/components/ui/badge';
import Button from '@/components/ui/button';
import EmptyState from '@/components/tables/empty-state';
import apiClient from '@/lib/axios';

export default function Billing() {
    const [invoices, setInvoices] = useState<any[]>([]);
    const [stats, setStats] = useState<any>(null);
    const [subscription, setSubscription] = useState<any>(null);

    const fetchBillingData = async () => {
        try {
            const [invoiceRes, subRes] = await Promise.allSettled([
                apiClient.get('/customer/invoices'),
                apiClient.get('/subscription/status'),
            ]);

            if (invoiceRes.status === 'fulfilled' && invoiceRes.value) {
                const resData = invoiceRes.value.data || invoiceRes.value;
                const list = resData?.data || resData?.invoices?.data || resData?.invoices || [];
                setInvoices(Array.isArray(list) ? list : []);
                setStats(resData?.stats || resData?.meta?.stats || null);
            } else {
                setInvoices([]);
            }

            if (subRes.status === 'fulfilled' && subRes.value) {
                const subData = subRes.value.data || subRes.value;
                setSubscription(subData?.data || subData || null);
            }
        } catch (error) {
            console.error('Failed to load billing data:', error);
            setInvoices([]);
        }
    };

    useEffect(() => {
        fetchBillingData();
    }, []);

    return (
        <div className="p-3 sm:p-4 md:p-6 w-full mx-auto min-h-screen space-y-4 font-sans text-slate-800 antialiased">
            {/* Header section */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-200 pb-3">
                <div>
                    <h1 className="text-lg sm:text-xl font-bold text-slate-900 tracking-tight">Billing & Invoicing Overview</h1>
                    <p className="text-xs text-slate-500 mt-0.5 font-normal">Manage your subscription, invoices, outstanding balances, and payment preferences.</p>
                </div>
                <div className="flex items-center gap-2">
                    <Button variant="outline" className="h-8 text-xs font-bold bg-white text-slate-700 hover:bg-slate-50 cursor-pointer">
                        <Download size={13} className="mr-1.5" /> Statement
                    </Button>
                </div>
            </div>

            {/* Content grid */}
            <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">
                
                {/* Active Subscription Summary */}
                <div className="xl:col-span-2 bg-white p-4 rounded-lg border border-slate-200 shadow-sm flex flex-col justify-between">
                    <div>
                        <div className="flex justify-between items-start mb-3 border-b border-slate-100 pb-2.5">
                            <div>
                                <span className="text-[10px] font-extrabold uppercase tracking-wider text-[#ff4a1f]">Current Active Plan</span>
                                <h2 className="text-lg font-bold text-slate-900 mt-0.5">
                                    {subscription?.plan_name || subscription?.name || 'Shipper Basic'}
                                </h2>
                            </div>
                            <Badge variant={subscription?.status === 'active' ? 'success' : 'warning'} className="px-2.5 py-0.5 text-xs font-bold">
                                {subscription?.status ? ucfirst(subscription.status) : 'Active'}
                            </Badge>
                        </div>

                        <p className="text-xs text-slate-600 mb-4">
                            Full access to spot quote requests, cargo tracking, supplier negotiations, and digital invoices.
                        </p>
                    </div>

                    <div className="pt-3 border-t border-slate-100 flex flex-wrap items-center justify-between gap-2">
                        <div className="flex items-center gap-2 text-xs text-slate-500">
                            <Clock size={14} className="text-slate-400" />
                            <span>Billing Cycle: Monthly</span>
                        </div>
                        <Button variant="primary" className="h-8 text-xs font-bold bg-[#ff4a1f] hover:bg-[#e03e15] text-white cursor-pointer">
                            Upgrade / Change Plan
                        </Button>
                    </div>
                </div>

                {/* Outstanding & Stats Card */}
                <div className="bg-white p-4 rounded-lg border border-slate-200 shadow-sm flex flex-col justify-between">
                    <h2 className="text-[13px] font-bold text-slate-800 border-b border-slate-100 pb-2 mb-3">Billing Summary</h2>

                    <div className="space-y-3">
                        <div className="flex justify-between items-center text-xs">
                            <span className="text-slate-500">Total Spent</span>
                            <span className="font-bold text-slate-900">{stats?.total_spent || '€ 0'}</span>
                        </div>
                        <div className="flex justify-between items-center text-xs">
                            <span className="text-slate-500">Total Outstanding</span>
                            <span className="font-bold text-rose-600">{stats?.total_outstanding || '€ 0'}</span>
                        </div>
                        <div className="flex justify-between items-center text-xs">
                            <span className="text-slate-500">Total Invoices</span>
                            <span className="font-bold text-slate-800">{stats?.total_invoices || invoices.length}</span>
                        </div>
                    </div>

                    <div className="mt-4 pt-3 border-t border-slate-100 text-center">
                        <p className="text-[11px] text-slate-400 font-medium">All payments secured with 256-bit SSL encryption</p>
                    </div>
                </div>
            </div>

            {/* Invoices History Table */}
            <div className="bg-white p-4 rounded-lg border border-slate-200 shadow-sm">
                <div className="flex items-center justify-between mb-3 border-b border-slate-100 pb-2">
                    <h2 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                        <Receipt size={16} className="text-[#ff4a1f]" /> Recent Billing History
                    </h2>
                </div>

                {invoices.length === 0 ? (
                    <EmptyState
                        icon={Receipt}
                        title="No Billing History"
                        description="There are no billing transactions or invoices associated with your account yet."
                    />
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full text-left text-xs">
                            <thead>
                                <tr className="border-b border-slate-200 text-slate-500 font-bold">
                                    <th className="py-2.5 px-3">Invoice No.</th>
                                    <th className="py-2.5 px-3">Issue Date</th>
                                    <th className="py-2.5 px-3">Due Date</th>
                                    <th className="py-2.5 px-3 text-right">Amount</th>
                                    <th className="py-2.5 px-3 text-center">Status</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                                {invoices.map((inv) => (
                                    <tr key={inv.id} className="hover:bg-slate-50">
                                        <td className="py-2.5 px-3 font-bold text-[#ff4a1f]">{inv.invoice_number || inv.id}</td>
                                        <td className="py-2.5 px-3 text-slate-600">{inv.date || inv.created_at_formatted || 'N/A'}</td>
                                        <td className="py-2.5 px-3 text-slate-600">{inv.due_date || inv.dueDate || 'N/A'}</td>
                                        <td className="py-2.5 px-3 text-right font-bold text-slate-900">{inv.amount || inv.total_amount_formatted || `€ ${inv.total_amount || 0}`}</td>
                                        <td className="py-2.5 px-3 text-center">
                                            <Badge variant={inv.status === 'paid' ? 'success' : inv.status === 'due' ? 'warning' : 'destructive'}>
                                                {inv.status ? ucfirst(inv.status) : 'Pending'}
                                            </Badge>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    );
}

function ucfirst(str: string) {
    if (!str) return '';
    return str.charAt(0).toUpperCase() + str.slice(1);
}
