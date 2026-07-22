import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Send, CheckCircle2, Euro, Clock, Plus, Trash2, MapPin, Truck, Box, Settings, Circle } from 'lucide-react';
import Button from '@/components/ui/button';
import Input from '@/components/ui/input';
import Textarea from '@/components/ui/textarea';
import Badge from '@/components/ui/badge';
import FormLabel from '@/components/ui/label';

export default function SubmitQuote() {
    const navigate = useNavigate();
    const [price, setPrice] = useState('');
    const [extraCharges, setExtraCharges] = useState<{name: string, description: string, amount: string}[]>([]);
    const [notes, setNotes] = useState('');
    const [submitted, setSubmitted] = useState(false);
    const [showAllPickup, setShowAllPickup] = useState(false);
    const [showAllDelivery, setShowAllDelivery] = useState(false);

    const calculateTotal = () => {
        const base = parseFloat(price) || 0;
        const extras = extraCharges.reduce((acc, curr) => acc + (parseFloat(curr.amount) || 0), 0);
        return (base + extras).toFixed(2);
    };

    // Mock data for the request being viewed
    const requestDetails = {
        id: 'QR-000125',
        requestDate: '20 Jul 2026',
        customer: 'ABC Company',
        pickup: 'Dhaka',
        delivery: 'Chittagong',
        distance: '265 KM',
        vehicleType: 'Truck / Van',
        loadType: 'Pallet / Box / Container',
        weight: '2,500 KG',
        pickupDate: '22 Jul 2026',
        deliveryDate: '23 Jul 2026',
        budget: '€450',
        status: 'New',
        timeRemaining: '02:15:30',
        itemsCount: '50',
        palletsCount: '5',
        volume: '15.5',
        dimensions: [
            { id: 1, length: '120', width: '100', height: '150', qty: '5', unit: 'CM' },
            { id: 2, length: '80', width: '60', height: '80', qty: '12', unit: 'CM' },
            { id: 3, length: '200', width: '150', height: '200', qty: '2', unit: 'CM' }
        ],
        stackable: true,
        fragile: true,
        hazardous: false,
        tempControlled: false,
        oversized: false,
        perishable: false,
        loadingRequired: true,
        unloadingRequired: true,
        packaging: false,
        insurance: true,
        liftGate: false,
        whiteGlove: false,
        assembly: false,
        insideDelivery: false,
        storage: false,
        pickupInstructions: 'Deliver to warehouse 3.\nUnloading will be handled by our forklift operators.\nRequire recipient signature upon delivery.',
        deliveryInstructions: 'Check in at the security gate first.\nDo not park in the visitor parking area.',
    };

    const ViewField = ({ label, value }: { label: string, value: React.ReactNode }) => (
        <div className="grid grid-cols-[110px_10px_1fr] items-start mb-0">
            <p className="text-[13px] text-slate-500 font-medium">{label}</p>
            <p className="text-[13px] text-slate-400">:</p>
            <div className="text-[13px] font-bold text-slate-900">{value}</div>
        </div>
    );

    if (submitted) {
        return (
            <div className="p-4 md:p-6 w-full min-h-[80vh] flex items-center justify-center">
                <div className="bg-white border border-slate-200 shadow-sm rounded-none p-8 max-w-md w-full text-center">
                    <div className="w-16 h-16 bg-emerald-50 rounded-full flex items-center justify-center mx-auto mb-4">
                        <CheckCircle2 size={32} className="text-emerald-600" />
                    </div>
                    <h2 className="text-[15px] font-bold text-slate-800 mb-2">Quote Submitted!</h2>
                    <p className="text-[13px] text-slate-500 mb-6">
                        Your quote for <span className="font-semibold text-slate-700">{requestDetails.id}</span> has been successfully sent to the customer. You will be notified if they accept or initiate negotiation.
                    </p>
                    <div className="flex flex-col gap-3">
                        <Button variant="primary" className="w-full" onClick={() => navigate('/supplier/quotes/requests')}>
                            Back to Requests
                        </Button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="p-4 md:p-6 w-full min-h-screen">
            {/* Page Title Area */}
            <div className="mb-6 flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <div>
                        <h1 className="text-[18px] font-bold text-slate-900 mb-1">Submit Quote</h1>
                        <p className="text-sm text-slate-500 font-medium">Review the request details carefully before submitting your offer.</p>
                    </div>
                </div>
            </div>

            {/* Split Layout: Two Separate Cards */}
            <div className="flex flex-col xl:flex-row gap-6 items-start">
                
                {/* LEFT CARD: Request Details */}
                <div className="flex-1 w-full bg-white border border-slate-200 shadow-sm rounded-md overflow-hidden">
                    {/* Details Header */}
                    <div className="flex flex-col md:flex-row justify-between items-center p-3 md:p-4 bg-slate-50/80 gap-3 border-b border-slate-200">
                        <div className="font-bold text-slate-800 text-base tracking-tight">Request ID : <span className="text-slate-600 font-bold">{requestDetails.id}</span></div>
                        <div className="flex items-center gap-2">
                            <Badge className="bg-brand-light text-brand border-blue-200 hover:bg-brand-light font-medium px-2.5 py-1">New Request</Badge>
                            <div className="flex items-center gap-1.5 text-xs font-medium text-amber-700 bg-amber-50 border border-amber-200 px-2.5 py-1 rounded-full">
                                <Clock size={12} /> {requestDetails.timeRemaining} Left
                            </div>
                        </div>
                    </div>

                    <div className="p-3 md:p-4 grid grid-cols-1 lg:grid-cols-3 gap-3">
                        {/* Customer Info */}
                        <div>
                            <h3 className="text-[13px] font-bold text-slate-800 uppercase tracking-wider mb-1.5 pb-1 border-b border-slate-200">Customer Info</h3>
                            <div className="grid grid-cols-[100px_8px_1fr] gap-y-1 text-[12px] items-center">
                                <span className="text-slate-500 font-medium">Customer</span>
                                <span className="text-slate-400">:</span>
                                <span className="text-slate-800 font-semibold">{requestDetails.customer}</span>

                                <span className="text-slate-500 font-medium">Request Date</span>
                                <span className="text-slate-400">:</span>
                                <span className="text-slate-800 font-semibold">{requestDetails.requestDate}</span>
                                
                                <span className="text-slate-500 font-medium">Initial Budget</span>
                                <span className="text-slate-400">:</span>
                                <span className="text-emerald-600 font-bold">{requestDetails.budget}</span>
                            </div>
                        </div>

                        {/* Routing Info */}
                        <div>
                            <h3 className="text-[13px] font-bold text-slate-800 uppercase tracking-wider mb-1.5 pb-1 border-b border-slate-200">Routing Info</h3>
                            <div className="grid grid-cols-[100px_8px_1fr] gap-y-1 text-[12px] items-center">
                                <span className="text-slate-500 font-medium">Pickup</span>
                                <span className="text-slate-400">:</span>
                                <span className="text-slate-800 font-semibold">{requestDetails.pickup}</span>

                                <span className="text-slate-500 font-medium">Delivery</span>
                                <span className="text-slate-400">:</span>
                                <span className="text-slate-800 font-semibold">{requestDetails.delivery}</span>

                                <span className="text-slate-500 font-medium">Distance</span>
                                <span className="text-slate-400">:</span>
                                <span className="text-slate-800 font-semibold">{requestDetails.distance}</span>
                            </div>
                        </div>

                        {/* Schedule Info */}
                        <div>
                            <h3 className="text-[13px] font-bold text-slate-800 uppercase tracking-wider mb-1.5 pb-1 border-b border-slate-200">Schedule Info</h3>
                            <div className="grid grid-cols-[100px_8px_1fr] gap-y-1 text-[12px] items-center">
                                <span className="text-slate-500 font-medium">Pickup Date</span>
                                <span className="text-slate-400">:</span>
                                <span className="text-slate-800 font-semibold">{requestDetails.pickupDate}</span>

                                <span className="text-slate-500 font-medium">Delivery Date</span>
                                <span className="text-slate-400">:</span>
                                <span className="text-slate-800 font-semibold">{requestDetails.deliveryDate}</span>
                            </div>
                        </div>
                    </div>

                    {/* Detailed Instructions Area */}
                    <div className="p-3 md:p-4 border-t border-slate-200 bg-white">
                        <h3 className="text-[13px] font-bold text-slate-800 flex items-center gap-1.5 mb-2.5">
                            <Truck size={14} className="text-slate-500" />
                            Load & Vehicle Information
                        </h3>
                        
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-x-5 gap-y-2">
                            <div className="flex flex-col">
                                <ViewField label="Vehicle Type" value={requestDetails.vehicleType} />
                                <ViewField label="Number of Items" value={requestDetails.itemsCount} />
                                <ViewField label="Total Weight (KG)" value={requestDetails.weight} />
                            </div>

                            <div className="flex flex-col">
                                <ViewField label="Load Type" value={requestDetails.loadType} />
                                <ViewField label="Number of Pallets" value={requestDetails.palletsCount} />
                                <ViewField label="Total Volume (CBM)" value={requestDetails.volume} />
                            </div>

                            <div className="flex flex-col lg:pl-6 lg:border-l border-slate-100">
                                <div className="grid grid-cols-[90px_10px_1fr] items-start">
                                    <p className="text-[13px] text-slate-500 font-medium">Dimensions</p>
                                    <p className="text-[13px] text-slate-400">:</p>
                                    <div className="w-full">
                                        <div className="grid grid-cols-[1fr_12px_1fr_12px_1fr_40px_35px] gap-1.5 items-center px-1 mb-1">
                                            <span className="text-[10px] font-bold text-slate-400 uppercase text-center">L</span><span></span>
                                            <span className="text-[10px] font-bold text-slate-400 uppercase text-center">W</span><span></span>
                                            <span className="text-[10px] font-bold text-slate-400 uppercase text-center">H</span>
                                            <span className="text-[10px] font-bold text-slate-400 uppercase text-center">Qty</span>
                                            <span className="text-[10px] font-bold text-slate-400 uppercase text-center">Unit</span>
                                        </div>
                                        {requestDetails.dimensions.map((dim) => (
                                            <div key={dim.id} className="grid grid-cols-[1fr_12px_1fr_12px_1fr_40px_35px] gap-1.5 items-center mb-1.5">
                                                <div className="text-[12px] font-bold text-slate-800 flex items-center justify-center bg-slate-50/80 py-1 rounded border border-slate-100">{dim.length}</div>
                                                <span className="font-bold text-slate-300 text-center text-[12px]">×</span>
                                                <div className="text-[12px] font-bold text-slate-800 flex items-center justify-center bg-slate-50/80 py-1 rounded border border-slate-100">{dim.width}</div>
                                                <span className="font-bold text-slate-300 text-center text-[12px]">×</span>
                                                <div className="text-[12px] font-bold text-slate-800 flex items-center justify-center bg-slate-50/80 py-1 rounded border border-slate-100">{dim.height}</div>
                                                <div className="text-[12px] font-bold text-slate-800 flex items-center justify-center bg-brand-light py-1 rounded">{dim.qty}</div>
                                                <div className="text-[11px] font-bold text-slate-500 flex items-center justify-center">{dim.unit}</div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-[1fr_1.5fr] gap-4 mt-2.5 pt-2.5 border-t border-slate-100">
                            {/* Load Characteristics */}
                            <div>
                                <h3 className="text-[13px] font-bold text-slate-800 flex items-center gap-1.5 mb-1.5">
                                    <Box size={14} className="text-slate-400" /> Characteristics
                                </h3>
                                <div className="grid grid-cols-2 gap-y-1 gap-x-3">
                                    {requestDetails.stackable ? <span className="text-[12px] font-bold text-slate-700 flex items-center gap-2"><CheckCircle2 size={14} className="text-emerald-500" /> Stackable</span> : <span className="text-[12px] font-medium text-slate-400 flex items-center gap-2"><Circle size={14} className="text-slate-200" /> <span className="line-through">Stackable</span></span>}
                                    {requestDetails.fragile ? <span className="text-[12px] font-bold text-slate-700 flex items-center gap-2"><CheckCircle2 size={14} className="text-emerald-500" /> Fragile</span> : <span className="text-[12px] font-medium text-slate-400 flex items-center gap-2"><Circle size={14} className="text-slate-200" /> <span className="line-through">Fragile</span></span>}
                                    {requestDetails.hazardous ? <span className="text-[12px] font-bold text-slate-700 flex items-center gap-2"><CheckCircle2 size={14} className="text-emerald-500" /> Hazardous</span> : <span className="text-[12px] font-medium text-slate-400 flex items-center gap-2"><Circle size={14} className="text-slate-200" /> <span className="line-through">Hazardous</span></span>}
                                    {requestDetails.tempControlled ? <span className="text-[12px] font-bold text-slate-700 flex items-center gap-2"><CheckCircle2 size={14} className="text-emerald-500" /> Temp Control</span> : <span className="text-[12px] font-medium text-slate-400 flex items-center gap-2"><Circle size={14} className="text-slate-200" /> <span className="line-through">Temp Control</span></span>}
                                    {requestDetails.oversized ? <span className="text-[12px] font-bold text-slate-700 flex items-center gap-2"><CheckCircle2 size={14} className="text-emerald-500" /> Oversized</span> : <span className="text-[12px] font-medium text-slate-400 flex items-center gap-2"><Circle size={14} className="text-slate-200" /> <span className="line-through">Oversized</span></span>}
                                    {requestDetails.perishable ? <span className="text-[12px] font-bold text-slate-700 flex items-center gap-2"><CheckCircle2 size={14} className="text-emerald-500" /> Perishable</span> : <span className="text-[12px] font-medium text-slate-400 flex items-center gap-2"><Circle size={14} className="text-slate-200" /> <span className="line-through">Perishable</span></span>}
                                </div>
                            </div>
                            
                            {/* Additional Services */}
                            <div>
                                <h3 className="text-[13px] font-bold text-slate-800 flex items-center gap-1.5 mb-1.5">
                                    <Settings size={14} className="text-slate-400" /> Services
                                </h3>
                                <div className="grid grid-cols-2 lg:grid-cols-3 gap-y-1 gap-x-3">
                                    {requestDetails.loadingRequired ? <span className="text-[12px] font-bold text-slate-700 flex items-center gap-2"><CheckCircle2 size={14} className="text-emerald-500" /> Loading Req.</span> : <span className="text-[12px] font-medium text-slate-400 flex items-center gap-2"><Circle size={14} className="text-slate-200" /> <span className="line-through">Loading Req.</span></span>}
                                    {requestDetails.unloadingRequired ? <span className="text-[12px] font-bold text-slate-700 flex items-center gap-2"><CheckCircle2 size={14} className="text-emerald-500" /> Unloading Req.</span> : <span className="text-[12px] font-medium text-slate-400 flex items-center gap-2"><Circle size={14} className="text-slate-200" /> <span className="line-through">Unloading Req.</span></span>}
                                    {requestDetails.packaging ? <span className="text-[12px] font-bold text-slate-700 flex items-center gap-2"><CheckCircle2 size={14} className="text-emerald-500" /> Packaging</span> : <span className="text-[12px] font-medium text-slate-400 flex items-center gap-2"><Circle size={14} className="text-slate-200" /> <span className="line-through">Packaging</span></span>}
                                    {requestDetails.insurance ? <span className="text-[12px] font-bold text-slate-700 flex items-center gap-2"><CheckCircle2 size={14} className="text-emerald-500" /> Insurance</span> : <span className="text-[12px] font-medium text-slate-400 flex items-center gap-2"><Circle size={14} className="text-slate-200" /> <span className="line-through">Insurance</span></span>}
                                    {requestDetails.liftGate ? <span className="text-[12px] font-bold text-slate-700 flex items-center gap-2"><CheckCircle2 size={14} className="text-emerald-500" /> Lift Gate</span> : <span className="text-[12px] font-medium text-slate-400 flex items-center gap-2"><Circle size={14} className="text-slate-200" /> <span className="line-through">Lift Gate</span></span>}
                                    {requestDetails.whiteGlove ? <span className="text-[12px] font-bold text-slate-700 flex items-center gap-2"><CheckCircle2 size={14} className="text-emerald-500" /> White Glove</span> : <span className="text-[12px] font-medium text-slate-400 flex items-center gap-2"><Circle size={14} className="text-slate-200" /> <span className="line-through">White Glove</span></span>}
                                    {requestDetails.assembly ? <span className="text-[12px] font-bold text-slate-700 flex items-center gap-2"><CheckCircle2 size={14} className="text-emerald-500" /> Assembly</span> : <span className="text-[12px] font-medium text-slate-400 flex items-center gap-2"><Circle size={14} className="text-slate-200" /> <span className="line-through">Assembly</span></span>}
                                    {requestDetails.insideDelivery ? <span className="text-[12px] font-bold text-slate-700 flex items-center gap-2"><CheckCircle2 size={14} className="text-emerald-500" /> Inside Delivery</span> : <span className="text-[12px] font-medium text-slate-400 flex items-center gap-2"><Circle size={14} className="text-slate-200" /> <span className="line-through">Inside Delivery</span></span>}
                                    {requestDetails.storage ? <span className="text-[12px] font-bold text-slate-700 flex items-center gap-2"><CheckCircle2 size={14} className="text-emerald-500" /> Storage</span> : <span className="text-[12px] font-medium text-slate-400 flex items-center gap-2"><Circle size={14} className="text-slate-200" /> <span className="line-through">Storage</span></span>}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Instructions List */}
                    <div className="p-3 md:p-4 border-t border-slate-200 bg-white rounded-b-md">
                        <div className="grid grid-cols-[100px_8px_1fr] items-start">
                            <h3 className="text-[13px] font-bold text-slate-800 pt-1">Instructions</h3>
                            <span className="text-[12px] text-slate-400 pt-1">:</span>
                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                                {/* Pickup Instructions */}
                                <div>
                                    <h4 className="text-[11px] font-bold text-brand uppercase tracking-wider mb-1.5 flex items-center gap-1"><MapPin size={12}/> Pickup</h4>
                                    <div>
                                        <div className="flex flex-col gap-y-1">
                                            {(showAllPickup ? requestDetails.pickupInstructions.split('\n').filter(Boolean) : requestDetails.pickupInstructions.split('\n').filter(Boolean).slice(0, 2)).map((instruction, idx) => (
                                                <div key={`p-${idx}`} className="flex items-start gap-1.5">
                                                    <div className="w-1 h-1 rounded-full bg-brand mt-1.5 flex-shrink-0" />
                                                    <span className="text-[12px] font-semibold text-slate-800 leading-tight">{instruction}</span>
                                                </div>
                                            ))}
                                            {requestDetails.pickupInstructions.split('\n').filter(Boolean).length > 2 && (
                                                <button onClick={() => setShowAllPickup(!showAllPickup)} className="text-[12px] font-bold text-brand hover:underline text-left mt-1 w-fit">
                                                    {showAllPickup ? 'See Less' : `+${requestDetails.pickupInstructions.split('\n').filter(Boolean).length - 2} see more`}
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                </div>
                                {/* Delivery Instructions */}
                                <div>
                                    <h4 className="text-[11px] font-bold text-emerald-600 uppercase tracking-wider mb-1.5 flex items-center gap-1"><MapPin size={12}/> Delivery</h4>
                                    <div>
                                        <div className="flex flex-col gap-y-1">
                                            {(showAllDelivery ? requestDetails.deliveryInstructions.split('\n').filter(Boolean) : requestDetails.deliveryInstructions.split('\n').filter(Boolean).slice(0, 2)).map((instruction, idx) => (
                                                <div key={`d-${idx}`} className="flex items-start gap-1.5">
                                                    <div className="w-1 h-1 rounded-full bg-emerald-500 mt-1.5 flex-shrink-0" />
                                                    <span className="text-[12px] font-semibold text-slate-800 leading-tight">{instruction}</span>
                                                </div>
                                            ))}
                                            {requestDetails.deliveryInstructions.split('\n').filter(Boolean).length > 2 && (
                                                <button onClick={() => setShowAllDelivery(!showAllDelivery)} className="text-[12px] font-bold text-brand hover:underline text-left mt-1 w-fit">
                                                    {showAllDelivery ? 'See Less' : `+${requestDetails.deliveryInstructions.split('\n').filter(Boolean).length - 2} see more`}
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* RIGHT CARD: Your Quotation Form */}
                <div className="w-full xl:w-[400px] bg-white border border-slate-200 shadow-sm rounded-md flex flex-col sticky top-6">
                    <div className="px-5 py-4 border-b border-slate-200 bg-slate-50/50">
                        <h3 className="text-[13px] font-bold text-slate-800">Your Quotation</h3>
                    </div>
                    
                    <div className="p-4 space-y-4 flex-1">
                        <div>
                            <FormLabel required>
                                Offer Price
                            </FormLabel>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <Euro size={16} className="text-slate-400" />
                                </div>
                                <Input 
                                    type="number" 
                                    placeholder="0.00" 
                                    className="pl-8 font-bold"
                                    value={price}
                                    onChange={(e) => setPrice(e.target.value)}
                                />
                            </div>
                        </div>

                        {/* Extra Charges Section */}
                        <div className="pt-2 border-t border-slate-100">
                            <div className="flex items-center justify-between mb-3">
                                <FormLabel className="mb-0">Extra Charges</FormLabel>
                                <button 
                                    onClick={() => setExtraCharges([...extraCharges, {name: '', description: '', amount: ''}])}
                                    className="text-[11px] font-bold text-brand hover:text-indigo-800 flex items-center gap-1 bg-brand-light px-2 py-1 rounded"
                                >
                                    <Plus size={12} /> Add Charge
                                </button>
                            </div>
                            
                            {extraCharges.length > 0 && (
                                <div className="space-y-3 mb-4">
                                    {extraCharges.map((charge, idx) => (
                                        <div key={idx} className="relative group pb-3 border-b border-slate-100 last:border-0 last:pb-0">
                                            <button 
                                                onClick={() => setExtraCharges(extraCharges.filter((_, i) => i !== idx))}
                                                className="absolute top-1.5 right-0 text-slate-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity z-10"
                                            >
                                                <Trash2 size={14} />
                                            </button>
                                            <div className="space-y-1.5 pr-6">
                                                <div className="grid grid-cols-[1fr_90px] gap-1.5">
                                                    <Input 
                                                        placeholder="Name (e.g. Labor)" 
                                                        className="text-xs h-8"
                                                        value={charge.name}
                                                        onChange={(e) => {
                                                            const newArr = [...extraCharges];
                                                            newArr[idx].name = e.target.value;
                                                            setExtraCharges(newArr);
                                                        }}
                                                    />
                                                    <div className="relative">
                                                        <div className="absolute inset-y-0 left-0 pl-2 flex items-center pointer-events-none">
                                                            <Euro size={12} className="text-slate-400" />
                                                        </div>
                                                        <Input 
                                                            type="number" 
                                                            placeholder="0.00" 
                                                            className="pl-6 text-xs h-8 font-bold"
                                                            value={charge.amount}
                                                            onChange={(e) => {
                                                                const newArr = [...extraCharges];
                                                                newArr[idx].amount = e.target.value;
                                                                setExtraCharges(newArr);
                                                            }}
                                                        />
                                                    </div>
                                                </div>
                                                <Input 
                                                    placeholder="Description (Optional)" 
                                                    className="text-xs h-8"
                                                    value={charge.description}
                                                    onChange={(e) => {
                                                        const newArr = [...extraCharges];
                                                        newArr[idx].description = e.target.value;
                                                        setExtraCharges(newArr);
                                                    }}
                                                />
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Price Breakdown */}
                        <div className="pt-3 border-t border-slate-100 mt-1">
                            <h4 className="text-[11px] font-bold text-slate-800 uppercase tracking-wider mb-2">Price Breakdown</h4>
                            <div className="space-y-1.5 text-[13px]">
                                <div className="flex justify-between items-center text-slate-600">
                                    <span>Base Price</span>
                                    <span className="font-semibold text-slate-800">€${parseFloat(price || '0').toFixed(2)}</span>
                                </div>
                                {extraCharges.map((charge, idx) => {
                                    if (!charge.name && !charge.amount) return null;
                                    return (
                                        <div key={idx} className="flex justify-between items-center text-slate-600">
                                            <span>{charge.name || 'Extra Charge'}</span>
                                            <span className="font-semibold text-slate-800">€${parseFloat(charge.amount || '0').toFixed(2)}</span>
                                        </div>
                                    );
                                })}
                                <div className="pt-2.5 mt-2.5 border-t border-slate-200 flex justify-between items-center">
                                    <span className="font-bold text-slate-900">Total Offer</span>
                                    <span className="text-lg font-bold text-brand">€${calculateTotal()}</span>
                                </div>
                            </div>
                        </div>

                        <div>
                            <FormLabel>
                                Remarks / Notes (Optional)
                            </FormLabel>
                            <Textarea 
                                placeholder="Add any conditions, extra charge notes, or vehicle details here..."
                                className="h-16 text-[13px] resize-none"
                                value={notes}
                                onChange={(e) => setNotes(e.target.value)}
                            />
                        </div>
                    </div>

                    <div className="px-5 py-5 border-t border-slate-200 bg-slate-50/50">
                        <Button 
                            variant="primary" 
                            className="w-full h-11 text-[14px] bg-slate-800 hover:bg-slate-900 text-white shadow-sm rounded-md"
                            icon={<Send size={16} />}
                            onClick={() => setSubmitted(true)}
                            disabled={!price}
                        >
                            Submit Quote
                        </Button>
                        <p className="text-center text-[11px] text-slate-500 font-medium mt-3">
                            By submitting, you agree to fulfill the trip if accepted by the customer.
                        </p>
                    </div>
                </div>
                
            </div>
        </div>
    );
}
