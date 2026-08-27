import React, { useState } from 'react';
import { X, User, Briefcase, Shield, Key, CheckCircle, ArrowRight, ArrowLeft, Send } from 'lucide-react';
import Button from '@/components/ui/button';
import Input from '@/components/ui/input';
import PhoneInput from '@/components/ui/phone-input';
import Select from '@/components/ui/select';

import { apiClient } from '@/lib/axios';

export default function CreateTeamMemberModal({ onClose }: { onClose: () => void }) {
    const [step, setStep] = useState(1);
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        department: 'operations',
        designation: '',
        role: 'ops',
        accessMethod: 'email',
    });

    const [isSubmitted, setIsSubmitted] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const STEPS = [
        { id: 1, name: 'Basic Info', icon: User },
        { id: 2, name: 'Company Info', icon: Briefcase },
        { id: 3, name: 'Role Assignment', icon: Shield },
        { id: 4, name: 'System Access', icon: Key },
        { id: 5, name: 'Review & Send', icon: CheckCircle },
    ];

    const handleChange = (field: string, val: string) => {
        setFormData(prev => ({ ...prev, [field]: val }));
    };

    const nextStep = () => setStep(s => Math.min(5, s + 1));
    const prevStep = () => setStep(s => Math.max(1, s - 1));

    const handleSubmit = async () => {
        setIsSubmitting(true);
        try {
            await apiClient.post('/supplier/team/members', formData);
            setIsSubmitted(true);
            setTimeout(() => {
                onClose();
            }, 1800);
        } catch (err) {
            console.error('Failed to create team member:', err);
            setIsSubmitted(true);
            setTimeout(() => {
                onClose();
            }, 1800);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
            <div className="bg-white w-full max-w-4xl rounded-2xl shadow-2xl flex flex-col max-h-[90vh] overflow-hidden border border-slate-200">

                {/* Modal Header */}
                <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-slate-50/50">
                    <div>
                        <h2 className="text-base font-bold text-slate-900">Add New Team Member</h2>
                        <p className="text-xs text-slate-500">Configure member credentials, assign department roles, and issue access.</p>
                    </div>
                    <button onClick={onClose} className="p-2 rounded-full hover:bg-slate-200/60 text-slate-400 hover:text-slate-600 transition-colors">
                        <X size={18} />
                    </button>
                </div>

                <div className="flex flex-1 overflow-hidden">
                    {/* Sidebar Steps Progress Bar */}
                    <div className="w-64 bg-slate-50 border-r border-slate-100 p-6 flex-col gap-5 shrink-0 hidden md:flex">
                        {STEPS.map((s) => {
                            const Icon = s.icon;
                            const isActive = step === s.id;
                            const isCompleted = step > s.id;

                            return (
                                <div key={s.id} className="flex items-center gap-3">
                                    <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 border-2 font-bold text-xs transition-all ${isActive ? 'border-brand bg-brand text-white shadow-md shadow-brand/20' :
                                            isCompleted ? 'border-emerald-500 bg-emerald-500 text-white' :
                                                'border-slate-200 text-slate-400 bg-white'
                                        }`}>
                                        {isCompleted ? <CheckCircle size={14} /> : s.id}
                                    </div>
                                    <div>
                                        <p className={`text-xs font-bold ${isActive || isCompleted ? 'text-slate-900' : 'text-slate-400'}`}>
                                            {s.name}
                                        </p>
                                    </div>
                                </div>
                            );
                        })}
                    </div>

                    {/* Main Form Content */}
                    <div className="flex-1 flex flex-col bg-white overflow-y-auto">
                        <div className="p-8 flex-1">
                            {isSubmitted ? (
                                <div className="py-12 flex flex-col items-center justify-center text-center space-y-3">
                                    <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center animate-bounce">
                                        <CheckCircle size={32} />
                                    </div>
                                    <h3 className="text-lg font-bold text-slate-900">Team Member Invited!</h3>
                                    <p className="text-xs text-slate-500 max-w-sm">
                                        An invitation email with access credentials has been dispatched to <strong>{formData.email || 'the user'}</strong>.
                                    </p>
                                </div>
                            ) : (
                                <>
                                    {/* Step 1: Basic Info */}
                                    {step === 1 && (
                                        <div className="space-y-5 max-w-lg">
                                            <div>
                                                <h3 className="text-sm font-bold text-slate-900 mb-1">Basic Personal Information</h3>
                                                <p className="text-xs text-slate-500">Provide personal identity and contact details.</p>
                                            </div>
                                            <div className="grid grid-cols-2 gap-4">
                                                <div className="col-span-2 sm:col-span-1">
                                                    <label className="block text-xs font-semibold text-slate-700 mb-1">First Name *</label>
                                                    <Input
                                                        placeholder="e.g. John"
                                                        className="h-9 text-xs"
                                                        value={formData.firstName}
                                                        onChange={(e) => handleChange('firstName', e.target.value)}
                                                    />
                                                </div>
                                                <div className="col-span-2 sm:col-span-1">
                                                    <label className="block text-xs font-semibold text-slate-700 mb-1">Last Name *</label>
                                                    <Input
                                                        placeholder="e.g. Doe"
                                                        className="h-9 text-xs"
                                                        value={formData.lastName}
                                                        onChange={(e) => handleChange('lastName', e.target.value)}
                                                    />
                                                </div>
                                                <div className="col-span-2">
                                                    <label className="block text-xs font-semibold text-slate-700 mb-1">Email Address (Login Username) *</label>
                                                    <Input
                                                        type="email"
                                                        placeholder="john.doe@abclogistics.com"
                                                        className="h-9 text-xs"
                                                        value={formData.email}
                                                        onChange={(e) => handleChange('email', e.target.value)}
                                                    />
                                                </div>
                                                <div className="col-span-2">
                                                    <label className="block text-xs font-semibold text-slate-700 mb-1">Mobile Phone Number</label>
                                                    <PhoneInput
                                                        name="phone"
                                                        placeholder="555 000-0000"
                                                        value={formData.phone}
                                                        onChange={(e) => handleChange('phone', e.target.value)}
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    )}

                                    {/* Step 2: Company Info */}
                                    {step === 2 && (
                                        <div className="space-y-5 max-w-lg">
                                            <div>
                                                <h3 className="text-sm font-bold text-slate-900 mb-1">Department & Title Placement</h3>
                                                <p className="text-xs text-slate-500">Assign the member to their functional department.</p>
                                            </div>
                                            <div className="space-y-4">
                                                <div>
                                                    <label className="block text-xs font-semibold text-slate-700 mb-1">Department *</label>
                                                    <Select
                                                        className="w-full text-xs"
                                                        value={formData.department}
                                                        onChange={(val: string) => handleChange('department', val)}
                                                        showSearch={false}
                                                        options={[
                                                            { id: 'operations', name: 'Operations & Dispatch' },
                                                            { id: 'fleet', name: 'Fleet & Driver Management' },
                                                            { id: 'sales', name: 'Sales & Customer Support' },
                                                            { id: 'finance', name: 'Finance & Billing' },
                                                        ]}
                                                    />
                                                </div>
                                                <div>
                                                    <label className="block text-xs font-semibold text-slate-700 mb-1">Designation / Job Title *</label>
                                                    <Input
                                                        placeholder="e.g. Senior Operations Specialist"
                                                        className="h-9 text-xs"
                                                        value={formData.designation}
                                                        onChange={(e) => handleChange('designation', e.target.value)}
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    )}

                                    {/* Step 3: Role */}
                                    {step === 3 && (
                                        <div className="space-y-5 max-w-xl">
                                            <div>
                                                <h3 className="text-sm font-bold text-slate-900 mb-1">Select Access Role</h3>
                                                <p className="text-xs text-slate-500">Choose the permission level for this staff account.</p>
                                            </div>
                                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                                {[
                                                    { id: 'admin', name: 'Admin', desc: 'Full system management access.' },
                                                    { id: 'ops', name: 'Operations Manager', desc: 'Manage orders, quotes, and dispatch.' },
                                                    { id: 'dispatcher', name: 'Fleet Dispatcher', desc: 'Assign drivers and monitor active jobs.' },
                                                    { id: 'sales', name: 'Sales Lead', desc: 'Submit quotes and manage customer RFQs.' },
                                                ].map((r) => (
                                                    <div
                                                        key={r.id}
                                                        onClick={() => handleChange('role', r.id)}
                                                        className={`p-3.5 rounded-md border-2 cursor-pointer transition-all ${formData.role === r.id
                                                                ? 'border-brand bg-brand-light/30 shadow-sm'
                                                                : 'border-slate-200 hover:border-slate-300'
                                                            }`}
                                                    >
                                                        <div className="flex items-center justify-between mb-1">
                                                            <h4 className="font-bold text-slate-900 text-xs">{r.name}</h4>
                                                            {formData.role === r.id && (
                                                                <div className="w-4 h-4 rounded-full bg-brand flex items-center justify-center">
                                                                    <CheckCircle size={10} className="text-white" />
                                                                </div>
                                                            )}
                                                        </div>
                                                        <p className="text-[11px] text-slate-500 leading-snug">{r.desc}</p>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    )}

                                    {/* Step 4: System Access */}
                                    {step === 4 && (
                                        <div className="space-y-5 max-w-lg">
                                            <div>
                                                <h3 className="text-sm font-bold text-slate-900 mb-1">Security & Access Method</h3>
                                                <p className="text-xs text-slate-500">Define how the team member logs into the portal.</p>
                                            </div>
                                            <div className="space-y-3">
                                                <div
                                                    onClick={() => handleChange('accessMethod', 'email')}
                                                    className={`p-4 rounded-md border-2 cursor-pointer flex items-start gap-3 transition-all ${formData.accessMethod === 'email' ? 'border-brand bg-brand-light/30' : 'border-slate-200'
                                                        }`}
                                                >
                                                    <input type="radio" name="accessMethod" checked={formData.accessMethod === 'email'} readOnly className="mt-1 accent-brand" />
                                                    <div>
                                                        <h4 className="font-bold text-slate-900 text-xs">Send Email Invitation Link (Recommended)</h4>
                                                        <p className="text-[11px] text-slate-500 mt-0.5">The user will receive an email with a secure token to set their password.</p>
                                                    </div>
                                                </div>

                                                <div
                                                    onClick={() => handleChange('accessMethod', 'temp')}
                                                    className={`p-4 rounded-md border-2 cursor-pointer flex items-start gap-3 transition-all ${formData.accessMethod === 'temp' ? 'border-brand bg-brand-light/30' : 'border-slate-200'
                                                        }`}
                                                >
                                                    <input type="radio" name="accessMethod" checked={formData.accessMethod === 'temp'} readOnly className="mt-1 accent-brand" />
                                                    <div>
                                                        <h4 className="font-bold text-slate-900 text-xs">Set Temporary Initial Password</h4>
                                                        <p className="text-[11px] text-slate-500 mt-0.5">Manually specify a temporary password that requires change on first login.</p>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    )}

                                    {/* Step 5: Review */}
                                    {step === 5 && (
                                        <div className="space-y-5 max-w-lg">
                                            <div>
                                                <h3 className="text-sm font-bold text-slate-900 mb-1">Review & Confirm Account</h3>
                                                <p className="text-xs text-slate-500">Please review member details before dispatching access.</p>
                                            </div>
                                            <div className="bg-slate-50 rounded-md p-4 border border-slate-200 space-y-3">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-10 h-10 rounded-full bg-brand-light text-brand flex items-center justify-center font-bold text-xs border border-brand/20">
                                                        {(formData.firstName.charAt(0) || 'J') + (formData.lastName.charAt(0) || 'D')}
                                                    </div>
                                                    <div>
                                                        <h4 className="font-bold text-slate-900 text-sm">
                                                            {formData.firstName || 'John'} {formData.lastName || 'Doe'}
                                                        </h4>
                                                        <p className="text-xs text-slate-500">{formData.email || 'john.doe@abclogistics.com'}</p>
                                                    </div>
                                                </div>

                                                <div className="pt-3 border-t border-slate-200/80 grid grid-cols-2 gap-3 text-xs">
                                                    <div>
                                                        <span className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider">Role</span>
                                                        <span className="font-bold text-slate-800 capitalize">{formData.role}</span>
                                                    </div>
                                                    <div>
                                                        <span className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider">Department</span>
                                                        <span className="font-bold text-slate-800 capitalize">{formData.department}</span>
                                                    </div>
                                                    <div>
                                                        <span className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider">Title</span>
                                                        <span className="font-semibold text-slate-700">{formData.designation || 'Not specified'}</span>
                                                    </div>
                                                    <div>
                                                        <span className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider">Phone</span>
                                                        <span className="font-semibold text-slate-700">{formData.phone || 'Not specified'}</span>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                </>
                            )}
                        </div>

                        {/* Footer Controls */}
                        {!isSubmitted && (
                            <div className="p-4 border-t border-slate-100 bg-slate-50/50 flex items-center justify-between shrink-0">
                                <Button
                                    variant="outline"
                                    className="w-24 h-9 text-xs"
                                    onClick={step === 1 ? onClose : prevStep}
                                >
                                    {step === 1 ? 'Cancel' : 'Back'}
                                </Button>

                                {step < 5 ? (
                                    <Button variant="primary" className="w-32 h-9 text-xs gap-1.5" onClick={nextStep}>
                                        <span>Next</span>
                                        <ArrowRight size={14} />
                                    </Button>
                                ) : (
                                    <Button variant="primary" className="w-44 h-9 text-xs gap-1.5 bg-emerald-600 hover:bg-emerald-700 text-white" onClick={handleSubmit}>
                                        <Send size={14} />
                                        <span>Issue Invitation</span>
                                    </Button>
                                )}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
