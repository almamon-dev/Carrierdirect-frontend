import React from 'react';
import { Printer, Download, ArrowLeft, Building2, Phone, Mail } from 'lucide-react';
import Button from '@/components/ui/button';
import Badge from '@/components/ui/badge';

export default function InvoiceView() {
    return (
        <div className="p-3 md:p-4 w-full mx-auto min-h-screen bg-slate-50 flex flex-col items-center">
            {/* Toolbar */}
            <div className="w-full max-w-3xl flex items-center justify-between mb-3">
                <Button variant="ghost" className="text-slate-600 hover:text-slate-900 gap-1.5 font-medium h-7 px-2 text-[11px]">
                    <ArrowLeft size={14} /> Back to Invoices
                </Button>
                <div className="flex gap-2">
                    <Button variant="outline" className="gap-1.5 font-bold bg-white text-slate-700 border-slate-200 h-7 px-3 text-[11px]">
                        <Printer size={13} /> Print
                    </Button>
                    <Button variant="primary" className="gap-1.5 font-bold bg-brand hover:bg-brand-hover text-white h-7 px-3 text-[11px]">
                        <Download size={13} /> Download PDF
                    </Button>
                </div>
            </div>

            {/* Compact A4 Invoice Paper */}
            <div className="w-full max-w-3xl bg-white shadow-sm rounded border border-slate-200 p-5 md:p-6">
                {/* Header */}
                <div className="flex justify-between items-start mb-6">
                    <div>
                        <div className="flex items-center gap-1.5 mb-2">
                            <div className="w-7 h-7 bg-brand rounded flex items-center justify-center">
                                <span className="text-white font-black text-sm leading-none">G</span>
                            </div>
                            <span className="text-[15px] font-black text-slate-900 tracking-tight">GetItMoving</span>
                        </div>
                        <div className="text-[10px] text-slate-500 space-y-0.5 leading-tight">
                            <p>123 Logistics Avenue, Industrial Estate</p>
                            <p>Dhaka 1212, Bangladesh</p>
                            <p className="flex items-center gap-1 mt-1"><Phone size={10} /> +880 1711-000000</p>
                            <p className="flex items-center gap-1"><Mail size={10} /> billing@getitmoving.com</p>
                        </div>
                    </div>
                    <div className="text-right">
                        <h1 className="text-[18px] font-bold text-slate-900 tracking-widest mb-2">INVOICE</h1>
                        <div className="space-y-1 text-[10.5px]">
                            <p className="flex justify-between gap-6"><span className="text-slate-400 font-medium">Invoice No:</span> <span className="font-bold text-slate-900">INV-2026-003</span></p>
                            <p className="flex justify-between gap-6"><span className="text-slate-400 font-medium">Issue Date:</span> <span className="font-medium text-slate-900">Jul 18, 2026</span></p>
                            <p className="flex justify-between gap-6"><span className="text-slate-400 font-medium">Due Date:</span> <span className="font-medium text-slate-900">Jul 30, 2026</span></p>
                            <p className="flex justify-between gap-6 items-center mt-1.5 pt-1.5 border-t border-slate-100">
                                <span className="text-slate-400 font-medium">Status:</span> 
                                <Badge variant="warning" className="px-1.5 py-0 text-[9px]">Due</Badge>
                            </p>
                        </div>
                    </div>
                </div>

                {/* Billing Info */}
                <div className="mb-5 text-[10.5px]">
                    <div className="bg-slate-50 p-2.5 rounded border border-slate-100 w-1/2">
                        <h3 className="text-[13px] font-bold text-slate-800 uppercase tracking-wider mb-1.5 flex items-center gap-1"><Building2 size={10}/> Billed To</h3>
                        <p className="font-bold text-slate-900 text-[11.5px] mb-0.5">Walton Group BD</p>
                        <p className="text-slate-600">Attn: Rahim Uddin (Manager)</p>
                        <p className="text-slate-600">Plot-1088, Block-I, Bashundhara R/A, Dhaka</p>
                        <p className="text-slate-600">BIN: 987654321</p>
                    </div>
                </div>

                {/* Table */}
                <div className="mb-5">
                    <div className="flex bg-slate-100 text-slate-600 text-[9px] font-bold uppercase tracking-wider px-2 py-1.5 border border-slate-200 rounded-t">
                        <div className="w-8 text-center">#</div>
                        <div className="flex-1">Description</div>
                        <div className="w-16 text-center">Qty</div>
                        <div className="w-24 text-right">Rate</div>
                        <div className="w-24 text-right">Amount</div>
                    </div>
                    <div className="border-x border-b border-slate-200 rounded-b">
                        {[
                            { id: 1, desc: 'Enterprise Shipper Subscription (Monthly)', qty: 1, rate: '5,000', amount: '5,000' },
                            { id: 2, desc: 'Additional API Requests (10k Batch)', qty: 2, rate: '2,500', amount: '5,000' },
                            { id: 3, desc: 'Express Freight Charge (Dhaka to Chittagong)', qty: 1, rate: '12,500', amount: '12,500' },
                        ].map((item, i) => (
                            <div key={i} className="flex px-2 py-2 border-b border-slate-100 last:border-0 text-[10.5px]">
                                <div className="w-8 text-center text-slate-400 font-medium">{item.id}</div>
                                <div className="flex-1 font-medium text-slate-800">{item.desc}</div>
                                <div className="w-16 text-center text-slate-600">{item.qty}</div>
                                <div className="w-24 text-right text-slate-600">€ {item.rate}</div>
                                <div className="w-24 text-right font-bold text-slate-900">€ {item.amount}</div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Summary */}
                <div className="flex justify-end mb-6">
                    <div className="w-64">
                        <div className="space-y-1 text-[10.5px]">
                            <div className="flex justify-between text-slate-600">
                                <span>Subtotal:</span>
                                <span className="font-medium text-slate-900">€ 22,500</span>
                            </div>
                            <div className="flex justify-between text-slate-600">
                                <span>Discount:</span>
                                <span className="font-medium text-slate-900">€ 0</span>
                            </div>
                            <div className="flex justify-between text-slate-600">
                                <span>VAT (15%):</span>
                                <span className="font-medium text-slate-900">€ 3,375</span>
                            </div>
                            <div className="flex justify-between items-end pt-1.5 mt-1.5 border-t border-slate-200">
                                <span className="text-[11px] font-bold text-slate-900">Total Amount:</span>
                                <span className="text-[14px] font-black text-brand leading-none">€ 25,875</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Footer Notes */}
                <div className="border-t border-slate-200 pt-3 text-[9px] text-slate-500 text-center">
                    <p className="font-semibold text-slate-600 mb-0.5">Payment Instructions</p>
                    <p>Please make the payment by the due date via Bank Transfer, bKash, or your GetItMoving dashboard.</p>
                </div>
            </div>
        </div>
    );
}
