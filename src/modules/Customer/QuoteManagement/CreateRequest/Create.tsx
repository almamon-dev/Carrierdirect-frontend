import React, { useState, useEffect } from 'react';
import { 
    FileText, MapPin, Truck, Euro, Paperclip, CheckCircle2, 
    ChevronRight, Lock, RotateCcw, Sparkles 
} from 'lucide-react';
import { useNavigate, useLocation, useSearchParams } from 'react-router-dom';
import Button from '@/components/ui/button';
import Badge from '@/components/ui/badge';
import { SubscriptionLockModal } from '@/components/modals';
import { QuotaReminderBanner } from '@/components';

import apiClient from '@/lib/axios';
import { ENDPOINTS } from '@/config/api';
import { useToastStore } from '@/stores/useToastStore';

import { QuoteFormData } from './types/formTypes';
import { BasicInfoSection } from './components/sections/BasicInfoSection';
import { LocationsSection } from './components/sections/LocationsSection';
import { LoadServicesSection } from './components/sections/LoadServicesSection';
import { BudgetPreferencesSection } from './components/sections/BudgetPreferencesSection';
import { AttachmentsNotesSection } from './components/sections/AttachmentsNotesSection';
import { ReviewSubmitSection } from './components/sections/ReviewSubmitSection';

const CREATE_TABS = [
    { id: 'general', label: 'Basic Information', icon: FileText },
    { id: 'locations', label: 'Pickup & Delivery', icon: MapPin },
    { id: 'load', label: 'Load & Services', icon: Truck },
    { id: 'preferences', label: 'Budget & Preferences', icon: Euro },
    { id: 'files', label: 'Attachments & Notes', icon: Paperclip },
    { id: 'review', label: 'Review & Submit', icon: CheckCircle2 },
];

export default function CreateRequestForm() {
    const navigate = useNavigate();
    const location = useLocation();
    const [searchParams, setSearchParams] = useSearchParams();
    const repeatData = location.state?.repeatData || location.state?.initialData;
    
    const activeTab = searchParams.get('tab') || 'general';
    const setActiveTab = (tab: string) => {
        setSearchParams({ tab }, { replace: true });
    };
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isLockModalOpen, setIsLockModalOpen] = useState(false);
    const [isRepeatMode, setIsRepeatMode] = useState(false);
    const [repeatSource, setRepeatSource] = useState('');

    const [formData, setFormData] = useState<QuoteFormData>({
        requestTitle: '',
        priority: 'Normal',
        shipmentType: 'One Way',
        serviceType: 'Standard',
        pickupDate: '',
        pickupTime: '',
        deliveryDate: '',
        deliveryTime: '',
        expectedTransitTime: '',
        
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
        autoExpire: '24 Hours',

        customerNotes: '',
        specialInstructions: '',
        internalReference: '',
        
        images: [],
        packingList: null,
        invoice: null
    });

    useEffect(() => {
        if (repeatData) {
            setIsRepeatMode(true);
            const sourceId = repeatData.id || repeatData.requestId || 'Previous Order';
            setRepeatSource(sourceId);

            const pickupCityName = repeatData.pickup?.city || repeatData.pickupCity || (typeof repeatData.pickup === 'string' ? repeatData.pickup : '') || (repeatData.route ? repeatData.route.split('→')[0]?.trim() : '') || 'Dhaka';
            const deliveryCityName = repeatData.delivery?.city || repeatData.deliveryCity || (typeof repeatData.delivery === 'string' ? repeatData.delivery : '') || (repeatData.route ? repeatData.route.split('→')[1]?.trim() : '') || 'Chittagong';

            const rawBudget = repeatData.pricing?.total ? String(repeatData.pricing.total) : (repeatData.amount ? String(repeatData.amount).replace(/[^0-9.]/g, '') : (repeatData.lowestBid ? String(repeatData.lowestBid) : '45000'));

            setFormData(prev => ({
                ...prev,
                requestTitle: repeatData.requestTitle || (repeatData.route ? `Repeat Shipment: ${repeatData.route}` : `Repeat Order Request (${sourceId})`),
                priority: repeatData.priority || 'High',
                shipmentType: repeatData.shipmentType || 'One Way',
                serviceType: repeatData.serviceType || 'Express',
                
                pickupDate: repeatData.pickupDate || repeatData.logistics?.pickupDate || '2026-07-28',
                pickupTime: repeatData.pickupTime || '09:00',
                deliveryDate: repeatData.deliveryDate || repeatData.logistics?.deliveryDate || '2026-07-30',
                deliveryTime: repeatData.deliveryTime || '17:00',
                expectedTransitTime: repeatData.expectedTransitTime || repeatData.logistics?.transitTime || '2 Days',
                
                pickupCompany: repeatData.pickup?.company || repeatData.pickupCompany || 'Prime Logistics EPZ Depot',
                pickupContactName: repeatData.pickup?.contact || repeatData.pickupContactName || 'Kamal Hossain',
                pickupPhone: repeatData.pickupPhone || '+8801711234567',
                pickupEmail: repeatData.pickupEmail || 'dispatch@primelogistics.bd',
                pickupCountry: repeatData.pickupCountry || 'Bangladesh',
                pickupState: repeatData.pickupState || 'Dhaka Division',
                pickupCity: pickupCityName,

                deliveryCompany: repeatData.delivery?.company || repeatData.deliveryCompany || 'Chittagong Maritime Terminal Hub',
                deliveryContactName: repeatData.delivery?.contact || repeatData.deliveryContactName || 'Rahim Uddin',
                deliveryPhone: repeatData.deliveryPhone || '+8801819987654',
                deliveryEmail: repeatData.deliveryEmail || 'cargo@ctgport.com',
                deliveryCountry: repeatData.deliveryCountry || 'Bangladesh',
                deliveryState: repeatData.deliveryState || 'Chittagong Division',
                deliveryCity: deliveryCityName,

                vehicleType: repeatData.vehicle || repeatData.logistics?.vehicleType || 'Covered Van (20ft)',
                loadType: repeatData.load || 'Pallets',
                weight: repeatData.weight ? String(repeatData.weight).replace(/[^0-9.]/g, '') : '2500',
                volume: repeatData.volume ? String(repeatData.volume).replace(/[^0-9.]/g, '') : '15.5',

                budget: rawBudget,
                customerNotes: repeatData.notes || repeatData.customerNotes || `Repeat request based on previous ${sourceId}.`,
                internalReference: repeatData.internalReference || `REPEAT-${sourceId}`,
            }));
        }
    }, [repeatData]);

    const fillSampleData = () => {
        setFormData({
            requestTitle: '5 Pallets of Industrial Machinery from Gazipur to Ctg Port',
            priority: 'High',
            shipmentType: 'One Way',
            serviceType: 'Express',
            pickupDate: '2026-07-28',
            pickupTime: '09:00',
            deliveryDate: '2026-07-30',
            deliveryTime: '17:00',
            expectedTransitTime: '2',
            
            pickupCompany: 'Prime Industrial Ltd.',
            pickupContactName: 'Kamal Hossain',
            pickupPhone: '+8801711234567',
            pickupEmail: 'dispatch@primeind.bd',
            pickupCountry: 'Bangladesh',
            pickupState: 'Dhaka Division',
            pickupCity: 'Dhaka (Gazipur)',
            pickupZip: '1700',
            pickupAddress: 'Plot 42, Gazipur Industrial Area, Dhaka',
            pickupMapUrl: 'https://maps.google.com/?q=Gazipur+Industrial+Area',
            pickupInstructions: 'Call before arriving.\nDriver must carry valid national ID.\nUse gate 2 loading dock.',

            deliveryCompany: 'Chittagong Port Terminal',
            deliveryContactName: 'Rahim Uddin',
            deliveryPhone: '+8801819987654',
            deliveryEmail: 'cargo@ctgport.com',
            deliveryCountry: 'Bangladesh',
            deliveryState: 'Chittagong Division',
            deliveryCity: 'Chittagong Port',
            deliveryZip: '4000',
            deliveryAddress: 'Berth 5, Terminal 2, Chittagong Port Authority',
            deliveryMapUrl: 'https://maps.google.com/?q=Chittagong+Port',
            deliveryInstructions: 'Report to port security first.\nUnloading will be handled by terminal crane.',

            vehicleType: 'Covered Van (20ft)',
            loadType: 'Pallets',
            itemsCount: '25',
            palletsCount: '5',
            weight: '2500',
            volume: '15.5',
            dimensions: [
                { id: 1, length: '120', width: '100', height: '150', qty: '2', unit: 'CM' },
                { id: 2, length: '100', width: '80', height: '120', qty: '2', unit: 'CM' },
                { id: 3, length: '80', width: '60', height: '90', qty: '1', unit: 'CM' }
            ],

            stackable: true,
            fragile: false,
            hazardous: false,
            tempControlled: false,
            oversized: false,
            perishable: false,
            loadingRequired: true,
            unloadingRequired: true,
            packaging: true,
            insurance: true,
            liftGate: false,
            whiteGlove: false,
            assembly: false,
            insideDelivery: false,
            storage: false,

            budget: '48000',
            currency: '৳',
            allowNegotiation: true,
            receiveMultiple: true,
            autoExpire: '48 Hours',

            customerNotes: 'Heavy industrial machinery parts boxed on wooden pallets.',
            specialInstructions: 'Call driver 1 hour before pickup. Ensure vehicle floor is dry.',
            internalReference: 'REF-GAZ-CTG-2026',

            images: [],
            packingList: null,
            invoice: null
        });
        useToastStore.getState().showToast('All fields have been auto-filled with sample dummy data!', 'success');
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSelectChange = (name: keyof QuoteFormData, value: string) => {
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleCheckboxChange = (name: keyof QuoteFormData, checked: boolean) => {
        setFormData(prev => ({ ...prev, [name]: checked }));
    };

    const handleFileUpload = (field: 'packingList' | 'invoice' | 'images', file: any) => {
        if (field === 'images') {
            if (!file) return;
            const filesArray = Array.from(file as FileList);
            setFormData(prev => ({ ...prev, images: filesArray }));
        } else {
            setFormData(prev => ({ ...prev, [field]: file }));
        }
    };

    const addDimensionRow = () => {
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

    const showToast = useToastStore(state => state.showToast);
    const [quotaUsed, setQuotaUsed] = useState(0);

    useEffect(() => {
        async function fetchQuota() {
            try {
                const res = await apiClient.get(ENDPOINTS.CUSTOMER.QUOTE_REQUESTS);
                const rawItems = res.data?.data || res.data || res.items || res;
                if (Array.isArray(rawItems)) {
                    setQuotaUsed(rawItems.length);
                } else if (typeof res.data?.total === 'number') {
                    setQuotaUsed(res.data.total);
                }
            } catch {
                setQuotaUsed(0);
            }
        }
        fetchQuota();
    }, []);

    const handleSubmit = async (e?: React.FormEvent, targetStatus: 'active' | 'pending' = 'active') => {
        if (e) e.preventDefault();
        if (targetStatus === 'active' && quotaUsed >= 5) {
            setIsLockModalOpen(true);
        } else {
            setIsSubmitting(true);
            try {
                const pickupLoc = [formData.pickupAddress, formData.pickupCity, formData.pickupCountry].filter(Boolean).join(', ') || 'Dhaka';
                const deliveryLoc = [formData.deliveryAddress, formData.deliveryCity, formData.deliveryCountry].filter(Boolean).join(', ') || 'Chittagong';

                const payload = {
                    status: targetStatus,
                    request_title: formData.requestTitle || `Quote Request: ${pickupLoc} -> ${deliveryLoc}`,
                    priority: formData.priority || 'Normal',
                    shipment_type: formData.shipmentType || 'One Way',
                    service_type: formData.serviceType || 'Standard',
                    expected_transit_time: formData.expectedTransitTime || null,

                    pickup_address: pickupLoc,
                    pickup_company: formData.pickupCompany || null,
                    pickup_contact_name: formData.pickupContactName || null,
                    pickup_phone: formData.pickupPhone || null,
                    pickup_email: formData.pickupEmail || null,
                    pickup_country: formData.pickupCountry || 'Bangladesh',
                    pickup_state: formData.pickupState || null,
                    pickup_city: formData.pickupCity || null,
                    pickup_zip: formData.pickupZip || null,
                    pickup_map_url: formData.pickupMapUrl || null,
                    pickup_instructions: formData.pickupInstructions || null,

                    delivery_address: deliveryLoc,
                    delivery_company: formData.deliveryCompany || null,
                    delivery_contact_name: formData.deliveryContactName || null,
                    delivery_phone: formData.deliveryPhone || null,
                    delivery_email: formData.deliveryEmail || null,
                    delivery_country: formData.deliveryCountry || 'Bangladesh',
                    delivery_state: formData.deliveryState || null,
                    delivery_city: formData.deliveryCity || null,
                    delivery_zip: formData.deliveryZip || null,
                    delivery_map_url: formData.deliveryMapUrl || null,
                    delivery_instructions: formData.deliveryInstructions || null,

                    pickup_date: formData.pickupDate || new Date().toISOString().split('T')[0],
                    delivery_date: formData.deliveryDate || null,
                    pickup_time_from: formData.pickupTime || '09:00',
                    pickup_time_till: '17:00',
                    delivery_time_from: formData.deliveryTime || null,

                    vehicle_type: formData.vehicleType || 'Covered Van',
                    load_type: formData.loadType || 'Pallets',
                    items_count: parseInt(formData.itemsCount || '1', 10),
                    pallets_count: parseInt(formData.palletsCount || '1', 10),
                    weight: parseFloat(formData.weight || '0'),
                    volume: parseFloat(formData.volume || '0'),

                    stackable: formData.stackable,
                    fragile: formData.fragile,
                    hazardous: formData.hazardous,
                    temp_controlled: formData.tempControlled,
                    oversized: formData.oversized,
                    perishable: formData.perishable,

                    loading_required: formData.loadingRequired,
                    unloading_required: formData.unloadingRequired,
                    packaging: formData.packaging,
                    insurance: formData.insurance,
                    lift_gate: formData.liftGate,
                    white_glove: formData.whiteGlove,
                    assembly: formData.assembly,
                    inside_delivery: formData.insideDelivery,
                    storage: formData.storage,

                    budget: parseFloat(formData.budget || '0'),
                    currency: formData.currency || '€',
                    allow_negotiation: formData.allowNegotiation,
                    receive_multiple: formData.receiveMultiple,
                    auto_expire: formData.autoExpire || '48 Hours',

                    additional_notes: [formData.requestTitle, formData.customerNotes, formData.specialInstructions].filter(Boolean).join(' | '),
                    customer_notes: formData.customerNotes || null,
                    special_instructions: formData.specialInstructions || null,
                    internal_reference: formData.internalReference || null,

                    items: [
                        {
                            item_type: formData.loadType || 'Pallets',
                            quantity: parseInt(formData.palletsCount || formData.itemsCount || '1', 10),
                            weight: parseFloat(formData.weight || '0'),
                            length: parseFloat(formData.dimensions[0]?.length || '0'),
                            width: parseFloat(formData.dimensions[0]?.width || '0'),
                            height: parseFloat(formData.dimensions[0]?.height || '0'),
                        }
                    ]
                };

                const hasFiles = Boolean((formData.packingList instanceof File) || (formData.invoice instanceof File) || (formData.images && formData.images.some((img: any) => img instanceof File)));
                let submitData: any = payload;
                let headers = {};
                if (hasFiles) {
                    const fd = new FormData();
                    Object.entries(payload).forEach(([key, val]) => {
                        if (key === 'items' && Array.isArray(val)) {
                            val.forEach((item: any, idx: number) => {
                                Object.entries(item).forEach(([k, v]) => {
                                    if (v !== null && v !== undefined) fd.append(`items[${idx}][${k}]`, String(v));
                                });
                            });
                        } else if (val !== null && val !== undefined) {
                            fd.append(key, typeof val === 'boolean' ? (val ? '1' : '0') : String(val));
                        }
                    });
                    if (formData.packingList instanceof File) fd.append('packing_list', formData.packingList);
                    if (formData.invoice instanceof File) fd.append('invoice', formData.invoice);
                    if (formData.images && formData.images.length > 0) {
                        formData.images.forEach((file: any) => {
                            if (file instanceof File) fd.append('images[]', file);
                        });
                    }
                    submitData = fd;
                }

                await apiClient.post(ENDPOINTS.CUSTOMER.QUOTE_REQUESTS, submitData);
                const toastMsg = targetStatus === 'pending' ? 'Quote request saved as draft!' : 'Quote request posted successfully!';
                showToast(toastMsg, 'success');
                if (targetStatus === 'active') {
                    setQuotaUsed(prev => prev + 1);
                }
                navigate('/customer/quotes');
            } catch (err: any) {
                const msg = err.data?.message || err.message || 'Failed to post quote request. Please try again.';
                showToast(msg, 'error');
            } finally {
                setIsSubmitting(false);
            }
        }
    };

    const servicesCount = [
        formData.stackable, formData.fragile, formData.hazardous, formData.tempControlled, formData.oversized, formData.perishable,
        formData.loadingRequired, formData.unloadingRequired, formData.packaging, formData.insurance, 
        formData.liftGate, formData.whiteGlove, formData.assembly, formData.insideDelivery, formData.storage
    ].filter(Boolean).length;

    return (
        <div className="p-5 md:p-6 w-full max-w-full bg-[#f8f9fa] min-h-screen pb-20 font-sans antialiased">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
                <div>
                    <h1 className="text-xl font-bold text-slate-900 tracking-tight">
                        {isRepeatMode ? 'Repeat Quote Request' : 'Create Quote Request'}
                    </h1>
                    <p className="text-xs font-medium text-slate-500 mt-0.5">
                        {isRepeatMode 
                            ? `Pre-filled from previous quote/order (${repeatSource}). Review dates and details before posting.` 
                            : 'Fill in the required shipping details to post a request for carriers.'}
                    </p>
                </div>
                <div className="flex items-center gap-2">
                    <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        className="h-9 px-3 text-xs font-semibold border-amber-300 bg-amber-50 text-amber-900 hover:bg-amber-100 flex items-center gap-1.5 cursor-pointer"
                        onClick={fillSampleData}
                    >
                        <Sparkles size={14} className="text-amber-600" />
                        Auto Fill Sample Data
                    </Button>
                    <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        className="h-9 px-3 text-xs font-semibold border-slate-300 text-slate-700 bg-white hover:bg-slate-50 flex items-center gap-1.5 cursor-pointer"
                        onClick={() => handleSubmit(undefined, 'pending')}
                        disabled={isSubmitting}
                    >
                        Save Draft
                    </Button>
                    <Button variant="outline" size="sm" className="h-9 px-3 text-xs font-semibold cursor-pointer" onClick={() => navigate(-1)}>
                        Cancel
                    </Button>
                </div>
            </div>

            {/* Reusable Top Free Quote Quota Reminder Banner */}
            <QuotaReminderBanner quotaUsed={quotaUsed} className="mb-4" />

            {/* Repeat Mode Banner */}
            {isRepeatMode && (
                <div className="mb-4 p-3.5 bg-blue-50 border border-blue-200 rounded-lg flex items-center justify-between gap-3 text-blue-900 shadow-2xs">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-blue-100 rounded-md text-blue-600 flex-shrink-0">
                            <RotateCcw size={18} />
                        </div>
                        <div>
                            <h4 className="text-xs font-bold flex items-center gap-2">
                                Repeat Request Active ({repeatSource})
                            </h4>
                            <p className="text-[11px] text-blue-700 mt-0.5">
                                Form details (pickup & delivery addresses, load specs, vehicle) have been pre-filled from your selected history item.
                            </p>
                        </div>
                    </div>
                    <Badge variant="primary" className="bg-blue-600 text-white font-semibold text-xs px-2 py-0.5 shrink-0">
                        Pre-filled
                    </Badge>
                </div>
            )}

            {/* Layout */}
            <div className="flex flex-col md:flex-row gap-5 items-start">
                {/* Sidebar Navigation */}
                <div className="w-full md:w-[260px] flex-shrink-0 bg-white border border-slate-200 rounded-md overflow-hidden shadow-2xs">
                    <div className="px-4 py-3 border-b border-slate-200 bg-slate-50">
                        <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider">Categories</h3>
                    </div>
                    <div className="flex flex-col">
                        {CREATE_TABS.map((tab) => {
                            const Icon = tab.icon;
                            const isSelected = activeTab === tab.id;
                            return (
                                <button
                                    key={tab.id}
                                    onClick={() => setActiveTab(tab.id)}
                                    className={`w-full flex items-center justify-between px-4 py-3 text-xs font-semibold transition-colors border-l-[3px] border-b border-slate-100 last:border-b-0 cursor-pointer ${
                                        isSelected 
                                            ? 'border-l-[#ff4a1f] bg-orange-50/50 text-[#ff4a1f]' 
                                            : 'border-l-transparent text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                                    }`}
                                >
                                    <div className="flex items-center gap-2.5">
                                        <Icon size={15} className={isSelected ? 'text-[#ff4a1f]' : 'text-slate-400'} />
                                        {tab.label}
                                    </div>
                                    {isSelected && <ChevronRight size={15} className="text-[#ff4a1f]" />}
                                </button>
                            );
                        })}
                    </div>
                </div>

                {/* Main Content Area */}
                <div className="flex-1 bg-white border border-slate-200 rounded-md shadow-2xs w-full">
                    <div className="p-6 md:p-8">
                        {activeTab === 'general' && (
                            <BasicInfoSection 
                                formData={formData} 
                                handleChange={handleChange} 
                                handleSelectChange={handleSelectChange} 
                            />
                        )}

                        {activeTab === 'locations' && (
                            <LocationsSection 
                                formData={formData} 
                                handleChange={handleChange} 
                            />
                        )}

                        {activeTab === 'load' && (
                            <LoadServicesSection 
                                formData={formData} 
                                handleChange={handleChange} 
                                handleSelectChange={handleSelectChange}
                                handleCheckboxChange={handleCheckboxChange}
                                addDimensionRow={addDimensionRow}
                                updateDimension={updateDimension}
                                removeDimension={removeDimension}
                            />
                        )}

                        {activeTab === 'preferences' && (
                            <BudgetPreferencesSection 
                                formData={formData} 
                                handleChange={handleChange} 
                                handleSelectChange={handleSelectChange}
                                handleCheckboxChange={handleCheckboxChange}
                            />
                        )}

                        {activeTab === 'files' && (
                            <AttachmentsNotesSection 
                                formData={formData} 
                                handleChange={handleChange} 
                                handleFileUpload={handleFileUpload}
                            />
                        )}

                        {activeTab === 'review' && (
                            <ReviewSubmitSection 
                                formData={formData} 
                                servicesCount={servicesCount}
                                isSubmitting={isSubmitting}
                                onSubmit={handleSubmit}
                            />
                        )}
                    </div>
                </div>
            </div>

            {/* Quota Lock Modal */}
            <SubscriptionLockModal 
                isOpen={isLockModalOpen}
                onClose={() => setIsLockModalOpen(false)}
                title="Create Quote Request Quota Reached"
                description="You have reached your limit of 5 Quote Requests. Upgrade to Growth Plan for unlimited requests."
            />
        </div>
    );
}
