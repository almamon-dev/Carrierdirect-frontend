import os

filepath = 'src/modules/Customer/QuoteManagement/CreateRequest/Create.tsx'

content = """import React, { useState } from 'react';
import { 
    ArrowLeft, Save, Send, MapPin, Truck, Box, FileText, Paperclip, 
    DollarSign, Settings, CheckCircle2, ChevronRight, Activity, AlertCircle 
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

export default function CreateRequestForm() {
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState('general');

    const [formData, setFormData] = useState({
        requestTitle: '',
        priority: 'Normal',
        shipmentType: 'One Way',
        serviceType: 'Standard',
        pickupDate: '',
        pickupTime: '',
        deliveryDate: '',
        deliveryTime: '',
        
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
        dimLength: '',
        dimWidth: '',
        dimHeight: '',

        stackable: false,
        fragile: false,
        hazardous: false,
        tempControlled: false,
        loadingRequired: false,
        unloadingRequired: false,
        packaging: false,
        insurance: false,
        liftGate: false,
        whiteGlove: false,
        assembly: false,

        budget: '',
        currency: 'BDT',
        allowNegotiation: true,
        receiveMultiple: true,
        autoExpire: '24 Hours',

        customerNotes: '',
        specialInstructions: '',
        internalReference: ''
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

    // Calculate selected services count for summary
    const servicesCount = [
        formData.stackable, formData.fragile, formData.hazardous, formData.tempControlled,
        formData.loadingRequired, formData.unloadingRequired, formData.packaging, 
        formData.insurance, formData.liftGate, formData.whiteGlove, formData.assembly
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
                    <button onClick={() => navigate(-1)} className="p-2 hover:bg-slate-200 bg-slate-100 rounded-full transition-colors shrink-0">
                        <ArrowLeft size={20} className="text-slate-700" />
                    </button>
                    <div>
                        <h1 className="text-[22px] font-bold text-slate-900">Create Quote Request</h1>
                        <p className="text-[14px] font-medium text-indigo-600 mt-1">Fill in the required information to submit a request.</p>
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
                                        <div className="flex gap-2">
                                            <Input name="dimLength" value={formData.dimLength} onChange={handleChange} placeholder="Length" />
                                            <span className="self-center font-bold text-slate-400">×</span>
                                            <Input name="dimWidth" value={formData.dimWidth} onChange={handleChange} placeholder="Width" />
                                            <span className="self-center font-bold text-slate-400">×</span>
                                            <Input name="dimHeight" value={formData.dimHeight} onChange={handleChange} placeholder="Height" />
                                        </div>
                                    </FormRow>

                                    <SectionHeader title="Load Characteristics" icon={Box} />
                                    <div className="col-span-1 md:col-span-2 grid grid-cols-2 md:grid-cols-4 gap-4 bg-slate-50 p-4 rounded-md border border-slate-100">
                                        <Checkbox name="stackable" checked={formData.stackable} onChange={handleChange} label="Stackable" />
                                        <Checkbox name="fragile" checked={formData.fragile} onChange={handleChange} label="Fragile" />
                                        <Checkbox name="hazardous" checked={formData.hazardous} onChange={handleChange} label="Hazardous Goods" />
                                        <Checkbox name="tempControlled" checked={formData.tempControlled} onChange={handleChange} label="Temp Controlled" />
                                    </div>
                                    
                                    <SectionHeader title="Additional Services" icon={Settings} />
                                    <div className="col-span-1 md:col-span-2 grid grid-cols-2 gap-4 ml-[170px]">
                                        <Checkbox name="loadingRequired" checked={formData.loadingRequired} onChange={handleChange} label="Loading Required" />
                                        <Checkbox name="unloadingRequired" checked={formData.unloadingRequired} onChange={handleChange} label="Unloading Required" />
                                        <Checkbox name="packaging" checked={formData.packaging} onChange={handleChange} label="Packaging" />
                                        <Checkbox name="insurance" checked={formData.insurance} onChange={handleChange} label="Insurance" />
                                        <Checkbox name="liftGate" checked={formData.liftGate} onChange={handleChange} label="Lift Gate" />
                                        <Checkbox name="whiteGlove" checked={formData.whiteGlove} onChange={handleChange} label="White Glove Service" />
                                        <Checkbox name="assembly" checked={formData.assembly} onChange={handleChange} label="Assembly / Disassembly" />
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* 6 & 9. Preferences */}
                        {activeTab === 'preferences' && (
                            <div className="space-y-3 animate-in fade-in duration-300">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4">
                                    <TabHeader title="Budget & Preferences" icon={DollarSign} />
                                    
                                    <FormRow label="Expected Budget">
                                        <div className="flex gap-2">
                                            <Input name="budget" value={formData.budget} onChange={handleChange} type="number" placeholder="0.00" />
                                            <Select name="currency" value={formData.currency} onChange={(e) => handleSelectChange('currency', e.target.value)} className="w-24">
                                                <option value="BDT">BDT</option>
                                                <option value="USD">USD</option>
                                                <option value="EUR">EUR</option>
                                            </Select>
                                        </div>
                                    </FormRow>
                                    
                                    <SectionHeader title="Quote Preferences" icon={Settings} />
                                    
                                    <div className="col-span-1 md:col-span-2 flex flex-col gap-3 ml-[170px]">
                                        <Checkbox name="allowNegotiation" checked={formData.allowNegotiation} onChange={handleChange} label="Allow Negotiation ✔" />
                                        <Checkbox name="receiveMultiple" checked={formData.receiveMultiple} onChange={handleChange} label="Receive Multiple Quotes ✔" />
                                    </div>
                                    
                                    <FormRow label="Auto Expire After">
                                        <Select name="autoExpire" value={formData.autoExpire} onChange={(e) => handleSelectChange('autoExpire', e.target.value)}>
                                            <option value="24 Hours">24 Hours</option>
                                            <option value="48 Hours">48 Hours</option>
                                            <option value="7 Days">7 Days</option>
                                        </Select>
                                    </FormRow>
                                </div>
                            </div>
                        )}

                        {/* 7 & 8. Attachments */}
                        {activeTab === 'files' && (
                            <div className="space-y-3 animate-in fade-in duration-300">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4">
                                    <TabHeader title="Attachments & Notes" icon={Paperclip} />
                                    
                                    <FormRow label="Customer Notes" colSpan>
                                        <Textarea name="customerNotes" value={formData.customerNotes} onChange={handleChange} placeholder="Any additional notes..." rows={3} />
                                    </FormRow>
                                    
                                    <FormRow label="Special Instructions" colSpan>
                                        <Textarea name="specialInstructions" value={formData.specialInstructions} onChange={handleChange} placeholder="Instructions..." rows={2} />
                                    </FormRow>
                                    
                                    <FormRow label="Internal Reference">
                                        <Input name="internalReference" value={formData.internalReference} onChange={handleChange} placeholder="Ref ID..." />
                                    </FormRow>
                                    
                                    <SectionHeader title="File Uploads" icon={FileText} />
                                    
                                    <FormRow label="Images / Docs" colSpan>
                                        <Input type="file" multiple className="h-[36px] p-0 file:h-full file:mr-4 file:px-4 file:py-0 file:bg-slate-50 file:border-0 file:border-r file:border-slate-200 file:text-slate-700 file:font-medium file:cursor-pointer hover:file:bg-slate-100 cursor-pointer text-slate-500" />
                                    </FormRow>
                                    <FormRow label="Packing List" colSpan>
                                        <Input type="file" className="h-[36px] p-0 file:h-full file:mr-4 file:px-4 file:py-0 file:bg-slate-50 file:border-0 file:border-r file:border-slate-200 file:text-slate-700 file:font-medium file:cursor-pointer hover:file:bg-slate-100 cursor-pointer text-slate-500" />
                                    </FormRow>
                                    <FormRow label="Invoice (Optional)" colSpan>
                                        <Input type="file" className="h-[36px] p-0 file:h-full file:mr-4 file:px-4 file:py-0 file:bg-slate-50 file:border-0 file:border-r file:border-slate-200 file:text-slate-700 file:font-medium file:cursor-pointer hover:file:bg-slate-100 cursor-pointer text-slate-500" />
                                    </FormRow>
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
"""

with open(filepath, 'w', encoding='utf-8') as f:
    f.write(content)
print("State updated successfully")
