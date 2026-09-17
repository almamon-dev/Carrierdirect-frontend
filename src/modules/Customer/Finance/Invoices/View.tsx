import React, { useState } from 'react';
import { Printer, Download, ArrowLeft, Building2, Phone, Mail, CheckCircle2, ShieldCheck, Star, AlertCircle, Clock } from 'lucide-react';
import Button from '@/components/ui/button';
import Badge from '@/components/ui/badge';
import { useNavigate } from 'react-router-dom';
import RatingModal from '@/components/modals/rating-modal';
import { exportInvoicePdf, openInvoicePreview } from "@/utils/exportInvoicePdf";

interface InvoiceViewProps {
    onBack?: () => void;
    invoice?: any;
    onDownload?: (inv: any) => void;
}

export default function InvoiceView({ onBack, invoice, onDownload }: InvoiceViewProps) {
    const navigate = useNavigate();
    const [isRatingOpen, setIsRatingOpen] = useState(false);

    const invoiceData = invoice || {
        id: 'INV-2026-003',
        invoice_number: 'INV-2026-003',
        order_number: 'ORD-0007',
        date: '2026-07-18',
        dueDate: '2026-07-30',
        amount: '€ 2,136.70',
        total_amount_formatted: '€ 2,136.70',
        status: 'Paid',
        supplier: 'Express Freight Logistics',
        supplier_name: 'Express Freight Logistics',
        customer_company: 'Walton Group Logistics BD',
        customer_name: 'Rahim Uddin',
        customer_address: 'Plot-1088, Block-I, Bashundhara R/A, Dhaka',
        route: 'Dhaka EPZ ➔ Chittagong Port',
    };

    const rawStatus = (invoiceData.status || invoiceData.payment_status || 'Paid').toLowerCase();
    const isPaid = rawStatus === 'paid' || rawStatus === 'cleared' || rawStatus === 'completed';
    const isDue = rawStatus === 'due' || rawStatus === 'overdue' || rawStatus === 'pending';
    const isOverdue = rawStatus === 'overdue';
    const isPayLater = invoiceData.is_pay_later || invoiceData.invoice_type === 'pay_later';

    const handleBack = () => {
        if (onBack) {
            onBack();
        } else {
            navigate(-1);
        }
    };

    const handleExport = () => {
        if (onDownload) {
            onDownload(invoiceData);
        } else {
            openInvoicePreview(invoiceData);
        }
    };

    const displayInvId = invoiceData.invoice_number || invoiceData.invoice_id || invoiceData.id || 'INV-0001';
    const displayOrderId = invoiceData.order_number || invoiceData.order_id || (invoiceData.id ? `ORD-${invoiceData.id}` : 'ORD-0001');

    return (
        <div className="p-3 md:p-6 w-full mx-auto min-h-screen bg-slate-50/60 dark:bg-[#12161c] flex flex-col items-center font-sans antialiased pb-16">
            {/* Top Navigation & Action Bar */}
            <div className="w-full max-w-2xl flex flex-wrap items-center justify-between gap-2 mb-3">
                <Button 
                    variant="ghost" 
                    onClick={handleBack}
                    className="text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 gap-1.5 font-semibold h-7.5 px-2 text-xs cursor-pointer"
                >
                    <ArrowLeft size={13} /> Back to Invoices
                </Button>

                <div className="flex items-center gap-1.5">
                    {/* Rate Supplier Button - ONLY for Paid Invoices */}
                    {isPaid && (
                        <Button
                            variant="outline"
                            onClick={() => setIsRatingOpen(true)}
                            className="gap-1 font-bold bg-amber-50 dark:bg-amber-950/30 text-amber-900 dark:text-amber-400 border-amber-200 dark:border-amber-800 hover:bg-amber-100 h-7.5 px-2.5 text-xs shadow-2xs cursor-pointer"
                        >
                            <Star size={12} className="fill-amber-400 text-amber-400" /> Rate Carrier
                        </Button>
                    )}
                    <Button 
                        variant="outline" 
                        onClick={handleExport}
                        className="gap-1 font-semibold bg-white dark:bg-[#1e2329] text-slate-700 dark:text-slate-200 border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 h-7.5 px-2.5 text-xs shadow-2xs cursor-pointer"
                    >
                        <Printer size={12} /> Print
                    </Button>
                    <Button 
                        onClick={handleExport}
                        className="gap-1 font-semibold bg-[#ff4a1f] hover:bg-[#e63d15] text-white h-7.5 px-3 text-xs shadow-2xs cursor-pointer"
                    >
                        <Download size={12} /> Download PDF
                    </Button>
                </div>
            </div>

            {/* Enterprise Minimal Invoice Paper Container */}
            <div className="w-full max-w-2xl bg-white dark:bg-[#1b2027] shadow-xs rounded-lg border border-slate-200 dark:border-slate-800 p-5 md:p-6 space-y-4">
                {/* Header & Logo */}
                <div className="flex justify-between items-start gap-4 pb-4 border-b border-slate-100 dark:border-slate-800">
                    <div>
                        <div className="flex items-center gap-1.5 mb-1">
                            <span className="text-base font-extrabold text-slate-900 dark:text-slate-100 tracking-tight">
                                Carrier<span className="text-[#ff4a1f]">Direct</span>
                            </span>
                            <span className="text-[9.5px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider bg-slate-100 dark:bg-slate-800 px-1.5 py-0.5 rounded border border-slate-200 dark:border-slate-700 ml-1">
                                Enterprise
                            </span>
                        </div>
                        <div className="text-[11px] text-slate-500 dark:text-slate-400 space-y-0.5 leading-tight">
                            <p className="font-semibold text-slate-700 dark:text-slate-300">CarrierDirect Logistics Tech</p>
                            <p>123 Logistics Avenue, Industrial Cargo Hub</p>
                            <div className="flex items-center gap-2 pt-0.5 text-[10.5px] text-slate-500">
                                <span className="flex items-center gap-0.5"><Phone size={10} /> +880 1711-000000</span>
                                <span>•</span>
                                <span className="flex items-center gap-0.5"><Mail size={10} /> billing@carrierdirect.com</span>
                            </div>
                        </div>
                    </div>

                    <div className="text-right space-y-1">
                        <div>
                            <span className="text-[9.5px] font-bold text-slate-500 uppercase tracking-wider bg-slate-50 dark:bg-slate-800/80 px-2 py-0.5 rounded border border-slate-200 dark:border-slate-700 inline-block">
                                TAX INVOICE
                            </span>
                            <h1 className="text-base font-extrabold text-slate-900 dark:text-slate-100 tracking-tight mt-1">{displayInvId}</h1>
                        </div>

                        <div className="space-y-0.5 text-[11px]">
                            <div className="flex justify-end gap-2 text-slate-600 dark:text-slate-400">
                                <span className="font-normal text-slate-400">Order:</span>
                                <span className="font-semibold text-slate-900 dark:text-slate-200">#{displayOrderId}</span>
                            </div>
                            <div className="flex justify-end gap-2 text-slate-600 dark:text-slate-400">
                                <span className="font-normal text-slate-400">Issue Date:</span>
                                <span className="font-semibold text-slate-900 dark:text-slate-200">{invoiceData.issue_date || invoiceData.date || '18 Jul 2026'}</span>
                            </div>
                            <div className="flex justify-end gap-2 text-slate-600 dark:text-slate-400">
                                <span className="font-normal text-slate-400">Due Date:</span>
                                <span className="font-semibold text-slate-900 dark:text-slate-200">{invoiceData.due_date || invoiceData.dueDate || '30 Jul 2026'}</span>
                            </div>
                            <div className="flex justify-end gap-2 items-center pt-0.5">
                                <span className="font-normal text-slate-400">Status:</span>
                                {isPaid && (
                                    <Badge className="bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800 px-1.5 py-0 text-[9.5px] font-bold">
                                        <CheckCircle2 size={10} className="mr-1 inline" /> Paid
                                    </Badge>
                                )}
                                {isDue && !isOverdue && isPayLater && (
                        <span className="inline-flex items-center gap-1 text-[10px] font-bold px-1.5 py-0.5 rounded bg-blue-50 text-blue-700 border border-blue-200 dark:bg-blue-950/40 dark:text-blue-300 dark:border-blue-800/60">
                            <span>🏢</span> Net-30 Due
                        </span>
                      )}
                      {isDue && !isOverdue && !isPayLater && (
                                    <Badge className="bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-400 border border-amber-200 dark:border-amber-800 px-1.5 py-0 text-[9.5px] font-bold">
                                        <Clock size={10} className="mr-1 inline" /> Payment Due
                                    </Badge>
                                )}
                                {isOverdue && (
                                    <Badge className="bg-rose-50 dark:bg-rose-950/40 text-rose-700 dark:text-rose-400 border border-rose-200 dark:border-rose-800 px-1.5 py-0 text-[9.5px] font-bold">
                                        <AlertCircle size={10} className="mr-1 inline" /> Overdue
                                    </Badge>
                                )}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Billed To & Payment Method Info */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-[11px]">
                    <div className="bg-slate-50/80 dark:bg-slate-800/40 p-3 rounded-lg border border-slate-200/80 dark:border-slate-800 space-y-0.5">
                        <span className="text-[10.5px] font-bold text-slate-500 dark:text-slate-400 flex items-center gap-1 mb-1">
                            <Building2 size={12} className="text-[#ff4a1f]" /> Billed To
                        </span>
                        <p className="font-bold text-slate-900 dark:text-slate-100 text-xs">{invoiceData.customer_company || invoiceData.customer_name || 'Customer Logistics BD'}</p>
                        {invoiceData.customer_name && invoiceData.customer_name !== invoiceData.customer_company && (
                            <p className="text-slate-600 dark:text-slate-300">Attn: {invoiceData.customer_name}</p>
                        )}
                        <p className="text-slate-500 dark:text-slate-400">{invoiceData.customer_address || 'Plot-1088, Industrial Zone, Dhaka'}</p>
                        <p className="text-slate-500 dark:text-slate-400">Carrier: {invoiceData.supplier_name || invoiceData.supplier || 'Express Freight Logistics'}</p>
                    </div>

                    <div className="bg-slate-50/80 dark:bg-slate-800/40 p-3 rounded-lg border border-slate-200/80 dark:border-slate-800 space-y-0.5">
                        <span className="text-[10.5px] font-bold text-slate-500 dark:text-slate-400 flex items-center gap-1 mb-1">
                            <ShieldCheck size={12} className="text-[#ff4a1f]" /> Settlement Information
                        </span>
                        <p className="font-bold text-slate-900 dark:text-slate-100">
                            {invoiceData.payment_method || (isPaid ? 'Credit Card / Escrow Cleared' : 'Escrow Secured Settlement')}
                        </p>
                        <p className="text-slate-600 dark:text-slate-300">Transaction Ref: TXN-{String(displayInvId).replace(/[^0-9]/g, '') || '892147'}</p>
                        <p className="text-slate-500 dark:text-slate-400">Issued on: {invoiceData.issue_date || invoiceData.date || '18 Jul 2026'}</p>
                        <p className="text-emerald-700 dark:text-emerald-400 font-semibold text-[10.5px]">Escrow Guaranteed &amp; Verified</p>
                    </div>
                </div>

                {/* Itemized Invoice Table */}
                <div className="rounded-lg border border-slate-200 dark:border-slate-800 overflow-hidden">
                    <table className="w-full text-[11px] text-left">
                        <thead className="bg-slate-50 dark:bg-slate-800/60 border-b border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300 font-bold">
                            <tr>
                                <th className="py-2 px-2.5 w-8 text-center">#</th>
                                <th className="py-2 px-2.5">Item Description</th>
                                <th className="py-2 px-2.5 text-center w-14">Qty</th>
                                <th className="py-2 px-2.5 text-right w-24">Rate</th>
                                <th className="py-2 px-2.5 text-right w-28">Amount</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 dark:divide-slate-800 font-medium text-slate-800 dark:text-slate-200">
                            {[
                                { id: 1, desc: 'Freight Transport Logistics Service', qty: 1, rate: invoiceData.amount || invoiceData.total_amount_formatted || '€ 2,136.70', amount: invoiceData.amount || invoiceData.total_amount_formatted || '€ 2,136.70' },
                            ].map((item) => (
                                <tr key={item.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30">
                                    <td className="py-2.5 px-2.5 text-center text-slate-400 font-semibold">{item.id}</td>
                                    <td className="py-2.5 px-2.5">
                                        <p className="font-bold text-slate-900 dark:text-slate-100">{item.desc}</p>
                                        <p className="text-[10px] text-slate-500 font-normal">Standard 24/7 priority support &amp; escrow protection included.</p>
                                    </td>
                                    <td className="py-2.5 px-2.5 text-center text-slate-600 dark:text-slate-400 font-semibold">{item.qty}</td>
                                    <td className="py-2.5 px-2.5 text-right text-slate-600 dark:text-slate-400">{item.rate}</td>
                                    <td className="py-2.5 px-2.5 text-right font-bold text-slate-900 dark:text-slate-100">{item.amount}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* Subtotal & Financial Breakdown */}
                <div className="flex justify-end">
                    <div className="w-full sm:w-64 space-y-1.5 text-[11px] bg-slate-50/60 dark:bg-slate-800/40 p-3 rounded-lg border border-slate-200/80 dark:border-slate-800">
                        <div className="flex justify-between text-slate-600 dark:text-slate-400">
                            <span>Subtotal:</span>
                            <span className="font-semibold text-slate-900 dark:text-slate-100">{invoiceData.subtotal_formatted || invoiceData.amount || '€ 2,034.95'}</span>
                        </div>
                        <div className="flex justify-between text-slate-600 dark:text-slate-400">
                            <span>Platform Fee (5%):</span>
                            <span className="font-semibold text-slate-900 dark:text-slate-100">{invoiceData.platform_fee_formatted || '€ 101.75'}</span>
                        </div>
                        <div className="flex justify-between text-slate-600 dark:text-slate-400">
                            <span>VAT (15%):</span>
                            <span className="font-semibold text-slate-900 dark:text-slate-100">Included</span>
                        </div>
                        <div className="flex justify-between items-baseline pt-1.5 border-t border-slate-200 dark:border-slate-700">
                            <span className="text-xs font-bold text-slate-900 dark:text-slate-100">Total Amount:</span>
                            <span className="text-base font-extrabold text-[#ff4a1f]">{invoiceData.gross_amount_formatted || invoiceData.total_amount_formatted || invoiceData.amount || '€ 2,136.70'}</span>
                        </div>
                    </div>
                </div>

                {/* Invoice Footer Notes & Verification Stamp */}
                <div className="border-t border-slate-100 dark:border-slate-800 pt-3 flex flex-col sm:flex-row items-center justify-between gap-2 text-[10.5px] text-slate-500 dark:text-slate-400">
                    <div className="flex items-center gap-1.5 text-slate-600 dark:text-slate-400 font-medium">
                        <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                        <span>Digitally Signed &amp; Issued by CarrierDirect SaaS Billing Engine</span>
                    </div>
                    <p className="text-slate-400">Questions? Contact support@carrierdirect.com</p>
                </div>
            </div>

            {/* Rating Modal for Invoice View */}
            {isPaid && (
                <RatingModal
                    isOpen={isRatingOpen}
                    onClose={() => setIsRatingOpen(false)}
                    orderId={invoiceData.id}
                    targetName={invoiceData.supplier_name || invoiceData.supplier || 'Express Freight Logistics'}
                    targetRole="Supplier"
                    orderTitle="Priority Freight Logistics Dispatch"
                    onSubmit={(data) => console.log('Invoice rating submitted:', data)}
                />
            )}
        </div>
    );
}
