import React from 'react';
import { ArrowLeft, Star, MapPin, Truck, ShieldCheck, CheckCircle, MessageSquare, ArrowRight, Box, Calendar, FileText } from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';
import Badge from '@/components/ui/badge';
import Button from '@/components/ui/button';

export default function QuoteView() {
    const navigate = useNavigate();
    const { quoteId } = useParams();

    // Mock data for the specific quote
    const quote = {
        id: quoteId || 'QT-8821',
        requestId: 'REQ-9233',
        status: 'Pending',
        validUntil: '2026-07-25',
        supplier: {
            name: 'Express Logistics BD',
            rating: 4.8,
            reviews: 124,
            established: '2015',
            completedJobs: 1540
        },
        logistics: {
            vehicle: 'Covered Van (14ft)',
            transitTime: '2 Days',
            pickupDate: '2026-07-28',
            deliveryDate: '2026-07-30'
        },
        pricing: {
            baseFreight: 40000,
            loadingUnloading: 3500,
            insurance: 1500,
            total: 45000
        },
        notes: "We will provide 2 labor personnel for loading and unloading. Vehicle is fully covered and waterproof."
    };

    const quoteHistory = [
        {
            id: 1,
            type: 'Supplier Revision',
            date: '2026-07-19 • 04:30 PM',
            note: 'Reduced base freight by 2,000 €. Cannot reduce loading/unloading charges as we are providing 2 extra laborers.',
            previousTotal: 47000,
            newTotal: 45000,
            status: 'Revised'
        },
        {
            id: 2,
            type: 'Customer Request',
            date: '2026-07-19 • 10:15 AM',
            note: 'Can you please reduce the total amount to 43,000 €? We are regular customers.',
            previousTotal: 47000,
            newTotal: 43000,
            status: 'Requested'
        },
        {
            id: 3,
            type: 'Original Quote',
            date: '2026-07-18 • 02:00 PM',
            note: 'Initial quote provided based on the original requirements.',
            previousTotal: null,
            newTotal: 47000,
            status: 'Submitted'
        }
    ];

    return (
        <div className="p-3 md:p-4 mx-auto min-h-screen">
            {/* Header */}
            <div className="mb-4 flex flex-col md:flex-row md:items-center justify-between gap-3">
                <div>
                    <div className="flex items-center gap-2 mb-1">
                        <Badge variant="secondary" className="px-2 py-0.5 text-[12px] font-bold">{quote.id}</Badge>
                        <Badge variant={quote.status === 'Pending' ? 'warning' : 'success'} className="px-2 py-0.5 text-[12px] font-bold">{quote.status}</Badge>
                    </div>
                    <h1 className="text-[18px] font-bold text-slate-900 leading-tight">Quote Details</h1>
                    <p className="text-[11.5px] text-slate-500 font-medium mt-0.5">Review the complete breakdown of this quote for request <span className="text-indigo-600 font-semibold">{quote.requestId}</span>.</p>
                </div>
                <div className="flex items-center gap-2">
                    <Button variant="outline" className="text-slate-600 border-slate-200 hover:bg-slate-50 h-7 px-3 font-semibold text-[12px]">
                        <MessageSquare size={13} className="mr-1.5" /> Negotiate
                    </Button>
                    <Button variant="primary" className="bg-emerald-600 hover:bg-emerald-700 text-white h-7 px-3 font-semibold text-[12px]">
                        <CheckCircle size={13} className="mr-1.5" /> Accept Quote
                    </Button>
                </div>
            </div>

            <div className="grid grid-cols-1 xl:grid-cols-12 gap-3 xl:gap-4">

                {/* Column 1: Original Request Details (Span 5) */}
                <div className="xl:col-span-5">
                    <div className="bg-white rounded-lg border border-slate-200 p-3.5 lg:p-4 shadow-sm h-full">
                        <div className="flex items-center justify-between mb-3 pb-2 border-b border-slate-100">
                            <h2 className="text-[12.5px] font-bold text-slate-900 uppercase tracking-wide">Original Request Requirements</h2>
                            <Badge variant="secondary" className="text-[12px] bg-slate-100 text-slate-500 border-none px-1.5 py-0">~254 km</Badge>
                        </div>

                        <div className="grid grid-cols-2 gap-y-4 gap-x-4">
                            {/* Pickup */}
                            <div className="col-span-2 sm:col-span-1">
                                <span className="block text-[10.5px] font-semibold text-slate-500 mb-1.5 uppercase">Pickup Details</span>
                                <div className="flex items-start gap-2 h-full">
                                    <MapPin size={15} className="text-emerald-500 mt-0.5 shrink-0" />
                                    <div className="w-full flex flex-col h-full">
                                        <div className="grid grid-cols-[55px_12px_1fr] gap-y-1 text-[12px] w-full">
                                            <span className="text-slate-500 font-medium">City</span>
                                            <span className="text-slate-400 text-center">:</span>
                                            <span className="font-bold text-slate-800 text-[11.5px]">Dhaka</span>

                                            <span className="text-slate-500 font-medium">Address</span>
                                            <span className="text-slate-400 text-center">:</span>
                                            <span className="text-slate-700 leading-tight">House 4, Road 2, Banani, 1212</span>

                                            <span className="text-slate-500 font-medium">Time</span>
                                            <span className="text-slate-400 text-center">:</span>
                                            <span className="text-slate-700">2026-07-28 • 10:00 AM</span>

                                            <div className="col-span-3 h-px bg-slate-100 my-1"></div>

                                            <span className="text-slate-500 font-medium">Company</span>
                                            <span className="text-slate-400 text-center">:</span>
                                            <span className="font-semibold text-slate-700">Tech Corp BD</span>

                                            <span className="text-slate-500 font-medium">Contact</span>
                                            <span className="text-slate-400 text-center">:</span>
                                            <span className="text-slate-700">Rahim Uddin</span>

                                            <span className="text-slate-500 font-medium">Phone</span>
                                            <span className="text-slate-400 text-center">:</span>
                                            <span className="text-slate-700">+8801711223344</span>
                                        </div>

                                        <div className="mt-4 pt-3 border-t border-slate-100/80 w-full">
                                            <div className="grid grid-cols-[55px_12px_1fr] gap-y-1.5 text-[12px]">
                                                <span className="text-slate-500 font-medium">Load Type</span>
                                                <span className="text-slate-400 text-center">:</span>
                                                <span className="font-bold text-slate-800 flex items-center gap-1.5"><Box size={13} className="text-slate-400 shrink-0" /> Pallets (50)</span>

                                                <span className="text-slate-500 font-medium">Volume</span>
                                                <span className="text-slate-400 text-center">:</span>
                                                <span className="font-bold text-slate-800">15.5 CBM</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Delivery */}
                            <div className="col-span-2 sm:col-span-1">
                                <span className="block text-[10.5px] font-semibold text-slate-500 mb-1.5 uppercase">Delivery Details</span>
                                <div className="flex items-start gap-2 h-full">
                                    <MapPin size={15} className="text-indigo-500 mt-0.5 shrink-0" />
                                    <div className="w-full flex flex-col h-full">
                                        <div className="grid grid-cols-[55px_12px_1fr] gap-y-1 text-[12px] w-full">
                                            <span className="text-slate-500 font-medium">City</span>
                                            <span className="text-slate-400 text-center">:</span>
                                            <span className="font-bold text-slate-800 text-[11.5px]">Chittagong</span>

                                            <span className="text-slate-500 font-medium">Address</span>
                                            <span className="text-slate-400 text-center">:</span>
                                            <span className="text-slate-700 leading-tight">Agrabad Comm. Area, 4000</span>

                                            <span className="text-slate-500 font-medium">Time</span>
                                            <span className="text-slate-400 text-center">:</span>
                                            <span className="text-slate-700">2026-07-30 • 06:00 PM</span>

                                            <div className="col-span-3 h-px bg-slate-100 my-1"></div>

                                            <span className="text-slate-500 font-medium">Company</span>
                                            <span className="text-slate-400 text-center">:</span>
                                            <span className="font-semibold text-slate-700">Ctg Traders</span>

                                            <span className="text-slate-500 font-medium">Contact</span>
                                            <span className="text-slate-400 text-center">:</span>
                                            <span className="text-slate-700">Karim Hasan</span>

                                            <span className="text-slate-500 font-medium">Phone</span>
                                            <span className="text-slate-400 text-center">:</span>
                                            <span className="text-slate-700">+8801811223344</span>
                                        </div>

                                        <div className="mt-4 pt-3 border-t border-slate-100/80 w-full">
                                            <div className="grid grid-cols-[55px_12px_1fr] gap-y-1.5 text-[12px]">
                                                <span className="text-slate-500 font-medium">Weight</span>
                                                <span className="text-slate-400 text-center">:</span>
                                                <span className="font-bold text-slate-800">1,200 kg</span>

                                                <span className="text-slate-500 font-medium">Services</span>
                                                <span className="text-slate-400 text-center">:</span>
                                                <span className="flex flex-wrap gap-1">
                                                    <Badge variant="secondary" className="text-[9px] py-0 px-1 border-amber-100 bg-amber-50 text-amber-700">Fragile</Badge>
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="col-span-2 bg-slate-50 rounded p-2.5 border border-slate-100 mt-1 ml-0 sm:ml-[23px]">
                                <span className="block text-[10.5px] font-semibold text-slate-500 mb-1.5 uppercase">Special Instructions</span>
                                <ul className="list-disc list-inside text-[12px] text-slate-600 space-y-0.5">
                                    <li>Driver must carry valid ID.</li>
                                    <li>Beware of the low clearance gate.</li>
                                    <li>Unloading will be handled by our forklift operators.</li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Column 2: Supplier & Logistics (Span 4) */}
                <div className="xl:col-span-4 flex flex-col gap-3 xl:gap-4">
                    {/* Supplier Info */}
                    <div className="bg-white rounded-lg border border-slate-200 p-3.5 lg:p-4 shadow-sm">
                        <h2 className="text-[12.5px] font-bold text-slate-900 mb-3 pb-2 border-b border-slate-100 uppercase tracking-wide">Supplier Profile</h2>
                        <div className="flex items-start gap-3">
                            <div className="w-10 h-10 bg-indigo-50 text-indigo-600 rounded-lg flex items-center justify-center font-black text-lg shrink-0 border border-indigo-100">
                                {quote.supplier.name.charAt(0)}
                            </div>
                            <div className="flex-1">
                                <h3 className="text-[14px] font-bold text-slate-900">{quote.supplier.name}</h3>
                                <div className="flex items-center gap-2 mt-1 text-[11.5px] text-slate-600 flex-wrap">
                                    <div className="flex items-center gap-1.5">
                                        <Star size={12} className="text-amber-500 fill-amber-500" />
                                        <span className="font-bold text-slate-800">{quote.supplier.rating}</span>
                                        <span className="text-slate-500">({quote.supplier.reviews})</span>
                                    </div>
                                    <div className="w-1 h-1 rounded-full bg-slate-300"></div>
                                    <div className="flex items-center gap-1 text-emerald-600 font-semibold">
                                        <ShieldCheck size={12} />
                                        <span>Verified</span>
                                    </div>
                                </div>
                                <p className="text-[12px] text-slate-500 mt-1 font-medium leading-tight">Est. {quote.supplier.established} • {quote.supplier.completedJobs} jobs done.</p>
                            </div>
                        </div>
                    </div>

                    {/* Logistics Breakdown */}
                    <div className="bg-white rounded-lg border border-slate-200 p-3.5 lg:p-4 shadow-sm flex-1 flex flex-col">
                        <h2 className="text-[12.5px] font-bold text-slate-900 mb-3 pb-2 border-b border-slate-100 uppercase tracking-wide">Quote Logistics</h2>
                        <div className="mt-2 grid grid-cols-[80px_12px_1fr] gap-y-1.5 text-[11.5px]">
                            <span className="text-slate-500 font-medium">Vehicle Type</span>
                            <span className="text-slate-400 text-center">:</span>
                            <span className="font-bold text-slate-800 flex items-center gap-1.5"><Truck size={13} className="text-slate-400" /> {quote.logistics.vehicle}</span>

                            <span className="text-slate-500 font-medium">Est. Transit</span>
                            <span className="text-slate-400 text-center">:</span>
                            <span className="font-bold text-slate-800">{quote.logistics.transitTime}</span>

                            <span className="text-slate-500 font-medium">Pickup Date</span>
                            <span className="text-slate-400 text-center">:</span>
                            <span className="font-bold text-slate-800">{quote.logistics.pickupDate}</span>

                            <span className="text-slate-500 font-medium">Delivery Date</span>
                            <span className="text-slate-400 text-center">:</span>
                            <span className="font-bold text-slate-800">{quote.logistics.deliveryDate}</span>
                        </div>

                        <div className="mt-auto pt-3 border-t border-slate-100">
                            <span className="block text-[10.5px] font-semibold text-slate-500 mb-1 uppercase">Supplier Notes</span>
                            <div className="bg-slate-50 p-2.5 rounded-md text-[12px] text-slate-700 border border-slate-200/60 leading-relaxed">
                                {quote.notes}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Column 3: Pricing Breakdown (Span 3) */}
                <div className="xl:col-span-3">
                    <div className="bg-white p-3.5 lg:p-4 rounded-lg border border-slate-200 shadow-sm">
                        <h2 className="text-[12.5px] font-bold text-slate-900 mb-3 pb-2 border-b border-slate-100 uppercase tracking-wide">Pricing Breakdown</h2>

                        <div className="space-y-2.5 mb-4">
                            <div className="flex justify-between items-center text-[11.5px]">
                                <span className="text-slate-500 font-medium">Base Freight</span>
                                <span className="font-bold text-slate-800">€ {quote.pricing.baseFreight.toLocaleString()}</span>
                            </div>
                            <div className="flex justify-between items-center text-[11.5px]">
                                <span className="text-slate-500 font-medium">Loading/Unloading</span>
                                <span className="font-bold text-slate-800">€ {quote.pricing.loadingUnloading.toLocaleString()}</span>
                            </div>
                            <div className="flex justify-between items-center text-[11.5px]">
                                <span className="text-slate-500 font-medium">Insurance</span>
                                <span className="font-bold text-slate-800">€ {quote.pricing.insurance.toLocaleString()}</span>
                            </div>
                        </div>

                        <div>
                            <div className="flex justify-between items-end pt-3 border-t border-slate-100">
                                <span className="text-[11.5px] font-bold text-slate-800">Total</span>
                                <span className="text-[17px] font-black text-emerald-600 leading-none">€ {quote.pricing.total.toLocaleString()}</span>
                            </div>
                            <div className="mt-3 text-center bg-slate-50 rounded p-1.5 border border-slate-100">
                                <p className="text-[9px] font-medium text-slate-500 uppercase tracking-wide">Valid until {quote.validUntil}</p>
                            </div>

                            <Button variant="primary" className="w-full mt-3 bg-emerald-600 hover:bg-emerald-700 text-white border-none h-7 font-bold text-[12px]">
                                Accept Quote Now
                            </Button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Negotiation & Revision History */}
            <div className="mt-3 xl:mt-4">
                <div className="bg-white p-3.5 lg:p-4 rounded-lg border border-slate-200 shadow-sm">
                    <h2 className="text-[12.5px] font-bold text-slate-900 mb-4 pb-2 border-b border-slate-100 uppercase tracking-wide">Negotiation & Revision History</h2>

                    <div className="relative border-l border-slate-200 ml-3 space-y-4 pb-2">
                        {quoteHistory.map((event) => (
                            <div key={event.id} className="relative pl-4">
                                {/* Timeline dot */}
                                <div className={`absolute -left-[4.5px] top-1 w-2 h-2 rounded-full border-2 border-white shadow-sm ${event.type === 'Supplier Revision' ? 'bg-indigo-500' : event.type === 'Customer Request' ? 'bg-amber-500' : 'bg-slate-400'}`}></div>

                                <div className="flex items-center gap-2 mb-1">
                                    <span className="text-[11.5px] font-bold text-slate-800">{event.type}</span>
                                    <span className="text-[10.5px] text-slate-400">• {event.date}</span>
                                    <Badge variant={event.status === 'Revised' ? 'success' : event.status === 'Requested' ? 'warning' : 'secondary'} className="px-2 py-0.5 text-[10.5px] font-medium ml-auto">
                                        {event.status}
                                    </Badge>
                                </div>

                                <div className="bg-slate-50 border border-slate-100 rounded-md p-2 mt-1">
                                    <p className="text-[12px] text-slate-600 mb-1.5 leading-relaxed">{event.note}</p>
                                    <div className="flex items-center gap-3 text-[10.5px]">
                                        {event.previousTotal && (
                                            <div className="flex items-center gap-1.5 text-slate-500 line-through">
                                                <span>Prev: € {event.previousTotal.toLocaleString()}</span>
                                            </div>
                                        )}
                                        <div className="flex items-center gap-1.5 font-bold text-slate-800">
                                            {event.previousTotal && <ArrowRight size={11} className="text-slate-400" />}
                                            <span className={event.type === 'Customer Request' ? 'text-amber-600' : 'text-emerald-600'}>
                                                New: € {event.newTotal.toLocaleString()}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
