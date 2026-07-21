import React, { useState } from 'react';
import { X, User, Briefcase, Shield, Key, CheckCircle, ArrowRight, ArrowLeft } from 'lucide-react';
import Button from '@/components/ui/button';
import Input from '@/components/ui/input';
import Select from '@/components/ui/select';

export default function CreateTeamMemberModal({ onClose }: { onClose: () => void }) {
    const [step, setStep] = useState(1);

    const STEPS = [
        { id: 1, name: 'Basic Info', icon: User },
        { id: 2, name: 'Company Info', icon: Briefcase },
        { id: 3, name: 'Role Assignment', icon: Shield },
        { id: 4, name: 'System Access', icon: Key },
        { id: 5, name: 'Review', icon: CheckCircle },
    ];

    const nextStep = () => setStep(s => Math.min(5, s + 1));
    const prevStep = () => setStep(s => Math.max(1, s - 1));

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm p-4">
            <div className="bg-white w-full max-w-4xl rounded-2xl shadow-2xl flex flex-col max-h-[90vh] overflow-hidden">
                
                {/* Modal Header */}
                <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
                    <div>
                        <h2 className="text-lg font-bold text-slate-900">Add New Team Member</h2>
                        <p className="text-[13px] text-slate-500">Follow the steps to set up a new user account.</p>
                    </div>
                    <button onClick={onClose} className="p-2 rounded-full hover:bg-slate-100 text-slate-400 hover:text-slate-600 transition-colors">
                        <X size={20} />
                    </button>
                </div>

                <div className="flex flex-1 overflow-hidden">
                    {/* Sidebar / Steps */}
                    <div className="w-64 bg-slate-50 border-r border-slate-100 p-6 flex flex-col gap-6 shrink-0 hidden md:flex">
                        {STEPS.map((s) => {
                            const Icon = s.icon;
                            const isActive = step === s.id;
                            const isCompleted = step > s.id;
                            
                            return (
                                <div key={s.id} className="flex items-center gap-3">
                                    <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 border-2 font-bold text-[12px] transition-colors ${
                                        isActive ? 'border-indigo-600 bg-indigo-600 text-white' :
                                        isCompleted ? 'border-emerald-500 bg-emerald-500 text-white' :
                                        'border-slate-200 text-slate-400 bg-white'
                                    }`}>
                                        {isCompleted ? <CheckCircle size={14} /> : s.id}
                                    </div>
                                    <div>
                                        <p className={`text-[13px] font-bold ${isActive || isCompleted ? 'text-slate-900' : 'text-slate-400'}`}>
                                            {s.name}
                                        </p>
                                    </div>
                                </div>
                            );
                        })}
                    </div>

                    {/* Main Content Area */}
                    <div className="flex-1 flex flex-col bg-white overflow-y-auto">
                        <div className="p-8 flex-1">
                            {/* Step 1: Basic Info */}
                            {step === 1 && (
                                <div className="space-y-6 max-w-lg">
                                    <h3 className="text-lg font-bold text-slate-800">Basic Information</h3>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="col-span-2 md:col-span-1">
                                            <label className="block text-[13px] font-semibold text-slate-700 mb-1.5">First Name *</label>
                                            <Input placeholder="e.g. John" className="h-10" />
                                        </div>
                                        <div className="col-span-2 md:col-span-1">
                                            <label className="block text-[13px] font-semibold text-slate-700 mb-1.5">Last Name *</label>
                                            <Input placeholder="e.g. Doe" className="h-10" />
                                        </div>
                                        <div className="col-span-2">
                                            <label className="block text-[13px] font-semibold text-slate-700 mb-1.5">Email Address *</label>
                                            <Input type="email" placeholder="john.doe@example.com" className="h-10" />
                                        </div>
                                        <div className="col-span-2">
                                            <label className="block text-[13px] font-semibold text-slate-700 mb-1.5">Phone Number</label>
                                            <Input type="tel" placeholder="+1 (555) 000-0000" className="h-10" />
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* Step 2: Company Info */}
                            {step === 2 && (
                                <div className="space-y-6 max-w-lg">
                                    <h3 className="text-lg font-bold text-slate-800">Company Information</h3>
                                    <div className="space-y-4">
                                        <div>
                                            <label className="block text-[13px] font-semibold text-slate-700 mb-1.5">Department *</label>
                                            <Select 
                                                className="w-full"
                                                value="operations"
                                                showSearch={false}
                                                options={[
                                                    { id: 'operations', name: 'Operations' },
                                                    { id: 'fleet', name: 'Fleet / Drivers' },
                                                    { id: 'warehouse', name: 'Warehouse' },
                                                    { id: 'sales', name: 'Sales & Support' },
                                                ]}
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-[13px] font-semibold text-slate-700 mb-1.5">Designation / Job Title *</label>
                                            <Input placeholder="e.g. Operations Manager" className="h-10" />
                                        </div>
                                        <div>
                                            <label className="block text-[13px] font-semibold text-slate-700 mb-1.5">Branch / Location</label>
                                            <Select 
                                                className="w-full"
                                                value="hq"
                                                showSearch={false}
                                                options={[
                                                    { id: 'hq', name: 'Main Headquarters' },
                                                    { id: 'ny', name: 'New York Facility' },
                                                ]}
                                            />
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* Step 3: Role */}
                            {step === 3 && (
                                <div className="space-y-6 max-w-2xl">
                                    <h3 className="text-lg font-bold text-slate-800">Assign Role</h3>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        {[
                                            { id: 'admin', name: 'Admin', desc: 'Full access to all modules.' },
                                            { id: 'ops', name: 'Operations Manager', desc: 'Manage orders and shipments.' },
                                            { id: 'dispatcher', name: 'Dispatcher', desc: 'Assign drivers and fleet.' },
                                            { id: 'sales', name: 'Sales', desc: 'Manage quotes and customers.' },
                                        ].map((r, i) => (
                                            <div key={r.id} className={`p-4 rounded-xl border-2 cursor-pointer transition-colors ${i === 1 ? 'border-indigo-600 bg-indigo-50' : 'border-slate-200 hover:border-indigo-300'}`}>
                                                <div className="flex items-center justify-between mb-1">
                                                    <h4 className="font-bold text-slate-900">{r.name}</h4>
                                                    {i === 1 && <div className="w-4 h-4 rounded-full bg-indigo-600 flex items-center justify-center"><CheckCircle size={10} className="text-white" /></div>}
                                                </div>
                                                <p className="text-[12px] text-slate-500">{r.desc}</p>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Step 4: System Access */}
                            {step === 4 && (
                                <div className="space-y-6 max-w-lg">
                                    <h3 className="text-lg font-bold text-slate-800">System Access Security</h3>
                                    <div className="space-y-4">
                                        <div className="p-4 rounded-xl border border-slate-200 bg-slate-50 flex items-start gap-3">
                                            <input type="radio" name="pass" defaultChecked className="mt-1" />
                                            <div>
                                                <h4 className="font-bold text-slate-900 text-sm">Send Email Invitation (Recommended)</h4>
                                                <p className="text-[12px] text-slate-500 mt-0.5">User will receive an email with a link to set their own password.</p>
                                            </div>
                                        </div>
                                        <div className="p-4 rounded-xl border border-slate-200 bg-white flex items-start gap-3 opacity-60">
                                            <input type="radio" name="pass" className="mt-1" />
                                            <div>
                                                <h4 className="font-bold text-slate-900 text-sm">Set Temporary Password</h4>
                                                <p className="text-[12px] text-slate-500 mt-0.5">Manually generate a password for them to login.</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* Step 5: Review */}
                            {step === 5 && (
                                <div className="space-y-6 max-w-lg">
                                    <h3 className="text-lg font-bold text-slate-800">Review & Send Invitation</h3>
                                    <div className="bg-slate-50 rounded-xl p-5 border border-slate-100 space-y-4">
                                        <div className="flex items-center gap-4">
                                            <div className="w-12 h-12 rounded-full bg-indigo-100 text-indigo-700 flex items-center justify-center font-bold text-lg">
                                                JD
                                            </div>
                                            <div>
                                                <h4 className="font-bold text-slate-900 text-base">John Doe</h4>
                                                <p className="text-[13px] text-slate-500">john.doe@example.com</p>
                                            </div>
                                        </div>
                                        <div className="pt-4 border-t border-slate-200 grid grid-cols-2 gap-4">
                                            <div>
                                                <span className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1">Role</span>
                                                <span className="text-[13px] font-semibold text-slate-800">Operations Manager</span>
                                            </div>
                                            <div>
                                                <span className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1">Department</span>
                                                <span className="text-[13px] font-semibold text-slate-800">Operations</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Footer / Actions */}
                        <div className="p-6 border-t border-slate-100 bg-white flex items-center justify-between shrink-0">
                            <Button 
                                variant="outline" 
                                className="w-24"
                                onClick={step === 1 ? onClose : prevStep}
                            >
                                {step === 1 ? 'Cancel' : 'Back'}
                            </Button>
                            
                            {step < 5 ? (
                                <Button variant="primary" className="w-32 gap-2" onClick={nextStep}>
                                    <span>Next</span>
                                    <ArrowRight size={16} />
                                </Button>
                            ) : (
                                <Button variant="primary" className="w-48 gap-2 bg-emerald-600 hover:bg-emerald-700 text-white" onClick={onClose}>
                                    <CheckCircle size={16} />
                                    <span>Send Invitation</span>
                                </Button>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
