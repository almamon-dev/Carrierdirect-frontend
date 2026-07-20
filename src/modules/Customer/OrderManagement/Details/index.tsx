import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Printer, Download, MapPin, Truck, CheckCircle2, Building } from 'lucide-react';
import Button from '@/components/ui/button';
import Badge from '@/components/ui/badge';

export default function OrderDetails() {
    const navigate = useNavigate();

    return (
        <div className="p-4 md:p-6 w-full max-w-4xl mx-auto min-h-screen">
            {/* Header Actions */}
            <div className="mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                    <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-500 rounded-full hover:bg-slate-100 -ml-1.5" onClick={() => navigate(-1)}>
                        <ArrowLeft size={18} />
                    </Button>
                    <div>
                        <div className="flex items-center gap-2">
                            <h1 className="text-xl font-bold text-slate-900">Order #ORD-5591</h1>
                            <Badge variant="success">Completed</Badge>
                        </div>
                        <p className="text-sm text-slate-500">Delivered on Jul 18, 2026</p>
                    </div>
                </div>
                <div className="flex gap-2">
                    <Button variant="outline" className="h-9">
                        <Printer size={16} className="mr-2" /> Print
                    </Button>
                    <Button variant="primary" className="h-9">
                        <Download size={16} className="mr-2" /> Download PDF
                    </Button>
                </div>
            </div>

            {/* Invoice Body */}
            <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
                <div className="p-6 border-b border-slate-100 flex flex-col md:flex-row justify-between gap-6 bg-slate-50/50">
                    <div>
                        <h2 className="text-2xl font-black text-indigo-700 tracking-tight">GET IT MOVING</h2>
                        <p className="text-sm text-slate-500 mt-1">Enterprise Logistics Solutions</p>
                    </div>
                    <div className="text-left md:text-right">
                        <p className="text-[13px] font-bold text-slate-400 uppercase tracking-wider mb-1">Supplier</p>
                        <p className="text-base font-bold text-slate-900">Global Transport Ltd.</p>
                        <p className="text-[13px] text-slate-500 mt-0.5">Contact: +880 1711-223344</p>
                    </div>
                </div>

                <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-8 border-b border-slate-100">
                    <div className="space-y-4">
                        <div>
                            <p className="text-[12px] font-bold text-slate-400 uppercase tracking-wider mb-2">Pickup Location</p>
                            <div className="flex items-start gap-2">
                                <MapPin size={18} className="text-indigo-600 mt-0.5" />
                                <div>
                                    <p className="text-[14px] font-bold text-slate-800">Dhaka Warehouse</p>
                                    <p className="text-[13px] text-slate-500 mt-0.5">Plot-1088, Block-I, Bashundhara R/A<br/>Dhaka-1229, Bangladesh</p>
                                </div>
                            </div>
                        </div>
                        <div>
                            <p className="text-[12px] font-bold text-slate-400 uppercase tracking-wider mb-2">Delivery Location</p>
                            <div className="flex items-start gap-2">
                                <MapPin size={18} className="text-emerald-600 mt-0.5" />
                                <div>
                                    <p className="text-[14px] font-bold text-slate-800">Chittagong Port Depot</p>
                                    <p className="text-[13px] text-slate-500 mt-0.5">Gate No 4, Port Link Road<br/>Chittagong, Bangladesh</p>
                                </div>
                            </div>
                        </div>
                    </div>
                    
                    <div className="space-y-4 md:pl-8 md:border-l border-slate-100">
                        <div>
                            <p className="text-[12px] font-bold text-slate-400 uppercase tracking-wider mb-2">Vehicle & Load</p>
                            <div className="flex items-center gap-2 mb-1.5">
                                <Truck size={16} className="text-slate-400" />
                                <span className="text-[14px] font-semibold text-slate-800">Covered Van (14ft) - 1.5 Ton</span>
                            </div>
                            <div className="flex items-center gap-2 mb-1.5">
                                <Building size={16} className="text-slate-400" />
                                <span className="text-[13px] text-slate-600">Goods: Electronics & Fragile</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <CheckCircle2 size={16} className="text-emerald-500" />
                                <span className="text-[13px] text-slate-600">Proof of Delivery Accepted</span>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="p-6 bg-white">
                    <p className="text-[12px] font-bold text-slate-400 uppercase tracking-wider mb-4">Payment Breakdown</p>
                    <div className="border border-slate-200 rounded-xl overflow-hidden">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-slate-50 border-b border-slate-200 text-[12px] font-bold text-slate-600 uppercase tracking-wider">
                                    <th className="py-3 px-4">Description</th>
                                    <th className="py-3 px-4 text-right">Amount (BDT)</th>
                                </tr>
                            </thead>
                            <tbody className="text-[14px]">
                                <tr className="border-b border-slate-100">
                                    <td className="py-3 px-4 font-medium text-slate-800">Base Freight Charge</td>
                                    <td className="py-3 px-4 text-right text-slate-600">40,000</td>
                                </tr>
                                <tr className="border-b border-slate-100">
                                    <td className="py-3 px-4 font-medium text-slate-800">Loading & Unloading Services</td>
                                    <td className="py-3 px-4 text-right text-slate-600">3,500</td>
                                </tr>
                                <tr className="border-b border-slate-200">
                                    <td className="py-3 px-4 font-medium text-slate-800">Insurance (Premium)</td>
                                    <td className="py-3 px-4 text-right text-slate-600">1,500</td>
                                </tr>
                                <tr className="bg-slate-50/50">
                                    <td className="py-4 px-4 font-bold text-slate-900 text-[15px]">Total Amount</td>
                                    <td className="py-4 px-4 text-right font-black text-indigo-700 text-[16px]">45,000</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
}
