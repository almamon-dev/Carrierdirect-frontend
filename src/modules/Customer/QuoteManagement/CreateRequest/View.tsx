import React, { useState, useEffect } from 'react';
import {
    ArrowLeft, Save, Send, MapPin, Truck, Box, FileText, Paperclip,
    Euro, Settings, CheckCircle2, ChevronRight, Activity, AlertCircle, Plus, Trash2, Clock, Sparkles
} from 'lucide-react';
import { useNavigate, useParams, useSearchParams } from 'react-router-dom';
import Button from '@/components/ui/button';
import TabHeader from '@/components/ui/tab-header';
import Skeleton from '@/components/ui/skeleton';
import apiClient from '@/lib/axios';
import { ENDPOINTS } from '@/config/api';

const SectionHeader = ({ title, icon: Icon, className = "col-span-1 md:col-span-2" }: { title: string, icon?: any, className?: string }) => (
    <div className={`${className} mt-4 pt-3 border-t border-slate-100 first:mt-0 first:pt-0 first:border-t-0 mb-2`}>
        <h3 className="text-[13px] font-bold text-slate-800 flex items-center gap-2">
            {Icon && <Icon size={16} className="text-slate-400" />}
            {title}
        </h3>
    </div>
);

const CREATE_TABS = [
    { id: 'general', label: 'Basic Information', icon: FileText },
    { id: 'locations', label: 'Pickup & Delivery', icon: MapPin },
    { id: 'load', label: 'Load & Services', icon: Truck },
    { id: 'preferences', label: 'Budget & Preferences', icon: Euro },
    { id: 'files', label: 'Attachments & Notes', icon: Paperclip },
    { id: 'review', label: 'Review & Submit', icon: CheckCircle2 },
];

export default function ViewRequestForm() {
    const navigate = useNavigate();
    const { id } = useParams();
    const [searchParams, setSearchParams] = useSearchParams();
    const cleanId = id?.replace('REQ-', '') || id;
    const activeTab = searchParams.get('tab') || 'general';
    const setActiveTab = (tab: string) => {
        setSearchParams({ tab }, { replace: true });
    };
    const [isLoading, setIsLoading] = useState(true);

    const [formData, setFormData] = useState({
        requestTitle: '',
        priority: 'Normal',
        shipmentType: 'One Way',
        serviceType: 'Standard',
        pickupDate: '',
        pickupTime: '',
        deliveryDate: '',
        deliveryTime: '',
        expectedTransitTime: '',
        estDistance: '',

        pickupCompany: '',
        pickupContactName: '',
        pickupPhone: '',
        pickupEmail: '',
        pickupCountry: 'Bangladesh',
        pickupState: '',
        pickupCity: '',
        pickupZip: '',
        pickupAddress: '',
        pickupMapUrl: '',
        pickupInstructions: '',

        deliveryCompany: '',
        deliveryContactName: '',
        deliveryPhone: '',
        deliveryEmail: '',
        deliveryCountry: 'Bangladesh',
        deliveryState: '',
        deliveryCity: '',
        deliveryZip: '',
        deliveryAddress: '',
        deliveryMapUrl: '',
        deliveryInstructions: '',

        vehicleType: '',
        loadType: '',
        itemsCount: '',
        palletsCount: '',
        weight: '',
        volume: '',
        dimensions: [{ id: 1, length: '', width: '', height: '', qty: '1', unit: 'CM' }],

        stackable: false,
        fragile: false,
        hazardous: false,
        tempControlled: false,
        oversized: false,
        perishable: false,
        loadingRequired: false,
        unloadingRequired: false,
        packaging: false,
        insurance: false,
        liftGate: false,
        whiteGlove: false,
        assembly: false,
        insideDelivery: false,
        storage: false,

        budget: '',
        currency: '€',
        allowNegotiation: true,
        receiveMultiple: true,
        autoExpire: '48 Hours',

        customerNotes: '',
        specialInstructions: '',
        internalReference: '',

        images: [] as File[],
        packingList: null as File | null,
        invoice: null as File | null
    });

    useEffect(() => {
        async function fetchQuoteDetails() {
            if (!cleanId) return;
            try {
                let q: any = null;
                try {
                    const res = await apiClient.get(`${ENDPOINTS.CUSTOMER.QUOTE_REQUESTS}/${cleanId}`);
                    q = res.data?.data || res.data;
                } catch {
                    try {
                        const res = await apiClient.get(`${ENDPOINTS.CUSTOMER.QUOTE_REQUESTS}/${cleanId}/edit`);
                        q = res.data?.data || res.data;
                    } catch {
                        // Fallback check in localStorage cache
                        const cached = localStorage.getItem('customer_quote_requests_cache');
                        if (cached) {
                            const items = JSON.parse(cached);
                            q = items.find((i: any) => String(i.id) === String(cleanId) || String(i.id) === `REQ-${cleanId}`);
                        }
                    }
                }

                if (q) {
                    setFormData(prev => ({
                        ...prev,
                        requestTitle: q.request_title || q.requestTitle || q.title || `Quote Request REQ-${q.id || cleanId}`,
                        priority: q.priority || 'Normal',
                        shipmentType: q.shipment_type || q.shipmentType || q.type || 'One Way',
                        serviceType: q.service_type || q.serviceType || 'Standard',
                        pickupDate: q.pickup_date || q.pickupDate || q.date || '',
                        pickupTime: q.pickup_time_from || q.pickupTime || '',
                        deliveryDate: q.delivery_date || q.deliveryDate || '',
                        deliveryTime: q.delivery_time_from || q.deliveryTime || '',
                        expectedTransitTime: q.expected_transit_time || q.expectedTransitTime || '2 Days',
                        estDistance: q.est_distance || q.distance_miles || q.estDistance || '245',

                        pickupCompany: q.pickup_company || q.pickupCompany || 'Prime Industrial Ltd.',
                        pickupContactName: q.pickup_contact_name || q.pickupContactName || 'Kamal Hossain',
                        pickupPhone: q.pickup_phone || q.pickupPhone || '+8801711234567',
                        pickupEmail: q.pickup_email || q.pickupEmail || 'dispatch@primeind.bd',
                        pickupCountry: q.pickup_country || q.pickupCountry || 'Bangladesh',
                        pickupState: q.pickup_state || q.pickupState || 'Dhaka Division',
                        pickupCity: q.pickup_city || q.pickupCity || q.pickup || 'Dhaka (Gazipur)',
                        pickupZip: q.pickup_zip || q.pickupZip || '1700',
                        pickupAddress: q.pickup_address || q.pickupAddress || q.pickup || 'Plot 42, Gazipur Industrial Area, Dhaka',
                        pickupMapUrl: q.pickup_map_url || q.pickupMapUrl || 'https://maps.google.com',
                        pickupInstructions: q.pickup_instructions || q.pickupInstructions || 'Call before arriving.\nDriver must carry valid national ID.\nUse gate 2 loading dock.',

                        deliveryCompany: q.delivery_company || q.deliveryCompany || 'Chittagong Port Terminal',
                        deliveryContactName: q.delivery_contact_name || q.deliveryContactName || 'Rahim Uddin',
                        deliveryPhone: q.delivery_phone || q.deliveryPhone || '+8801819987654',
                        deliveryEmail: q.delivery_email || q.deliveryEmail || 'cargo@ctgport.com',
                        deliveryCountry: q.delivery_country || q.deliveryCountry || 'Bangladesh',
                        deliveryState: q.delivery_state || q.deliveryState || 'Chittagong Division',
                        deliveryCity: q.delivery_city || q.deliveryCity || q.delivery || 'Chittagong Port',
                        deliveryZip: q.delivery_zip || q.deliveryZip || '4000',
                        deliveryAddress: q.delivery_address || q.deliveryAddress || q.delivery || 'Berth 5, Terminal 2, Chittagong Port',
                        deliveryMapUrl: q.delivery_map_url || q.deliveryMapUrl || 'https://maps.google.com',
                        deliveryInstructions: q.delivery_instructions || q.deliveryInstructions || 'Report to port security first.\nUnloading via overhead crane.',

                        vehicleType: q.vehicle_type || q.vehicleType || q.vehicle || 'Covered Van (20ft)',
                        loadType: q.load_type || q.loadType || q.load || 'Pallets',
                        itemsCount: q.items_count || q.itemsCount ? String(q.items_count || q.itemsCount) : '25',
                        palletsCount: q.pallets_count || q.palletsCount ? String(q.pallets_count || q.palletsCount) : '5',
                        weight: q.weight ? String(q.weight) : '2500',
                        volume: q.volume ? String(q.volume) : '15.5',
                        dimensions: Array.isArray(q.items) && q.items.length > 0
                            ? q.items.map((it: any, idx: number) => ({
                                id: it.id || idx + 1,
                                length: it.length ? String(it.length) : '120',
                                width: it.width ? String(it.width) : '100',
                                height: it.height ? String(it.height) : '150',
                                qty: it.quantity ? String(it.quantity) : '1',
                                unit: 'CM'
                            }))
                            : [{ id: 1, length: '120', width: '100', height: '150', qty: '5', unit: 'CM' }],

                        stackable: Boolean(q.stackable ?? true),
                        fragile: Boolean(q.fragile ?? false),
                        hazardous: Boolean(q.hazardous ?? false),
                        tempControlled: Boolean(q.temp_controlled ?? q.tempControlled ?? false),
                        oversized: Boolean(q.oversized ?? false),
                        perishable: Boolean(q.perishable ?? false),
                        loadingRequired: Boolean(q.loading_required ?? q.loadingRequired ?? true),
                        unloadingRequired: Boolean(q.unloading_required ?? q.unloadingRequired ?? true),
                        packaging: Boolean(q.packaging ?? false),
                        insurance: Boolean(q.insurance ?? true),
                        liftGate: Boolean(q.lift_gate ?? q.liftGate ?? false),
                        whiteGlove: Boolean(q.white_glove ?? q.whiteGlove ?? false),
                        assembly: Boolean(q.assembly ?? false),
                        insideDelivery: Boolean(q.inside_delivery ?? q.insideDelivery ?? false),
                        storage: Boolean(q.storage ?? false),

                        budget: q.budget || q.lowestBid ? String(q.budget || q.lowestBid) : '48000',
                        currency: q.currency || '৳',
                        allowNegotiation: Boolean(q.allow_negotiation ?? q.allowNegotiation ?? true),
                        receiveMultiple: Boolean(q.receive_multiple ?? q.receiveMultiple ?? true),
                        autoExpire: q.auto_expire || q.autoExpire || '48 Hours',
                        customerNotes: q.customer_notes || q.customerNotes || q.additional_notes || 'Heavy industrial machinery parts boxed on wooden pallets.',
                        specialInstructions: q.special_instructions || q.specialInstructions || 'Call driver 1 hour before pickup.',
                        internalReference: q.internal_reference || q.internalReference || `REF-${cleanId}`,
                        images: Array.isArray(q.images_urls) && q.images_urls.length > 0
                            ? q.images_urls.map((u: string, idx: number) => ({ name: `Attachment_${idx + 1}`, url: u }))
                            : (Array.isArray(q.images) ? q.images : []),
                        packingList: q.packing_list_url || q.packing_list_path
                            ? { name: 'Packing_List.pdf', url: q.packing_list_url || q.packing_list_path }
                            : (q.packingList || q.packing_list || (q.attachment_url ? { name: 'Attachment_File.pdf', url: q.attachment_url } : null)),
                        invoice: q.invoice_url || q.invoice_path
                            ? { name: 'Commercial_Invoice.pdf', url: q.invoice_url || q.invoice_path }
                            : (q.invoice || null),
                    }));
                }
            } catch (err) {
                console.error('Failed to load quote details', err);
            } finally {
                setIsLoading(false);
            }
        }
        fetchQuoteDetails();
    }, [cleanId]);

    const handleChange = (e: any) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    const handleSelectChange = (name: string, value: string) => {
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, fieldName: string) => {
        if (e.target.files && e.target.files.length > 0) {
            if (fieldName === 'images') {
                setFormData(prev => ({
                    ...prev,
                    [fieldName]: Array.from(e.target.files as FileList)
                }));
            } else {
                setFormData(prev => ({
                    ...prev,
                    [fieldName]: (e.target.files as FileList)[0]
                }));
            }
        }
    };

    const removeFile = (fieldName: string, index?: number) => {
        if (fieldName === 'images' && typeof index === 'number') {
            setFormData(prev => ({
                ...prev,
                images: prev.images.filter((_, i) => i !== index)
            }));
        } else {
            setFormData(prev => ({
                ...prev,
                [fieldName]: null
            }));
        }
    };

    const addDimension = () => {
        setFormData(prev => ({
            ...prev,
            dimensions: [...prev.dimensions, { id: Date.now(), length: '', width: '', height: '', qty: '1', unit: 'CM' }]
        }));
    };

    const updateDimension = (id: number, field: string, value: string) => {
        setFormData(prev => ({
            ...prev,
            dimensions: prev.dimensions.map(d => d.id === id ? { ...d, [field]: value } : d)
        }));
    };

    const removeDimension = (id: number) => {
        setFormData(prev => ({
            ...prev,
            dimensions: prev.dimensions.filter(d => d.id !== id)
        }));
    };

    // Calculate selected services count for summary
    const servicesCount = [
        formData.stackable, formData.fragile, formData.hazardous, formData.tempControlled, formData.oversized, formData.perishable,
        formData.loadingRequired, formData.unloadingRequired, formData.packaging, formData.insurance,
        formData.liftGate, formData.whiteGlove, formData.assembly, formData.insideDelivery, formData.storage
    ].filter(Boolean).length;

    const ViewField = ({ label, value, children, isLink = false, linkHref = "", colSpan = false }: { label: string, value?: React.ReactNode, children?: React.ReactNode, isLink?: boolean, linkHref?: string, colSpan?: boolean }) => (
        <div className={`${colSpan ? 'col-span-1 md:col-span-2' : ''} grid grid-cols-[160px_10px_1fr] items-start`}>
            <p className="text-[14px] text-slate-500 font-medium">{label}</p>
            <p className="text-[14px] text-slate-400">:</p>
            <div className="w-full">
                {isLoading ? (
                    <Skeleton className="h-5 w-36 rounded my-0.5" />
                ) : children ? children : isLink ? (
                    <a href={linkHref} target={linkHref.startsWith('http') ? "_blank" : "_self"} className="text-[14px] font-semibold text-brand hover:underline break-all">
                        {value || '-'}
                    </a>
                ) : (
                    <div className="text-[14px] font-semibold text-slate-800 break-words">{value || <span className="text-[13px] text-slate-400 font-bold">-</span>}</div>
                )}
            </div>
        </div>
    );

    return (
        <div className="p-6 md:p-8 mx-auto bg-[#f8f9fa] min-h-screen pb-24">
            {/* Header */}
            <div className="flex items-center justify-between mb-8">
                <div className="flex items-center gap-3">
                    <div>
                        <h1 className="text-[18px] font-bold text-slate-900">View Quote Request</h1>
                        <p className="text-[14px] font-medium text-brand mt-1">Review the details of your quote request.</p>
                    </div>
                </div>
                <div className="flex items-center gap-3">
                    <Button variant="outline" size="sm" className="h-[32px] text-[14px]" onClick={() => navigate(-1)}>Cancel</Button>
                    <Button variant="outline" size="sm" className="h-[32px] text-[14px] flex items-center gap-2">
                        <Save size={14} /> Save Draft
                    </Button>
                </div>
            </div>

            {/* Layout */}
            <div className="flex flex-col md:flex-row gap-6 items-start">
                {/* Sidebar Navigation */}
                <div className="w-full md:w-[260px] flex-shrink-0 bg-white border border-slate-200 rounded-md overflow-hidden shadow-sm">
                    <div className="px-4 py-3 border-b border-slate-200 bg-slate-50">
                        <h3 className="text-[13px] font-bold text-slate-800">Categories</h3>
                    </div>
                    <div className="flex flex-col">
                        {CREATE_TABS.map((tab) => {
                            const Icon = tab.icon;
                            const isSelected = activeTab === tab.id;
                            return (
                                <button
                                    key={tab.id}
                                    onClick={() => setActiveTab(tab.id)}
                                    className={`w-full flex items-center justify-between px-4 py-2.5 text-[14px] font-medium transition-colors border-l-[3px] border-b border-slate-50 last:border-b-0 ${isSelected
                                        ? 'border-l-indigo-600 bg-brand-light/50 text-indigo-700'
                                        : 'border-l-transparent text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                                        }`}
                                >
                                    <div className="flex items-center gap-2.5">
                                        <Icon size={15} className={isSelected ? 'text-brand' : 'text-slate-400'} />
                                        {tab.label}
                                    </div>
                                    {isSelected && <ChevronRight size={15} className="text-brand" />}
                                </button>
                            );
                        })}
                    </div>
                </div>

                {/* Main Content Area */}
                <div className="flex-1 bg-white border border-slate-200 rounded-md shadow-sm w-full">
                    <div className="p-6 md:p-8">

                        {/* 1. Basic Information */}
                        {activeTab === 'general' && (
                            <div className="space-y-3 animate-in fade-in duration-300">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-2">
                                    <TabHeader title="Basic Information" icon={FileText} />

                                    <ViewField label="Request Title" colSpan value={formData.requestTitle} />

                                    <ViewField label="Request Number" value={<span className="font-mono text-brand font-bold bg-brand-light px-2 py-0.5 rounded">REQ-{cleanId || 'NEW'}</span>} />

                                    <ViewField label="Priority" value={<span className="px-2 py-0.5 rounded-full text-[11px] font-medium bg-amber-100 text-amber-700 border border-amber-200 w-fit">{formData.priority}</span>} />

                                    <ViewField label="Shipment Type" value={formData.shipmentType} />

                                    <ViewField label="Service Type" value={formData.serviceType} />

                                    <SectionHeader title="Schedule" icon={Activity} />

                                    <ViewField label="Pickup Date" value={formData.pickupDate} />

                                    <ViewField label="Pickup Time" value={formData.pickupTime} />

                                    <ViewField label="Delivery Date" value={formData.deliveryDate} />

                                    <ViewField label="Delivery Time" value={formData.deliveryTime} />

                                    <ViewField label="Transit Time (Days)" value={formData.expectedTransitTime} />
                                </div>
                            </div>
                        )}

                        {/* 2 & 3. Locations */}
                        {activeTab === 'locations' && (
                            <div className="space-y-3 animate-in fade-in duration-300">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-2">
                                    <TabHeader title="Location Information" icon={MapPin} />

                                    {/* Pickup Info */}
                                    <div className="col-span-1 md:col-span-2 border-b border-slate-100 pb-5 mb-2">
                                        <h3 className="text-[13px] font-bold text-slate-800 text-brand mb-4 flex items-center gap-2"><MapPin size={16} /> Pickup Details</h3>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-2">
                                            <ViewField label="Company Name" value={formData.pickupCompany} />
                                            <ViewField label="Contact Person" value={formData.pickupContactName} />
                                            <ViewField label="Phone Number" value={formData.pickupPhone} isLink linkHref={`tel:${formData.pickupPhone}`} />
                                            <ViewField label="Email" value={formData.pickupEmail} isLink linkHref={`mailto:${formData.pickupEmail}`} />
                                            <ViewField label="Country" value={formData.pickupCountry} />
                                            <ViewField label="State/Division" value={formData.pickupState} />
                                            <ViewField label="City" value={formData.pickupCity} />
                                            <ViewField label="ZIP Code" value={formData.pickupZip} />
                                            <ViewField label="Full Address" colSpan value={formData.pickupAddress} />
                                            <ViewField label="Google Map URL" colSpan value={formData.pickupMapUrl} isLink linkHref={formData.pickupMapUrl} />
                                            <ViewField label="Instructions" colSpan>
                                                {formData.pickupInstructions ? (
                                                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-x-6 gap-y-2 bg-slate-50 p-3.5 rounded border border-slate-100 mt-1">
                                                        {formData.pickupInstructions.split('\n').filter(Boolean).map((instruction, idx) => (
                                                            <div key={idx} className="flex items-start gap-2">
                                                                <div className="w-1.5 h-1.5 rounded-full bg-slate-700 mt-1.5 flex-shrink-0" />
                                                                <span className="text-[14px] font-semibold text-slate-800 leading-tight">{instruction}</span>
                                                            </div>
                                                        ))}
                                                    </div>
                                                ) : <span className="text-[13px] text-slate-400 font-bold">-</span>}
                                            </ViewField>
                                        </div>
                                    </div>

                                    {/* Delivery Info */}
                                    <div className="col-span-1 md:col-span-2">
                                        <h3 className="text-[13px] font-bold text-slate-800 text-emerald-600 mb-4 flex items-center gap-2"><MapPin size={16} /> Delivery Details</h3>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-2">
                                            <ViewField label="Company Name" value={formData.deliveryCompany} />
                                            <ViewField label="Contact Person" value={formData.deliveryContactName} />
                                            <ViewField label="Phone Number" value={formData.deliveryPhone} isLink linkHref={`tel:${formData.deliveryPhone}`} />
                                            <ViewField label="Email" value={formData.deliveryEmail} isLink linkHref={`mailto:${formData.deliveryEmail}`} />
                                            <ViewField label="Country" value={formData.deliveryCountry} />
                                            <ViewField label="State/Division" value={formData.deliveryState} />
                                            <ViewField label="City" value={formData.deliveryCity} />
                                            <ViewField label="ZIP Code" value={formData.deliveryZip} />
                                            <ViewField label="Full Address" colSpan value={formData.deliveryAddress} />
                                            <ViewField label="Google Map URL" colSpan value={formData.deliveryMapUrl} isLink linkHref={formData.deliveryMapUrl} />
                                            <ViewField label="Instructions" colSpan>
                                                {formData.deliveryInstructions ? (
                                                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-x-6 gap-y-2 bg-slate-50 p-3.5 rounded border border-slate-100 mt-1">
                                                        {formData.deliveryInstructions.split('\n').filter(Boolean).map((instruction, idx) => (
                                                            <div key={idx} className="flex items-start gap-2">
                                                                <div className="w-1.5 h-1.5 rounded-full bg-slate-700 mt-1.5 flex-shrink-0" />
                                                                <span className="text-[14px] font-semibold text-slate-800 leading-tight">{instruction}</span>
                                                            </div>
                                                        ))}
                                                    </div>
                                                ) : <span className="text-[13px] text-slate-400 font-bold">-</span>}
                                            </ViewField>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* 4 & 5. Load & Services */}
                        {activeTab === 'load' && (
                            <div className="space-y-6 animate-in fade-in duration-300">
                                <div className="grid grid-cols-1 lg:grid-cols-3 gap-x-6 gap-y-4">
                                    <TabHeader title="Load & Vehicle Information" icon={Truck} className="lg:col-span-3 mb-0" />

                                    <div className="flex flex-col gap-y-2">
                                        <ViewField label="Vehicle Type" value={formData.vehicleType} />
                                        <ViewField label="Number of Items" value={formData.itemsCount} />
                                        <ViewField label="Total Weight (KG)" value={formData.weight} />
                                    </div>

                                    <div className="flex flex-col gap-y-2">
                                        <ViewField label="Load Type" value={formData.loadType} />
                                        <ViewField label="Number of Pallets" value={formData.palletsCount} />
                                        <ViewField label="Total Volume (CBM)" value={formData.volume} />
                                    </div>

                                    <div className="flex flex-col gap-y-2 lg:pl-6 lg:border-l border-slate-100">
                                        <div className="grid grid-cols-[110px_10px_1fr] items-start">
                                            <p className="text-[14px] text-slate-500 font-medium">Dimensions</p>
                                            <p className="text-[14px] text-slate-400">:</p>
                                        </div>

                                        <div className="flex flex-col gap-2 w-full mt-1">
                                            {/* Header Row */}
                                            <div className="grid grid-cols-[1fr_12px_1fr_12px_1fr_40px_35px_20px] gap-1.5 items-center px-1">
                                                <span className="text-[10px] font-bold text-slate-500 uppercase text-center">L</span>
                                                <span></span>
                                                <span className="text-[10px] font-bold text-slate-500 uppercase text-center">W</span>
                                                <span></span>
                                                <span className="text-[10px] font-bold text-slate-500 uppercase text-center">H</span>
                                                <span className="text-[10px] font-bold text-slate-500 uppercase text-center">Qty</span>
                                                <span className="text-[10px] font-bold text-slate-500 uppercase text-center">Unit</span>
                                                <span></span>
                                            </div>

                                            {formData.dimensions.map((dim, index) => (
                                                <div key={dim.id} className="grid grid-cols-[1fr_12px_1fr_12px_1fr_40px_35px_20px] gap-1.5 items-center group">
                                                    <div className="text-[13px] font-bold text-slate-800 flex items-center justify-center bg-slate-50 py-1 rounded">{dim.length || '--'}</div>
                                                    <span className="font-bold text-slate-400 text-center text-[12px]">×</span>
                                                    <div className="text-[13px] font-bold text-slate-800 flex items-center justify-center bg-slate-50 py-1 rounded">{dim.width || '--'}</div>
                                                    <span className="font-bold text-slate-400 text-center text-[12px]">×</span>
                                                    <div className="text-[13px] font-bold text-slate-800 flex items-center justify-center bg-slate-50 py-1 rounded">{dim.height || '--'}</div>

                                                    <div className="text-[13px] font-bold text-slate-800 flex items-center justify-center bg-brand-light py-1 rounded">{dim.qty || '--'}</div>

                                                    <div className="text-[11px] font-bold text-slate-500 flex items-center justify-center">{dim.unit || '--'}</div>

                                                    <button
                                                        onClick={() => removeDimension(dim.id)}
                                                        className="text-slate-300 hover:text-red-500 transition-colors flex items-center justify-center opacity-0 group-hover:opacity-100"
                                                        title="Remove dimension"
                                                    >
                                                        <Trash2 size={14} />
                                                    </button>
                                                </div>
                                            ))}
                                            {formData.dimensions.length === 0 && (
                                                <div className="text-[13px] text-slate-400 font-bold">-</div>
                                            )}
                                        </div>
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-[1fr_1.5fr] gap-8 pt-6 border-t border-slate-200/80 mt-2">
                                    {/* Load Characteristics */}
                                    <div>
                                        <h3 className="text-[13px] font-bold text-slate-800 flex items-center gap-2 mb-2.5">
                                            <Box size={14} className="text-slate-400" />
                                            Load Characteristics
                                        </h3>
                                        <div className="grid grid-cols-2 gap-y-2.5 gap-x-4">
                                            {formData.stackable ? <span className="text-[13px] font-medium text-slate-800 flex items-center gap-2"><CheckCircle2 size={14} className="text-emerald-500" /> Stackable</span> : <span className="text-[13px] font-medium text-slate-400 flex items-center gap-2 line-through"><CheckCircle2 size={14} className="text-slate-300" /> Stackable</span>}
                                            {formData.fragile ? <span className="text-[13px] font-medium text-slate-800 flex items-center gap-2"><CheckCircle2 size={14} className="text-emerald-500" /> Fragile</span> : <span className="text-[13px] font-medium text-slate-400 flex items-center gap-2 line-through"><CheckCircle2 size={14} className="text-slate-300" /> Fragile</span>}
                                            {formData.hazardous ? <span className="text-[13px] font-medium text-slate-800 flex items-center gap-2"><CheckCircle2 size={14} className="text-emerald-500" /> Hazardous</span> : <span className="text-[13px] font-medium text-slate-400 flex items-center gap-2 line-through"><CheckCircle2 size={14} className="text-slate-300" /> Hazardous</span>}
                                            {formData.tempControlled ? <span className="text-[13px] font-medium text-slate-800 flex items-center gap-2"><CheckCircle2 size={14} className="text-emerald-500" /> Temp Control</span> : <span className="text-[13px] font-medium text-slate-400 flex items-center gap-2 line-through"><CheckCircle2 size={14} className="text-slate-300" /> Temp Control</span>}
                                            {formData.oversized ? <span className="text-[13px] font-medium text-slate-800 flex items-center gap-2"><CheckCircle2 size={14} className="text-emerald-500" /> Oversized</span> : <span className="text-[13px] font-medium text-slate-400 flex items-center gap-2 line-through"><CheckCircle2 size={14} className="text-slate-300" /> Oversized</span>}
                                            {formData.perishable ? <span className="text-[13px] font-medium text-slate-800 flex items-center gap-2"><CheckCircle2 size={14} className="text-emerald-500" /> Perishable</span> : <span className="text-[13px] font-medium text-slate-400 flex items-center gap-2 line-through"><CheckCircle2 size={14} className="text-slate-300" /> Perishable</span>}
                                        </div>
                                    </div>

                                    {/* Additional Services */}
                                    <div>
                                        <h3 className="text-[13px] font-bold text-slate-800 flex items-center gap-2 mb-2.5">
                                            <Settings size={14} className="text-slate-400" />
                                            Additional Services
                                        </h3>
                                        <div className="grid grid-cols-2 lg:grid-cols-3 gap-y-2.5 gap-x-4">
                                            {formData.loadingRequired ? <span className="text-[13px] font-medium text-slate-800 flex items-center gap-2"><CheckCircle2 size={14} className="text-emerald-500" /> Loading Req.</span> : <span className="text-[13px] font-medium text-slate-400 flex items-center gap-2 line-through"><CheckCircle2 size={14} className="text-slate-300" /> Loading Req.</span>}
                                            {formData.unloadingRequired ? <span className="text-[13px] font-medium text-slate-800 flex items-center gap-2"><CheckCircle2 size={14} className="text-emerald-500" /> Unloading Req.</span> : <span className="text-[13px] font-medium text-slate-400 flex items-center gap-2 line-through"><CheckCircle2 size={14} className="text-slate-300" /> Unloading Req.</span>}
                                            {formData.packaging ? <span className="text-[13px] font-medium text-slate-800 flex items-center gap-2"><CheckCircle2 size={14} className="text-emerald-500" /> Packaging</span> : <span className="text-[13px] font-medium text-slate-400 flex items-center gap-2 line-through"><CheckCircle2 size={14} className="text-slate-300" /> Packaging</span>}
                                            {formData.insurance ? <span className="text-[13px] font-medium text-slate-800 flex items-center gap-2"><CheckCircle2 size={14} className="text-emerald-500" /> Insurance</span> : <span className="text-[13px] font-medium text-slate-400 flex items-center gap-2 line-through"><CheckCircle2 size={14} className="text-slate-300" /> Insurance</span>}
                                            {formData.liftGate ? <span className="text-[13px] font-medium text-slate-800 flex items-center gap-2"><CheckCircle2 size={14} className="text-emerald-500" /> Lift Gate</span> : <span className="text-[13px] font-medium text-slate-400 flex items-center gap-2 line-through"><CheckCircle2 size={14} className="text-slate-300" /> Lift Gate</span>}
                                            {formData.whiteGlove ? <span className="text-[13px] font-medium text-slate-800 flex items-center gap-2"><CheckCircle2 size={14} className="text-emerald-500" /> White Glove</span> : <span className="text-[13px] font-medium text-slate-400 flex items-center gap-2 line-through"><CheckCircle2 size={14} className="text-slate-300" /> White Glove</span>}
                                            {formData.assembly ? <span className="text-[13px] font-medium text-slate-800 flex items-center gap-2"><CheckCircle2 size={14} className="text-emerald-500" /> Assembly</span> : <span className="text-[13px] font-medium text-slate-400 flex items-center gap-2 line-through"><CheckCircle2 size={14} className="text-slate-300" /> Assembly</span>}
                                            {formData.insideDelivery ? <span className="text-[13px] font-medium text-slate-800 flex items-center gap-2"><CheckCircle2 size={14} className="text-emerald-500" /> Inside Delivery</span> : <span className="text-[13px] font-medium text-slate-400 flex items-center gap-2 line-through"><CheckCircle2 size={14} className="text-slate-300" /> Inside Delivery</span>}
                                            {formData.storage ? <span className="text-[13px] font-medium text-slate-800 flex items-center gap-2"><CheckCircle2 size={14} className="text-emerald-500" /> Storage</span> : <span className="text-[13px] font-medium text-slate-400 flex items-center gap-2 line-through"><CheckCircle2 size={14} className="text-slate-300" /> Storage</span>}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* 6 & 9. Preferences */}
                        {activeTab === 'preferences' && (
                            <div className="space-y-3 animate-in fade-in duration-300">
                                <div className="grid grid-cols-1">
                                    <TabHeader title="Budget & Preferences" icon={Euro} className="mb-2" />

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5 pt-1">
                                        {/* Budget & Expiration */}
                                        <div className="bg-slate-50/70 border border-slate-200/80 rounded-md p-4">
                                            <h3 className="text-[13px] font-bold text-slate-800 flex items-center gap-2 mb-3 pb-2 border-b border-slate-200/60">
                                                <Euro size={14} className="text-emerald-600" />
                                                Budget Details
                                            </h3>
                                            <div className="grid grid-cols-2 gap-3">
                                                <div className="bg-white p-2.5 rounded-lg border border-slate-100 shadow-2xs">
                                                    <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block mb-1">Expected Budget</label>
                                                    <div className="flex items-baseline gap-1">
                                                        <span className="text-[18px] font-black text-emerald-600">{formData.budget ? Number(formData.budget).toLocaleString() : '--'}</span>
                                                        <span className="text-[12px] font-bold text-emerald-700">{formData.currency || '€'}</span>
                                                    </div>
                                                </div>
                                                <div className="bg-white p-2.5 rounded-lg border border-slate-100 shadow-2xs">
                                                    <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block mb-1">Auto Expire</label>
                                                    <div className="text-[14px] font-bold text-slate-800 flex items-center gap-1.5 pt-0.5">
                                                        <Clock size={13} className="text-amber-500" />
                                                        {formData.autoExpire || '--'}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Quote Preferences */}
                                        <div className="bg-slate-50/70 border border-slate-200/80 rounded-md p-4 flex flex-col justify-between">
                                            <div>
                                                <h3 className="text-[13px] font-bold text-slate-800 flex items-center gap-2 mb-3 pb-2 border-b border-slate-200/60">
                                                    <Settings size={14} className="text-indigo-600" />
                                                    Quote Rules
                                                </h3>
                                                <div className="flex flex-col gap-2.5">
                                                    <div className="flex items-center justify-between bg-white px-3 py-2 rounded-lg border border-slate-100 shadow-2xs">
                                                        <span className="text-[12.5px] font-semibold text-slate-800 flex items-center gap-2">
                                                            <CheckCircle2 size={15} className={formData.allowNegotiation ? "text-emerald-500" : "text-slate-300"} />
                                                            Allow Price Negotiation
                                                        </span>
                                                        <span className={`text-[10px] font-extrabold px-2 py-0.5 rounded uppercase ${formData.allowNegotiation ? "bg-emerald-50 text-emerald-700 border border-emerald-200/60" : "bg-slate-100 text-slate-400"}`}>
                                                            {formData.allowNegotiation ? 'Yes' : 'No'}
                                                        </span>
                                                    </div>
                                                    <div className="flex items-center justify-between bg-white px-3 py-2 rounded-lg border border-slate-100 shadow-2xs">
                                                        <span className="text-[12.5px] font-semibold text-slate-800 flex items-center gap-2">
                                                            <CheckCircle2 size={15} className={formData.receiveMultiple ? "text-emerald-500" : "text-slate-300"} />
                                                            Receive Multiple Quotes
                                                        </span>
                                                        <span className={`text-[10px] font-extrabold px-2 py-0.5 rounded uppercase ${formData.receiveMultiple ? "bg-blue-50 text-blue-700 border border-blue-200/60" : "bg-slate-100 text-slate-400"}`}>
                                                            {formData.receiveMultiple ? 'Yes' : 'No'}
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="mt-3 pt-2 flex gap-1.5 items-center text-[11px] text-slate-500">
                                                <AlertCircle size={13} className="text-indigo-500 shrink-0" />
                                                <span>Allows competitive bidding and price flexibility from suppliers.</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* 7 & 8. Attachments */}
                        {activeTab === 'files' && (
                            <div className="space-y-3 animate-in fade-in duration-300">
                                <div className="grid grid-cols-1 gap-y-2">
                                    <TabHeader title="Attachments & Notes" icon={Paperclip} />

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4">
                                        {/* Notes & Instructions */}
                                        <div>
                                            <h3 className="text-[13px] font-bold text-slate-800 flex items-center gap-2 mb-3">
                                                <FileText size={14} className="text-slate-400" />
                                                Notes & Instructions
                                            </h3>
                                            <div className="flex flex-col gap-y-4">
                                                <div>
                                                    <label className="text-[12px] font-bold text-slate-700 block mb-1.5">Customer Notes</label>
                                                    <div className="text-[14px] font-semibold text-slate-800 flex items-center py-1 bg-slate-50 p-3 rounded border border-slate-100">{formData.customerNotes || <span className="italic text-slate-400 font-normal">None</span>}</div>
                                                </div>
                                                <div>
                                                    <label className="text-[12px] font-bold text-slate-700 block mb-1.5">Special Instructions</label>
                                                    <div className="text-[14px] font-semibold text-slate-800 flex items-center py-1 bg-slate-50 p-3 rounded border border-slate-100">{formData.specialInstructions || <span className="italic text-slate-400 font-normal">None</span>}</div>
                                                </div>
                                                <div>
                                                    <label className="text-[12px] font-bold text-slate-700 block mb-1.5">Internal Reference</label>
                                                    <div className="text-[14px] font-mono font-medium text-slate-600 flex items-center py-1">{formData.internalReference || '--'}</div>
                                                </div>
                                            </div>
                                        </div>

                                        {/* File Uploads */}
                                        <div>
                                            <h3 className="text-[13px] font-bold text-slate-800 flex items-center gap-2 mb-3">
                                                <Paperclip size={14} className="text-slate-400" />
                                                File Uploads
                                            </h3>
                                            <div className="flex flex-col gap-y-4">
                                                <div>
                                                    <label className="text-[12px] font-bold text-slate-700 block mb-1.5">Images / Docs</label>
                                                    {formData.images.length > 0 ? (
                                                        <div className="mt-2 flex flex-col gap-1">
                                                            {formData.images.map((file: any, idx: number) => (
                                                                <a key={idx} href={file.url || (file instanceof File ? URL.createObjectURL(file) : typeof file === 'string' ? file : '#')} target="_blank" rel="noopener noreferrer" className="text-[12px] font-bold text-[#ff4a1f] hover:underline truncate w-full inline-flex items-center gap-1.5">
                                                                    📄 {file.name || `Attachment_${idx + 1}`}
                                                                </a>
                                                            ))}
                                                        </div>
                                                    ) : (
                                                        <span className="text-[13px] text-slate-400 italic">No images attached</span>
                                                    )}
                                                </div>
                                                <div>
                                                    <label className="text-[12px] font-bold text-slate-700 block mb-1.5">Packing List</label>
                                                    {formData.packingList ? (
                                                        <div className="mt-2">
                                                            <a href={(formData.packingList as any).url || (formData.packingList instanceof File ? URL.createObjectURL(formData.packingList) : typeof formData.packingList === 'string' ? formData.packingList : '#')} target="_blank" rel="noopener noreferrer" className="text-[12px] font-bold text-[#ff4a1f] hover:underline truncate w-full inline-flex items-center gap-1.5">
                                                                📄 {(formData.packingList as any).name || 'Packing_List.pdf'}
                                                            </a>
                                                        </div>
                                                    ) : (
                                                        <span className="text-[13px] text-slate-400 italic">No packing list attached</span>
                                                    )}
                                                </div>
                                                <div>
                                                    <label className="text-[12px] font-bold text-slate-700 block mb-1.5">Invoice (Optional)</label>
                                                    {formData.invoice ? (
                                                        <div className="mt-2">
                                                            <a href={(formData.invoice as any).url || (formData.invoice instanceof File ? URL.createObjectURL(formData.invoice) : typeof formData.invoice === 'string' ? formData.invoice : '#')} target="_blank" rel="noopener noreferrer" className="text-[12px] font-bold text-[#ff4a1f] hover:underline truncate w-full inline-flex items-center gap-1.5">
                                                                📄 {(formData.invoice as any).name || 'Commercial_Invoice.pdf'}
                                                            </a>
                                                        </div>
                                                    ) : (
                                                        <span className="text-[13px] text-slate-400 italic">No invoice attached</span>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* 10. Review */}
                        {activeTab === 'review' && (
                            <div className="space-y-4 animate-in fade-in duration-300">
                                <TabHeader title="Review & Submit" icon={CheckCircle2} />

                                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-3">
                                    {/* Left: Detailed Summary (Compact) */}
                                    <div className="lg:col-span-2 space-y-4">
                                        <div className="bg-slate-50 border border-slate-200 rounded-md p-5">
                                            <div className="flex items-center justify-between mb-5 pb-3 border-b border-slate-200">
                                                <h3 className="text-[13px] font-bold text-slate-800 flex items-center gap-2">
                                                    <FileText size={16} className="text-brand" /> Request Summary
                                                </h3>
                                                <span className="text-[12px] font-bold text-slate-500 bg-white px-2 py-1 rounded border border-slate-200">
                                                    {formData.requestTitle || `REQ-${cleanId || 'NEW'}`}
                                                </span>
                                            </div>

                                            <div className="grid grid-cols-2 md:grid-cols-3 gap-x-6 gap-y-5">
                                                <div>
                                                    <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Shipment Type</p>
                                                    <p className="text-[13px] font-bold text-slate-900 mt-1">{formData.shipmentType || '--'}</p>
                                                </div>
                                                <div>
                                                    <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Service Type</p>
                                                    <p className="text-[13px] font-bold text-slate-900 mt-1">{formData.serviceType || '--'}</p>
                                                </div>
                                                <div>
                                                    <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Priority</p>
                                                    <p className="text-[13px] font-bold text-amber-600 mt-1">{formData.priority || '--'}</p>
                                                </div>

                                                <div className="col-span-2 md:col-span-3 border-t border-slate-200 my-1 pt-4 grid grid-cols-1 md:grid-cols-2 gap-6">
                                                    <div className="bg-white p-3 rounded border border-slate-100 shadow-sm">
                                                        <p className="text-[11px] font-bold text-brand uppercase tracking-wider flex items-center gap-1.5"><MapPin size={12} /> Pickup Details</p>
                                                        <p className="text-[13px] font-bold text-slate-900 mt-2">{formData.pickupCity || '--'}</p>
                                                        <p className="text-[12px] text-slate-500 mt-0.5">Date: {formData.pickupDate || '--'}</p>
                                                    </div>
                                                    <div className="bg-white p-3 rounded border border-slate-100 shadow-sm">
                                                        <p className="text-[11px] font-bold text-emerald-600 uppercase tracking-wider flex items-center gap-1.5"><MapPin size={12} /> Delivery Details</p>
                                                        <p className="text-[13px] font-bold text-slate-900 mt-2">{formData.deliveryCity || '--'}</p>
                                                        <p className="text-[12px] text-slate-500 mt-0.5">Date: {formData.deliveryDate || '--'}</p>
                                                    </div>
                                                </div>

                                                <div className="col-span-2 md:col-span-3 border-t border-slate-200 my-1 pt-4">
                                                    <p className="text-[11px] font-bold text-brand uppercase tracking-wider flex items-center gap-1.5 mb-3"><Truck size={12} /> Load Information</p>
                                                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 bg-white p-3 rounded border border-slate-100 shadow-sm">
                                                        <div><p className="text-[11px] font-bold text-slate-400 uppercase">Vehicle</p><p className="text-[13px] font-bold text-slate-800 mt-1">{formData.vehicleType || '--'}</p></div>
                                                        <div><p className="text-[11px] font-bold text-slate-400 uppercase">Load Type</p><p className="text-[13px] font-bold text-slate-800 mt-1">{formData.loadType || '--'}</p></div>
                                                        <div><p className="text-[11px] font-bold text-slate-400 uppercase">Weight</p><p className="text-[13px] font-bold text-slate-800 mt-1">{formData.weight ? `${formData.weight} KG` : '--'}</p></div>
                                                        <div><p className="text-[11px] font-bold text-slate-400 uppercase">Services</p><p className="text-[13px] font-bold text-slate-800 mt-1">{servicesCount} Selected</p></div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Right: Submit Action Card */}
                                    <div className="lg:col-span-1">
                                        <div className="bg-white border border-slate-200 rounded-md shadow-sm overflow-hidden sticky top-6">
                                            <div className="bg-slate-800 p-4 border-b border-slate-700">
                                                <h3 className="text-[13px] font-bold text-slate-800 text-white text-center">Ready to Submit</h3>
                                            </div>

                                            <div className="p-5 space-y-4">
                                                <div className="flex justify-between items-center pb-3 border-b border-slate-100">
                                                    <span className="text-[13px] text-slate-500 font-medium">Est. Distance</span>
                                                    <span className="text-[13px] font-bold text-slate-900">{formData.estDistance ? `${formData.estDistance} km` : '-- km'}</span>
                                                </div>
                                                <div className="flex justify-between items-center pb-4 border-b border-slate-100">
                                                    <span className="text-[13px] text-slate-500 font-medium">Expected Budget</span>
                                                    <span className="text-[15px] font-bold text-emerald-600">{formData.budget ? `${formData.currency} ${formData.budget}` : '--'}</span>
                                                </div>

                                                <div className="pt-2 flex flex-col gap-3">
                                                    <Button variant="primary" className="w-full h-[36px] text-[14px]">
                                                        <Send size={16} className="mr-2" /> Submit Request
                                                    </Button>
                                                    <Button variant="outline" className="w-full h-[36px] text-[14px]">
                                                        <Save size={16} className="mr-2" /> Save as Draft
                                                    </Button>
                                                </div>

                                                <div className="mt-4 bg-amber-50 border border-amber-100 rounded p-3 flex gap-2">
                                                    <AlertCircle size={16} className="text-amber-600 shrink-0 mt-0.5" />
                                                    <p className="text-[11px] text-amber-700 font-medium leading-tight">
                                                        Please ensure all required fields are filled out. You can edit this request later before a quote is accepted.
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                    </div>
                </div>
            </div>
        </div>
    );
}
