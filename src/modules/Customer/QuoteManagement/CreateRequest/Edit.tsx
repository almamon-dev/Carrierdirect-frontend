import React, { useState } from 'react';
import { 
    ArrowLeft, Save, Send, MapPin, Truck, Box, FileText, Paperclip, 
    DollarSign, Settings, CheckCircle2, ChevronRight, Activity, AlertCircle, Plus, Trash2 
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
        <h3 className="text-[15px] font-bold text-slate-800 flex items-center gap-2">
            {Icon && <Icon size={16} className="text-slate-400" />}
            {title}
        </h3>
    </div>
);

const CREATE_TABS = [
    { id: 'general', label: 'Basic Information', icon: FileText },
    { id: 'locations', label: 'Pickup & Delivery', icon: MapPin },
    { id: 'load', label: 'Load & Services', icon: Truck },
    { id: 'preferences', label: 'Budget & Preferences', icon: DollarSign },
    { id: 'files', label: 'Attachments & Notes', icon: Paperclip },
    { id: 'review', label: 'Review & Submit', icon: CheckCircle2 },
];

export default function EditRequestForm() {
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
        pickupInstructions: 'Call before arriving.',

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
        deliveryInstructions: 'Deliver to warehouse 3.',

        vehicleType: 'Box Truck',
        loadType: 'Pallets',
        itemsCount: '50',
        palletsCount: '5',
        weight: '1200',
        volume: '15.5',
        dimensions: [{ id: 1, length: '120', width: '100', height: '150', qty: '5', unit: 'CM' }],

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
        currency: 'BDT',
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

    const FormRow = ({ label, required, children, colSpan = false }: { label: string, required?: boolean, children: React.ReactNode, colSpan?: boolean }) => (
        <div className={`${colSpan ? 'col-span-1 md:col-span-2' : ''} grid grid-cols-[160px_10px_1fr] items-start gap-3`}>
            <FormLabel required={required} className="!mb-0 mt-2">{label}</FormLabel>
            <p className="text-[14px] text-slate-400 mt-2">:</p>
            <div>{children}</div>
        </div>
    );

    return (
        <div className="p-6 md:p-8 mx-auto bg-[#f8f9fa] min-h-screen pb-24">
            {/* Header */}
            <div className="flex items-center justify-between mb-8">
                <div className="flex items-center gap-3">
                    <div>
                        <h1 className="text-[22px] font-bold text-slate-900">Edit Quote Request</h1>
                        <p className="text-[14px] font-medium text-indigo-600 mt-1">Update the required information to modify the request.</p>
                    </div>
                </div>
                <div className="flex items-center gap-3">
                    <Button variant="outline" size="sm" className="h-[32px] text-[14px]" onClick={() => navigate(-1)}>Cancel</Button>
                    <Button variant="outline" size="sm" className="h-[32px] text-[14px] flex items-center gap-2">
                        <Save size={14} /> Update Draft
                    </Button>
                </div>
            </div>

            {/* Layout */}
            <div className="flex flex-col md:flex-row gap-6 items-start">
                {/* Sidebar Navigation */}
                <div className="w-full md:w-[260px] flex-shrink-0 bg-white border border-slate-200 rounded-md overflow-hidden shadow-sm">
                    <div className="px-4 py-3 border-b border-slate-200 bg-slate-50">
                        <h3 className="text-[15px] font-bold text-slate-800">Categories</h3>
                    </div>
                    <div className="flex flex-col">
                        {CREATE_TABS.map((tab) => {
                            const Icon = tab.icon;
                            const isSelected = activeTab === tab.id;
                            return (
                                <button
                                    key={tab.id}
                                    onClick={() => setActiveTab(tab.id)}
                                    className={`w-full flex items-center justify-between px-4 py-2.5 text-[14px] font-medium transition-colors border-l-[3px] border-b border-slate-50 last:border-b-0 ${
                                        isSelected 
                                            ? 'border-l-indigo-600 bg-indigo-50/50 text-indigo-700' 
                                            : 'border-l-transparent text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                                    }`}
                                >
                                    <div className="flex items-center gap-2.5">
                                        <Icon size={15} className={isSelected ? 'text-indigo-600' : 'text-slate-400'} />
                                        {tab.label}
                                    </div>
                                    {isSelected && <ChevronRight size={15} className="text-indigo-600" />}
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
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4">
                                    <TabHeader title="Basic Information" icon={FileText} />
                                    
                                    <FormRow label="Request Title" required colSpan>
                                        <Input name="requestTitle" value={formData.requestTitle} onChange={handleChange} placeholder="e.g. 5 Pallets from Dhaka to Ctg" />
                                    </FormRow>
                                    
                                    <FormRow label="Request Number">
                                        <Input value="REQ-9824" disabled className="bg-slate-50 text-slate-500 font-semibold" />
                                    </FormRow>
                                    
                                    <FormRow label="Priority">
                                        <Select name="priority" value={formData.priority} onChange={(e) => handleSelectChange('priority', e.target.value)}>
                                            <option value="Normal">Normal</option>
                                            <option value="High">High</option>
                                            <option value="Urgent">Urgent</option>
                                        </Select>
                                    </FormRow>
                                    
                                    <FormRow label="Shipment Type" required>
                                        <Select name="shipmentType" value={formData.shipmentType} onChange={(e) => handleSelectChange('shipmentType', e.target.value)}>
                                            <option value="One Way">One Way</option>
                                            <option value="Round Trip">Round Trip</option>
                                        </Select>
                                    </FormRow>
                                    
                                    <FormRow label="Service Type">
                                        <Select name="serviceType" value={formData.serviceType} onChange={(e) => handleSelectChange('serviceType', e.target.value)}>
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
                                        <Input type="number" name="expectedTransitTime" value={formData.expectedTransitTime} onChange={handleChange} placeholder="e.g. 3" min="1" />
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
                                        <h3 className="text-[14px] font-bold text-blue-600 mb-4 flex items-center gap-2"><MapPin size={16}/> Pickup Details</h3>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4">
                                            <FormRow label="Company Name"><Input name="pickupCompany" value={formData.pickupCompany} onChange={handleChange} placeholder="Pickup Company" /></FormRow>
                                            <FormRow label="Contact Person" required><Input name="pickupContactName" value={formData.pickupContactName} onChange={handleChange} placeholder="Contact Name" /></FormRow>
                                            <FormRow label="Phone Number" required><Input name="pickupPhone" value={formData.pickupPhone} onChange={handleChange} placeholder="+880..." /></FormRow>
                                            <FormRow label="Email"><Input name="pickupEmail" value={formData.pickupEmail} onChange={handleChange} type="email" placeholder="Email Address" /></FormRow>
                                            <FormRow label="Country"><Input name="pickupCountry" value={formData.pickupCountry} onChange={handleChange} /></FormRow>
                                            <FormRow label="State/Division"><Input name="pickupState" value={formData.pickupState} onChange={handleChange} placeholder="State" /></FormRow>
                                            <FormRow label="City"><Input name="pickupCity" value={formData.pickupCity} onChange={handleChange} placeholder="City" /></FormRow>
                                            <FormRow label="ZIP Code"><Input name="pickupZip" value={formData.pickupZip} onChange={handleChange} placeholder="ZIP" /></FormRow>
                                            <FormRow label="Full Address" required colSpan><Textarea name="pickupAddress" value={formData.pickupAddress} onChange={handleChange} placeholder="Detailed street address" rows={2}/></FormRow>
                                            <FormRow label="Google Map URL" colSpan><Input name="pickupMapUrl" value={formData.pickupMapUrl} onChange={handleChange} placeholder="Map Link" /></FormRow>
                                            <FormRow label="Instructions" colSpan><Textarea name="pickupInstructions" value={formData.pickupInstructions} onChange={handleChange} placeholder="Instructions for driver..." rows={2}/></FormRow>
                                        </div>
                                    </div>
                                    
                                    {/* Delivery Info */}
                                    <div className="col-span-1 md:col-span-2">
                                        <h3 className="text-[14px] font-bold text-emerald-600 mb-4 flex items-center gap-2"><MapPin size={16}/> Delivery Details</h3>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4">
                                            <FormRow label="Company Name"><Input name="deliveryCompany" value={formData.deliveryCompany} onChange={handleChange} placeholder="Delivery Company" /></FormRow>
                                            <FormRow label="Contact Person" required><Input name="deliveryContactName" value={formData.deliveryContactName} onChange={handleChange} placeholder="Contact Name" /></FormRow>
                                            <FormRow label="Phone Number" required><Input name="deliveryPhone" value={formData.deliveryPhone} onChange={handleChange} placeholder="+880..." /></FormRow>
                                            <FormRow label="Email"><Input name="deliveryEmail" value={formData.deliveryEmail} onChange={handleChange} type="email" placeholder="Email Address" /></FormRow>
                                            <FormRow label="Country"><Input name="deliveryCountry" value={formData.deliveryCountry} onChange={handleChange} /></FormRow>
                                            <FormRow label="State/Division"><Input name="deliveryState" value={formData.deliveryState} onChange={handleChange} placeholder="State" /></FormRow>
                                            <FormRow label="City"><Input name="deliveryCity" value={formData.deliveryCity} onChange={handleChange} placeholder="City" /></FormRow>
                                            <FormRow label="ZIP Code"><Input name="deliveryZip" value={formData.deliveryZip} onChange={handleChange} placeholder="ZIP" /></FormRow>
                                            <FormRow label="Full Address" required colSpan><Textarea name="deliveryAddress" value={formData.deliveryAddress} onChange={handleChange} placeholder="Detailed street address" rows={2}/></FormRow>
                                            <FormRow label="Google Map URL" colSpan><Input name="deliveryMapUrl" value={formData.deliveryMapUrl} onChange={handleChange} placeholder="Map Link" /></FormRow>
                                            <FormRow label="Instructions" colSpan><Textarea name="deliveryInstructions" value={formData.deliveryInstructions} onChange={handleChange} placeholder="Instructions for delivery..." rows={2}/></FormRow>
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
                                        <Select name="vehicleType" value={formData.vehicleType} onChange={(e) => handleSelectChange('vehicleType', e.target.value)}>
                                            <option value="">Select vehicle...</option>
                                            <option value="Small Van">Small Van</option>
                                            <option value="Cargo Van">Cargo Van</option>
                                            <option value="Pickup Truck">Pickup Truck</option>
                                            <option value="Box Truck">Box Truck</option>
                                            <option value="Semi Trailer">Semi Trailer</option>
                                        </Select>
                                    </FormRow>
                                    
                                    <FormRow label="Load Type" required>
                                        <Select name="loadType" value={formData.loadType} onChange={(e) => handleSelectChange('loadType', e.target.value)}>
                                            <option value="">Select load type...</option>
                                            <option value="Boxes">Boxes</option>
                                            <option value="Pallets">Pallets</option>
                                            <option value="Furniture">Furniture</option>
                                            <option value="Machinery">Machinery</option>
                                            <option value="Mixed">Mixed</option>
                                        </Select>
                                    </FormRow>
                                    
                                    <FormRow label="Number of Items"><Input name="itemsCount" value={formData.itemsCount} onChange={handleChange} type="number" placeholder="0" /></FormRow>
                                    <FormRow label="Number of Pallets"><Input name="palletsCount" value={formData.palletsCount} onChange={handleChange} type="number" placeholder="0" /></FormRow>
                                    <FormRow label="Total Weight (KG)"><Input name="weight" value={formData.weight} onChange={handleChange} type="number" placeholder="0.00" /></FormRow>
                                    <FormRow label="Total Volume (CBM)"><Input name="volume" value={formData.volume} onChange={handleChange} type="number" placeholder="0.00" /></FormRow>
                                    
                                    <FormRow label="Dimensions" colSpan>
                                        <div className="flex flex-col gap-2 w-full">
                                            {/* Header Row */}
                                            <div className="grid grid-cols-[1fr_20px_1fr_20px_1fr_80px_100px_40px] gap-3 items-center px-1">
                                                <span className="text-[11px] font-bold text-slate-500 uppercase">Length</span>
                                                <span></span>
                                                <span className="text-[11px] font-bold text-slate-500 uppercase">Width</span>
                                                <span></span>
                                                <span className="text-[11px] font-bold text-slate-500 uppercase">Height</span>
                                                <span className="text-[11px] font-bold text-slate-500 uppercase">Quantity</span>
                                                <span className="text-[11px] font-bold text-slate-500 uppercase">Unit</span>
                                                <span></span>
                                            </div>
                                            
                                            {formData.dimensions.map((dim, index) => (
                                                <div key={dim.id} className="grid grid-cols-[1fr_20px_1fr_20px_1fr_80px_100px_40px] gap-3 items-center">
                                                    <Input value={dim.length} onChange={(e) => updateDimension(dim.id, 'length', e.target.value)} placeholder="L" className="w-full" />
                                                    <span className="font-bold text-slate-400 text-center">×</span>
                                                    <Input value={dim.width} onChange={(e) => updateDimension(dim.id, 'width', e.target.value)} placeholder="W" className="w-full" />
                                                    <span className="font-bold text-slate-400 text-center">×</span>
                                                    <Input value={dim.height} onChange={(e) => updateDimension(dim.id, 'height', e.target.value)} placeholder="H" className="w-full" />
                                                    
                                                    <Input value={dim.qty} onChange={(e) => updateDimension(dim.id, 'qty', e.target.value)} type="number" min="1" className="w-full" />
                                                    
                                                    <Select value={dim.unit} onChange={(e: any) => updateDimension(dim.id, 'unit', e.target.value)} className="w-full">
                                                        <option value="CM">CM</option>
                                                        <option value="IN">IN</option>
                                                    </Select>

                                                    <div className="flex justify-center">
                                                        {formData.dimensions.length > 1 && (
                                                            <button type="button" onClick={() => removeDimension(dim.id)} className="p-1.5 text-red-500 hover:bg-red-50 rounded transition-colors" title="Remove item">
                                                                <Trash2 size={16} />
                                                            </button>
                                                        )}
                                                    </div>
                                                </div>
                                            ))}
                                            <button type="button" onClick={addDimension} className="flex items-center gap-1.5 text-[13px] font-bold text-indigo-600 hover:text-indigo-700 w-fit mt-2">
                                                <Plus size={14} /> Add Another Item
                                            </button>
                                        </div>
                                    </FormRow>

                                    <div className="col-span-1 md:col-span-2 grid grid-cols-1 md:grid-cols-[1fr_1.5fr] gap-6 mt-2 pt-4 border-t border-slate-100">
                                        {/* Load Characteristics */}
                                        <div>
                                            <h3 className="text-[13px] font-bold text-slate-800 flex items-center gap-2 mb-2.5">
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
                                            <h3 className="text-[13px] font-bold text-slate-800 flex items-center gap-2 mb-2.5">
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
                                    <TabHeader title="Budget & Preferences" icon={DollarSign} />
                                    
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-2 pt-2">
                                        {/* Budget & Expiration */}
                                        <div>
                                            <h3 className="text-[13px] font-bold text-slate-800 flex items-center gap-2 mb-2.5">
                                                <DollarSign size={14} className="text-slate-400" />
                                                Budget Details
                                            </h3>
                                            <div className="grid grid-cols-1 gap-y-4 bg-slate-50 p-4 rounded-md border border-slate-200">
                                                <div>
                                                    <label className="text-[12px] font-bold text-slate-700 block mb-1.5">Expected Budget</label>
                                                    <div className="flex gap-2">
                                                        <Input name="budget" value={formData.budget} onChange={handleChange} type="number" placeholder="0.00" />
                                                        <Select name="currency" value={formData.currency} onChange={(e: any) => handleSelectChange('currency', e.target.value)} className="w-[100px]">
                                                            <option value="BDT">BDT</option>
                                                            <option value="USD">USD</option>
                                                            <option value="EUR">EUR</option>
                                                        </Select>
                                                    </div>
                                                </div>
                                                <div>
                                                    <label className="text-[12px] font-bold text-slate-700 block mb-1.5">Auto Expire Request</label>
                                                    <Select name="autoExpire" value={formData.autoExpire} onChange={(e: any) => handleSelectChange('autoExpire', e.target.value)}>
                                                        <option value="24 Hours">24 Hours</option>
                                                        <option value="48 Hours">48 Hours</option>
                                                        <option value="7 Days">7 Days</option>
                                                    </Select>
                                                </div>
                                            </div>
                                        </div>
                                        
                                        {/* Quote Preferences */}
                                        <div>
                                            <h3 className="text-[13px] font-bold text-slate-800 flex items-center gap-2 mb-2.5">
                                                <Settings size={14} className="text-slate-400" />
                                                Quote Rules
                                            </h3>
                                            <div className="flex flex-col gap-y-3.5 bg-slate-50 p-4 rounded-md border border-slate-200 h-[calc(100%-28px)]">
                                                <Checkbox name="allowNegotiation" checked={formData.allowNegotiation} onChange={handleChange} label="Allow Price Negotiation" />
                                                <Checkbox name="receiveMultiple" checked={formData.receiveMultiple} onChange={handleChange} label="Receive Multiple Quotes" />
                                                
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
                                    
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4 mt-2">
                                        {/* Notes & Instructions */}
                                        <div>
                                            <h3 className="text-[13px] font-bold text-slate-800 flex items-center gap-2 mb-3">
                                                <FileText size={14} className="text-slate-400" />
                                                Notes & Instructions
                                            </h3>
                                            <div className="flex flex-col gap-y-4">
                                                <div>
                                                    <label className="text-[12px] font-bold text-slate-700 block mb-1.5">Customer Notes</label>
                                                    <Textarea name="customerNotes" value={formData.customerNotes} onChange={handleChange} placeholder="Any additional notes..." rows={3} />
                                                </div>
                                                <div>
                                                    <label className="text-[12px] font-bold text-slate-700 block mb-1.5">Special Instructions</label>
                                                    <Textarea name="specialInstructions" value={formData.specialInstructions} onChange={handleChange} placeholder="Instructions for carrier..." rows={2} />
                                                </div>
                                                <div>
                                                    <label className="text-[12px] font-bold text-slate-700 block mb-1.5">Internal Reference</label>
                                                    <Input name="internalReference" value={formData.internalReference} onChange={handleChange} placeholder="Ref ID, PO Number, etc." />
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
                                                    <Input type="file" multiple onChange={(e: any) => handleFileChange(e, 'images')} className={`w-full h-[36px] p-0 file:h-full file:mr-4 file:px-4 file:py-0 file:border-0 file:border-r file:font-medium file:cursor-pointer cursor-pointer bg-white transition-all ${formData.images.length > 0 ? 'border-[#008060] ring-1 ring-[#008060] file:border-[#008060]/30 file:bg-[#f0f9f6] file:text-[#008060] text-[#008060] hover:file:bg-[#e1f3ec]' : 'file:border-slate-200 file:bg-slate-50 file:text-slate-700 text-slate-500 hover:file:bg-slate-100'}`} />
                                                    {formData.images.length > 0 && (
                                                        <div className="mt-2 flex flex-col gap-1">
                                                            {formData.images.map((file, idx) => (
                                                                <a key={idx} href={URL.createObjectURL(file)} target="_blank" rel="noopener noreferrer" className="text-[11px] text-indigo-600 hover:underline truncate w-full inline-block">
                                                                    📄 {file.name}
                                                                </a>
                                                            ))}
                                                        </div>
                                                    )}
                                                </div>
                                                <div>
                                                    <label className="text-[12px] font-bold text-slate-700 block mb-1.5">Packing List</label>
                                                    <Input type="file" onChange={(e: any) => handleFileChange(e, 'packingList')} className={`w-full h-[36px] p-0 file:h-full file:mr-4 file:px-4 file:py-0 file:border-0 file:border-r file:font-medium file:cursor-pointer cursor-pointer bg-white transition-all ${formData.packingList ? 'border-[#008060] ring-1 ring-[#008060] file:border-[#008060]/30 file:bg-[#f0f9f6] file:text-[#008060] text-[#008060] hover:file:bg-[#e1f3ec]' : 'file:border-slate-200 file:bg-slate-50 file:text-slate-700 text-slate-500 hover:file:bg-slate-100'}`} />
                                                    {formData.packingList && (
                                                        <div className="mt-2">
                                                            <a href={URL.createObjectURL(formData.packingList)} target="_blank" rel="noopener noreferrer" className="text-[11px] text-indigo-600 hover:underline truncate w-full inline-block">
                                                                📄 {formData.packingList.name}
                                                            </a>
                                                        </div>
                                                    )}
                                                </div>
                                                <div>
                                                    <label className="text-[12px] font-bold text-slate-700 block mb-1.5">Invoice (Optional)</label>
                                                    <Input type="file" onChange={(e: any) => handleFileChange(e, 'invoice')} className={`w-full h-[36px] p-0 file:h-full file:mr-4 file:px-4 file:py-0 file:border-0 file:border-r file:font-medium file:cursor-pointer cursor-pointer bg-white transition-all ${formData.invoice ? 'border-[#008060] ring-1 ring-[#008060] file:border-[#008060]/30 file:bg-[#f0f9f6] file:text-[#008060] text-[#008060] hover:file:bg-[#e1f3ec]' : 'file:border-slate-200 file:bg-slate-50 file:text-slate-700 text-slate-500 hover:file:bg-slate-100'}`} />
                                                    {formData.invoice && (
                                                        <div className="mt-2">
                                                            <a href={URL.createObjectURL(formData.invoice)} target="_blank" rel="noopener noreferrer" className="text-[11px] text-indigo-600 hover:underline truncate w-full inline-block">
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
                                
                                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-6">
                                    {/* Left: Detailed Summary (Compact) */}
                                    <div className="lg:col-span-2 space-y-4">
                                        <div className="bg-slate-50 border border-slate-200 rounded-md p-5">
                                            <div className="flex items-center justify-between mb-5 pb-3 border-b border-slate-200">
                                                <h3 className="text-[15px] font-bold text-slate-800 flex items-center gap-2">
                                                    <FileText size={16} className="text-indigo-600"/> Request Summary
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
                                                        <p className="text-[11px] font-bold text-blue-600 uppercase tracking-wider flex items-center gap-1.5"><MapPin size={12}/> Pickup Details</p>
                                                        <p className="text-[13px] font-bold text-slate-900 mt-2">{formData.pickupCity || 'City Not Set'}</p>
                                                        <p className="text-[12px] text-slate-500 mt-0.5">Date: {formData.pickupDate || '--'}</p>
                                                    </div>
                                                    <div className="bg-white p-3 rounded border border-slate-100 shadow-sm">
                                                        <p className="text-[11px] font-bold text-emerald-600 uppercase tracking-wider flex items-center gap-1.5"><MapPin size={12}/> Delivery Details</p>
                                                        <p className="text-[13px] font-bold text-slate-900 mt-2">{formData.deliveryCity || 'City Not Set'}</p>
                                                        <p className="text-[12px] text-slate-500 mt-0.5">Date: {formData.deliveryDate || '--'}</p>
                                                    </div>
                                                </div>
                                                
                                                <div className="col-span-2 md:col-span-3 border-t border-slate-200 my-1 pt-4">
                                                    <p className="text-[11px] font-bold text-indigo-600 uppercase tracking-wider flex items-center gap-1.5 mb-3"><Truck size={12}/> Load Information</p>
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
                                        <div className="bg-white border border-slate-200 rounded-md shadow-sm overflow-hidden sticky top-6">
                                            <div className="bg-slate-800 p-4 border-b border-slate-700">
                                                <h3 className="text-[14px] font-bold text-white text-center">Ready to Submit</h3>
                                            </div>
                                            
                                            <div className="p-5 space-y-4">
                                                <div className="flex justify-between items-center pb-3 border-b border-slate-100">
                                                    <span className="text-[13px] text-slate-500 font-medium">Est. Distance</span>
                                                    <span className="text-[13px] font-bold text-slate-900">-- km</span>
                                                </div>
                                                <div className="flex justify-between items-center pb-4 border-b border-slate-100">
                                                    <span className="text-[13px] text-slate-500 font-medium">Expected Budget</span>
                                                    <span className="text-[15px] font-bold text-emerald-600">{formData.budget ? `${formData.currency} ${formData.budget}` : '--'}</span>
                                                </div>
                                                
                                                <div className="pt-2 flex flex-col gap-3">
                                                    <Button variant="primary" className="w-full h-[36px] text-[14px]">
                                                        <Send size={16} className="mr-2" /> Save Changes
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
