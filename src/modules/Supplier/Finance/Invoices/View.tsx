import { exportInvoicePdf, openInvoicePreview } from "@/utils/exportInvoicePdf";
import React from 'react';
import { Printer, Download, ArrowLeft, Building2, Phone, Mail, CheckCircle2, ShieldCheck, AlertCircle, Clock } from 'lucide-react';
import Button from '@/components/ui/button';
import Badge from '@/components/ui/badge';
import { useNavigate } from 'react-router-dom';

interface InvoiceViewProps {
    onBack?: () => void;
    invoice?: any;
    onDownload?: (invoice: any) => void;
}

export default function InvoiceView({ onBack, invoice, onDownload }: InvoiceViewProps) {
    const navigate = useNavigate();

    const invoiceData = invoice || {
        id: 'INV-202546',
        invoice_number: 'INV-202546',
        order_number: 'ORD-2026-0002',
        date: '16 Sep 2026',
        due_date: '16 Sep 2026',
        gross_amount_formatted: '€39,972.45',
        platform_fee_formatted: '€1,903.45',
        supplier_amount_formatted: '€38,069.00',
        payment_stage_label: 'Cleared & Available',
        status: 'Cleared',
        customer_name: 'Customer 1',
        customer_company: 'Customer Co 1',
        route: 'Savar EPZ ➔ Comilla Highway Hub',
        pickup_address: 'Savar EPZ Industrial Zone, Sector 2, Dhaka 1340',
        delivery_address: 'Comilla Highway Hub, Industrial Zone, Comilla 3500',
    };

    const isCleared = (invoiceData.payment_stage === 'cleared') || (invoiceData.status === 'Cleared');
    const isInEscrow = (invoiceData.payment_stage === 'in_escrow') || (invoiceData.status === 'In Escrow');

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
                    <Button 
                        variant="outline" 
                        onClick={() => exportInvoicePdf(invoiceData)}
                        className="h-7 px-2.5 text-[11px] font-semibold gap-1 text-slate-700 bg-white border-slate-200 hover:bg-slate-50 cursor-pointer"
                    >
                        <Printer size={12} /> Print
                    </Button>
                    <Button 
                        onClick={() => { if (onDownload) { onDownload(invoiceData); } else { openInvoicePreview(invoiceData); } }}
                        className="h-7 px-3 text-[11px] font-semibold gap-1 bg-[#ff4a1f] hover:bg-[#ff4a1f]/90 text-white cursor-pointer shadow-2xs"
                    >
                        <Download size={12} /> Download PDF
                    </Button>
                </div>
            </div>

            {/* Main Invoice Card Container */}
            <div className="w-full max-w-2xl bg-white border border-slate-200 rounded-lg shadow-xs overflow-hidden text-[12px]">
                {/* Invoice Header */}
                <div className="p-5 md:p-6 border-b border-slate-100 flex flex-col sm:flex-row justify-between items-start gap-4">
                    <div>
                        <div className="flex items-center gap-2 mb-1">
                            <span className="text-base font-black tracking-tight text-slate-900">CarrierDirect</span>
                            <span className="text-[9px] font-black uppercase tracking-wider text-[#ff4a1f] bg-orange-50 px-1.5 py-0.5 rounded border border-orange-200">SUPPLIER INVOICE</span>
                        </div>
                        <p className="text-[11px] text-slate-500">Freight & Logistics Invoice Settlement</p>
                        <p className="text-[11px] text-slate-400 mt-0.5">Invoice ID: <span className="font-bold text-slate-700">{invoiceData.invoice_number || invoiceData.id}</span></p>
                    </div>

                    <div className="text-left sm:text-right">
                        <div className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-bold mb-1 border ${
                            isCleared ? 'bg-emerald-50 text-emerald-700 border-emerald-200' :
                            isInEscrow ? 'bg-blue-50 text-blue-700 border-blue-200' :
                            'bg-amber-50 text-amber-700 border-amber-200'
                        }`}>
                            {isCleared && <CheckCircle2 size={13} className="text-emerald-600" />}
                            {isInEscrow && <Clock size={13} className="text-blue-600" />}
                            <span>{invoiceData.payment_stage_label || invoiceData.status || 'Pending'}</span>
                        </div>
                        <p className="text-[11px] text-slate-400">Date: <span className="text-slate-600 font-medium">{invoiceData.issue_date || invoiceData.date || '16 Sep 2026'}</span></p>
                        <p className="text-[11px] text-slate-400">Due Date: <span className="text-slate-600 font-medium">{invoiceData.due_date || invoiceData.dueDate || '16 Sep 2026'}</span></p>
                    </div>
                </div>

                {/* Client & Route Breakdown */}
                <div className="p-5 md:p-6 grid grid-cols-1 sm:grid-cols-2 gap-4 border-b border-slate-100 bg-slate-50/30">
                    <div>
                        <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">Customer Information</h4>
                        <p className="font-bold text-slate-900 text-xs">{invoiceData.customer_company || invoiceData.customer_name || 'Customer Co'}</p>
                        <p className="text-slate-500 text-[11px] mt-0.5">{invoiceData.customer_name}</p>
                        {invoiceData.customer_email && <p className="text-slate-500 text-[11px]">{invoiceData.customer_email}</p>}
                        {invoiceData.customer_phone && <p className="text-slate-500 text-[11px]">{invoiceData.customer_phone}</p>}
                    </div>

                    <div>
                        <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">Shipment & Order</h4>
                        <p className="font-bold text-slate-900 text-xs">Order #{invoiceData.order_number || invoiceData.order_id || 'ORD-0001'}</p>
                        <p className="text-slate-600 text-[11px] font-medium mt-0.5">Route: {invoiceData.route || 'Direct Transit'}</p>
                        <p className="text-slate-400 text-[10px] mt-1">Pickup: {invoiceData.pickup_address || 'Origin Hub'}</p>
                        <p className="text-slate-400 text-[10px]">Delivery: {invoiceData.delivery_address || 'Destination Hub'}</p>
                    </div>
                </div>

                {/* Financial Summary */}
                <div className="p-5 md:p-6 space-y-2">
                    <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">Financial Earnings Breakdown</h4>
                    
                    <div className="flex justify-between py-1 border-b border-slate-100 text-slate-600">
                        <span>Gross Freight Fare (Customer Amount):</span>
                        <span className="font-semibold text-slate-800">{invoiceData.gross_amount_formatted || `€${Number(invoiceData.gross_amount || 0).toLocaleString()}`}</span>
                    </div>

                    <div className="flex justify-between py-1 border-b border-slate-100 text-slate-600">
                        <span>Platform Fee & Commission:</span>
                        <span className="font-semibold text-rose-600">- {invoiceData.platform_fee_formatted || `€${Number(invoiceData.platform_fee || 0).toLocaleString()}`}</span>
                    </div>

                    <div className="flex justify-between py-2 text-sm font-bold text-slate-900 bg-slate-50 px-3 rounded-md">
                        <span className="text-emerald-700">Net Supplier Payout:</span>
                        <span className="text-emerald-700 font-extrabold">{invoiceData.supplier_amount_formatted || invoiceData.net_amount_formatted || `€${Number(invoiceData.supplier_amount || 0).toLocaleString()}`}</span>
                    </div>
                </div>

                {/* Footer Note */}
                <div className="p-4 bg-slate-50 border-t border-slate-100 text-[11px] text-slate-500 text-center">
                    This is an electronically verified invoice ledger from CarrierDirect. For inquiries, contact support.
                </div>
            </div>
        </div>
    );
}
