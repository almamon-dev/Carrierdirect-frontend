import React, { useState, useEffect } from 'react';
import { 
  ArrowLeft, Star, MapPin, Truck, ShieldCheck, CheckCircle, MessageSquare, 
  ArrowRight, Box, Calendar, FileText, Clock, Building2, ChevronDown, ChevronUp, Navigation, History, RotateCcw,
  Loader2, AlertCircle, Receipt
} from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';
import Badge from '@/components/ui/badge';
import Button from '@/components/ui/button';
import { apiClient } from '@/lib/axios';
import { ENDPOINTS } from '@/config/api';

interface ExtraCharge {
    type: string;
    custom_name: string | null;
    amount: number;
}

interface QuoteData {
    id: number;
    amount: string;
    base_amount: string | null;
    extra_charges: ExtraCharge[];
    supplier_name: string;
    rating: number;
    completed_orders: string;
    notes: string;
    estimated_delivery: string;
    pickup_date: string;
    delivery_date: string;
    revision_status: string;
}

interface RequestDetail {
    id: number;
    origin: string;
    destination: string;
    pickup_city: string;
    delivery_city: string;
    pickup_date: string;
    delivery_date: string;
    total_weight: string;
    load_type: string;
    vehicle_type: string;
    budget: string | null;
    currency: string;
    est_distance: string;
    additional_notes: string;
}

export default function QuoteView() {
    const navigate = useNavigate();
    const { quoteId, requestId } = useParams();
    const [activeTab, setActiveTab] = useState<'breakdown' | 'history'>('breakdown');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [quotes, setQuotes] = useState<QuoteData[]>([]);
    const [requestDetail, setRequestDetail] = useState<RequestDetail | null>(null);
    const [selectedQuote, setSelectedQuote] = useState<QuoteData | null>(null);

    // The requestId is the quote_request_id - either from params or from quoteId prefix
    const reqId = requestId || quoteId?.replace('REQ-', '') || '';

    useEffect(() => {
        if (!reqId) return;
        setLoading(true);
        apiClient.get(ENDPOINTS.CUSTOMER.REQUEST_QUOTES(reqId))
            .then(res => {
                const data = res.data?.data || res.data;
                const quotesList: QuoteData[] = data?.quotes_request || [];
                const detail: RequestDetail = data?.quote_details || null;
                setQuotes(quotesList);
                setRequestDetail(detail);
                // Auto-select the quote matching quoteId, or first quote
                if (quoteId && quoteId.startsWith('QT-')) {
                    const numId = parseInt(quoteId.replace('QT-', ''));
                    const found = quotesList.find(q => q.id === numId);
                    setSelectedQuote(found || quotesList[0] || null);
                } else {
                    setSelectedQuote(quotesList[0] || null);
                }
            })
            .catch(err => {
                console.error('Failed to load quote details:', err);
                setError('Failed to load quote details. Please try again.');
            })
            .finally(() => setLoading(false));
    }, [reqId]);

    if (loading) {
        return (
            <div className="p-6 flex items-center justify-center min-h-[60vh]">
                <div className="flex flex-col items-center gap-3 text-slate-500">
                    <Loader2 size={28} className="animate-spin text-[#ff4a1f]" />
                    <span className="text-sm font-medium">Loading quote details...</span>
                </div>
            </div>
        );
    }
    if (error) {
        return (
            <div className="p-6 flex items-center justify-center min-h-[60vh]">
                <div className="flex flex-col items-center gap-3 text-slate-500">
                    <AlertCircle size={28} className="text-red-500" />
                    <span className="text-sm font-medium text-red-600">{error}</span>
                    <Button variant="outline" size="sm" onClick={() => navigate(-1)}>Go Back</Button>
                </div>
            </div>
        );
    }

    const quote = selectedQuote;
    const req = requestDetail;

    // Parse total amount from formatted string like "€45,000"
    const parsedTotal = quote ? parseFloat(quote.amount.replace(/[^0-9.]/g, '')) : 0;
    const parsedBase = quote?.base_amount ? parseFloat(quote.base_amount.replace(/[^0-9.]/g, '')) : 0;
    const extraTotal = quote?.extra_charges?.reduce((sum, c) => sum + (c.amount || 0), 0) ?? 0;

    return (
        <div className="p-4 md:p-6 w-full mx-auto min-h-screen font-sans bg-[#f8f9fa] pb-24 text-slate-800 antialiased">
            
            {/* Page Header Bar */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                <div>
                    <div className="flex items-center gap-2.5 mb-1">
                        <h1 className="text-xl font-bold text-slate-900 tracking-tight">Quote Details</h1>
                        <span className="inline-flex items-center px-3 py-0.5 rounded-full text-xs font-semibold bg-slate-100 text-slate-700 border border-slate-200">
                            REQ-{req?.id || reqId}
                        </span>
                        {quote && (
                            <Badge variant={quote.revision_status === 'pending' ? 'warning' : 'success'}>
                                {quote.revision_status === 'pending' ? 'Revised Offer' : 'Active Quote'}
                            </Badge>
                        )}
                    </div>
                    <p className="text-xs text-slate-500 font-medium">
                        Review carrier response and rate breakdown for shipment request <span className="text-[#ff4a1f] font-bold">REQ-{req?.id || reqId}</span>.
                    </p>
                </div>

                <div className="flex items-center gap-2">
                    <Button 
                        variant="outline" 
                        size="sm"
                        icon={<ArrowLeft size={14} />}
                        onClick={() => navigate(-1)}
                    >
                        Back to Quotes
                    </Button>
                </div>
            </div>

            {/* Multiple quotes selector if multiple suppliers bid */}
            {quotes.length > 1 && (
                <div className="mb-5 flex flex-wrap gap-2 items-center">
                    <span className="text-xs font-semibold text-slate-600">{quotes.length} Carrier Offers:</span>
                    {quotes.map((q, i) => (
                        <button
                            key={q.id}
                            type="button"
                            onClick={() => setSelectedQuote(q)}
                            className={`px-3 py-1.5 rounded-md text-xs font-semibold border transition-colors ${
                                selectedQuote?.id === q.id
                                    ? 'bg-[#ff4a1f] text-white border-[#ff4a1f]'
                                    : 'bg-white text-slate-700 border-slate-200 hover:border-slate-400'
                            }`}
                        >
                            {q.supplier_name} — {q.amount}
                        </button>
                    ))}
                </div>
            )}

            {/* Quick Metrics Strip */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                <div className="bg-white border border-slate-200 rounded-md p-4 shadow-2xs flex items-center gap-3.5">
                    <div className="w-10 h-10 rounded-md bg-orange-50 text-[#ff4a1f] flex items-center justify-center font-bold text-base shrink-0 border border-orange-100">
                        €
                    </div>
                    <div>
                        <span className="text-xs font-medium text-slate-500 block">Total Offer</span>
                        <span className="text-base font-extrabold text-slate-900">{quote?.amount || '—'}</span>
                    </div>
                </div>

                <div className="bg-white border border-slate-200 rounded-md p-4 shadow-2xs flex items-center gap-3.5">
                    <div className="w-10 h-10 rounded-md bg-blue-50 text-blue-600 flex items-center justify-center shrink-0 border border-blue-100">
                        <Truck size={18} />
                    </div>
                    <div>
                        <span className="text-xs font-medium text-slate-500 block">Transit Time</span>
                        <span className="text-xs font-bold text-slate-900 truncate block">{quote?.estimated_delivery || '—'}</span>
                    </div>
                </div>

                <div className="bg-white border border-slate-200 rounded-md p-4 shadow-2xs flex items-center gap-3.5">
                    <div className="w-10 h-10 rounded-md bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0 border border-emerald-100">
                        <Receipt size={18} />
                    </div>
                    <div>
                        <span className="text-xs font-medium text-slate-500 block">Extra Charges</span>
                        <span className="text-xs font-bold text-slate-900 block">
                            {(quote?.extra_charges?.length || 0) > 0 ? `${quote!.extra_charges.length} item(s) — €${extraTotal.toFixed(2)}` : 'None'}
                        </span>
                    </div>
                </div>

                <div className="bg-white border border-slate-200 rounded-md p-4 shadow-2xs flex items-center gap-3.5">
                    <div className="w-10 h-10 rounded-md bg-amber-50 text-amber-600 flex items-center justify-center shrink-0 border border-amber-100">
                        <Star size={18} className="fill-amber-500" />
                    </div>
                    <div>
                        <span className="text-xs font-medium text-slate-500 block">Carrier Rating</span>
                        <span className="text-xs font-bold text-slate-900 block">{quote?.rating ?? '—'} ★</span>
                    </div>
                </div>
            </div>

            {/* Main Content Layout Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">

                {/* Left 7 Columns: Route & Carrier Details */}
                <div className="lg:col-span-7 space-y-6">
                    
                    {/* Route Card */}
                    <div className="bg-white border border-slate-200 rounded-md p-5 sm:p-6 shadow-2xs space-y-5">
                        
                        <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                            <h2 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                                <Navigation size={17} className="text-[#ff4a1f]" /> Shipment Route & Requirements
                            </h2>
                            {req?.est_distance && (
                                <span className="inline-flex items-center px-3 py-0.5 rounded-full text-xs font-semibold bg-sky-50 text-sky-700 border border-sky-200">
                                    Distance: {req.est_distance}
                                </span>
                            )}
                        </div>

                        {/* Route Line */}
                        <div className="p-4 sm:p-5 bg-slate-50 border border-slate-200/80 rounded-md space-y-3">
                            <div className="flex items-center justify-between text-xs sm:text-sm font-bold text-slate-900">
                                <div className="flex items-center gap-2 text-emerald-700">
                                    <MapPin size={16} className="text-emerald-600" />
                                    <span>{req?.origin || '—'} (Origin)</span>
                                </div>
                                <div className="flex-1 mx-4 border-t-2 border-dashed border-slate-300 relative flex items-center justify-center">
                                    <span className="inline-flex items-center px-3 py-0.5 rounded-full text-xs font-semibold bg-sky-50 text-sky-700 border border-sky-200 shadow-2xs">
                                        {quote?.estimated_delivery || '2-3 days'}
                                    </span>
                                </div>
                                <div className="flex items-center gap-2 text-indigo-700">
                                    <MapPin size={16} className="text-indigo-600" />
                                    <span>{req?.destination || '—'} (Destination)</span>
                                </div>
                            </div>
                        </div>

                        {/* Pickup & Delivery dates */}
                        <div className="grid grid-cols-2 gap-4 text-xs">
                            <div className="p-3 bg-emerald-50/50 border border-emerald-200/60 rounded-md">
                                <span className="font-bold text-emerald-800 block mb-1">Pickup Date</span>
                                <span className="text-slate-700 font-semibold">{req?.pickup_date || quote?.pickup_date || '—'}</span>
                            </div>
                            <div className="p-3 bg-indigo-50/50 border border-indigo-200/60 rounded-md">
                                <span className="font-bold text-indigo-800 block mb-1">Delivery Date</span>
                                <span className="text-slate-700 font-semibold">{req?.delivery_date || quote?.delivery_date || '—'}</span>
                            </div>
                        </div>

                        {/* Cargo Specs */}
                        <div className="p-4 bg-slate-50/90 rounded-md border border-slate-200/80 text-xs grid grid-cols-3 gap-4">
                            <div>
                                <span className="text-slate-500 font-medium block">Load Type:</span>
                                <span className="font-bold text-slate-900 mt-0.5 block">{req?.load_type || '—'}</span>
                            </div>
                            <div>
                                <span className="text-slate-500 font-medium block">Weight:</span>
                                <span className="font-bold text-slate-900 mt-0.5 block">{req?.total_weight || '—'}</span>
                            </div>
                            <div>
                                <span className="text-slate-500 font-medium block">Target Budget:</span>
                                <span className="font-bold text-amber-700 mt-0.5 block">
                                    {req?.budget ? `${req.currency ?? '€'}${req.budget}` : 'Open / Flexible'}
                                </span>
                            </div>
                        </div>

                    </div>

                    {/* Carrier Profile Card */}
                    <div className="bg-white border border-slate-200 rounded-md p-5 sm:p-6 shadow-2xs space-y-4">
                        <div className="flex items-center justify-between border-b border-slate-100 pb-3.5">
                            <h2 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                                <Building2 size={17} className="text-slate-500" /> Carrier Profile
                            </h2>
                            <span className="inline-flex items-center px-3 py-0.5 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                                <ShieldCheck size={12} className="mr-1" /> Verified Transport Partner
                            </span>
                        </div>

                        <div className="flex items-start gap-4 text-xs sm:text-sm">
                            <div className="w-11 h-11 rounded-md bg-orange-50 text-[#ff4a1f] border border-orange-200 flex items-center justify-center font-bold text-base shrink-0">
                                {(quote?.supplier_name || 'S').charAt(0)}
                            </div>
                            <div className="flex-1 space-y-1">
                                <div className="flex items-center justify-between">
                                    <h3 className="text-sm font-bold text-slate-900">{quote?.supplier_name || '—'}</h3>
                                </div>
                                <div className="flex items-center gap-3 text-slate-600">
                                    <span className="font-bold text-slate-800 flex items-center gap-1">
                                        <Star size={14} className="text-amber-500 fill-amber-500" /> {quote?.rating ?? '—'} ★
                                    </span>
                                    <span>•</span>
                                    <span className="font-semibold text-emerald-600">{quote?.completed_orders || '—'}</span>
                                </div>
                            </div>
                        </div>

                        {quote?.notes && (
                            <div className="p-4 bg-slate-50 rounded-md border border-slate-200/80 text-xs">
                                <span className="font-bold text-slate-900 block text-xs mb-1">Supplier Note & Conditions:</span>
                                <p className="text-slate-700 font-medium leading-relaxed">"{quote.notes}"</p>
                            </div>
                        )}
                    </div>
                </div>

                {/* Right 5 Columns: Rate Breakdown */}
                <div className="lg:col-span-5 space-y-6">
                    
                    {/* Rate Breakdown Card */}
                    <div className="bg-white border border-slate-200 rounded-md p-5 sm:p-6 shadow-2xs space-y-5">
                        <div className="flex items-center justify-between border-b border-slate-100 pb-3.5">
                            <h2 className="text-sm font-bold text-slate-900">Quote Rate Breakdown</h2>
                            <span className="inline-flex items-center px-3 py-0.5 rounded-full text-xs font-semibold bg-orange-50 text-[#ff4a1f] border border-orange-200">
                                Firm Offer
                            </span>
                        </div>

                        {quote ? (
                            <div className="space-y-3 text-xs sm:text-sm text-slate-600">
                                {/* Base Freight */}
                                <div className="flex justify-between items-center">
                                    <span className="font-medium text-slate-500">Base freight transport</span>
                                    <span className="font-bold text-slate-900">{quote.base_amount || quote.amount}</span>
                                </div>

                                {/* Extra Charges */}
                                {quote.extra_charges && quote.extra_charges.length > 0 ? (
                                    <>
                                        <div className="border-t border-slate-100 pt-2">
                                            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wide block mb-2">Extra Charges</span>
                                            {quote.extra_charges.map((charge, i) => (
                                                <div key={i} className="flex justify-between items-center py-1.5 border-b border-slate-100 last:border-0">
                                                    <div className="flex items-center gap-2">
                                                        <div className="w-1.5 h-1.5 rounded-full bg-slate-400 shrink-0" />
                                                        <span className="font-medium text-slate-600">
                                                            {charge.custom_name || charge.type}
                                                        </span>
                                                    </div>
                                                    <span className="font-bold text-slate-900">€{charge.amount.toFixed(2)}</span>
                                                </div>
                                            ))}
                                            {extraTotal > 0 && (
                                                <div className="flex justify-between items-center pt-2 text-slate-500">
                                                    <span className="text-xs font-medium">Extra charges subtotal</span>
                                                    <span className="text-xs font-semibold">€{extraTotal.toFixed(2)}</span>
                                                </div>
                                            )}
                                        </div>
                                    </>
                                ) : (
                                    <div className="text-xs text-slate-400 italic flex items-center gap-1.5 py-1">
                                        <Receipt size={13} /> No extra charges added
                                    </div>
                                )}

                                {/* Total */}
                                <div className="pt-4 border-t border-slate-100">
                                    <div className="flex justify-between items-baseline">
                                        <span className="text-xs font-bold text-slate-900">Total All-Inclusive Rate</span>
                                        <span className="text-xl font-extrabold text-[#ff4a1f]">{quote.amount}</span>
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <div className="text-xs text-slate-400 text-center py-8">No quote data available.</div>
                        )}

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
                                onClick={() => navigate('/customer/quotes/received/checkout/' + (quote?.id || ''), { state: { quote } })}
                                disabled={!quote}
                            >
                                <CheckCircle size={15} />
                                <span>Accept & Book</span>
                            </Button>
                        </div>
                    </div>

                    {/* Additional Notes */}
                    {req?.additional_notes && (
                        <div className="bg-white border border-slate-200 rounded-md p-5 shadow-2xs">
                            <h2 className="text-sm font-bold text-slate-900 mb-3 flex items-center gap-2">
                                <FileText size={15} className="text-slate-400" /> Customer's Request Notes
                            </h2>
                            <p className="text-xs text-slate-600 leading-relaxed">{req.additional_notes}</p>
                        </div>
                    )}
                </div>

            </div>

        </div>
    );
}
