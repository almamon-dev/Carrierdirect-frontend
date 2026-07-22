import React from 'react';
import { CreditCard, ShieldCheck, Package, Calendar, Download, Building, MapPin, Receipt, CheckCircle, Check } from 'lucide-react';
import Button from '@/components/ui/button';
import Badge from '@/components/ui/badge';

export default function Billing() {
    return (
        <div className="p-3 md:p-4 mx-auto min-h-screen">
            {/* Header */}
            <div className="mb-4 flex flex-col md:flex-row md:items-center justify-between gap-3">
                <div>
                    <h1 className="text-[18px] font-bold text-slate-900">Billing & Subscription</h1>
                    <p className="text-[11.5px] text-slate-500 font-medium mt-0.5">Manage your active subscription, payment methods, and billing history.</p>
                </div>
                <div className="flex items-center gap-2">
                    <div className="flex items-center gap-1.5 px-2.5 py-1 rounded bg-emerald-50 border border-emerald-100 text-emerald-700 mr-2">
                        <ShieldCheck size={14} />
                        <span className="text-[10.5px] font-bold tracking-wide">Secure</span>
                    </div>
                    <Button variant="outline" className="text-slate-600 border-slate-200 hover:bg-slate-50 h-7 px-3 font-semibold text-[12px]">
                        <Download size={13} className="mr-1.5" /> Statement
                    </Button>
                </div>
            </div>

            <div className="grid grid-cols-1 xl:grid-cols-12 gap-3 xl:gap-4">

                {/* Column 1: Left Side (Span 8) */}
                <div className="xl:col-span-8 flex flex-col gap-3 xl:gap-4">

                    {/* Current Plan Details */}
                    <div className="bg-white rounded-lg border border-slate-200 p-3.5 lg:p-4 shadow-sm">
                        <div className="flex items-center justify-between mb-3 pb-2 border-b border-slate-100">
                            <h2 className="text-[15px] font-bold text-slate-800 .5px] tracking-wide">Active Plan Details</h2>
                            <Button variant="outline" size="sm" className="h-6 px-2 text-[10.5px] font-bold text-brand border-indigo-200 hover:bg-brand-light">
                                Upgrade Plan
                            </Button>
                        </div>

                        <div className="flex items-start gap-3">
                            <div className="w-10 h-10 bg-brand-light text-brand rounded-lg flex items-center justify-center font-bold shrink-0 border border-indigo-100">
                                <Package size={20} />
                            </div>
                            <div className="flex-1 w-full">
                                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-1">
                                    <h3 className="text-[13px] font-bold text-slate-800">Enterprise Shipper</h3>
                                    <Badge variant="success" className="px-2 py-0.5 text-[10px] font-bold w-fit">Active</Badge>
                                </div>
                                <p className="text-[12px] text-slate-500 font-medium leading-tight mb-3 border-b border-slate-50 pb-3">
                                    Full access to all enterprise logistics features, dedicated account manager, and priority support.
                                </p>

                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-2 gap-x-4">
                                    <div className="flex items-center gap-1.5 text-[11.5px] font-medium text-slate-700">
                                        <Check size={12} className="text-brand shrink-0" /> Unlimited order tracking
                                    </div>
                                    <div className="flex items-center gap-1.5 text-[11.5px] font-medium text-slate-700">
                                        <Check size={12} className="text-brand shrink-0" /> Dedicated account manager
                                    </div>
                                    <div className="flex items-center gap-1.5 text-[11.5px] font-medium text-slate-700">
                                        <Check size={12} className="text-brand shrink-0" /> Priority 24/7 customer support
                                    </div>
                                    <div className="flex items-center gap-1.5 text-[11.5px] font-medium text-slate-700">
                                        <Check size={12} className="text-brand shrink-0" /> Advanced analytics dashboard
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Payment Method & Billing Info (Side by Side inside Column 1) */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 xl:gap-4 flex-1">

                        {/* Payment Method */}
                        <div className="bg-white rounded-lg border border-slate-200 p-3.5 lg:p-4 shadow-sm flex flex-col">
                            <div className="flex items-center justify-between mb-3 pb-2 border-b border-slate-100">
                                <div className="flex items-center gap-1.5 text-indigo-700">
                                    <CreditCard size={14} />
                                    <h2 className="text-[15px] font-bold text-slate-800 .5px] tracking-wide">Payment Method</h2>
                                </div>
                                <button className="text-[10.5px] font-bold text-brand hover:underline">Edit</button>
                            </div>

                            <div className="relative w-full rounded-xl bg-gradient-to-tr from-slate-900 via-slate-800 to-slate-700 p-4 text-white shadow-md overflow-hidden flex flex-col justify-between h-[135px]">
                                {/* Decorative elements */}
                                <div className="absolute -right-6 -top-6 w-24 h-24 bg-white/10 rounded-full blur-xl"></div>
                                <div className="absolute -left-6 -bottom-6 w-24 h-24 bg-white/10 rounded-full blur-xl"></div>

                                <div className="flex justify-between items-start relative z-10">
                                    {/* Chip icon simulation */}
                                    <div className="w-8 h-6 bg-gradient-to-br from-amber-200 to-amber-400 rounded-sm flex items-center justify-center opacity-90 shadow-sm">
                                        <div className="w-5 h-3 border border-amber-600/30 rounded-[1px]"></div>
                                    </div>
                                    <span className="text-[13px] font-bold italic tracking-wider opacity-90">VISA</span>
                                </div>

                                <div className="relative z-10 mt-auto">
                                    <p className="text-[15px] font-mono tracking-[0.2em] mb-2 text-slate-100 shadow-sm">•••• •••• •••• 4242</p>
                                    <div className="flex justify-between items-end">
                                        <div>
                                            <p className="text-[7.5px] tracking-widest text-slate-400 mb-0.5 font-semibold">Card Holder</p>
                                            <p className="text-[10.5px] font-semibold tracking-wide text-white">Rahim Uddin</p>
                                        </div>
                                        <div className="text-right">
                                            <p className="text-[7.5px] tracking-widest text-slate-400 mb-0.5 font-semibold">Expires</p>
                                            <p className="text-[10.5px] font-semibold tracking-wide text-white">08/27</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Billing Information */}
                        <div className="bg-white rounded-lg border border-slate-200 p-3.5 lg:p-4 shadow-sm flex flex-col">
                            <div className="flex items-center justify-between mb-3 pb-2 border-b border-slate-100">
                                <div className="flex items-center gap-1.5 text-indigo-700">
                                    <Building size={14} />
                                    <h2 className="text-[15px] font-bold text-slate-800 .5px] tracking-wide">Billing Profile</h2>
                                </div>
                                <button className="text-[10.5px] font-bold text-brand hover:underline">Edit</button>
                            </div>

                            <div className="flex-1 w-full flex flex-col h-full">
                                <div className="grid grid-cols-[60px_12px_1fr] gap-y-1.5 text-[11.5px] w-full">
                                    <span className="text-slate-500 font-medium">Company</span>
                                    <span className="text-slate-400 text-center">:</span>
                                    <span className="font-bold text-slate-800 text-[11.5px]">Walton Group BD</span>

                                    <span className="text-slate-500 font-medium">Tax/BIN</span>
                                    <span className="text-slate-400 text-center">:</span>
                                    <span className="text-slate-700">BIN-987654321</span>

                                    <span className="text-slate-500 font-medium">Contact</span>
                                    <span className="text-slate-400 text-center">:</span>
                                    <span className="text-slate-700">Rahim Uddin (Manager)</span>

                                    <span className="text-slate-500 font-medium">Email</span>
                                    <span className="text-slate-400 text-center">:</span>
                                    <span className="text-slate-700">billing@walton.bd</span>

                                    <span className="text-slate-500 font-medium">Phone</span>
                                    <span className="text-slate-400 text-center">:</span>
                                    <span className="text-slate-700">+8801711-223344</span>

                                    <div className="col-span-3 h-px bg-slate-100 my-1"></div>

                                    <span className="text-slate-500 font-medium flex items-center gap-1"><MapPin size={11} className="text-slate-400" /> Addr.</span>
                                    <span className="text-slate-400 text-center">:</span>
                                    <span className="text-slate-700 leading-tight">Plot-1088, Block-I, Bashundhara R/A, Dhaka</span>
                                </div>
                            </div>
                        </div>

                    </div>
                </div>

                {/* Column 2: Right Side (Span 4) */}
                <div className="xl:col-span-4 flex flex-col gap-3 xl:gap-4">

                    {/* Total Outstanding */}
                    <div className="bg-white p-3.5 lg:p-4 rounded-lg border border-slate-200 shadow-sm relative overflow-hidden">
                        {/* Decorative background element similar to other components */}
                        <div className="absolute -right-4 -top-4 w-16 h-16 bg-rose-50 rounded-full blur-xl pointer-events-none"></div>

                        <h2 className="text-[15px] font-bold text-slate-800 .5px] mb-2 pb-2 border-b border-slate-100 tracking-wide relative z-10">Outstanding Balance</h2>
                        <p className="text-[10.5px] text-slate-500 font-medium mb-3 relative z-10 leading-snug">
                            This is your total unpaid amount for recent shipping invoices and 'Pay Later' freight charges.
                        </p>

                        <div className="relative z-10">
                            <span className="block text-[10.5px] font-semibold text-slate-500 mb-1">Total Due Amount</span>
                            <div className="flex items-end gap-1.5 mb-3">
                                <span className="text-[24px] font-bold text-rose-600 leading-none">€ 25,500</span>
                            </div>

                            <div className="flex items-center justify-between text-[11.5px] mb-4 bg-slate-50 p-2 rounded border border-slate-100">
                                <span className="text-slate-500 font-medium">Due Date</span>
                                <span className="font-bold text-slate-800 flex items-center gap-1"><Calendar size={12} className="text-slate-400" /> 2026-07-30</span>
                            </div>

                            <Button variant="primary" className="w-full bg-slate-900 hover:bg-slate-800 text-white border-none h-8 font-bold text-[12px]">
                                Pay Outstanding Now
                            </Button>
                        </div>
                    </div>

                    {/* Subscription Pricing Breakdown */}
                    <div className="bg-white p-3.5 lg:p-4 rounded-lg border border-slate-200 shadow-sm flex-1 flex flex-col">
                        <h2 className="text-[15px] font-bold text-slate-800 .5px] mb-3 pb-2 border-b border-slate-100 tracking-wide">Next Billing Cycle</h2>

                        <div className="space-y-2 mb-3">
                            <div className="flex justify-between items-center text-[11.5px]">
                                <span className="text-slate-500 font-medium">Plan Fee (Monthly)</span>
                                <span className="font-bold text-slate-800">€ 5,000</span>
                            </div>
                            <div className="flex justify-between items-center text-[11.5px]">
                                <span className="text-slate-500 font-medium">Additional Services</span>
                                <span className="font-bold text-slate-800">€ 0</span>
                            </div>
                            <div className="flex justify-between items-center text-[11.5px]">
                                <span className="text-slate-500 font-medium">VAT/Tax (15%)</span>
                                <span className="font-bold text-slate-800">€ 750</span>
                            </div>
                        </div>

                        <div className="mt-auto">
                            <div className="flex justify-between items-end pt-3 border-t border-slate-100 mb-3">
                                <span className="text-[11.5px] font-bold text-slate-800">Estimated Total</span>
                                <span className="text-[16px] font-bold text-slate-900 leading-none">€ 5,750</span>
                            </div>
                            <div className="text-center bg-slate-50 rounded p-1.5 border border-slate-100">
                                <p className="text-[10px] font-medium text-slate-500 tracking-wide">Next Invoice: Aug 10, 2026</p>
                            </div>
                        </div>
                    </div>

                </div>
            </div>

            {/* Billing History Full Width */}
            <div className="mt-3 xl:mt-4">
                <div className="bg-white p-3.5 lg:p-4 rounded-lg border border-slate-200 shadow-sm overflow-x-auto">
                    <div className="flex items-center justify-between mb-4 pb-2 border-b border-slate-100 min-w-[700px]">
                        <h2 className="text-[15px] font-bold text-slate-800 .5px] tracking-wide flex items-center gap-1.5">
                            <Receipt size={14} className="text-brand" /> Recent Billing History
                        </h2>
                        <button className="text-[10.5px] font-bold text-brand hover:underline">View All Invoices</button>
                    </div>

                    <div className="min-w-[700px]">
                        {/* Table Header */}
                        <div className="flex items-center gap-4 px-2 pb-2 border-b border-slate-200 text-[10.5px] font-bold text-slate-500 tracking-wide">
                            <div className="w-20 shrink-0">Invoice No.</div>
                            <div className="w-20 shrink-0">Date</div>
                            <div className="flex-1">Description</div>
                            <div className="w-32 shrink-0">Billing Period</div>
                            <div className="w-32 shrink-0">Payment Method</div>
                            <div className="w-24 text-right shrink-0">Amount</div>
                            <div className="w-20 text-right shrink-0">Status</div>
                            <div className="w-8 shrink-0"></div>
                        </div>

                        <div className="space-y-0">
                            {[
                                { id: 'INV-2026-07', date: '2026-07-10', plan: 'Enterprise Shipper - Monthly', period: 'Jul 1 - Jul 31', method: '•••• 4242', methodType: 'visa', amount: '€ 5,750', status: 'Paid' },
                                { id: 'INV-2026-06', date: '2026-06-10', plan: 'Enterprise Shipper - Monthly', period: 'Jun 1 - Jun 30', method: '01711•••344', methodType: 'bkash', amount: '€ 5,750', status: 'Pending' },
                                { id: 'INV-2026-05', date: '2026-05-10', plan: 'Enterprise Shipper - Monthly', period: 'May 1 - May 31', method: '•••• 4242', methodType: 'visa', amount: '€ 5,750', status: 'Failed' },
                            ].map((item, i) => (
                                <div key={i} className="flex items-center gap-4 p-2 border-b border-slate-50 last:border-0 hover:bg-slate-50 transition-colors rounded-sm">
                                    <div className="w-20 shrink-0">
                                        <span className="text-[11.5px] font-bold text-brand block">{item.id}</span>
                                    </div>
                                    <div className="w-20 shrink-0">
                                        <span className="text-[11px] text-slate-600 font-medium block">{item.date}</span>
                                    </div>
                                    <div className="flex-1">
                                        <p className="text-[11.5px] font-medium text-slate-800">{item.plan}</p>
                                    </div>
                                    <div className="w-32 shrink-0">
                                        <p className="text-[11px] text-slate-600">{item.period}</p>
                                    </div>
                                    <div className="w-32 shrink-0 flex items-center gap-2">
                                        {item.methodType === 'visa' ? (
                                            <div className="w-7 h-5 bg-slate-800 rounded flex items-center justify-center shrink-0">
                                                <span className="text-white text-[6px] font-bold italic">VISA</span>
                                            </div>
                                        ) : (
                                            <div className="w-7 h-5 bg-pink-600 rounded flex items-center justify-center shrink-0">
                                                <span className="text-white text-[6px] font-bold">bKash</span>
                                            </div>
                                        )}
                                        <p className="text-[11px] text-slate-600">{item.method}</p>
                                    </div>
                                    <div className="w-24 text-right shrink-0">
                                        <p className="text-[11.5px] font-bold text-slate-900">{item.amount}</p>
                                    </div>
                                    <div className="w-20 text-right shrink-0">
                                        <Badge variant={item.status === 'Paid' ? 'success' : item.status === 'Pending' ? 'warning' : 'destructive'} className="px-1.5 py-0 text-[9.5px]">
                                            {item.status}
                                        </Badge>
                                    </div>
                                    <div className="w-8 flex justify-end shrink-0">
                                        <button className="text-slate-400 hover:text-brand bg-white border border-slate-200 shadow-sm p-1 rounded hover:bg-slate-50"><Download size={13} /></button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
