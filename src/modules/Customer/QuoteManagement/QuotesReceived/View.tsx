import React, { useState } from 'react';
import { 
  ArrowLeft, Star, MapPin, Truck, ShieldCheck, CheckCircle, MessageSquare, 
  ArrowRight, Box, Calendar, FileText, Clock, Building2, ChevronDown, ChevronUp, Navigation, History
} from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';
import Badge from '@/components/ui/badge';
import Button from '@/components/ui/button';

export default function QuoteView() {
    const navigate = useNavigate();
    const { quoteId } = useParams();
    const [activeTab, setActiveTab] = useState<'active' | 'history'>('history');

    // Mock quote data
    const quote = {
        id: quoteId || 'QT-8821',
        requestId: 'REQ-9233',
        status: 'Pending',
        validUntil: 'Jul 25, 2026',
        supplier: {
            name: 'Express Logistics BD Ltd.',
            rating: 4.8,
            reviews: 124,
            established: '2015',
            completedJobs: 1540,
            verified: true
        },
        logistics: {
            vehicle: 'Covered Van (14ft)',
            transitTime: '2 Days',
            pickupDate: 'Jul 28, 2026',
            deliveryDate: 'Jul 30, 2026',
            routeKm: '254 km'
        },
        pickup: {
            city: 'Dhaka',
            address: 'House 4, Road 2, Banani, 1212',
            company: 'Tech Corp BD Ltd.',
            contact: 'Rahim Uddin (+8801711223344)',
            schedule: 'Jul 28, 2026 • 10:00 AM'
        },
        delivery: {
            city: 'Chittagong',
            address: 'Agrabad Comm. Area, Port Zone, 4000',
            company: 'Ctg Freight Line Ltd.',
            contact: 'Karim Hasan (+8801811223344)',
            schedule: 'Jul 30, 2026 • 06:00 PM'
        },
        cargo: {
            loadType: 'Pallets (50 Units)',
            volume: '15.5 CBM',
            weight: '1,200 KG',
            care: 'Fragile Care Required'
        },
        pricing: {
            baseFreight: 40000,
            loadingUnloading: 3500,
            insurance: 1500,
            total: 45000
        },
        notes: "We will provide 2 labor personnel for loading and unloading. Vehicle is fully covered and waterproof."
    };

    const activeNegotiations = [
        {
            id: 101,
            type: 'Pending Counter Offer',
            date: 'Jul 20, 2026 • 11:30 AM',
            note: 'Requested €43,000 corporate rate. Supplier reviewing loading labor headcount.',
            currentTotal: 45000,
            proposedTotal: 43000,
            status: 'In Review'
        },
        {
            id: 102,
            type: 'Validity Extension',
            date: 'Jul 20, 2026 • 09:15 AM',
            note: 'Extended offer validity by 3 extra calendar days.',
            currentTotal: 45000,
            proposedTotal: 45000,
            status: 'Active'
        }
    ];

    const quoteHistory = [
        {
            id: 1,
            type: 'Supplier Revision',
            date: 'Jul 19, 2026 • 04:30 PM',
            note: 'Reduced base freight by €2,000. Cannot reduce loading/unloading charges as we provide 2 extra laborers.',
            previousTotal: 47000,
            newTotal: 45000,
            status: 'Revised'
        },
        {
            id: 2,
            type: 'Customer Request',
            date: 'Jul 19, 2026 • 10:15 AM',
            note: 'Can you please reduce the total amount to €43,000? We are regular corporate customers.',
            previousTotal: 47000,
            newTotal: 43000,
            status: 'Requested'
        },
        {
            id: 3,
            type: 'Original Quote',
            date: 'Jul 18, 2026 • 02:00 PM',
            note: 'Initial quote provided based on the original requirements.',
            previousTotal: null,
            newTotal: 47000,
            status: 'Submitted'
        }
    ];

    return (
        <div className="p-4 md:p-6 w-full mx-auto min-h-screen font-sans bg-[#f8f9fa] pb-24 text-slate-800 antialiased">
            
            {/* Page Header Bar */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                <div>
                    <div className="flex items-center gap-2.5 mb-1">
                        <h1 className="text-xl font-bold text-slate-900 tracking-tight">Quote Details</h1>
                        <span className="inline-flex items-center px-3 py-0.5 rounded-full text-xs font-semibold bg-slate-100 text-slate-700 border border-slate-200">
                            {quote.id}
                        </span>
                        <span className="inline-flex items-center px-3 py-0.5 rounded-full text-xs font-semibold bg-amber-50 text-amber-700 border border-amber-200">
                            {quote.status}
                        </span>
                    </div>
                    <p className="text-xs text-slate-500 font-medium">
                        Review carrier response and rate breakdown for shipment request <span className="text-[#ff4a1f] font-bold">{quote.requestId}</span>.
                    </p>
                </div>

                <Button 
                    variant="outline" 
                    size="sm"
                    icon={<ArrowLeft size={14} />}
                    onClick={() => navigate(-1)}
                >
                    Back to Quotes
                </Button>
            </div>

            {/* Quick Metrics Strip */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                <div className="bg-white border border-slate-200 rounded-md p-4 shadow-2xs flex items-center gap-3.5">
                    <div className="w-10 h-10 rounded-md bg-orange-50 text-[#ff4a1f] flex items-center justify-center font-bold text-base shrink-0 border border-orange-100">
                        €
                    </div>
                    <div>
                        <span className="text-xs font-medium text-slate-500 block">Total Freight Rate</span>
                        <span className="text-base font-extrabold text-slate-900">€{quote.pricing.total.toLocaleString()}</span>
                    </div>
                </div>

                <div className="bg-white border border-slate-200 rounded-md p-4 shadow-2xs flex items-center gap-3.5">
                    <div className="w-10 h-10 rounded-md bg-blue-50 text-blue-600 flex items-center justify-center shrink-0 border border-blue-100">
                        <Truck size={18} />
                    </div>
                    <div>
                        <span className="text-xs font-medium text-slate-500 block">Assigned Vehicle</span>
                        <span className="text-xs font-bold text-slate-900 truncate block">{quote.logistics.vehicle}</span>
                    </div>
                </div>

                <div className="bg-white border border-slate-200 rounded-md p-4 shadow-2xs flex items-center gap-3.5">
                    <div className="w-10 h-10 rounded-md bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0 border border-emerald-100">
                        <Clock size={18} />
                    </div>
                    <div>
                        <span className="text-xs font-medium text-slate-500 block">Transit Time</span>
                        <span className="text-xs font-bold text-slate-900 block">{quote.logistics.transitTime} ({quote.logistics.routeKm})</span>
                    </div>
                </div>

                <div className="bg-white border border-slate-200 rounded-md p-4 shadow-2xs flex items-center gap-3.5">
                    <div className="w-10 h-10 rounded-md bg-amber-50 text-amber-600 flex items-center justify-center shrink-0 border border-amber-100">
                        <Star size={18} className="fill-amber-500" />
                    </div>
                    <div>
                        <span className="text-xs font-medium text-slate-500 block">Carrier Rating</span>
                        <span className="text-xs font-bold text-slate-900 block">{quote.supplier.rating} ★ ({quote.supplier.reviews})</span>
                    </div>
                </div>
            </div>

            {/* Main Content Layout Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">

                {/* Left 7 Columns: Route, Specs & Carrier Details */}
                <div className="lg:col-span-7 space-y-6">
                    
                    {/* Route Map & Shipment Requirements Card */}
                    <div className="bg-white border border-slate-200 rounded-md p-5 sm:p-6 shadow-2xs space-y-5">
                        
                        <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                            <h2 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                                <Navigation size={17} className="text-[#ff4a1f]" /> Shipment Route & Requirements
                            </h2>
                            <span className="inline-flex items-center px-3 py-0.5 rounded-full text-xs font-semibold bg-sky-50 text-sky-700 border border-sky-200">
                                Distance: {quote.logistics.routeKm}
                            </span>
                        </div>

                        {/* Interactive Route Line Card */}
                        <div className="p-4 sm:p-5 bg-slate-50 border border-slate-200/80 rounded-md space-y-3">
                            <div className="flex items-center justify-between text-xs sm:text-sm font-bold text-slate-900">
                                <div className="flex items-center gap-2 text-emerald-700">
                                    <MapPin size={16} className="text-emerald-600" />
                                    <span>{quote.pickup.city} (Origin)</span>
                                </div>
                                <div className="flex-1 mx-4 border-t-2 border-dashed border-slate-300 relative flex items-center justify-center">
                                    <span className="inline-flex items-center px-3 py-0.5 rounded-full text-xs font-semibold bg-sky-50 text-sky-700 border border-sky-200 shadow-2xs">
                                        {quote.logistics.transitTime}
                                    </span>
                                </div>
                                <div className="flex items-center gap-2 text-indigo-700">
                                    <MapPin size={16} className="text-indigo-600" />
                                    <span>{quote.delivery.city} (Destination)</span>
                                </div>
                            </div>
                        </div>

                        {/* Pickup & Delivery Grid */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs sm:text-[13px]">
                            
                            {/* Pickup Box */}
                            <div className="p-4 bg-slate-50/80 rounded-md border border-slate-200/70 space-y-2.5">
                                <span className="font-bold text-emerald-800 text-xs block border-b border-slate-200/60 pb-1.5">
                                    Pickup Information
                                </span>
                                <div className="space-y-1.5 text-slate-700">
                                    <p><strong className="text-slate-900">Facility:</strong> {quote.pickup.company}</p>
                                    <p><strong className="text-slate-900">Address:</strong> {quote.pickup.address}</p>
                                    <p><strong className="text-slate-900">Schedule:</strong> {quote.pickup.schedule}</p>
                                    <p><strong className="text-slate-900">Contact:</strong> {quote.pickup.contact}</p>
                                </div>
                            </div>

                            {/* Delivery Box */}
                            <div className="p-4 bg-slate-50/80 rounded-md border border-slate-200/70 space-y-2.5">
                                <span className="font-bold text-indigo-800 text-xs block border-b border-slate-200/60 pb-1.5">
                                    Delivery Information
                                </span>
                                <div className="space-y-1.5 text-slate-700">
                                    <p><strong className="text-slate-900">Facility:</strong> {quote.delivery.company}</p>
                                    <p><strong className="text-slate-900">Address:</strong> {quote.delivery.address}</p>
                                    <p><strong className="text-slate-900">Schedule:</strong> {quote.delivery.schedule}</p>
                                    <p><strong className="text-slate-900">Contact:</strong> {quote.delivery.contact}</p>
                                </div>
                            </div>

                        </div>

                        {/* Cargo Load Specs */}
                        <div className="p-4 bg-slate-50/90 rounded-md border border-slate-200/80 text-xs sm:text-[13px] grid grid-cols-1 sm:grid-cols-3 gap-4">
                            <div>
                                <span className="text-slate-500 font-medium block">Load & volume:</span>
                                <span className="font-bold text-slate-900 mt-0.5 block">{quote.cargo.loadType} • {quote.cargo.volume}</span>
                            </div>
                            <div>
                                <span className="text-slate-500 font-medium block">Weight:</span>
                                <span className="font-bold text-slate-900 mt-0.5 block">{quote.cargo.weight}</span>
                            </div>
                            <div>
                                <span className="text-slate-500 font-medium block">Handling requirement:</span>
                                <span className="font-bold text-amber-700 mt-0.5 block">{quote.cargo.care}</span>
                            </div>
                        </div>

                    </div>

                    {/* Carrier Profile & Terms Card */}
                    <div className="bg-white border border-slate-200 rounded-md p-5 sm:p-6 shadow-2xs space-y-4">
                        <div className="flex items-center justify-between border-b border-slate-100 pb-3.5">
                            <h2 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                                <Building2 size={17} className="text-slate-500" /> Carrier Profile & Terms
                            </h2>
                            <span className="inline-flex items-center px-3 py-0.5 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                                Verified Transport Partner
                            </span>
                        </div>

                        <div className="flex items-start gap-4 text-xs sm:text-sm">
                            <div className="w-11 h-11 rounded-md bg-orange-50 text-[#ff4a1f] border border-orange-200 flex items-center justify-center font-bold text-base shrink-0">
                                {quote.supplier.name.charAt(0)}
                            </div>
                            <div className="flex-1 space-y-1">
                                <div className="flex items-center justify-between">
                                    <h3 className="text-sm font-bold text-slate-900">{quote.supplier.name}</h3>
                                    <span className="text-xs text-slate-500 font-medium">Est. {quote.supplier.established}</span>
                                </div>
                                <div className="flex items-center gap-3 text-slate-600">
                                    <span className="font-bold text-slate-800 flex items-center gap-1">
                                        <Star size={14} className="text-amber-500 fill-amber-500" /> {quote.supplier.rating} ({quote.supplier.reviews} reviews)
                                    </span>
                                    <span>•</span>
                                    <span className="font-semibold text-emerald-600">{quote.supplier.completedJobs}+ Completed Shipments</span>
                                </div>
                            </div>
                        </div>

                        <div className="p-4 bg-slate-50 rounded-md border border-slate-200/80 text-xs sm:text-[13px] space-y-1.5">
                            <span className="font-bold text-slate-900 block text-xs">Supplier Note & Conditions:</span>
                            <p className="text-slate-700 font-medium leading-relaxed">
                                "{quote.notes}"
                            </p>
                        </div>
                    </div>

                </div>

                {/* Right 5 Columns: Rate Breakdown Card & Revision History */}
                <div className="lg:col-span-5 space-y-6">
                    
                    {/* Rate Breakdown Card */}
                    <div className="bg-white border border-slate-200 rounded-md p-5 sm:p-6 shadow-2xs space-y-5">
                        <div className="flex items-center justify-between border-b border-slate-100 pb-3.5">
                            <h2 className="text-sm font-bold text-slate-900">Quote Rate Breakdown</h2>
                            <span className="inline-flex items-center px-3 py-0.5 rounded-full text-xs font-semibold bg-orange-50 text-[#ff4a1f] border border-orange-200">
                                Firm Offer
                            </span>
                        </div>

                        <div className="space-y-3 text-xs sm:text-sm text-slate-600">
                            <div className="flex justify-between items-center">
                                <span className="font-medium text-slate-500">Base freight transport</span>
                                <span className="font-bold text-slate-900">€{quote.pricing.baseFreight.toLocaleString()}</span>
                            </div>
                            <div className="flex justify-between items-center">
                                <span className="font-medium text-slate-500">Loading & unloading labor</span>
                                <span className="font-bold text-slate-900">€{quote.pricing.loadingUnloading.toLocaleString()}</span>
                            </div>
                            <div className="flex justify-between items-center">
                                <span className="font-medium text-slate-500">CMR cargo insurance</span>
                                <span className="font-bold text-slate-900">€{quote.pricing.insurance.toLocaleString()}</span>
                            </div>
                        </div>

                        <div className="pt-4 border-t border-slate-100 space-y-4">
                            <div className="flex justify-between items-baseline">
                                <span className="text-xs font-bold text-slate-900">Total All-Inclusive Rate</span>
                                <span className="text-xl font-extrabold text-[#ff4a1f]">€{quote.pricing.total.toLocaleString()}</span>
                            </div>
                            
                            <div className="text-center bg-slate-50 rounded-md p-2.5 border border-slate-200/80 text-xs">
                                <span className="text-slate-500 font-medium">Quote validity: </span>
                                <span className="font-bold text-slate-900">{quote.validUntil}</span>
                            </div>

                            <div className="flex flex-col sm:flex-row gap-2 pt-1">
                                <Button 
                                    variant="outline"
                                    className="w-full sm:w-1/2 h-10 text-xs font-semibold text-slate-700 border border-slate-300 hover:bg-slate-50 flex items-center justify-center gap-1.5 cursor-pointer rounded-md"
                                    onClick={() => navigate('/customer/quotes/negotiation')}
                                >
                                    <MessageSquare size={14} />
                                    <span>Negotiate Rate</span>
                                </Button>

                                <Button 
                                    className="w-full sm:w-1/2 h-10 text-xs font-bold bg-[#ff4a1f] hover:bg-[#e03e15] text-white shadow-sm flex items-center justify-center gap-1.5 cursor-pointer rounded-md"
                                    onClick={() => navigate('/customer/quotes/received/checkout/' + quote.id, { state: { quote } })}
                                >
                                    <CheckCircle size={15} />
                                    <span>Accept & Book</span>
                                </Button>
                            </div>
                        </div>
                    </div>

                    {/* Segmented Pill Tab Bar (Matching Image Exactly) */}
                    <div className="bg-white border border-slate-200 rounded-md p-5 sm:p-6 shadow-2xs space-y-5 font-sans">
                        
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
                            <h2 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                                <Clock size={17} className="text-slate-500" /> Negotiation Log
                            </h2>

                            {/* Segmented Pill Tab Switcher */}
                            <div className="p-1 bg-slate-100/90 border border-slate-200/70 rounded-full inline-flex items-center gap-1 shrink-0">
                                <button
                                    type="button"
                                    onClick={() => setActiveTab('active')}
                                    className={`px-3 py-1 rounded-full text-xs transition-all cursor-pointer flex items-center gap-1.5 ${
                                        activeTab === 'active'
                                            ? 'bg-white text-[#ff4a1f] shadow-2xs border border-slate-200/80 font-bold'
                                            : 'text-slate-600 hover:text-slate-900 font-medium'
                                    }`}
                                >
                                    <Clock size={13} className={activeTab === 'active' ? 'text-[#ff4a1f]' : 'text-slate-500'} />
                                    <span>Active Negotiations ({activeNegotiations.length})</span>
                                </button>

                                <button
                                    type="button"
                                    onClick={() => setActiveTab('history')}
                                    className={`px-3 py-1 rounded-full text-xs transition-all cursor-pointer flex items-center gap-1.5 ${
                                        activeTab === 'history'
                                            ? 'bg-white text-[#ff4a1f] shadow-2xs border border-slate-200/80 font-bold'
                                            : 'text-slate-600 hover:text-slate-900 font-medium'
                                    }`}
                                >
                                    <History size={13} className={activeTab === 'history' ? 'text-[#ff4a1f]' : 'text-slate-500'} />
                                    <span>Negotiation History ({quoteHistory.length})</span>
                                </button>
                            </div>
                        </div>

                        {/* Tab Content 1: Active Negotiations */}
                        {activeTab === 'active' && (
                            <div className="space-y-3">
                                {activeNegotiations.map((item) => (
                                    <div key={item.id} className="p-4 bg-slate-50 border border-slate-200/80 rounded-md text-xs space-y-2">
                                        <div className="flex items-center justify-between">
                                            <span className="font-bold text-slate-900">{item.type}</span>
                                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-50 text-amber-700 border border-amber-200">
                                                {item.status}
                                            </span>
                                        </div>
                                        <p className="text-slate-700 font-medium">{item.note}</p>
                                        <div className="flex items-center justify-between text-slate-500 pt-1 border-t border-slate-200/60">
                                            <span>{item.date}</span>
                                            <span className="font-bold text-[#ff4a1f]">Target: €{item.proposedTotal.toLocaleString()}</span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}

                        {/* Tab Content 2: Negotiation History Timeline */}
                        {activeTab === 'history' && (
                            <div className="relative border-l-2 border-slate-200 ml-3 space-y-4 pt-2 pb-1">
                                {quoteHistory.map((event) => (
                                    <div key={event.id} className="relative pl-5">
                                        <div className={`absolute -left-[7px] top-1.5 w-3 h-3 rounded-full border-2 border-white shadow-xs ${event.type === 'Supplier Revision' ? 'bg-[#ff4a1f]' : event.type === 'Customer Request' ? 'bg-amber-500' : 'bg-slate-400'}`}></div>

                                        <div className="flex items-center gap-2 mb-1 flex-wrap text-xs sm:text-[13px]">
                                            <span className="font-bold text-slate-900">{event.type}</span>
                                            <span className="text-slate-400">• {event.date}</span>
                                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold ml-auto ${event.status === 'Revised' ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : event.status === 'Requested' ? 'bg-amber-50 text-amber-700 border border-amber-200' : 'bg-slate-100 text-slate-700 border border-slate-200'}`}>
                                                {event.status}
                                            </span>
                                        </div>

                                        <div className="bg-slate-50 border border-slate-200/80 rounded-md p-3.5 text-xs sm:text-[13px] space-y-2">
                                            <p className="text-slate-700 font-medium leading-relaxed">{event.note}</p>
                                            <div className="flex items-center gap-3 font-semibold">
                                                {event.previousTotal && (
                                                    <div className="text-slate-400 line-through">
                                                        Previous: €{event.previousTotal.toLocaleString()}
                                                    </div>
                                                )}
                                                <div className="flex items-center gap-1.5 font-bold text-slate-900">
                                                    {event.previousTotal && <ArrowRight size={13} className="text-slate-400" />}
                                                    <span className={event.type === 'Customer Request' ? 'text-amber-700' : 'text-[#ff4a1f]'}>
                                                        New Rate: €{event.newTotal.toLocaleString()}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}

                    </div>

                </div>

            </div>

        </div>
    );
}
