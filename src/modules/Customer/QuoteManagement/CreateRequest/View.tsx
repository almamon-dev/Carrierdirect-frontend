import React, { useState } from 'react';
import {
    ArrowLeft, Save, Send, MapPin, Truck, Box, FileText, Paperclip,
    Euro, Settings, CheckCircle2, ChevronRight, Activity, AlertCircle, Plus, Trash2
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Button from '@/components/ui/button';
import Input from '@/components/ui/input';
import Select from '@/components/ui/select';
import Textarea from '@/components/ui/textarea';
import Checkbox from '@/components/ui/checkbox';
import FormLabel from '@/components/ui/label';
import TabHeader from '@/components/ui/tab-header';

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
    const [activeTab, setActiveTab] = useState('general');

    const [formData, setFormData] = useState({
        requestTitle: '5 Pallets of Electronics from Dhaka to Ctg',
        priority: 'High',
        shipmentType: 'One Way',
        serviceType: 'Express',
        pickupDate: '2023-11-20',
        pickupTime: '10:00',
        deliveryDate: '2023-11-21',
        deliveryTime: '18:00',
        expectedTransitTime: '3',
        estDistance: '254',

        pickupCompany: 'Tech Corp BD',
        pickupContactName: 'Rahim Uddin',
        pickupPhone: '+8801711223344',
        pickupEmail: 'rahim@techcorp.com',
        pickupCountry: 'Bangladesh',
        pickupState: 'Dhaka',
        pickupCity: 'Dhaka',
        pickupZip: '1212',
        pickupAddress: 'House 4, Road 2, Banani',
        pickupMapUrl: 'https://maps.google.com/...',
        pickupInstructions: 'Call before arriving.\nDriver must carry valid ID.\nUse the back entrance for loading.\nBeware of the low clearance gate.\nPlease call 30 mins before arrival.\nEnsure vehicle is clean and odor-free.',

        deliveryCompany: 'Ctg Traders',
        deliveryContactName: 'Karim Hasan',
        deliveryPhone: '+8801811223344',
        deliveryEmail: 'karim@ctgtraders.com',
        deliveryCountry: 'Bangladesh',
        deliveryState: 'Chittagong',
        deliveryCity: 'Chittagong',
        deliveryZip: '4000',
        deliveryAddress: 'Agrabad Commercial Area',
        deliveryMapUrl: '',
        deliveryInstructions: 'Deliver to warehouse 3.\nCheck in at the security gate first.\nUnloading will be handled by our forklift operators.\nDo not park in the visitor parking area.\nRequire recipient signature upon delivery.',

        vehicleType: 'Box Truck',
        loadType: 'Pallets',
        itemsCount: '50',
        palletsCount: '5',
        weight: '1200',
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

        budget: '25000',
        currency: '€',
        allowNegotiation: true,
        receiveMultiple: true,
        autoExpire: '48 Hours',

        customerNotes: 'Please ensure careful handling of fragile items.',
        specialInstructions: 'Driver must have proper ID.',
        internalReference: 'PO-2023-991',

        images: [] as File[],
        packingList: null as File | null,
        invoice: null as File | null
    });

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

    const ViewField = ({ label, value, children, isLink = false, linkHref = "", colSpan = false }: { label: string, value?: React.ReactNode, children?: React.ReactNode, isLink?: boolean, linkHref?: string, colSpan?: boolean }) => (
        <div className={`${colSpan ? 'col-span-1 md:col-span-2' : ''} grid grid-cols-[160px_10px_1fr] items-start`}>
            <p className="text-[14px] text-slate-500 font-medium">{label}</p>
            <p className="text-[14px] text-slate-400">:</p>
            <div className="w-full">
                {children ? children : isLink ? (
                    <a href={linkHref} target={linkHref.startsWith('http') ? "_blank" : "_self"} className="text-[14px] font-semibold text-brand hover:underline break-all">
                        {value || 'N/A'}
                    </a>
                ) : (
                    <div className="text-[14px] font-semibold text-slate-800 break-words">{value || <span className="text-[13px] text-slate-400 font-normal italic">Not specified</span>}</div>
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
                <div className="w-full md:w-[260px] flex-shrink-0 bg-white border border-slate-200 rounded-sm overflow-hidden shadow-sm">
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
                <div className="flex-1 bg-white border border-slate-200 rounded-sm shadow-sm w-full">
                    <div className="p-6 md:p-8">

                        {/* 1. Basic Information */}
                        {activeTab === 'general' && (
                            <div className="space-y-3 animate-in fade-in duration-300">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-2">
                                    <TabHeader title="Basic Information" icon={FileText} />

                                    <ViewField label="Request Title" colSpan value={formData.requestTitle} />

                                    <ViewField label="Request Number" value={<span className="font-mono text-brand font-bold bg-brand-light px-2 py-0.5 rounded">REQ-9824</span>} />

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
                                                ) : <span className="text-[13px] text-slate-400 font-normal italic">Not specified</span>}
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
                                                ) : <span className="text-[13px] text-slate-400 font-normal italic">Not specified</span>}
                                            </ViewField>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* 4 & 5. Load & Services */}
                        {activeTab === 'load' && (
                            <div className="space-y-3 animate-in fade-in duration-300">
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
                                                <div className="text-[13px] text-slate-400 font-normal italic">Not specified</div>
                                            )}
                                        </div>
                                    </div>
                                </div>

                                <div className="col-span-1 lg:col-span-3 grid grid-cols-1 md:grid-cols-[1fr_1.5fr] gap-6 mt-1 border-t border-slate-100">
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

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-1">
                                        {/* Budget & Expiration */}
                                        <div>
                                            <h3 className="text-[13px] font-bold text-slate-800 flex items-center gap-2 mb-2.5">
                                                <Euro size={14} className="text-slate-400" />
                                                Budget Details
                                            </h3>
                                            <div className="grid grid-cols-1 gap-y-4">
                                                <div>
                                                    <label className="text-[12px] font-bold text-slate-700 block mb-1.5">Expected Budget</label>
                                                    <div className="flex gap-2">
                                                        <div className="text-[16px] font-bold text-emerald-600 flex items-center py-1">{formData.budget || '--'}</div>
                                                        <div className="text-[14px] font-bold text-emerald-700 flex items-center py-1 ml-1 pt-1.5">{formData.currency || '--'}</div>
                                                    </div>
                                                </div>
                                                <div>
                                                    <label className="text-[12px] font-bold text-slate-700 block mb-1.5">Auto Expire Request</label>
                                                    <div className="text-[14px] font-semibold text-slate-800 flex items-center py-1">{formData.autoExpire || '--'}</div>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Quote Preferences */}
                                        <div>
                                            <h3 className="text-[13px] font-bold text-slate-800 flex items-center gap-2 mb-2.5">
                                                <Settings size={14} className="text-slate-400" />
                                                Quote Rules
                                            </h3>
                                            <div className="flex flex-col gap-y-3.5 h-[calc(100%-28px)]">
                                                {formData.allowNegotiation ? <span className="text-[13px] font-medium text-slate-800 flex items-center gap-2"><CheckCircle2 size={14} className="text-emerald-500" /> Allow Price Negotiation</span> : <span className="text-[13px] font-medium text-slate-400 flex items-center gap-2 line-through"><CheckCircle2 size={14} className="text-slate-300" /> Allow Price Negotiation</span>}
                                                {formData.receiveMultiple ? <span className="text-[13px] font-medium text-slate-800 flex items-center gap-2"><CheckCircle2 size={14} className="text-emerald-500" /> Receive Multiple Quotes</span> : <span className="text-[13px] font-medium text-slate-400 flex items-center gap-2 line-through"><CheckCircle2 size={14} className="text-slate-300" /> Receive Multiple Quotes</span>}

                                                <div className="mt-auto pt-4 flex gap-2 items-start text-[11px] text-slate-500 border-t border-slate-200">
                                                    <AlertCircle size={14} className="text-indigo-500 shrink-0 mt-0.5" />
                                                    <p>Allowing multiple quotes and price negotiation ensures you receive the most competitive offers from suppliers.</p>
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
                                                    {/* File Input Removed for View */}
                                                    {formData.images.length > 0 && (
                                                        <div className="mt-2 flex flex-col gap-1">
                                                            {formData.images.map((file, idx) => (
                                                                <a key={idx} href={URL.createObjectURL(file)} target="_blank" rel="noopener noreferrer" className="text-[11px] text-brand hover:underline truncate w-full inline-block">
                                                                    📄 {file.name}
                                                                </a>
                                                            ))}
                                                        </div>
                                                    )}
                                                </div>
                                                <div>
                                                    <label className="text-[12px] font-bold text-slate-700 block mb-1.5">Packing List</label>
                                                    {/* File Input Removed for View */}
                                                    {formData.packingList && (
                                                        <div className="mt-2">
                                                            <a href={URL.createObjectURL(formData.packingList)} target="_blank" rel="noopener noreferrer" className="text-[11px] text-brand hover:underline truncate w-full inline-block">
                                                                📄 {formData.packingList.name}
                                                            </a>
                                                        </div>
                                                    )}
                                                </div>
                                                <div>
                                                    <label className="text-[12px] font-bold text-slate-700 block mb-1.5">Invoice (Optional)</label>
                                                    {/* File Input Removed for View */}
                                                    {formData.invoice && (
                                                        <div className="mt-2">
                                                            <a href={URL.createObjectURL(formData.invoice)} target="_blank" rel="noopener noreferrer" className="text-[11px] text-brand hover:underline truncate w-full inline-block">
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

                        {/* 10. Review */}
                        {activeTab === 'review' && (
                            <div className="space-y-4 animate-in fade-in duration-300">
                                <TabHeader title="Review & Submit" icon={CheckCircle2} />

                                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-3">
                                    {/* Left: Detailed Summary (Compact) */}
                                    <div className="lg:col-span-2 space-y-4">
                                        <div className="bg-slate-50 border border-slate-200 rounded-sm p-5">
                                            <div className="flex items-center justify-between mb-5 pb-3 border-b border-slate-200">
                                                <h3 className="text-[13px] font-bold text-slate-800 flex items-center gap-2">
                                                    <FileText size={16} className="text-brand" /> Request Summary
                                                </h3>
                                                <span className="text-[12px] font-bold text-slate-500 bg-white px-2 py-1 rounded border border-slate-200">
                                                    {formData.requestTitle || 'REQ-9824'}
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
                                                        <p className="text-[13px] font-bold text-slate-900 mt-2">{formData.pickupCity || 'City Not Set'}</p>
                                                        <p className="text-[12px] text-slate-500 mt-0.5">Date: {formData.pickupDate || '--'}</p>
                                                    </div>
                                                    <div className="bg-white p-3 rounded border border-slate-100 shadow-sm">
                                                        <p className="text-[11px] font-bold text-emerald-600 uppercase tracking-wider flex items-center gap-1.5"><MapPin size={12} /> Delivery Details</p>
                                                        <p className="text-[13px] font-bold text-slate-900 mt-2">{formData.deliveryCity || 'City Not Set'}</p>
                                                        <p className="text-[12px] text-slate-500 mt-0.5">Date: {formData.deliveryDate || '--'}</p>
                                                    </div>
                                                </div>

                                                <div className="col-span-2 md:col-span-3 border-t border-slate-200 my-1 pt-4">
                                                    <p className="text-[11px] font-bold text-brand uppercase tracking-wider flex items-center gap-1.5 mb-3"><Truck size={12} /> Load Information</p>
                                                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 bg-white p-3 rounded border border-slate-100 shadow-sm">
                                                        <div><p className="text-[11px] font-bold text-slate-400 uppercase">Vehicle</p><p className="text-[13px] font-bold text-slate-800 mt-1">{formData.vehicleType || '--'}</p></div>
                                                        <div><p className="text-[11px] font-bold text-slate-400 uppercase">Load Type</p><p className="text-[13px] font-bold text-slate-800 mt-1">{formData.loadType || '--'}</p></div>
                                                        <div><p className="text-[11px] font-bold text-slate-400 uppercase">Weight</p><p className="text-[13px] font-bold text-slate-800 mt-1">{formData.weight ? `${formData.weight} KG` : '-- KG'}</p></div>
                                                        <div><p className="text-[11px] font-bold text-slate-400 uppercase">Services</p><p className="text-[13px] font-bold text-slate-800 mt-1">{servicesCount} Selected</p></div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Right: Submit Action Card */}
                                    <div className="lg:col-span-1">
                                        <div className="bg-white border border-slate-200 rounded-sm shadow-sm overflow-hidden sticky top-6">
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
