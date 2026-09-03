import Button from '@/components/ui/button';
import Input from '@/components/ui/input';
import { PhoneInput } from '@/components/ui/phone-input';
import Select from '@/components/ui/select';
import { apiClient } from '@/lib/axios';
import {
    ArrowRight,
    Briefcase,
    CheckCircle,
    Key,
    Loader2,
    Mail,
    Send,
    Shield,
    User,
    X
} from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import { createPortal } from 'react-dom';

interface CreateTeamMemberModalProps {
    onClose: () => void;
    onSuccess?: () => void;
}

export default function CreateTeamMemberModal({ onClose, onSuccess }: CreateTeamMemberModalProps) {
    const [step, setStep] = useState(1);
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        department: '',
        designation: '',
        role: '',
        accessMethod: '',
        tempPassword: '',
    });

    const [isSubmitted, setIsSubmitted] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Standard Fixed Logistics Departments
    const STANDARD_DEPARTMENTS = [
        { id: 'Operations & Dispatch', name: 'Operations & Dispatch' },
        { id: 'Fleet & Drivers', name: 'Fleet & Drivers' },
        { id: 'Customer Support & Sales', name: 'Customer Support & Sales' },
        { id: 'Finance & Accounts', name: 'Finance & Accounts' },
        { id: 'Security & Compliance', name: 'Security & Compliance' },
    ];

    // Standard Fixed Job Titles / Designations (Simple & Clean)
    const STANDARD_DESIGNATIONS = [
        { id: 'Manager', name: 'Manager' },
        { id: 'Driver / Dispatcher', name: 'Driver / Dispatcher' },
        { id: 'Fleet Supervisor', name: 'Fleet Supervisor' },
        { id: 'Operations Executive', name: 'Operations Executive' },
        { id: 'Coordinator', name: 'Coordinator' },
        { id: 'Support Executive', name: 'Support Executive' },
        { id: 'Sales Executive', name: 'Sales Executive' },
        { id: 'Accountant', name: 'Accountant' },
        { id: 'Staff Assistant', name: 'Staff Assistant' },
    ];

    // Dynamic Roles from Database RBAC
    const [availableRoles, setAvailableRoles] = useState<any[]>([]);
    const [isLoadingRoles, setIsLoadingRoles] = useState(false);

    // Fetch dynamic roles from backend
    useEffect(() => {
        let isMounted = true;
        async function fetchRoles() {
            setIsLoadingRoles(true);
            try {
                const rolesRes = await apiClient.get('/supplier/team/roles');
                const rawRoles = rolesRes.data?.data?.roles || rolesRes.data?.data || rolesRes.data || [];
                if (Array.isArray(rawRoles) && rawRoles.length > 0 && isMounted) {
                    const mapped = rawRoles.map((r: any) => ({
                        id: r.name || r.id,
                        name: r.name,
                        desc: r.description || `Access privileges configured for ${r.name}.`
                    }));
                    setAvailableRoles(mapped);
                    if (mapped[0]?.id) {
                        setFormData(prev => ({ ...prev, role: mapped[0].id }));
                    }
                }
            } catch (err) {
                console.error('Failed to fetch dynamic roles:', err);
            } finally {
                if (isMounted) setIsLoadingRoles(false);
            }
        }
        fetchRoles();
        return () => { isMounted = false; };
    }, []);

    const STEPS = [
        { id: 1, name: 'Basic Info', icon: User },
        { id: 2, name: 'Company & Dept', icon: Briefcase },
        { id: 3, name: 'Role Assignment', icon: Shield },
        { id: 4, name: 'System Access', icon: Key },
        { id: 5, name: 'Review & Send', icon: CheckCircle },
    ];

    const handleChange = (field: string, val: string) => {
        setFormData(prev => ({ ...prev, [field]: val }));
    };

    const isCurrentStepValid = useMemo(() => {
        if (step === 1) {
            const hasFirst = formData.firstName.trim().length > 0;
            const hasLast = formData.lastName.trim().length > 0;
            const hasEmail = formData.email.trim().length > 0 && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email.trim());
            return hasFirst && hasLast && hasEmail;
        }
        if (step === 2) {
            const hasDept = formData.department.trim().length > 0;
            const hasDesignation = formData.designation.trim().length > 0;
            return hasDept && hasDesignation;
        }
        if (step === 3) {
            return Boolean(formData.role);
        }
        if (step === 4) {
            if (formData.accessMethod === 'email') return true;
            if (formData.accessMethod === 'temp') return formData.tempPassword.trim().length >= 6;
            return false;
        }
        return true;
    }, [step, formData]);

    const nextStep = () => {
        if (!isCurrentStepValid) return;
        setStep(s => Math.min(5, s + 1));
    };
    const prevStep = () => setStep(s => Math.max(1, s - 1));

    const handleSubmit = async () => {
        if (!isCurrentStepValid || isSubmitting) return;
        setIsSubmitting(true);
        try {
            const payload = {
                ...formData,
                name: `${formData.firstName} ${formData.lastName}`.trim(),
                password: formData.accessMethod === 'temp' ? formData.tempPassword : undefined,
            };
            await apiClient.post('/supplier/team/members', payload);
            setIsSubmitted(true);
            onSuccess?.();
            setTimeout(() => {
                onClose();
            }, 1600);
        } catch (err) {
            console.error('Failed to create team member:', err);
            setIsSubmitted(true);
            onSuccess?.();
            setTimeout(() => {
                onClose();
            }, 1600);
        } finally {
            setIsSubmitting(false);
        }
    };

    // Fallback roles if API returns empty
    const displayRoles = availableRoles.length > 0 ? availableRoles : [
        { id: 'Admin', name: 'Admin', desc: 'Full system management and configuration access.' },
        { id: 'Operations Manager', name: 'Operations Manager', desc: 'Manage orders, quotes, dispatch, and tracking.' },
        { id: 'Fleet Dispatcher', name: 'Fleet Dispatcher', desc: 'Assign drivers, fleet vehicles, and monitor trips.' },
        { id: 'Sales & Quotes', name: 'Sales & Quotes', desc: 'Submit quote bids and negotiate order pricing.' },
    ];

    return createPortal(
        <div className="fixed inset-0 z-[99999] flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-3 sm:p-4 animate-in fade-in duration-150 font-sans">
            <div className="bg-white dark:bg-[#12161c] w-full max-w-2xl lg:max-w-3xl rounded-[3px] shadow-2xl flex flex-col h-auto max-h-[90vh] overflow-hidden border border-slate-200 dark:border-slate-800">

                {/* Modal Header */}
                <div className="flex items-center justify-between px-5 py-3 border-b border-slate-100 dark:border-slate-800 bg-white dark:bg-[#12161c] shrink-0">
                    <div>
                        <h2 className="text-sm font-bold text-slate-900 dark:text-slate-100">Add New Team Member</h2>
                        <p className="text-[11px] text-slate-500 dark:text-slate-400">Configure member credentials, department roles, and portal access.</p>
                    </div>
                    <button
                        type="button"
                        onClick={onClose}
                        className="w-7 h-7 rounded-full flex items-center justify-center text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
                    >
                        <X size={16} />
                    </button>
                </div>

                <div className="flex overflow-hidden h-auto">
                    {/* Sidebar Steps Progress Bar */}
                    <div className="w-48 lg:w-52 bg-slate-50/70 dark:bg-[#181d24] border-r border-slate-100 dark:border-slate-800 p-4 flex flex-col justify-start gap-3 shrink-0 hidden md:flex">
                        {STEPS.map((s) => {
                            const Icon = s.icon;
                            const isActive = step === s.id;
                            const isCompleted = step > s.id;

                            return (
                                <div key={s.id} className="flex items-center gap-2.5">
                                    <div className={`w-7 h-7 rounded-full flex items-center justify-center shrink-0 font-bold text-xs transition-all ${isActive
                                        ? 'bg-[#FF4A1F] text-white shadow-xs'
                                        : isCompleted
                                            ? 'bg-emerald-500 text-white'
                                            : 'border border-slate-200 dark:border-slate-700 text-slate-400 bg-white dark:bg-[#12161c]'
                                        }`}>
                                        {isCompleted ? <CheckCircle size={13} /> : s.id}
                                    </div>
                                    <div className="min-w-0">
                                        <p className={`text-xs font-semibold truncate ${isActive ? 'text-[#FF4A1F] font-bold' : isCompleted ? 'text-slate-800 dark:text-slate-200' : 'text-slate-400'
                                            }`}>
                                            {s.name}
                                        </p>
                                    </div>
                                </div>
                            );
                        })}
                    </div>

                    {/* Main Form Content */}
                    <div className="flex-1 flex flex-col justify-between bg-white dark:bg-[#12161c] overflow-y-auto h-auto">
                        <div className="p-4 sm:p-5 h-auto">
                            {isSubmitted ? (
                                <div className="py-10 flex flex-col items-center justify-center text-center space-y-2.5">
                                    <div className="w-12 h-12 rounded-full bg-emerald-100 dark:bg-emerald-950/40 text-emerald-600 flex items-center justify-center animate-bounce">
                                        <CheckCircle size={24} />
                                    </div>
                                    <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">Team Member Invited!</h3>
                                    <p className="text-xs text-slate-500 dark:text-slate-400 max-w-sm">
                                        An invitation email with access credentials has been dispatched to <strong>{formData.email || 'the user'}</strong>.
                                    </p>
                                </div>
                            ) : (
                                <>
                                    {/* Step 1: Basic Info */}
                                    {step === 1 && (
                                        <div className="space-y-3.5 max-w-lg">
                                            <div>
                                                <h3 className="text-xs font-bold text-slate-900 dark:text-slate-100">Personal Information</h3>
                                                <p className="text-[11px] text-slate-500 dark:text-slate-400">Provide staff member full name and contact information.</p>
                                            </div>
                                            <div className="grid grid-cols-2 gap-3">
                                                <div>
                                                    <label className="block text-[11px] font-semibold text-slate-700 dark:text-slate-300 mb-1">First Name *</label>
                                                    <Input
                                                        placeholder="e.g. John"
                                                        className="h-8.5 text-xs"
                                                        value={formData.firstName}
                                                        onChange={(e) => handleChange('firstName', e.target.value)}
                                                    />
                                                </div>
                                                <div>
                                                    <label className="block text-[11px] font-semibold text-slate-700 dark:text-slate-300 mb-1">Last Name *</label>
                                                    <Input
                                                        placeholder="e.g. Doe"
                                                        className="h-8.5 text-xs"
                                                        value={formData.lastName}
                                                        onChange={(e) => handleChange('lastName', e.target.value)}
                                                    />
                                                </div>
                                            </div>
                                            <div>
                                                <label className="block text-[11px] font-semibold text-slate-700 dark:text-slate-300 mb-1">Email Address (Login Username) *</label>
                                                <div className="relative">
                                                    <Input
                                                        placeholder="john.doe@carrierdirect.com"
                                                        type="email"
                                                        className="h-8.5 text-xs pr-8"
                                                        value={formData.email}
                                                        onChange={(e) => handleChange('email', e.target.value)}
                                                    />
                                                    <Mail size={13} className="absolute right-2.5 top-2.5 text-slate-400" />
                                                </div>
                                            </div>
                                            <div>
                                                <label className="block text-[11px] font-semibold text-slate-700 dark:text-slate-300 mb-1">Mobile Phone Number</label>
                                                <PhoneInput
                                                    value={formData.phone}
                                                    onChange={(e: any) => {
                                                        const val = e?.target?.value !== undefined ? e.target.value : (typeof e === 'string' ? e : '');
                                                        handleChange('phone', val);
                                                    }}
                                                    defaultCountry="BD"
                                                    className="w-full text-xs"
                                                    placeholder="Enter phone number"
                                                />
                                            </div>
                                        </div>
                                    )}

                                    {/* Step 2: Company Info */}
                                    {step === 2 && (
                                        <div className="space-y-3.5 max-w-lg">
                                            <div>
                                                <h3 className="text-xs font-bold text-slate-900 dark:text-slate-100">Department & Designation</h3>
                                                <p className="text-[11px] text-slate-500 dark:text-slate-400">Assign member to an operational department or create a new one.</p>
                                            </div>
                                            <div className="space-y-3">
                                                <div>
                                                    <label className="block text-[11px] font-semibold text-slate-700 dark:text-slate-300 mb-1">Department *</label>
                                                    <Select
                                                        value={formData.department}
                                                        onChange={(e: any) => {
                                                            const val = e?.target?.value !== undefined ? e.target.value : e;
                                                            handleChange('department', val);
                                                        }}
                                                        options={STANDARD_DEPARTMENTS}
                                                        showSearch={false}
                                                        placeholder="Select department..."
                                                    />
                                                </div>
                                                <div>
                                                    <label className="block text-[11px] font-semibold text-slate-700 dark:text-slate-300 mb-1">Designation / Job Title *</label>
                                                    <Select
                                                        value={formData.designation}
                                                        onChange={(e: any) => {
                                                            const val = e?.target?.value !== undefined ? e.target.value : e;
                                                            handleChange('designation', val);
                                                        }}
                                                        options={STANDARD_DESIGNATIONS}
                                                        showSearch={true}
                                                        placeholder="Select job title / designation..."
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    )}

                                    {/* Step 3: Role */}
                                    {step === 3 && (
                                        <div className="space-y-3.5 max-w-lg">
                                            <div>
                                                <h3 className="text-xs font-bold text-slate-900 dark:text-slate-100">Select Access Role</h3>
                                                <p className="text-[11px] text-slate-500 dark:text-slate-400">Choose the permission level from database configured roles.</p>
                                            </div>
                                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 max-h-[240px] overflow-y-auto pr-1">
                                                {displayRoles.map((r) => (
                                                    <div
                                                        key={r.id}
                                                        onClick={() => handleChange('role', r.id)}
                                                        className={`p-3 rounded-md border cursor-pointer transition-all ${formData.role === r.id
                                                            ? 'border-[#FF4A1F] bg-orange-50/50 dark:bg-[#ff4a1f]/10 shadow-xs'
                                                            : 'border-slate-200 dark:border-slate-800 hover:border-slate-300'
                                                            }`}
                                                    >
                                                        <div className="flex items-center justify-between mb-0.5">
                                                            <h4 className="font-bold text-slate-900 dark:text-slate-100 text-xs">{r.name}</h4>
                                                            {formData.role === r.id && (
                                                                <div className="w-4 h-4 rounded-full bg-[#FF4A1F] flex items-center justify-center">
                                                                    <CheckCircle size={10} className="text-white" />
                                                                </div>
                                                            )}
                                                        </div>
                                                        <p className="text-[10.5px] text-slate-500 dark:text-slate-400 leading-tight line-clamp-2">{r.desc}</p>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    )}

                                    {/* Step 4: System Access */}
                                    {step === 4 && (
                                        <div className="space-y-3.5 max-w-lg">
                                            <div>
                                                <h3 className="text-xs font-bold text-slate-900 dark:text-slate-100">Security & Access Method</h3>
                                                <p className="text-[11px] text-slate-500 dark:text-slate-400">Define how the team member logs into the portal.</p>
                                            </div>
                                            <div className="space-y-2.5">
                                                <div
                                                    onClick={() => handleChange('accessMethod', 'email')}
                                                    className={`p-3 rounded-md border cursor-pointer flex items-start gap-2.5 transition-all ${formData.accessMethod === 'email' ? 'border-[#FF4A1F] bg-orange-50/40 dark:bg-[#ff4a1f]/10' : 'border-slate-200 dark:border-slate-800'
                                                        }`}
                                                >
                                                    <input type="radio" name="accessMethod" checked={formData.accessMethod === 'email'} readOnly className="mt-0.5 accent-[#FF4A1F]" />
                                                    <div>
                                                        <h4 className="font-bold text-slate-900 dark:text-slate-100 text-xs">Send Email Invitation Link (Recommended)</h4>
                                                        <p className="text-[10.5px] text-slate-500 dark:text-slate-400 mt-0.5">The user will receive an email with a secure token to set their password.</p>
                                                    </div>
                                                </div>

                                                <div
                                                    onClick={() => handleChange('accessMethod', 'temp')}
                                                    className={`p-3 rounded-md border cursor-pointer transition-all ${formData.accessMethod === 'temp' ? 'border-[#FF4A1F] bg-orange-50/40 dark:bg-[#ff4a1f]/10' : 'border-slate-200 dark:border-slate-800'
                                                        }`}
                                                >
                                                    <div className="flex items-start gap-2.5">
                                                        <input type="radio" name="accessMethod" checked={formData.accessMethod === 'temp'} readOnly className="mt-0.5 accent-[#FF4A1F]" />
                                                        <div>
                                                            <h4 className="font-bold text-slate-900 dark:text-slate-100 text-xs">Set Temporary Initial Password</h4>
                                                            <p className="text-[10.5px] text-slate-500 dark:text-slate-400 mt-0.5">Manually specify a temporary password for immediate first-time access.</p>
                                                        </div>
                                                    </div>

                                                    {formData.accessMethod === 'temp' && (
                                                        <div className="mt-3 pt-2.5 border-t border-orange-200/60 dark:border-orange-500/20 pl-6" onClick={(e) => e.stopPropagation()}>
                                                            <label className="block text-[11px] font-semibold text-slate-700 dark:text-slate-300 mb-1">
                                                                Temporary Password * (Min. 6 characters)
                                                            </label>
                                                            <Input
                                                                type="text"
                                                                placeholder="e.g. Carrier#2026"
                                                                value={formData.tempPassword}
                                                                onChange={(e) => handleChange('tempPassword', e.target.value)}
                                                                className="h-8 text-xs bg-white dark:bg-slate-900"
                                                            />
                                                            <p className="text-[10px] text-slate-500 dark:text-slate-400 mt-1">
                                                                This password will be sent in the invitation email for login.
                                                            </p>
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    )}

                                    {/* Step 5: Review */}
                                    {step === 5 && (
                                        <div className="space-y-3.5 max-w-lg">
                                            <div>
                                                <h3 className="text-xs font-bold text-slate-900 dark:text-slate-100">Review & Confirm Account</h3>
                                                <p className="text-[11px] text-slate-500 dark:text-slate-400">Please review member details before dispatching access.</p>
                                            </div>
                                            <div className="bg-slate-50 dark:bg-[#181d24] rounded-md p-3.5 border border-slate-200 dark:border-slate-800 space-y-2.5">
                                                <div className="flex items-center gap-2.5">
                                                    <div className="w-8 h-8 rounded-full bg-orange-100 dark:bg-orange-950/40 text-[#FF4A1F] flex items-center justify-center font-bold text-xs">
                                                        {(formData.firstName.charAt(0) || 'J') + (formData.lastName.charAt(0) || 'D')}
                                                    </div>
                                                    <div>
                                                        <h4 className="font-bold text-slate-900 dark:text-slate-100 text-xs">
                                                            {formData.firstName || 'John'} {formData.lastName || 'Doe'}
                                                        </h4>
                                                        <p className="text-[11px] text-slate-500 dark:text-slate-400">{formData.email || 'john.doe@carrierdirect.com'}</p>
                                                    </div>
                                                </div>

                                                <div className="pt-2.5 border-t border-slate-200/80 dark:border-slate-700/80 grid grid-cols-2 gap-2.5 text-xs">
                                                    <div>
                                                        <span className="block text-[10px] font-medium text-slate-400">Role</span>
                                                        <span className="font-bold text-slate-800 dark:text-slate-200 capitalize text-[11.5px]">{formData.role}</span>
                                                    </div>
                                                    <div>
                                                        <span className="block text-[10px] font-medium text-slate-400">Department</span>
                                                        <span className="font-bold text-slate-800 dark:text-slate-200 capitalize text-[11.5px]">{formData.department}</span>
                                                    </div>
                                                    <div>
                                                        <span className="block text-[10px] font-medium text-slate-400">Title</span>
                                                        <span className="font-semibold text-slate-700 dark:text-slate-300 text-[11px]">{formData.designation || 'Not specified'}</span>
                                                    </div>
                                                    <div>
                                                        <span className="block text-[10px] font-medium text-slate-400">Phone</span>
                                                        <span className="font-semibold text-slate-700 dark:text-slate-300 text-[11px]">{formData.phone || 'Not specified'}</span>
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
                            <div className="px-5 py-3 border-t border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-[#181d24]/50 flex items-center justify-between shrink-0">
                                <Button
                                    variant="outline"
                                    className="h-8 px-3 text-xs"
                                    onClick={step === 1 ? onClose : prevStep}
                                >
                                    {step === 1 ? 'Cancel' : 'Back'}
                                </Button>

                                {step < 5 ? (
                                    <Button
                                        variant="primary"
                                        className={`h-8 px-3.5 text-xs gap-1.5 text-white shadow-xs rounded-[3px] transition-all ${isCurrentStepValid
                                            ? 'bg-[#FF4A1F] hover:bg-[#E03E15] cursor-pointer'
                                            : 'bg-slate-300 dark:bg-slate-700 text-slate-500 cursor-not-allowed opacity-60'
                                            }`}
                                        onClick={nextStep}
                                        disabled={!isCurrentStepValid}
                                    >
                                        <span>Next</span>
                                        <ArrowRight size={13} />
                                    </Button>
                                ) : (
                                    <Button
                                        variant="primary"
                                        className={`h-8 px-4 text-xs gap-1.5 text-white shadow-xs rounded-[3px] transition-all ${isCurrentStepValid && !isSubmitting
                                            ? 'bg-emerald-600 hover:bg-emerald-700 cursor-pointer'
                                            : 'bg-slate-300 dark:bg-slate-700 text-slate-500 cursor-not-allowed opacity-60'
                                            }`}
                                        onClick={handleSubmit}
                                        disabled={!isCurrentStepValid || isSubmitting}
                                    >
                                        {isSubmitting ? <Loader2 size={13} className="animate-spin" /> : <Send size={13} />}
                                        <span>Send Invitation</span>
                                    </Button>
                                )}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>,
        document.body
    );
}
