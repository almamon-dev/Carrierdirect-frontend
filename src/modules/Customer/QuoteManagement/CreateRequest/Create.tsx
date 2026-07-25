import React, { useState, useEffect } from 'react';
import { 
    FileText, MapPin, Truck, Euro, Paperclip, CheckCircle2, 
    ChevronRight, Sparkles, Lock, RotateCcw 
} from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import Button from '@/components/ui/button';
import Badge from '@/components/ui/badge';
import { SubscriptionLockModal } from '@/components/modals';
import { QuotaReminderBanner } from '@/components';

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
    const repeatData = location.state?.repeatData || location.state?.initialData;
    
    const [activeTab, setActiveTab] = useState('general');
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

    const handleFileUpload = (field: 'packingList' | 'invoice', file: File | null) => {
        setFormData(prev => ({ ...prev, [field]: file }));
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

    const fillSampleData = () => {
        setFormData({
            requestTitle: '5 Pallets Heavy Machinery Parts - Dhaka EPZ to Chittagong Port',
            priority: 'High',
            shipmentType: 'One Way',
            serviceType: 'Express',
            pickupDate: '2026-07-28',
            pickupTime: '09:00',
            deliveryDate: '2026-07-29',
            deliveryTime: '17:00',
            expectedTransitTime: '1',
            
            pickupCompany: 'Prime Logistics EPZ Depot',
            pickupContactName: 'Kamal Hossain',
            pickupPhone: '+8801711234567',
            pickupEmail: 'dispatch@primelogistics.bd',
            pickupCountry: 'Bangladesh',
            pickupState: 'Dhaka Division',
            pickupCity: 'Dhaka (Gazipur EPZ)',
            pickupZip: '1700',
            pickupAddress: 'Plot 42, Sector 4, Gazipur Industrial Area, Dhaka',
            pickupMapUrl: 'https://maps.google.com/?q=Gazipur+EPZ',
            pickupInstructions: 'Report to Gate 3 loading dock.',

            deliveryCompany: 'Chittagong Maritime Terminal Hub',
            deliveryContactName: 'Rahim Uddin',
            deliveryPhone: '+8801819987654',
            deliveryEmail: 'cargo@ctgport.com',
            deliveryCountry: 'Bangladesh',
            deliveryState: 'Chittagong Division',
            deliveryCity: 'Chittagong (Port Area)',
            deliveryZip: '4000',
            deliveryAddress: 'Terminal 2, Berth 5, Chittagong Port Authority Zone',
            deliveryMapUrl: 'https://maps.google.com/?q=Chittagong+Port',
            deliveryInstructions: 'Delivery permitted between 08:00 AM and 06:00 PM.',

            vehicleType: 'Semi Trailer',
            loadType: 'Pallets',
            itemsCount: '25',
            palletsCount: '5',
            weight: '4500',
            volume: '18',
            dimensions: [{ id: 1, length: '120', width: '100', height: '150', qty: '5', unit: 'CM' }],

            stackable: true,
            fragile: false,
            hazardous: false,
            tempControlled: false,
            oversized: true,
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

            budget: '1450',
            currency: '€',
            allowNegotiation: true,
            receiveMultiple: true,
            autoExpire: '48 Hours',

            customerNotes: 'Heavy industrial parts boxed on heat-treated wooden pallets.',
            specialInstructions: 'Driver must wear safety boots and reflective vest.',
            internalReference: 'PO-2026-99218',
            
            images: [],
            packingList: null,
            invoice: null
        });
    };

    const [quotaUsed, setQuotaUsed] = useState(2); // Example: 2 of 5 used

    const handleSubmit = (e?: React.FormEvent) => {
        if (e) e.preventDefault();
        if (quotaUsed >= 5) {
            setIsLockModalOpen(true);
        } else {
            setIsSubmitting(true);
            setTimeout(() => {
                setIsSubmitting(false);
                setQuotaUsed(prev => prev + 1);
                navigate('/customer/quotes/quotes-received');
            }, 1000);
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
                        variant="primary" 
                        size="sm" 
                        className="h-9 px-3.5 text-xs font-bold bg-[#ff4a1f] hover:bg-[#e03e15] text-white shadow-sm flex items-center gap-1.5 cursor-pointer"
                        onClick={fillSampleData}
                    >
                        <Sparkles size={14} />
                        <span>Auto-Fill Demo Data</span>
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
