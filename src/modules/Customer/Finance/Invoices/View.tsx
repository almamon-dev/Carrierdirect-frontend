import React, { useState } from 'react';
import { Printer, Download, ArrowLeft, Building2, Phone, Mail, CheckCircle2, ShieldCheck, Star, AlertCircle, Clock } from 'lucide-react';
import Button from '@/components/ui/button';
import Badge from '@/components/ui/badge';
import { useNavigate } from 'react-router-dom';
import RatingModal from '@/components/modals/rating-modal';

interface InvoiceViewProps {
    onBack?: () => void;
    invoice?: {
        id?: string;
        date?: string;
        dueDate?: string;
        amount?: string;
        status?: string;
        supplier?: string;
    };
}

export default function InvoiceView({ onBack, invoice }: InvoiceViewProps) {
    const navigate = useNavigate();
    const [isRatingOpen, setIsRatingOpen] = useState(false);

    const invoiceData = invoice || {
        id: 'INV-2026-003',
        date: '2026-07-18',
        dueDate: '2026-07-30',
        amount: '€ 2,136.70',
        status: 'Paid',
        supplier: 'Express Freight Logistics'
    };

    const isPaid = invoiceData.status === 'Paid';

    const handleBack = () => {
        if (onBack) {
            onBack();
        } else {
            navigate(-1);
        }
    };

    return (
        <div className="p-3 md:p-5 w-full mx-auto min-h-screen bg-slate-50/50 flex flex-col items-center font-sans antialiased pb-16">
            {/* Top Navigation & Action Bar */}
            <div className="w-full max-w-2xl flex flex-wrap items-center justify-between gap-2 mb-3">
                <Button 
                    variant="ghost" 
                    onClick={handleBack}
                    className="text-slate-600 hover:text-slate-900 gap-1.5 font-semibold h-7 px-2 text-[11px] cursor-pointer"
                >
                    <ArrowLeft size={13} /> Back to Invoices
                </Button>

                <div className="flex items-center gap-1.5">
                    {/* Rate Supplier Button - ONLY for Paid Invoices */}
                    {isPaid && (
                        <Button
                            variant="outline"
                            onClick={() => setIsRatingOpen(true)}
                            className="gap-1 font-bold bg-amber-50 text-amber-900 border-amber-200 hover:bg-amber-100 h-7 px-2.5 text-[11px] shadow-2xs cursor-pointer"
                        >
                            <Star size={12} className="fill-amber-400 text-amber-400" /> Rate Supplier
                        </Button>
                    )}
                    <Button 
                        variant="outline" 
                        onClick={() => window.print()}
                        className="gap-1 font-bold bg-white text-slate-700 border-slate-200 hover:bg-slate-50 h-7 px-2.5 text-[11px] shadow-2xs cursor-pointer"
                    >
                        <Printer size={12} /> Print Invoice
                    </Button>
                    <Button 
                        onClick={() => alert(`Downloading Invoice PDF ${invoiceData.id}...`)}
                        className="gap-1 font-bold bg-[#ff4a1f] hover:bg-[#e63d15] text-white h-7 px-2.5 text-[11px] shadow-2xs cursor-pointer"
                    >
                        <Download size={12} /> Download PDF
                    </Button>
                </div>
            </div>

            {/* Enterprise Compact Invoice Paper Container */}
            <div className="w-full max-w-2xl bg-white shadow-2xs rounded-lg border border-slate-200 p-4 md:p-5 space-y-4">
                {/* Header & Logo */}
                <div className="flex justify-between items-start gap-4 pb-4 border-b border-slate-100">
                    <div>
                        <div className="flex items-center gap-1.5 mb-1">
                            <div className="w-6 h-6 bg-[#ff4a1f] rounded-md flex items-center justify-center shadow-2xs">
                                <span className="text-white font-black text-xs leading-none">G</span>
                            </div>
                            <span className="text-base font-bold text-slate-900 tracking-tight">GetItMoving</span>
                        </div>
                        <div className="text-[11px] text-slate-500 space-y-0.5 leading-tight">
                            <p className="font-semibold text-slate-700">GetItMoving Logistics Tech Inc.</p>
                            <p>123 Logistics Avenue, Industrial Park, Dhaka 1212</p>
                            <div className="flex items-center gap-2 pt-0.5 text-[10.5px] text-slate-500">
                                <span className="flex items-center gap-0.5"><Phone size={10} /> +880 1711-000000</span>
                                <span>•</span>
                                <span className="flex items-center gap-0.5"><Mail size={10} /> billing@getitmoving.com</span>
                            </div>
                        </div>
                    </div>

                    <div className="text-right space-y-1">
                        <div>
                            <span className="text-[10px] font-bold text-[#ff4a1f] tracking-wider uppercase">TAX INVOICE</span>
                            <h1 className="text-base font-extrabold text-slate-900 tracking-tight">{invoiceData.id}</h1>
                        </div>

                        <div className="space-y-0.5 text-[11px]">
                            <div className="flex justify-end gap-2 text-slate-600">
                                <span className="font-normal text-slate-400">Issue Date:</span>
                                <span className="font-semibold text-slate-900">{invoiceData.date}</span>
                            </div>
                            <div className="flex justify-end gap-2 text-slate-600">
                                <span className="font-normal text-slate-400">Due Date:</span>
                                <span className="font-semibold text-slate-900">{invoiceData.dueDate}</span>
                            </div>
                            <div className="flex justify-end gap-2 items-center pt-0.5">
                                <span className="font-normal text-slate-400">Status:</span>
                                {invoiceData.status === 'Paid' && (
                                    <Badge className="bg-emerald-50 text-emerald-700 border border-emerald-200 px-1.5 py-0 text-[9.5px] font-bold">
                                        <CheckCircle2 size={10} className="mr-1 inline" /> Paid
                                    </Badge>
                                )}
                                {invoiceData.status === 'Due' && (
                                    <Badge className="bg-amber-50 text-amber-700 border border-amber-200 px-1.5 py-0 text-[9.5px] font-bold">
                                        <Clock size={10} className="mr-1 inline" /> Payment Due
                                    </Badge>
                                )}
                                {invoiceData.status === 'Overdue' && (
                                    <Badge className="bg-red-50 text-red-700 border border-red-200 px-1.5 py-0 text-[9.5px] font-bold">
                                        <AlertCircle size={10} className="mr-1 inline" /> Overdue
                                    </Badge>
                                )}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Billed To & Payment Method Info */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-[11px]">
                    <div className="bg-slate-50/80 p-3 rounded-md border border-slate-200/80 space-y-0.5">
                        <span className="text-[10.5px] font-bold text-slate-500 flex items-center gap-1 mb-1">
                            <Building2 size={12} className="text-[#ff4a1f]" /> Billed To
                        </span>
                        <p className="font-bold text-slate-900 text-xs">Walton Group Logistics BD</p>
                        <p className="text-slate-600">Attn: Rahim Uddin (Procurement Manager)</p>
                        <p className="text-slate-500">Plot-1088, Block-I, Bashundhara R/A, Dhaka</p>
                        <p className="text-slate-500">Supplier: {invoiceData.supplier || 'Express Freight Logistics'}</p>
                    </div>

                    <div className="bg-slate-50/80 p-3 rounded-md border border-slate-200/80 space-y-0.5">
                        <span className="text-[10.5px] font-bold text-slate-500 flex items-center gap-1 mb-1">
                            <ShieldCheck size={12} className="text-[#ff4a1f]" /> Payment Information
                        </span>
                        <p className="font-bold text-slate-900">Visa ending in •••• 4242</p>
                        <p className="text-slate-600">Transaction Ref: TXN-89214710</p>
                        <p className="text-slate-500">Paid on: {invoiceData.date} at 14:32 UTC</p>
                        <p className="text-emerald-700 font-semibold text-[10.5px]">Escrow Guaranteed & Verified</p>
                    </div>
                </div>

                {/* Itemized Invoice Table */}
                <div className="rounded-md border border-slate-200 overflow-hidden">
                    <table className="w-full text-[11px] text-left">
                        <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-bold">
                            <tr>
                                <th className="py-2 px-2.5 w-8 text-center">#</th>
                                <th className="py-2 px-2.5">Item Description</th>
                                <th className="py-2 px-2.5 text-center w-14">Qty</th>
                                <th className="py-2 px-2.5 text-right w-20">Rate</th>
                                <th className="py-2 px-2.5 text-right w-24">Amount</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 font-medium text-slate-800">
                            {[
                                { id: 1, desc: 'Freight Transport Logistics Service', qty: 1, rate: invoiceData.amount || '€ 25,500', amount: invoiceData.amount || '€ 25,500' },
                                { id: 2, desc: 'Priority Cargo Dispatch & Escrow Deposit', qty: 1, rate: '€ 125.00', amount: '€ 125.00' },
                            ].map((item) => (
                                <tr key={item.id} className="hover:bg-slate-50/50">
                                    <td className="py-2 px-2.5 text-center text-slate-400 font-semibold">{item.id}</td>
                                    <td className="py-2 px-2.5">
                                        <p className="font-bold text-slate-900">{item.desc}</p>
                                        <p className="text-[10px] text-slate-500 font-normal">Standard 24/7 priority support & escrow protection included.</p>
                                    </td>
                                    <td className="py-2 px-2.5 text-center text-slate-600 font-semibold">{item.qty}</td>
                                    <td className="py-2 px-2.5 text-right text-slate-600">{item.rate}</td>
                                    <td className="py-2 px-2.5 text-right font-bold text-slate-900">{item.amount}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* Subtotal & Financial Breakdown */}
                <div className="flex justify-end">
                    <div className="w-full sm:w-64 space-y-1.5 text-[11px] bg-slate-50/50 p-3 rounded-md border border-slate-200/80">
                        <div className="flex justify-between text-slate-600">
                            <span>Subtotal:</span>
                            <span className="font-semibold text-slate-900">{invoiceData.amount}</span>
                        </div>
                        <div className="flex justify-between text-slate-600">
                            <span>VAT (15%):</span>
                            <span className="font-semibold text-slate-900">Included</span>
                        </div>
                        <div className="flex justify-between items-baseline pt-1.5 border-t border-slate-200">
                            <span className="text-xs font-bold text-slate-900">Total Amount:</span>
                            <span className="text-base font-extrabold text-[#ff4a1f]">{invoiceData.amount}</span>
                        </div>
                    </div>
                </div>

                {/* Invoice Footer Notes & Verification Stamp */}
                <div className="border-t border-slate-100 pt-3 flex flex-col sm:flex-row items-center justify-between gap-2 text-[10.5px] text-slate-500">
                    <div className="flex items-center gap-1.5 text-slate-600 font-medium">
                        <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                        <span>Digitally Signed & Issued by GetItMoving SaaS Billing Engine</span>
                    </div>
                    <p className="text-slate-400">Questions? Contact support@getitmoving.com</p>
                </div>
            </div>

            {/* Rating Modal for Invoice View */}
            {isPaid && (
                <RatingModal
                    isOpen={isRatingOpen}
                    onClose={() => setIsRatingOpen(false)}
                    orderId={invoiceData.id}
                    targetName={invoiceData.supplier || 'Express Freight Logistics'}
                    targetRole="Supplier"
                    orderTitle="Priority Freight Logistics Dispatch"
                    onSubmit={(data) => console.log('Invoice rating submitted:', data)}
                />
            )}
        </div>
    );
}
