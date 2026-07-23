import React, { useState } from 'react';
import { 
    ArrowLeft, Save, Send, MapPin, Truck, Box, FileText, Paperclip, 
    Euro, Settings, CheckCircle2, ChevronRight, Activity, AlertCircle, Plus, Trash2, Sparkles, ArrowRight, Lock
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Button from '@/components/ui/button';
import Input from '@/components/ui/input';
import Select from '@/components/ui/select';
import Textarea from '@/components/ui/textarea';
import Checkbox from '@/components/ui/checkbox';
import FormLabel from '@/components/ui/label';
import TabHeader from '@/components/ui/tab-header';
import Badge from '@/components/ui/badge';
import { SubscriptionLockModal } from '@/components/modals';

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

export default function CreateRequestForm() {
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState('general');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [showSuccessModal, setShowSuccessModal] = useState(false);
    const [isLockModalOpen, setIsLockModalOpen] = useState(false);

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
        
        images: [] as File[],
        packingList: null as File | null,
        invoice: null as File | null
    });

    // Auto Fill Demo Sample Data for instant testing
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
            pickupInstructions: 'Report to Gate 3 loading dock. Contact supervisor Kamal upon arrival.',

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
            deliveryInstructions: 'Delivery permitted between 08:00 AM and 06:00 PM. Gate pass attached.',

            vehicleType: 'Semi Trailer',
            loadType: 'Pallets',
            itemsCount: '25',
            palletsCount: '5',
            weight: '4500',
            volume: '18',
            dimensions: [
                { id: 1, length: '120', width: '100', height: '150', qty: '5', unit: 'CM' }
            ],

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
            specialInstructions: 'Driver must wear safety boots and reflective vest at port entrance.',
            internalReference: 'PO-2026-99218',
            
            images: [],
            packingList: null,
            invoice: null
        });
    };

    const handleSubmit = (e?: React.FormEvent) => {
        if (e) e.preventDefault();

        // Subscription Check Before Submission
        const isQuotaExceeded = true; // Triggers subscription check modal for demonstration
        if (isQuotaExceeded) {
            setIsLockModalOpen(true);
            return;
        }

        setIsSubmitting(true);
        setTimeout(() => {
            setIsSubmitting(false);
            setShowSuccessModal(true);
        }, 800);
    };

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

    const FormRow = ({ label, required, children, colSpan = false }: { label: string, required?: boolean, children: React.ReactNode, colSpan?: boolean }) => (
        <div className={`${colSpan ? 'col-span-1 md:col-span-2' : ''} grid grid-cols-[160px_10px_1fr] items-start gap-3`}>
            <FormLabel required={required} className="!mb-0 mt-2">{label}</FormLabel>
            <p className="text-[14px] text-slate-400 mt-2">:</p>
            <div>{children}</div>
        </div>
    );

    return (
        <div className="p-6 md:p-8 mx-auto bg-[#f8f9fa] min-h-screen pb-24 font-sans antialiased">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
                <div>
                    <h1 className="text-xl font-bold text-slate-900 tracking-tight">Create Quote Request</h1>
                    <p className="text-xs font-medium text-slate-500 mt-0.5">Fill in the required shipping details to post a request for carriers.</p>
                </div>
                <div className="flex items-center gap-2">
                    <Button 
                        variant="outline"
                        size="sm"
                        className="h-9 px-3 text-xs font-semibold border-amber-300 bg-amber-50 text-amber-800 hover:bg-amber-100 flex items-center gap-1.5 cursor-pointer shadow-2xs"
                        onClick={() => setIsLockModalOpen(true)}
                    >
                        <Lock size={13} className="text-amber-600" />
                        <span>Quota Limit: 5 / 5 RFQs</span>
                    </Button>
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

            {/* Layout */}
            <div className="flex flex-col md:flex-row gap-6 items-start">
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
                        
                        {/* 1. Basic Information */}
                        {activeTab === 'general' && (
                            <div className="space-y-3 animate-in fade-in duration-300">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4">
                                    <TabHeader title="Basic Information" icon={FileText} />
                                    
                                    <FormRow label="Request Title" required colSpan>
                                        <Input name="requestTitle" value={formData.requestTitle} onChange={handleChange} placeholder="e.g. 5 Pallets Heavy Machinery Parts - Dhaka to Chittagong" />
                                    </FormRow>
                                    
                                    <FormRow label="Request Number">
                                        <Input value="REQ-9824" disabled className="bg-slate-50 text-slate-500 font-semibold" />
                                    </FormRow>
                                    
                                    <FormRow label="Priority">
                                        <Select name="priority" value={formData.priority} onChange={(e) => handleSelectChange('priority', e.target.value)} showSearch={false}>
                                            <option value="Normal">Normal</option>
                                            <option value="High">High</option>
                                            <option value="Urgent">Urgent</option>
                                        </Select>
                                    </FormRow>
                                    
                                    <FormRow label="Shipment Type" required>
                                        <Select name="shipmentType" value={formData.shipmentType} onChange={(e) => handleSelectChange('shipmentType', e.target.value)} showSearch={false}>
                                            <option value="One Way">One Way</option>
                                            <option value="Round Trip">Round Trip</option>
                                        </Select>
                                    </FormRow>
                                    
                                    <FormRow label="Service Type">
                                        <Select name="serviceType" value={formData.serviceType} onChange={(e) => handleSelectChange('serviceType', e.target.value)} showSearch={false}>
                                            <option value="Standard">Standard</option>
                                            <option value="Express">Express</option>
                                            <option value="Same Day">Same Day</option>
                                        </Select>
                                    </FormRow>
                                    
                                    <SectionHeader title="Schedule" icon={Activity} />
                                    
                                    <FormRow label="Pickup Date" required>
                                        <Input type="date" name="pickupDate" value={formData.pickupDate} onChange={handleChange} />
                                    </FormRow>
                                    
                                    <FormRow label="Pickup Time" required>
                                        <Input type="time" name="pickupTime" value={formData.pickupTime} onChange={handleChange} />
                                    </FormRow>
                                    
                                    <FormRow label="Delivery Date">
                                        <Input type="date" name="deliveryDate" value={formData.deliveryDate} onChange={handleChange} />
                                    </FormRow>
                                    
                                    <FormRow label="Delivery Time">
                                        <Input type="time" name="deliveryTime" value={formData.deliveryTime} onChange={handleChange} />
                                    </FormRow>

                                    <FormRow label="Transit Time (Days)">
                                        <Input type="text" inputMode="numeric" name="expectedTransitTime" value={formData.expectedTransitTime} onChange={handleChange} placeholder="e.g. 1" />
                                    </FormRow>
                                </div>
                            </div>
                        )}

                        {/* 2 & 3. Locations */}
                        {activeTab === 'locations' && (
                            <div className="space-y-3 animate-in fade-in duration-300">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4">
                                    <TabHeader title="Location Information" icon={MapPin} />
                                    
                                    {/* Pickup Info */}
                                    <div className="col-span-1 md:col-span-2 border-b border-slate-100 pb-6 mb-2">
                                        <h3 className="text-xs font-bold text-[#ff4a1f] uppercase tracking-wider mb-4 flex items-center gap-2">
                                            <MapPin size={16}/> Pickup Details
                                        </h3>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4">
                                            <FormRow label="Company Name"><Input name="pickupCompany" value={formData.pickupCompany} onChange={handleChange} placeholder="Pickup Company Name" /></FormRow>
                                            <FormRow label="Contact Person" required><Input name="pickupContactName" value={formData.pickupContactName} onChange={handleChange} placeholder="Contact Person Name" /></FormRow>
                                            <FormRow label="Phone Number" required><Input type="text" name="pickupPhone" value={formData.pickupPhone} onChange={handleChange} placeholder="+880 1711-234567" /></FormRow>
                                            <FormRow label="Email"><Input name="pickupEmail" value={formData.pickupEmail} onChange={handleChange} type="email" placeholder="Email Address" /></FormRow>
                                            <FormRow label="Country"><Input name="pickupCountry" value={formData.pickupCountry} onChange={handleChange} /></FormRow>
                                            <FormRow label="State/Division"><Input name="pickupState" value={formData.pickupState} onChange={handleChange} placeholder="State / Division" /></FormRow>
                                            <FormRow label="City"><Input name="pickupCity" value={formData.pickupCity} onChange={handleChange} placeholder="City" /></FormRow>
                                            <FormRow label="ZIP Code"><Input name="pickupZip" value={formData.pickupZip} onChange={handleChange} placeholder="ZIP Code" /></FormRow>
                                            <FormRow label="Full Address" required colSpan><Textarea name="pickupAddress" value={formData.pickupAddress} onChange={handleChange} placeholder="Detailed street address..." rows={2}/></FormRow>
                                            <FormRow label="Google Map URL" colSpan><Input name="pickupMapUrl" value={formData.pickupMapUrl} onChange={handleChange} placeholder="Map Link URL" /></FormRow>
                                            <FormRow label="Instructions" colSpan><Textarea name="pickupInstructions" value={formData.pickupInstructions} onChange={handleChange} placeholder="Special pickup instructions..." rows={2}/></FormRow>
                                        </div>
                                    </div>
                                    
                                    {/* Delivery Info */}
                                    <div className="col-span-1 md:col-span-2">
                                        <h3 className="text-xs font-bold text-emerald-600 uppercase tracking-wider mb-4 flex items-center gap-2">
                                            <MapPin size={16}/> Delivery Details
                                        </h3>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4">
                                            <FormRow label="Company Name"><Input name="deliveryCompany" value={formData.deliveryCompany} onChange={handleChange} placeholder="Delivery Company Name" /></FormRow>
                                            <FormRow label="Contact Person" required><Input name="deliveryContactName" value={formData.deliveryContactName} onChange={handleChange} placeholder="Contact Person Name" /></FormRow>
                                            <FormRow label="Phone Number" required><Input type="text" name="deliveryPhone" value={formData.deliveryPhone} onChange={handleChange} placeholder="+880 1819-987654" /></FormRow>
                                            <FormRow label="Email"><Input name="deliveryEmail" value={formData.deliveryEmail} onChange={handleChange} type="email" placeholder="Email Address" /></FormRow>
                                            <FormRow label="Country"><Input name="deliveryCountry" value={formData.deliveryCountry} onChange={handleChange} /></FormRow>
                                            <FormRow label="State/Division"><Input name="deliveryState" value={formData.deliveryState} onChange={handleChange} placeholder="State / Division" /></FormRow>
                                            <FormRow label="City"><Input name="deliveryCity" value={formData.deliveryCity} onChange={handleChange} placeholder="City" /></FormRow>
                                            <FormRow label="ZIP Code"><Input name="deliveryZip" value={formData.deliveryZip} onChange={handleChange} placeholder="ZIP Code" /></FormRow>
                                            <FormRow label="Full Address" required colSpan><Textarea name="deliveryAddress" value={formData.deliveryAddress} onChange={handleChange} placeholder="Detailed street address..." rows={2}/></FormRow>
                                            <FormRow label="Google Map URL" colSpan><Input name="deliveryMapUrl" value={formData.deliveryMapUrl} onChange={handleChange} placeholder="Map Link URL" /></FormRow>
                                            <FormRow label="Instructions" colSpan><Textarea name="deliveryInstructions" value={formData.deliveryInstructions} onChange={handleChange} placeholder="Special delivery instructions..." rows={2}/></FormRow>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* 4 & 5. Load & Services */}
                        {activeTab === 'load' && (
                            <div className="space-y-3 animate-in fade-in duration-300">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4">
                                    <TabHeader title="Load & Vehicle Information" icon={Truck} />
                                    
                                    <FormRow label="Vehicle Type" required>
                                        <Select name="vehicleType" value={formData.vehicleType} onChange={(e) => handleSelectChange('vehicleType', e.target.value)} showSearch={false}>
                                            <option value="">Select vehicle...</option>
                                            <option value="Small Van">Small Van</option>
                                            <option value="Cargo Van">Cargo Van</option>
                                            <option value="Pickup Truck">Pickup Truck</option>
                                            <option value="Box Truck">Box Truck</option>
                                            <option value="Semi Trailer">Semi Trailer</option>
                                        </Select>
                                    </FormRow>
                                    
                                    <FormRow label="Load Type" required>
                                        <Select name="loadType" value={formData.loadType} onChange={(e) => handleSelectChange('loadType', e.target.value)} showSearch={false}>
                                            <option value="">Select load type...</option>
                                            <option value="Boxes">Boxes</option>
                                            <option value="Pallets">Pallets</option>
                                            <option value="Furniture">Furniture</option>
                                            <option value="Machinery">Machinery</option>
                                            <option value="Mixed">Mixed</option>
                                        </Select>
                                    </FormRow>
                                    
                                    <FormRow label="Number of Items"><Input type="text" inputMode="numeric" name="itemsCount" value={formData.itemsCount} onChange={handleChange} placeholder="e.g. 25" /></FormRow>
                                    <FormRow label="Number of Pallets"><Input type="text" inputMode="numeric" name="palletsCount" value={formData.palletsCount} onChange={handleChange} placeholder="e.g. 5" /></FormRow>
                                    <FormRow label="Total Weight (KG)"><Input type="text" inputMode="numeric" name="weight" value={formData.weight} onChange={handleChange} placeholder="e.g. 4500" /></FormRow>
                                    <FormRow label="Total Volume (CBM)"><Input type="text" inputMode="numeric" name="volume" value={formData.volume} onChange={handleChange} placeholder="e.g. 18" /></FormRow>
                                    
                                    <FormRow label="Dimensions" colSpan>
                                        <div className="flex flex-col gap-2 w-full">
                                            {/* Header Row */}
                                            <div className="grid grid-cols-[1fr_20px_1fr_20px_1fr_80px_100px_40px] gap-3 items-center px-1">
                                                <span className="text-[10px] font-bold text-slate-500 uppercase">Length</span>
                                                <span></span>
                                                <span className="text-[10px] font-bold text-slate-500 uppercase">Width</span>
                                                <span></span>
                                                <span className="text-[10px] font-bold text-slate-500 uppercase">Height</span>
                                                <span className="text-[10px] font-bold text-slate-500 uppercase">Quantity</span>
                                                <span className="text-[10px] font-bold text-slate-500 uppercase">Unit</span>
                                                <span></span>
                                            </div>
                                            
                                            {formData.dimensions.map((dim) => (
                                                <div key={dim.id} className="grid grid-cols-[1fr_20px_1fr_20px_1fr_80px_100px_40px] gap-3 items-center">
                                                    <Input type="text" inputMode="numeric" value={dim.length} onChange={(e) => updateDimension(dim.id, 'length', e.target.value)} placeholder="L" className="w-full" />
                                                    <span className="font-bold text-slate-400 text-center">×</span>
                                                    <Input type="text" inputMode="numeric" value={dim.width} onChange={(e) => updateDimension(dim.id, 'width', e.target.value)} placeholder="W" className="w-full" />
                                                    <span className="font-bold text-slate-400 text-center">×</span>
                                                    <Input type="text" inputMode="numeric" value={dim.height} onChange={(e) => updateDimension(dim.id, 'height', e.target.value)} placeholder="H" className="w-full" />
                                                    
                                                    <Input type="text" inputMode="numeric" value={dim.qty} onChange={(e) => updateDimension(dim.id, 'qty', e.target.value)} className="w-full" />
                                                    
                                                    <Select value={dim.unit} onChange={(e: any) => updateDimension(dim.id, 'unit', e.target.value)} showSearch={false} className="w-full">
                                                        <option value="CM">CM</option>
                                                        <option value="IN">IN</option>
                                                    </Select>

                                                    <div className="flex justify-center">
                                                        {formData.dimensions.length > 1 && (
                                                            <button type="button" onClick={() => removeDimension(dim.id)} className="p-1.5 text-red-500 hover:bg-red-50 rounded transition-colors cursor-pointer" title="Remove item">
                                                                <Trash2 size={16} />
                                                            </button>
                                                        )}
                                                    </div>
                                                </div>
                                            ))}
                                            <button type="button" onClick={addDimension} className="flex items-center gap-1.5 text-xs font-bold text-[#ff4a1f] hover:underline w-fit mt-2 cursor-pointer">
                                                <Plus size={14} /> Add Another Item
                                            </button>
                                        </div>
                                    </FormRow>

                                    <div className="col-span-1 md:col-span-2 grid grid-cols-1 md:grid-cols-[1fr_1.5fr] gap-6 mt-2 pt-4 border-t border-slate-100">
                                        {/* Load Characteristics */}
                                        <div>
                                            <h3 className="text-xs font-bold text-slate-800 flex items-center gap-2 mb-2.5">
                                                <Box size={14} className="text-slate-400" />
                                                Load Characteristics
                                            </h3>
                                            <div className="grid grid-cols-2 gap-y-2.5 gap-x-4 bg-slate-50 p-3 rounded-md border border-slate-200">
                                                <Checkbox name="stackable" checked={formData.stackable} onChange={handleChange} label="Stackable" />
                                                <Checkbox name="fragile" checked={formData.fragile} onChange={handleChange} label="Fragile" />
                                                <Checkbox name="hazardous" checked={formData.hazardous} onChange={handleChange} label="Hazardous" />
                                                <Checkbox name="tempControlled" checked={formData.tempControlled} onChange={handleChange} label="Temp Control" />
                                                <Checkbox name="oversized" checked={formData.oversized} onChange={handleChange} label="Oversized" />
                                                <Checkbox name="perishable" checked={formData.perishable} onChange={handleChange} label="Perishable" />
                                            </div>
                                        </div>
                                        
                                        {/* Additional Services */}
                                        <div>
                                            <h3 className="text-xs font-bold text-slate-800 flex items-center gap-2 mb-2.5">
                                                <Settings size={14} className="text-slate-400" />
                                                Additional Services
                                            </h3>
                                            <div className="grid grid-cols-2 lg:grid-cols-3 gap-y-2.5 gap-x-4 bg-slate-50 p-3 rounded-md border border-slate-200">
                                                <Checkbox name="loadingRequired" checked={formData.loadingRequired} onChange={handleChange} label="Loading Req." />
                                                <Checkbox name="unloadingRequired" checked={formData.unloadingRequired} onChange={handleChange} label="Unloading Req." />
                                                <Checkbox name="packaging" checked={formData.packaging} onChange={handleChange} label="Packaging" />
                                                <Checkbox name="insurance" checked={formData.insurance} onChange={handleChange} label="Insurance" />
                                                <Checkbox name="liftGate" checked={formData.liftGate} onChange={handleChange} label="Lift Gate" />
                                                <Checkbox name="whiteGlove" checked={formData.whiteGlove} onChange={handleChange} label="White Glove" />
                                                <Checkbox name="assembly" checked={formData.assembly} onChange={handleChange} label="Assembly" />
                                                <Checkbox name="insideDelivery" checked={formData.insideDelivery} onChange={handleChange} label="Inside Delivery" />
                                                <Checkbox name="storage" checked={formData.storage} onChange={handleChange} label="Storage" />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* 6 & 9. Preferences */}
                        {activeTab === 'preferences' && (
                            <div className="space-y-3 animate-in fade-in duration-300">
                                <div className="grid grid-cols-1 gap-y-4">
                                    <TabHeader title="Budget & Preferences" icon={Euro} />
                                    
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-2 pt-2">
                                        {/* Budget & Expiration */}
                                        <div>
                                            <h3 className="text-xs font-bold text-slate-800 flex items-center gap-2 mb-2.5">
                                                <Euro size={14} className="text-slate-400" />
                                                Budget Details
                                            </h3>
                                            <div className="grid grid-cols-1 gap-y-4 bg-slate-50 p-4 rounded-md border border-slate-200">
                                                <div>
                                                    <label className="text-xs font-bold text-slate-700 block mb-1.5">Expected Budget</label>
                                                    <div className="flex gap-2">
                                                        <Input type="text" inputMode="numeric" name="budget" value={formData.budget} onChange={handleChange} placeholder="e.g. 1450" />
                                                        <Select name="currency" value={formData.currency} onChange={(e: any) => handleSelectChange('currency', e.target.value)} showSearch={false} className="w-[100px]">
                                                            <option value="€">€</option>
                                                            <option value="USD">USD</option>
                                                            <option value="EUR">EUR</option>
                                                        </Select>
                                                    </div>
                                                </div>
                                                <div>
                                                    <label className="text-xs font-bold text-slate-700 block mb-1.5">Auto Expire Request</label>
                                                    <Select name="autoExpire" value={formData.autoExpire} onChange={(e: any) => handleSelectChange('autoExpire', e.target.value)} showSearch={false}>
                                                        <option value="24 Hours">24 Hours</option>
                                                        <option value="48 Hours">48 Hours</option>
                                                        <option value="7 Days">7 Days</option>
                                                    </Select>
                                                </div>
                                            </div>
                                        </div>
                                        
                                        {/* Quote Preferences */}
                                        <div>
                                            <h3 className="text-xs font-bold text-slate-800 flex items-center gap-2 mb-2.5">
                                                <Settings size={14} className="text-slate-400" />
                                                Quote Rules
                                            </h3>
                                            <div className="flex flex-col gap-y-3.5 bg-slate-50 p-4 rounded-md border border-slate-200 h-[calc(100%-28px)]">
                                                <Checkbox name="allowNegotiation" checked={formData.allowNegotiation} onChange={handleChange} label="Allow Price Negotiation" />
                                                <Checkbox name="receiveMultiple" checked={formData.receiveMultiple} onChange={handleChange} label="Receive Multiple Quotes" />
                                                
                                                <div className="mt-auto pt-4 flex gap-2 items-start text-xs text-slate-500 border-t border-slate-200">
                                                    <AlertCircle size={14} className="text-indigo-500 shrink-0 mt-0.5" />
                                                    <p>Allowing multiple quotes and price negotiation ensures you receive the most competitive offers from carriers.</p>
                                                </div>
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
                                    
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4 mt-2">
                                        {/* Notes & Instructions */}
                                        <div>
                                            <h3 className="text-xs font-bold text-slate-800 flex items-center gap-2 mb-3">
                                                <FileText size={14} className="text-slate-400" />
                                                Notes & Instructions
                                            </h3>
                                            <div className="flex flex-col gap-y-4">
                                                <div>
                                                    <label className="text-xs font-bold text-slate-700 block mb-1.5">Customer Notes</label>
                                                    <Textarea name="customerNotes" value={formData.customerNotes} onChange={handleChange} placeholder="Any additional notes for carrier..." rows={3} />
                                                </div>
                                                <div>
                                                    <label className="text-xs font-bold text-slate-700 block mb-1.5">Special Instructions</label>
                                                    <Textarea name="specialInstructions" value={formData.specialInstructions} onChange={handleChange} placeholder="Instructions for driver at loading dock..." rows={2} />
                                                </div>
                                                <div>
                                                    <label className="text-xs font-bold text-slate-700 block mb-1.5">Internal Reference</label>
                                                    <Input name="internalReference" value={formData.internalReference} onChange={handleChange} placeholder="PO Number, Job Ref ID, etc." />
                                                </div>
                                            </div>
                                        </div>
                                        
                                        {/* File Uploads */}
                                        <div>
                                            <h3 className="text-xs font-bold text-slate-800 flex items-center gap-2 mb-3">
                                                <Paperclip size={14} className="text-slate-400" />
                                                File Uploads
                                            </h3>
                                            <div className="flex flex-col gap-y-4">
                                                <div>
                                                    <label className="text-xs font-bold text-slate-700 block mb-1.5">Cargo Photos / Documents</label>
                                                    <Input type="file" multiple onChange={(e: any) => handleFileChange(e, 'images')} className={`w-full h-9 p-0 file:h-full file:mr-4 file:px-4 file:py-0 file:border-0 file:border-r file:font-medium file:cursor-pointer cursor-pointer bg-white transition-all ${formData.images.length > 0 ? 'border-[#008060] ring-1 ring-[#008060] file:border-[#008060]/30 file:bg-[#f0f9f6] file:text-[#008060] text-[#008060] hover:file:bg-[#e1f3ec]' : 'file:border-slate-200 file:bg-slate-50 file:text-slate-700 text-slate-500 hover:file:bg-slate-100'}`} />
                                                    {formData.images.length > 0 && (
                                                        <div className="mt-2 flex flex-col gap-1">
                                                            {formData.images.map((file, idx) => (
                                                                <a key={idx} href={URL.createObjectURL(file)} target="_blank" rel="noopener noreferrer" className="text-xs text-[#ff4a1f] hover:underline truncate w-full inline-block font-medium">
                                                                    📄 {file.name}
                                                                </a>
                                                            ))}
                                                        </div>
                                                    )}
                                                </div>
                                                <div>
                                                    <label className="text-xs font-bold text-slate-700 block mb-1.5">Packing List</label>
                                                    <Input type="file" onChange={(e: any) => handleFileChange(e, 'packingList')} className={`w-full h-9 p-0 file:h-full file:mr-4 file:px-4 file:py-0 file:border-0 file:border-r file:font-medium file:cursor-pointer cursor-pointer bg-white transition-all ${formData.packingList ? 'border-[#008060] ring-1 ring-[#008060] file:border-[#008060]/30 file:bg-[#f0f9f6] file:text-[#008060] text-[#008060] hover:file:bg-[#e1f3ec]' : 'file:border-slate-200 file:bg-slate-50 file:text-slate-700 text-slate-500 hover:file:bg-slate-100'}`} />
                                                    {formData.packingList && (
                                                        <div className="mt-2">
                                                            <a href={URL.createObjectURL(formData.packingList)} target="_blank" rel="noopener noreferrer" className="text-xs text-[#ff4a1f] hover:underline truncate w-full inline-block font-medium">
                                                                📄 {formData.packingList.name}
                                                            </a>
                                                        </div>
                                                    )}
                                                </div>
                                                <div>
                                                    <label className="text-xs font-bold text-slate-700 block mb-1.5">Commercial Invoice (Optional)</label>
                                                    <Input type="file" onChange={(e: any) => handleFileChange(e, 'invoice')} className={`w-full h-9 p-0 file:h-full file:mr-4 file:px-4 file:py-0 file:border-0 file:border-r file:font-medium file:cursor-pointer cursor-pointer bg-white transition-all ${formData.invoice ? 'border-[#008060] ring-1 ring-[#008060] file:border-[#008060]/30 file:bg-[#f0f9f6] file:text-[#008060] text-[#008060] hover:file:bg-[#e1f3ec]' : 'file:border-slate-200 file:bg-slate-50 file:text-slate-700 text-slate-500 hover:file:bg-slate-100'}`} />
                                                    {formData.invoice && (
                                                        <div className="mt-2">
                                                            <a href={URL.createObjectURL(formData.invoice)} target="_blank" rel="noopener noreferrer" className="text-xs text-[#ff4a1f] hover:underline truncate w-full inline-block font-medium">
                                                                📄 {formData.invoice.name}
                                                            </a>
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* 10. Review & Submit */}
                        {activeTab === 'review' && (
                            <div className="space-y-5 animate-in fade-in duration-300">
                                <TabHeader title="Review & Submit Request" icon={CheckCircle2} />
                                
                                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-4">
                                    {/* Left: Comprehensive Detailed Summary */}
                                    <div className="lg:col-span-2 space-y-4">
                                        
                                        {/* Card 1: Basic & Schedule Info */}
                                        <div className="bg-slate-50 border border-slate-200 rounded-md p-4 space-y-3">
                                            <div className="flex items-center justify-between border-b border-slate-200 pb-2.5">
                                                <h3 className="text-xs font-bold text-slate-800 flex items-center gap-2">
                                                    <FileText size={15} className="text-[#ff4a1f]"/> Request Summary
                                                </h3>
                                                <span className="text-xs font-semibold text-slate-700 bg-white px-2.5 py-0.5 rounded border border-slate-200">
                                                    {formData.requestTitle || 'REQ-9824'}
                                                </span>
                                            </div>

                                            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
                                                <div>
                                                    <span className="text-slate-500 font-medium block">Shipment type:</span>
                                                    <span className="font-bold text-slate-900 mt-0.5 block">{formData.shipmentType || 'One Way'}</span>
                                                </div>
                                                <div>
                                                    <span className="text-slate-500 font-medium block">Service type:</span>
                                                    <span className="font-bold text-slate-900 mt-0.5 block">{formData.serviceType || 'Standard'}</span>
                                                </div>
                                                <div>
                                                    <span className="text-slate-500 font-medium block">Priority level:</span>
                                                    <span className="font-bold text-amber-600 mt-0.5 block">{formData.priority || 'Normal'}</span>
                                                </div>
                                                <div>
                                                    <span className="text-slate-500 font-medium block">Auto expire:</span>
                                                    <span className="font-bold text-slate-800 mt-0.5 block">{formData.autoExpire || '24 Hours'}</span>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Card 2: Pickup & Delivery Route Details */}
                                        <div className="bg-white border border-slate-200 rounded-md p-4 space-y-3">
                                            <h3 className="text-xs font-bold text-slate-800 flex items-center gap-2 border-b border-slate-100 pb-2">
                                                <MapPin size={15} className="text-[#ff4a1f]"/> Route & Contact Information
                                            </h3>

                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                                                {/* Pickup Box */}
                                                <div className="p-3 bg-slate-50 rounded-md border border-slate-200/80 space-y-1.5">
                                                    <div className="flex items-center justify-between">
                                                        <span className="font-bold text-[#ff4a1f] flex items-center gap-1.5">
                                                            <MapPin size={13} /> Pickup details
                                                        </span>
                                                        <span className="text-[11px] text-slate-500">{formData.pickupDate || 'Date TBD'}</span>
                                                    </div>
                                                    <p className="font-bold text-slate-900">{formData.pickupCompany || 'Prime Logistics Depot'}</p>
                                                    <p className="text-slate-600">{formData.pickupAddress || 'Gazipur Industrial Zone, Dhaka'}</p>
                                                    <div className="pt-1.5 border-t border-slate-200/60 flex justify-between text-[11.5px] text-slate-500">
                                                        <span>Contact: <strong className="text-slate-800">{formData.pickupContactName || 'Kamal Hossain'}</strong></span>
                                                        <span>{formData.pickupPhone || '+8801711...'}</span>
                                                    </div>
                                                </div>

                                                {/* Delivery Box */}
                                                <div className="p-3 bg-slate-50 rounded-md border border-slate-200/80 space-y-1.5">
                                                    <div className="flex items-center justify-between">
                                                        <span className="font-bold text-emerald-600 flex items-center gap-1.5">
                                                            <MapPin size={13} /> Delivery details
                                                        </span>
                                                        <span className="text-[11px] text-slate-500">{formData.deliveryDate || 'Date TBD'}</span>
                                                    </div>
                                                    <p className="font-bold text-slate-900">{formData.deliveryCompany || 'Chittagong Terminal Hub'}</p>
                                                    <p className="text-slate-600">{formData.deliveryAddress || 'Port Authority Area, Chittagong'}</p>
                                                    <div className="pt-1.5 border-t border-slate-200/60 flex justify-between text-[11.5px] text-slate-500">
                                                        <span>Contact: <strong className="text-slate-800">{formData.deliveryContactName || 'Rahim Uddin'}</strong></span>
                                                        <span>{formData.deliveryPhone || '+8801819...'}</span>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Card 3: Load Specifications & Services */}
                                        <div className="bg-white border border-slate-200 rounded-md p-4 space-y-3">
                                            <h3 className="text-xs font-bold text-slate-800 flex items-center gap-2 border-b border-slate-100 pb-2">
                                                <Truck size={15} className="text-[#ff4a1f]"/> Load & Vehicle Specifications
                                            </h3>

                                            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 bg-slate-50 p-3 rounded-md border border-slate-200/80 text-xs">
                                                <div>
                                                    <span className="text-slate-500 font-medium block">Vehicle required:</span>
                                                    <span className="font-bold text-slate-900 mt-0.5 block">{formData.vehicleType || 'Semi Trailer'}</span>
                                                </div>
                                                <div>
                                                    <span className="text-slate-500 font-medium block">Load type:</span>
                                                    <span className="font-bold text-slate-900 mt-0.5 block">{formData.loadType || 'Pallets'}</span>
                                                </div>
                                                <div>
                                                    <span className="text-slate-500 font-medium block">Total weight:</span>
                                                    <span className="font-bold text-slate-900 mt-0.5 block">{formData.weight ? `${formData.weight} KG` : '4,500 KG'}</span>
                                                </div>
                                                <div>
                                                    <span className="text-slate-500 font-medium block">Total volume:</span>
                                                    <span className="font-bold text-slate-900 mt-0.5 block">{formData.volume ? `${formData.volume} CBM` : '18 CBM'}</span>
                                                </div>
                                            </div>

                                            {/* Selected Services & Attachments Summary */}
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-2 text-xs">
                                                <div className="p-2.5 bg-slate-50 rounded-md border border-slate-200/60">
                                                    <span className="font-semibold text-slate-700 block mb-1">Additional services ({servicesCount}):</span>
                                                    <p className="text-slate-600 leading-normal">
                                                        {[
                                                            formData.loadingRequired && 'Loading',
                                                            formData.unloadingRequired && 'Unloading',
                                                            formData.insurance && 'Cargo Insurance',
                                                            formData.packaging && 'Packaging',
                                                            formData.tempControlled && 'Temp Control'
                                                        ].filter(Boolean).join(', ') || 'Standard transport handling'}
                                                    </p>
                                                </div>

                                                <div className="p-2.5 bg-slate-50 rounded-md border border-slate-200/60">
                                                    <span className="font-semibold text-slate-700 block mb-1">Attached documents ({formData.images.length + (formData.packingList ? 1 : 0) + (formData.invoice ? 1 : 0)}):</span>
                                                    <p className="text-slate-600 leading-normal">
                                                        {[
                                                            formData.images.length > 0 && `${formData.images.length} Photos`,
                                                            formData.packingList && 'Packing List',
                                                            formData.invoice && 'Commercial Invoice'
                                                        ].filter(Boolean).join(', ') || 'No files attached'}
                                                    </p>
                                                </div>
                                            </div>
                                        </div>

                                    </div>

                                    {/* Right: Submit Action Card */}
                                    <div className="lg:col-span-1">
                                        <div className="bg-white border border-slate-200 rounded-md shadow-2xs overflow-hidden sticky top-6">
                                            <div className="bg-slate-900 p-3.5 border-b border-slate-800 text-center">
                                                <h3 className="text-xs font-bold text-white">Ready to Submit Request</h3>
                                                <p className="text-[11px] text-slate-400 mt-0.5">Double check details before broadcasting</p>
                                            </div>
                                            
                                            <div className="p-5 space-y-4 text-xs">
                                                <div className="flex justify-between items-center pb-2.5 border-b border-slate-100">
                                                    <span className="text-slate-500 font-medium">Estimated distance</span>
                                                    <span className="font-bold text-slate-900">265 km</span>
                                                </div>
                                                <div className="flex justify-between items-center pb-3 border-b border-slate-100">
                                                    <span className="text-slate-500 font-medium">Target budget</span>
                                                    <span className="text-sm font-bold text-emerald-600">{formData.budget ? `${formData.currency} ${formData.budget}` : '€1,450'}</span>
                                                </div>

                                                <div className="space-y-1.5 text-[11.5px] text-slate-600 bg-slate-50 p-3 rounded-md border border-slate-200/80">
                                                    <div className="flex justify-between">
                                                        <span>Price negotiation:</span>
                                                        <strong className="text-slate-800">{formData.allowNegotiation ? 'Allowed' : 'Fixed Only'}</strong>
                                                    </div>
                                                    <div className="flex justify-between">
                                                        <span>Carrier bids:</span>
                                                        <strong className="text-slate-800">{formData.receiveMultiple ? 'Multiple Bids' : 'Single Bid'}</strong>
                                                    </div>
                                                </div>
                                                
                                                <div className="pt-1 flex flex-col gap-2.5">
                                                    <Button 
                                                        variant="primary" 
                                                        isLoading={isSubmitting}
                                                        className="w-full h-9 text-xs font-bold bg-[#ff4a1f] hover:bg-[#e03e15] text-white cursor-pointer shadow-sm" 
                                                        onClick={handleSubmit}
                                                    >
                                                        <Send size={14} className="mr-2" /> Submit Request Now
                                                    </Button>
                                                    <Button variant="outline" className="w-full h-9 text-xs font-semibold cursor-pointer" onClick={() => navigate('/customer/quotes/requests')}>
                                                        <Save size={14} className="mr-2" /> Save as Draft
                                                    </Button>
                                                </div>
                                                
                                                <div className="bg-amber-50 border border-amber-200/80 rounded-md p-3 flex gap-2">
                                                    <AlertCircle size={15} className="text-amber-600 shrink-0 mt-0.5" />
                                                    <p className="text-[11px] text-amber-800 font-medium leading-tight">
                                                        Your request will be published immediately to verified carriers matching your route.
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

            {/* Subscription Lock Gate Modal on Submission */}
            <SubscriptionLockModal 
                isOpen={isLockModalOpen}
                onClose={() => setIsLockModalOpen(false)}
                userType="customer"
                featureName="Customer RFQ Bidding Quota"
                title="Customer Subscription Required"
                description="Upgrade your account to post shipping RFQs, access corporate pay later credit limits, and receive quotes from top verified carriers."
                requiredPlan="Business Shipper (€39/mo)"
                benefits={[
                    "Unlimited Monthly Freight RFQ Postings",
                    "Corporate Pay Later Credit Line Facility (30-Day Terms)",
                    "Priority Placement for Top Verified Carriers",
                    "Unlimited Saved Warehouse Locations"
                ]}
            />

            {/* Submission Success Modal */}
            {showSuccessModal && (
                <div className="fixed inset-0 bg-slate-950/60 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-fade-in font-sans">
                    <div className="bg-white rounded-2xl max-w-md w-full border border-slate-200 shadow-2xl p-6 text-center space-y-4 relative overflow-hidden">
                        
                        {/* Animated Check Icon */}
                        <div className="w-14 h-14 rounded-full bg-emerald-100 text-emerald-600 mx-auto flex items-center justify-center border-4 border-emerald-50 shadow-inner">
                            <CheckCircle2 size={32} className="text-emerald-600 animate-pulse" />
                        </div>

                        <div>
                            <Badge className="bg-emerald-50 text-emerald-700 border border-emerald-200 text-[10px] font-bold uppercase tracking-wider mb-1.5 px-2.5 py-0.5">
                                RFQ Broadcasted & Active
                            </Badge>
                            <h3 className="text-lg font-bold text-slate-900 leading-tight">Quote Request Submitted!</h3>
                            <p className="text-xs text-slate-500 font-medium mt-1 leading-relaxed">
                                Your shipping request <span className="font-bold text-slate-800">REQ-9824</span> has been successfully published to matching carriers.
                            </p>
                        </div>

                        {/* Request Summary Box */}
                        <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200/80 text-left space-y-2 text-xs">
                            <div className="flex justify-between border-b border-slate-200/60 pb-1.5">
                                <span className="text-slate-500 font-medium">Request Title:</span>
                                <span className="font-bold text-slate-900 truncate max-w-[200px]">{formData.requestTitle || '5 Pallets Freight Cargo'}</span>
                            </div>
                            <div className="flex justify-between border-b border-slate-200/60 pb-1.5">
                                <span className="text-slate-500 font-medium">Pickup & Delivery:</span>
                                <span className="font-bold text-slate-800">{formData.pickupCity || 'Dhaka'} ➔ {formData.deliveryCity || 'Chittagong'}</span>
                            </div>
                            <div className="flex justify-between border-b border-slate-200/60 pb-1.5">
                                <span className="text-slate-500 font-medium">Expected Budget:</span>
                                <span className="font-bold text-emerald-600">{formData.budget ? `${formData.currency} ${formData.budget}` : '€1,450'}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-slate-500 font-medium">Bidding Broadcast:</span>
                                <span className="font-bold text-emerald-600">14 Verified Carriers Notified</span>
                            </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="pt-2 flex flex-col sm:flex-row gap-2">
                            <Button 
                                variant="outline" 
                                className="w-full sm:w-1/2 h-9 text-xs font-semibold text-slate-700 cursor-pointer"
                                onClick={() => setShowSuccessModal(false)}
                            >
                                Create Another
                            </Button>
                            <Button 
                                variant="primary" 
                                className="w-full sm:w-1/2 h-9 text-xs font-bold bg-[#ff4a1f] hover:bg-[#e03e15] text-white cursor-pointer shadow-md flex items-center justify-center gap-1.5"
                                onClick={() => {
                                    setShowSuccessModal(false);
                                    navigate('/customer/quotes/requests');
                                }}
                            >
                                <span>Go to Requests List</span>
                                <ArrowRight size={14} />
                            </Button>
                        </div>

                    </div>
                </div>
            )}

        </div>
    );
}
