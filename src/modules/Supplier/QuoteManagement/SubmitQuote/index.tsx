import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { 
    ArrowLeft, Send, CheckCircle2, Euro, Clock, Plus, Trash2, MapPin, 
    Truck, Box, Settings, ShieldCheck, FileText, Download, XCircle, 
    ChevronRight, Navigation, Layers, Check, Calculator, Star, ArrowRight
} from 'lucide-react';
import Button from '@/components/ui/button';
import Input from '@/components/ui/input';
import Textarea from '@/components/ui/textarea';
import Badge from '@/components/ui/badge';
import FormLabel from '@/components/ui/label';
import Select from '@/components/ui/select';
import { getQuoteRequestBySlug, QuoteRequest } from '../data/quoteRequestsData';

export default function SubmitQuote() {
    const navigate = useNavigate();
    const { slug } = useParams<{ slug?: string }>();

    // Load matching quote request based on slug
    const [requestDetails, setRequestDetails] = useState<QuoteRequest>(() => getQuoteRequestBySlug(slug));

    useEffect(() => {
        setRequestDetails(getQuoteRequestBySlug(slug));
    }, [slug]);

    // Form state
    const [price, setPrice] = useState<string>('');
    const [extraCharges, setExtraCharges] = useState<{ name: string; description: string; amount: string }[]>([]);
    const [notes, setNotes] = useState<string>('');
    const [validity, setValidity] = useState<string>('48h');
    const [paymentTerm, setPaymentTerm] = useState<string>('net15');
    const [assignedVehicle, setAssignedVehicle] = useState<string>('auto');
    const [submitted, setSubmitted] = useState<boolean>(false);
    const [declined, setDeclined] = useState<boolean>(false);
    const [showDeclineModal, setShowDeclineModal] = useState<boolean>(false);
    const [declineReason, setDeclineReason] = useState<string>('');
    
    // Tab state
    const [activeTab, setActiveTab] = useState<'overview' | 'cargo' | 'services' | 'instructions'>('overview');

    // Calculate total price offer
    const calculateBasePrice = () => parseFloat(price) || 0;
    const calculateExtras = () => extraCharges.reduce((acc, curr) => acc + (parseFloat(curr.amount) || 0), 0);
    const calculateTotal = () => (calculateBasePrice() + calculateExtras()).toFixed(2);
    
    // Calculate estimated net payout
    const calculateNetPayout = () => {
        const total = parseFloat(calculateTotal());
        return (total * 0.95).toFixed(2);
    };

    // Quick price preset handler
    const applyBudgetPreset = () => {
        if (!requestDetails.budget || requestDetails.budget === 'Open') {
            setPrice('450');
        } else {
            const numericBudget = requestDetails.budget.replace(/[^0-9.]/g, '');
            if (numericBudget) setPrice(numericBudget);
        }
    };

    const addPresetNote = (noteText: string) => {
        if (notes.includes(noteText)) return;
        setNotes(prev => prev ? `${prev}\n• ${noteText}` : `• ${noteText}`);
    };

    if (submitted) {
        return (
            <div className="p-4 md:p-6 w-full min-h-[80vh] flex items-center justify-center font-sans">
                <div className="bg-white border border-slate-200 shadow-2xs rounded-lg p-8 max-w-md w-full text-center">
                    <div className="w-12 h-12 bg-emerald-50 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-3 border border-emerald-200">
                        <CheckCircle2 size={28} />
                    </div>
                    <Badge variant="success" className="mb-2">Proposal Submitted</Badge>
                    <h2 className="text-lg font-bold text-slate-900 mb-1">Quote Submitted Successfully</h2>
                    <p className="text-xs text-slate-500 leading-relaxed mb-5">
                        Your offer of <span className="font-bold text-slate-800">€{calculateTotal()}</span> for request <span className="font-semibold text-slate-700">{requestDetails.id}</span> has been sent to <strong className="text-slate-800">{requestDetails.customer}</strong>.
                    </p>
                    
                    <div className="bg-slate-50 border border-slate-200 rounded-md p-3.5 mb-5 text-left space-y-2 text-xs text-slate-600">
                        <div className="flex justify-between border-b border-slate-200 pb-1.5">
                            <span>Route:</span>
                            <span className="font-semibold text-slate-800">{requestDetails.pickup} → {requestDetails.delivery}</span>
                        </div>
                        <div className="flex justify-between border-b border-slate-200 pb-1.5">
                            <span>Validity:</span>
                            <span className="font-semibold text-slate-800">{validity === '24h' ? '24 Hours' : validity === '48h' ? '48 Hours' : validity === '3d' ? '3 Days' : '7 Days'}</span>
                        </div>
                        <div className="flex justify-between">
                            <span>Est. Net Payout:</span>
                            <span className="font-bold text-emerald-600">€{calculateNetPayout()}</span>
                        </div>
                    </div>

                    <div className="flex gap-3">
                        <Button 
                            variant="outline" 
                            className="flex-1 text-xs h-9" 
                            onClick={() => navigate('/supplier/quotes/requests')}
                        >
                            <ArrowLeft size={13} className="mr-1" /> Back to Requests
                        </Button>
                        <Button 
                            variant="primary" 
                            className="flex-1 text-xs h-9 bg-[#ff4a1f] hover:bg-[#e03e15] text-white" 
                            onClick={() => navigate('/supplier/quotes/negotiation')}
                        >
                            View Negotiation <ChevronRight size={13} className="ml-1" />
                        </Button>
                    </div>
                </div>
            </div>
        );
    }

    if (declined) {
        return (
            <div className="p-4 md:p-6 w-full min-h-[80vh] flex items-center justify-center font-sans">
                <div className="bg-white border border-slate-200 shadow-2xs rounded-lg p-8 max-w-md w-full text-center">
                    <div className="w-12 h-12 bg-slate-100 text-slate-600 rounded-full flex items-center justify-center mx-auto mb-3 border border-slate-200">
                        <XCircle size={28} />
                    </div>
                    <h2 className="text-lg font-bold text-slate-900 mb-1">Request Declined</h2>
                    <p className="text-xs text-slate-500 mb-5 leading-relaxed">
                        You have declined request <span className="font-semibold text-slate-700">{requestDetails.id}</span>.
                    </p>
                    <Button variant="primary" className="w-full text-xs h-9" onClick={() => navigate('/supplier/quotes/requests')}>
                        Back to Quote Requests
                    </Button>
                </div>
            </div>
        );
    }

    return (
        <div className="p-4 md:p-6 w-full mx-auto min-h-screen font-sans antialiased space-y-5">
            {/* Header & Actions */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <button 
                        onClick={() => navigate('/supplier/quotes/requests')} 
                        className="text-xs text-slate-500 hover:text-slate-900 flex items-center transition-colors font-medium mb-1"
                    >
                        <ArrowLeft size={13} className="mr-1" /> Back to Quote Requests
                    </button>
                    <div className="flex items-center gap-3">
                        <h1 className="text-lg font-bold text-slate-900 tracking-tight">
                            Quote Request: {requestDetails.id}
                        </h1>
                        <Badge variant="info">{requestDetails.status}</Badge>
                        <Badge variant="warning">{requestDetails.priority}</Badge>
                    </div>
                </div>

                {/* Toolbar */}
                <div className="flex items-center gap-2">
                    <Button 
                        variant="outline" 
                        size="sm" 
                        className="h-8 text-xs font-semibold text-slate-700 hover:bg-slate-50"
                        onClick={() => alert(`Exporting ${requestDetails.id}...`)}
                    >
                        <Download size={13} className="mr-1 text-slate-500" /> Export PDF
                    </Button>
                    <Button 
                        variant="outline" 
                        size="sm" 
                        className="h-8 text-xs font-semibold text-red-600 hover:bg-red-50 hover:border-red-200"
                        onClick={() => setShowDeclineModal(true)}
                    >
                        <XCircle size={13} className="mr-1" /> Decline
                    </Button>
                    <Button 
                        variant="primary" 
                        size="sm" 
                        className="h-8 text-xs font-semibold bg-[#ff4a1f] hover:bg-[#e03e15] text-white"
                        onClick={() => {
                            const el = document.getElementById('offer-price-input');
                            if (el) el.focus();
                        }}
                    >
                        <Send size={13} className="mr-1" /> Submit Quote
                    </Button>
                </div>
            </div>

            {/* Split Content Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
                
                {/* LEFT PANEL: Request Details (8 cols) */}
                <div className="lg:col-span-7 xl:col-span-8 space-y-5">

                    {/* Customer & Route Card */}
                    <div className="bg-white border border-slate-200 rounded-lg shadow-2xs p-5 space-y-5">
                        
                        {/* Customer Header */}
                        <div className="flex flex-wrap items-center justify-between pb-4 border-b border-slate-200 gap-3">
                            <div>
                                <div className="flex items-center gap-2 text-slate-900 font-bold text-sm">
                                    <span>{requestDetails.customer}</span>
                                    <span title="Verified Shipper"><ShieldCheck size={15} className="text-blue-600" /></span>
                                    <span className="text-slate-500 text-xs font-normal">★ {requestDetails.customerRating} ({requestDetails.customerOrdersCount} orders)</span>
                                </div>
                                <p className="text-xs text-slate-500 mt-0.5">
                                    Date: {requestDetails.requestDate} • Phone: {requestDetails.customerPhone}
                                </p>
                            </div>
                            <div className="text-right">
                                <span className="text-[11px] text-slate-500 block font-medium">Target Budget</span>
                                <span className="text-sm font-bold text-slate-900">{requestDetails.budget}</span>
                            </div>
                        </div>

                        {/* Route Grid */}
                        <div className="grid grid-cols-1 md:grid-cols-[1fr_auto_1fr] gap-4 items-stretch">
                            {/* Pickup */}
                            <div className="p-3.5 rounded-md border border-slate-200 bg-slate-50/50 flex flex-col justify-between h-full">
                                <div>
                                    <div className="flex items-center justify-between mb-1.5">
                                        <span className="text-xs font-bold text-slate-800 flex items-center gap-1">
                                            <MapPin size={13} className="text-slate-600" /> Pickup
                                        </span>
                                        <span className="text-[11px] font-medium text-slate-500">{requestDetails.pickupDate}</span>
                                    </div>
                                    <h4 className="text-sm font-bold text-slate-900">{requestDetails.pickup}</h4>
                                    <p className="text-xs text-slate-600 mt-1 leading-snug">{requestDetails.pickupFullAddress}</p>
                                </div>
                                <div className="pt-2 mt-3 border-t border-slate-200/60 flex items-center justify-between">
                                    <span className="text-[11px] text-slate-500">Time Slot:</span>
                                    <span className="text-[11px] font-medium text-slate-700">{requestDetails.pickupTimeWindow}</span>
                                </div>
                            </div>

                            {/* Mid Distance */}
                            <div className="flex flex-col items-center justify-center text-center px-1 self-center">
                                <div className="flex items-center justify-center w-7 h-7 rounded-full bg-slate-100 border border-slate-200 text-slate-500 mb-1">
                                    <Navigation size={12} className="rotate-90 text-slate-600" />
                                </div>
                                <span className="text-xs font-bold text-slate-900 whitespace-nowrap">{requestDetails.distance}</span>
                                <span className="text-[11px] text-slate-500 whitespace-nowrap">{requestDetails.estimatedDuration}</span>
                            </div>

                            {/* Delivery */}
                            <div className="p-3.5 rounded-md border border-slate-200 bg-slate-50/50 flex flex-col justify-between h-full">
                                <div>
                                    <div className="flex items-center justify-between mb-1.5">
                                        <span className="text-xs font-bold text-slate-800 flex items-center gap-1">
                                            <MapPin size={13} className="text-slate-600" /> Delivery
                                        </span>
                                        <span className="text-[11px] font-medium text-slate-500">{requestDetails.deliveryDate}</span>
                                    </div>
                                    <h4 className="text-sm font-bold text-slate-900">{requestDetails.delivery}</h4>
                                    <p className="text-xs text-slate-600 mt-1 leading-snug">{requestDetails.deliveryFullAddress}</p>
                                </div>
                                <div className="pt-2 mt-3 border-t border-slate-200/60 flex items-center justify-between">
                                    <span className="text-[11px] text-slate-500">Time Slot:</span>
                                    <span className="text-[11px] font-medium text-slate-700">{requestDetails.deliveryTimeWindow}</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Underline Tab Navigation */}
                    <div className="bg-white border border-slate-200 rounded-lg shadow-2xs overflow-hidden">
                        <div className="border-b border-slate-200 flex items-center gap-6 px-5 overflow-x-auto custom-scrollbar">
                            <button
                                onClick={() => setActiveTab('overview')}
                                className={`py-3 text-[13px] font-medium border-b-2 transition-colors whitespace-nowrap -mb-px flex items-center gap-1.5 ${
                                    activeTab === 'overview'
                                        ? 'border-[#ff4a1f] text-[#ff4a1f] font-semibold'
                                        : 'border-transparent text-slate-600 hover:text-slate-900'
                                }`}
                            >
                                <Truck size={14} /> Vehicle & Specs
                            </button>
                            <button
                                onClick={() => setActiveTab('cargo')}
                                className={`py-3 text-[13px] font-medium border-b-2 transition-colors whitespace-nowrap -mb-px flex items-center gap-1.5 ${
                                    activeTab === 'cargo'
                                        ? 'border-[#ff4a1f] text-[#ff4a1f] font-semibold'
                                        : 'border-transparent text-slate-600 hover:text-slate-900'
                                }`}
                            >
                                <Box size={14} /> Package Inventory ({requestDetails.cargoItems.length})
                            </button>
                            <button
                                onClick={() => setActiveTab('services')}
                                className={`py-3 text-[13px] font-medium border-b-2 transition-colors whitespace-nowrap -mb-px flex items-center gap-1.5 ${
                                    activeTab === 'services'
                                        ? 'border-[#ff4a1f] text-[#ff4a1f] font-semibold'
                                        : 'border-transparent text-slate-600 hover:text-slate-900'
                                }`}
                            >
                                <Settings size={14} /> Handling & Services
                            </button>
                            <button
                                onClick={() => setActiveTab('instructions')}
                                className={`py-3 text-[13px] font-medium border-b-2 transition-colors whitespace-nowrap -mb-px flex items-center gap-1.5 ${
                                    activeTab === 'instructions'
                                        ? 'border-[#ff4a1f] text-[#ff4a1f] font-semibold'
                                        : 'border-transparent text-slate-600 hover:text-slate-900'
                                }`}
                            >
                                <FileText size={14} /> Instructions & Docs ({requestDetails.documents.length})
                            </button>
                        </div>

                        {/* TAB 1: Specs */}
                        {activeTab === 'overview' && (
                            <div className="p-5 space-y-5">
                                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 text-xs">
                                    <div className="p-3 bg-slate-50 border border-slate-200 rounded-md">
                                        <span className="text-slate-500 font-medium block">Vehicle Type</span>
                                        <span className="font-bold text-slate-900 mt-0.5 block">{requestDetails.vehicleType}</span>
                                    </div>
                                    <div className="p-3 bg-slate-50 border border-slate-200 rounded-md">
                                        <span className="text-slate-500 font-medium block">Weight</span>
                                        <span className="font-bold text-slate-900 mt-0.5 block">{requestDetails.weight}</span>
                                    </div>
                                    <div className="p-3 bg-slate-50 border border-slate-200 rounded-md">
                                        <span className="text-slate-500 font-medium block">Volume</span>
                                        <span className="font-bold text-slate-900 mt-0.5 block">{requestDetails.volume}</span>
                                    </div>
                                    <div className="p-3 bg-slate-50 border border-slate-200 rounded-md">
                                        <span className="text-slate-500 font-medium block">Pallets Count</span>
                                        <span className="font-bold text-slate-900 mt-0.5 block">{requestDetails.palletsCount}</span>
                                    </div>
                                    <div className="p-3 bg-slate-50 border border-slate-200 rounded-md">
                                        <span className="text-slate-500 font-medium block">Items Quantity</span>
                                        <span className="font-bold text-slate-900 mt-0.5 block">{requestDetails.itemsCount}</span>
                                    </div>
                                    <div className="p-3 bg-slate-50 border border-slate-200 rounded-md">
                                        <span className="text-slate-500 font-medium block">Load Type</span>
                                        <span className="font-bold text-slate-900 mt-0.5 block">{requestDetails.loadType}</span>
                                    </div>
                                </div>

                                {/* Dimensions Breakdown */}
                                <div>
                                    <h4 className="text-xs font-bold text-slate-800 mb-2 flex items-center gap-1">
                                        <Layers size={13} /> Cargo Dimensions
                                    </h4>
                                    <div className="border border-slate-200 rounded-md overflow-hidden">
                                        <table className="w-full text-xs">
                                            <thead>
                                                <tr className="border-b border-slate-200 bg-slate-50 text-slate-600 font-semibold">
                                                    <th className="py-2 px-3 text-left">Length</th>
                                                    <th className="py-2 px-3 text-left">Width</th>
                                                    <th className="py-2 px-3 text-left">Height</th>
                                                    <th className="py-2 px-3 text-left">Qty</th>
                                                    <th className="py-2 px-3 text-left">Unit</th>
                                                </tr>
                                            </thead>
                                            <tbody className="divide-y divide-slate-100">
                                                {requestDetails.dimensions.map((dim) => (
                                                    <tr key={dim.id}>
                                                        <td className="py-2 px-3 font-semibold text-slate-800">{dim.length}</td>
                                                        <td className="py-2 px-3 font-semibold text-slate-800">{dim.width}</td>
                                                        <td className="py-2 px-3 font-semibold text-slate-800">{dim.height}</td>
                                                        <td className="py-2 px-3 font-bold text-slate-900">{dim.qty}</td>
                                                        <td className="py-2 px-3 text-slate-500">{dim.unit}</td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* TAB 2: Cargo Inventory */}
                        {activeTab === 'cargo' && (
                            <div className="p-5">
                                <div className="border border-slate-200 rounded-md overflow-hidden">
                                    <table className="w-full text-xs">
                                        <thead>
                                            <tr className="bg-slate-50 text-slate-700 font-semibold border-b border-slate-200">
                                                <th className="py-2.5 px-3 text-left">Item Name</th>
                                                <th className="py-2.5 px-3 text-left">Category</th>
                                                <th className="py-2.5 px-3 text-left">Quantity</th>
                                                <th className="py-2.5 px-3 text-left">Weight</th>
                                                <th className="py-2.5 px-3 text-left">Dimensions</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-slate-100 bg-white">
                                            {requestDetails.cargoItems.map((item) => (
                                                <tr key={item.id}>
                                                    <td className="py-2.5 px-3 font-bold text-slate-900">{item.name}</td>
                                                    <td className="py-2.5 px-3 text-slate-600">{item.category}</td>
                                                    <td className="py-2.5 px-3 font-bold text-slate-900">{item.qty}</td>
                                                    <td className="py-2.5 px-3 text-slate-800">{item.weight}</td>
                                                    <td className="py-2.5 px-3 text-slate-500 font-mono text-[11px]">{item.dimensions}</td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        )}

                        {/* TAB 3: Handling & Services */}
                        {activeTab === 'services' && (
                            <div className="p-5 space-y-5">
                                <div>
                                    <h4 className="text-xs font-bold text-slate-800 mb-2">
                                        Characteristics
                                    </h4>
                                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 text-xs">
                                        {[
                                            { label: 'Stackable', active: requestDetails.stackable },
                                            { label: 'Fragile', active: requestDetails.fragile },
                                            { label: 'Hazardous', active: requestDetails.hazardous },
                                            { label: `Temp Control ${requestDetails.tempRange ? `(${requestDetails.tempRange})` : ''}`, active: requestDetails.tempControlled },
                                            { label: 'Oversized', active: requestDetails.oversized },
                                            { label: 'Perishable', active: requestDetails.perishable },
                                        ].map((item, i) => (
                                            <div key={i} className={`p-2.5 rounded border flex items-center gap-2 font-medium ${item.active ? 'bg-slate-50 border-slate-300 text-slate-900 font-bold' : 'bg-white border-slate-200 text-slate-400 line-through'}`}>
                                                <Check size={13} className={item.active ? 'text-slate-800' : 'text-slate-300'} />
                                                <span>{item.label}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                <div>
                                    <h4 className="text-xs font-bold text-slate-800 mb-2">
                                        Required Services
                                    </h4>
                                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
                                        {[
                                            { label: 'Loading Required', active: requestDetails.loadingRequired },
                                            { label: 'Unloading Required', active: requestDetails.unloadingRequired },
                                            { label: 'Packaging Service', active: requestDetails.packaging },
                                            { label: 'Insurance Coverage', active: requestDetails.insurance },
                                            { label: 'Lift Gate Needed', active: requestDetails.liftGate },
                                            { label: 'White Glove Service', active: requestDetails.whiteGlove },
                                            { label: 'Assembly / Installation', active: requestDetails.assembly },
                                            { label: 'Inside Delivery', active: requestDetails.insideDelivery },
                                        ].map((srv, idx) => (
                                            <div key={idx} className={`p-2.5 rounded border flex items-center gap-2 font-medium ${srv.active ? 'bg-slate-50 border-slate-300 text-slate-900 font-bold' : 'bg-white border-slate-200 text-slate-400 line-through'}`}>
                                                <Check size={13} className={srv.active ? 'text-slate-800' : 'text-slate-300'} />
                                                <span>{srv.label}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* TAB 4: Instructions & Docs */}
                        {activeTab === 'instructions' && (
                            <div className="p-5 space-y-5">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                                    <div className="p-3.5 rounded border border-slate-200 bg-slate-50/50">
                                        <h4 className="font-bold text-slate-900 mb-1 flex items-center gap-1">
                                            <MapPin size={13} /> Pickup Instructions
                                        </h4>
                                        <p className="text-slate-700 whitespace-pre-line leading-relaxed">
                                            {requestDetails.pickupInstructions}
                                        </p>
                                    </div>

                                    <div className="p-3.5 rounded border border-slate-200 bg-slate-50/50">
                                        <h4 className="font-bold text-slate-900 mb-1 flex items-center gap-1">
                                            <MapPin size={13} /> Delivery Instructions
                                        </h4>
                                        <p className="text-slate-700 whitespace-pre-line leading-relaxed">
                                            {requestDetails.deliveryInstructions}
                                        </p>
                                    </div>
                                </div>

                                <div>
                                    <h4 className="text-xs font-bold text-slate-800 mb-2">
                                        Attached Documents
                                    </h4>
                                    <div className="space-y-2">
                                        {requestDetails.documents.map((doc) => (
                                            <div key={doc.id} className="flex items-center justify-between p-3 rounded border border-slate-200 bg-white">
                                                <div className="flex items-center gap-2.5">
                                                    <FileText size={16} className="text-slate-500" />
                                                    <div>
                                                        <p className="text-xs font-bold text-slate-900">{doc.name}</p>
                                                        <p className="text-[11px] text-slate-400">{doc.type} • {doc.size}</p>
                                                    </div>
                                                </div>
                                                <Button variant="outline" size="sm" className="h-7 text-xs px-2.5" onClick={() => alert(`Downloading ${doc.name}...`)}>
                                                    <Download size={12} className="mr-1" /> Download
                                                </Button>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                {/* RIGHT PANEL: Quotation Proposal Form (4 cols) */}
                <div className="lg:col-span-5 xl:col-span-4 bg-white border border-slate-200 rounded-lg shadow-2xs p-5 space-y-4 sticky top-6">
                    <div className="border-b border-slate-200 pb-3 flex items-center justify-between">
                        <h3 className="text-sm font-bold text-slate-900">Your Quotation Offer</h3>
                        <span className="text-xs text-slate-500 font-medium">{requestDetails.id}</span>
                    </div>

                    {/* Target Budget Helper */}
                    <div className="p-2.5 bg-slate-50 border border-slate-200 rounded text-xs flex items-center justify-between">
                        <span className="text-slate-600">Budget: <strong className="text-slate-900">{requestDetails.budget}</strong></span>
                        <button 
                            type="button"
                            onClick={applyBudgetPreset}
                            className="text-xs font-semibold text-slate-900 hover:underline"
                        >
                            Use Budget
                        </button>
                    </div>

                    {/* Base Price */}
                    <div>
                        <FormLabel required className="text-xs font-semibold text-slate-800">
                            Freight Price (€)
                        </FormLabel>
                        <div className="relative mt-1">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400 text-xs font-bold">
                                €
                            </div>
                            <Input 
                                id="offer-price-input"
                                type="number" 
                                placeholder="0.00" 
                                className="pl-7 font-bold text-sm h-9 border-slate-300 focus:border-[#ff4a1f] focus:ring-[#ff4a1f]"
                                value={price}
                                onChange={(e) => setPrice(e.target.value)}
                            />
                        </div>
                        
                        <div className="flex gap-1.5 mt-2">
                            {['350', '450', '550', '750'].map(val => (
                                <button
                                    key={val}
                                    type="button"
                                    onClick={() => setPrice(val)}
                                    className="flex-1 py-1 text-xs font-medium bg-slate-100 hover:bg-slate-200 text-slate-800 rounded border border-slate-200 transition-colors text-center"
                                >
                                    €{val}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Extra Charges */}
                    <div className="pt-3 border-t border-slate-200">
                        <div className="flex items-center justify-between mb-2">
                            <FormLabel className="mb-0 text-xs font-semibold text-slate-800">Extra Charges</FormLabel>
                            <button 
                                type="button"
                                onClick={() => setExtraCharges([...extraCharges, { name: '', description: '', amount: '' }])}
                                className="text-xs font-semibold text-slate-900 hover:underline flex items-center gap-1"
                            >
                                <Plus size={12} /> Add Charge
                            </button>
                        </div>
                        
                        {extraCharges.length > 0 && (
                            <div className="space-y-2 mb-3">
                                {extraCharges.map((charge, idx) => (
                                    <div key={idx} className="flex items-center gap-2">
                                        <Input 
                                            placeholder="Charge Name (e.g. Tolls)" 
                                            className="text-xs h-7 bg-white flex-1"
                                            value={charge.name}
                                            onChange={(e) => {
                                                const newArr = [...extraCharges];
                                                newArr[idx].name = e.target.value;
                                                setExtraCharges(newArr);
                                            }}
                                        />
                                        <div className="relative w-20 shrink-0">
                                            <div className="absolute inset-y-0 left-0 pl-2 flex items-center pointer-events-none text-slate-400 text-xs">
                                                €
                                            </div>
                                            <Input 
                                                type="number" 
                                                placeholder="0.00" 
                                                className="pl-5 text-xs h-7 font-bold bg-white"
                                                value={charge.amount}
                                                onChange={(e) => {
                                                    const newArr = [...extraCharges];
                                                    newArr[idx].amount = e.target.value;
                                                    setExtraCharges(newArr);
                                                }}
                                            />
                                        </div>
                                        <button 
                                            type="button"
                                            onClick={() => setExtraCharges(extraCharges.filter((_, i) => i !== idx))}
                                            className="shrink-0 text-slate-400 hover:text-red-600 transition-colors"
                                        >
                                            <Trash2 size={13} />
                                        </button>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Price Summary */}
                    <div className="p-3 bg-slate-50 border border-slate-200 rounded space-y-2 text-xs text-slate-700">
                        <div className="flex justify-between items-center">
                            <span>Base Rate:</span>
                            <span className="font-semibold text-slate-900">€{parseFloat(price || '0').toFixed(2)}</span>
                        </div>
                        {extraCharges.map((ch, i) => ch.name && (
                            <div key={i} className="flex justify-between items-center">
                                <span>{ch.name}:</span>
                                <span className="font-semibold text-slate-900">€{parseFloat(ch.amount || '0').toFixed(2)}</span>
                            </div>
                        ))}
                        <div className="pt-2 border-t border-slate-200 flex justify-between items-center font-bold text-sm">
                            <span className="text-slate-900">Total Offer:</span>
                            <span className="text-slate-900 font-extrabold">€{calculateTotal()}</span>
                        </div>
                    </div>

                    {/* Validity & Terms */}
                    <div className="grid grid-cols-2 gap-2.5">
                        <div>
                            <FormLabel className="text-xs font-semibold text-slate-700">Quote Validity</FormLabel>
                            <Select value={validity} onChange={(e) => setValidity(e.target.value)} showSearch={false} className="text-xs h-8">
                                <option value="24h">24 Hours</option>
                                <option value="48h">48 Hours</option>
                                <option value="3d">3 Days</option>
                                <option value="7d">7 Days</option>
                            </Select>
                        </div>
                        <div>
                            <FormLabel className="text-xs font-semibold text-slate-700">Payment Terms</FormLabel>
                            <Select value={paymentTerm} onChange={(e) => setPaymentTerm(e.target.value)} showSearch={false} className="text-xs h-8">
                                <option value="immediate">Immediate</option>
                                <option value="net15">Net 15 Days</option>
                                <option value="net30">Net 30 Days</option>
                                <option value="advance">50% Advance</option>
                            </Select>
                        </div>
                    </div>
                    {/* Remarks */}
                    <div>
                        <FormLabel className="text-xs font-semibold text-slate-700">Remarks</FormLabel>
                        <Textarea 
                            placeholder="Add any special conditions or notes..."
                            className="h-16 text-xs resize-none"
                            value={notes}
                            onChange={(e) => setNotes(e.target.value)}
                        />
                        <div className="flex flex-wrap gap-1 mt-1.5">
                            <button type="button" onClick={() => addPresetNote('Includes loading & unloading')} className="text-[11px] bg-slate-100 hover:bg-slate-200 text-slate-700 px-2 py-0.5 rounded font-medium">
                                + Loading included
                            </button>
                            <button type="button" onClick={() => addPresetNote('Driver GPS live tracking provided')} className="text-[11px] bg-slate-100 hover:bg-slate-200 text-slate-700 px-2 py-0.5 rounded font-medium">
                                + GPS Tracking
                            </button>
                        </div>
                    </div>

                    {/* Submit Button */}
                    <div className="pt-2">
                        <Button 
                            variant="primary" 
                            className="w-full h-10 text-xs font-semibold bg-[#ff4a1f] hover:bg-[#e03e15] text-white shadow-2xs"
                            icon={<Send size={14} />}
                            onClick={() => setSubmitted(true)}
                            disabled={!price || parseFloat(price) <= 0}
                        >
                            Submit Offer (€{calculateTotal()})
                        </Button>
                    </div>
                </div>
            </div>

            {/* Decline Modal */}
            {showDeclineModal && (
                <div className="fixed inset-0 bg-slate-900/30 backdrop-blur-2xs flex items-center justify-center p-4 z-50">
                    <div className="bg-white rounded-lg max-w-md w-full p-6 border border-slate-200 shadow-md space-y-4">
                        <div className="flex items-center gap-2 text-red-600 font-bold">
                            <XCircle size={20} />
                            <h3 className="text-sm font-bold text-slate-900">Decline Quote Request</h3>
                        </div>
                        <p className="text-xs text-slate-600">
                            Are you sure you want to decline request <strong className="text-slate-800">{requestDetails.id}</strong>?
                        </p>
                        <div>
                            <FormLabel className="text-xs">Reason for Declining</FormLabel>
                            <Select value={declineReason} onChange={(e) => setDeclineReason(e.target.value)} showSearch={false} className="text-xs">
                                <option value="">Select reason...</option>
                                <option value="capacity">No vehicle capacity available</option>
                                <option value="route">Route outside our coverage area</option>
                                <option value="equipment">Specialized equipment unavailable</option>
                                <option value="budget">Target budget is too low</option>
                            </Select>
                        </div>
                        <div className="flex gap-2 justify-end pt-2">
                            <Button variant="outline" size="sm" onClick={() => setShowDeclineModal(false)}>
                                Cancel
                            </Button>
                            <Button variant="primary" size="sm" className="bg-red-600 hover:bg-red-700 text-white" onClick={() => { setShowDeclineModal(false); setDeclined(true); }}>
                                Confirm Decline
                            </Button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
