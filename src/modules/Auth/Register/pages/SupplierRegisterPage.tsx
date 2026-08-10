import React, { useState, useEffect } from 'react';
import { ArrowLeft, User, Mail, Lock, Eye, EyeOff, Upload, Calendar, Building2, Hash } from 'lucide-react';
import { useNavigate, Link, useSearchParams } from 'react-router-dom';
import LogoBlack from '../../../../assets/Images/LogoBlack.png';
import LogoWhite from '../../../../assets/Images/Logo.png';
import Input from '../../../../components/ui/input';
import Select from '../../../../components/ui/select';
import Button from '../../../../components/ui/button';
import { useDropdownOptions } from '../../../../hooks/useDropdownOptions';

import apiClient from '../../../../lib/axios';
import { ENDPOINTS } from '../../../../config/api';
import { TOKEN_CONFIG } from '../../../../config/auth';
import { useToastStore } from '../../../../stores/useToastStore';

export default function SupplierRegisterPage() {
    const navigate = useNavigate();
    const [searchParams, setSearchParams] = useSearchParams();
    const { getOptions } = useDropdownOptions();
    const [step, setStep] = useState(1);
    const [agreed, setAgreed] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [isStep1Loading, setIsStep1Loading] = useState(false);
    const [formData, setFormData] = useState({
        fullName: '',
        email: '',
        password: '',
        confirmPassword: '',
        insuranceType: '',
        insuranceProviderName: '',
        policyNumber: '',
        policyExpiryDate: '',
        insuranceDocument: null as any,
        licenses: null as any
    });
    const [errors, setErrors] = useState<Record<string, string>>({});

    const getRegisterSessionId = (): string => {
        let sid = sessionStorage.getItem('supplier_register_session_id');
        if (!sid) {
            const randHex = Array.from(crypto.getRandomValues(new Uint8Array(16)))
                .map(b => b.toString(16).padStart(2, '0'))
                .join('');
            sid = `sess_${randHex}_${Date.now()}`;
            sessionStorage.setItem('supplier_register_session_id', sid);
        }
        return sid;
    };

    useEffect(() => {
        const selectedSlug = step === 1 ? 'account-info' : (formData.insuranceType || 'compliance-documents');
        const sid = searchParams.get('session_id') || getRegisterSessionId();
        setSearchParams({ slug: selectedSlug, session_id: sid }, { replace: true });
    }, [step, formData.insuranceType]);

    const isPolicyDateValid = (dateStr: string): boolean => {
        if (!dateStr) return false;
        const selectedDate = new Date(dateStr);
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        return selectedDate >= today;
    };

    const handleInputChange = (field: string, value: string | File) => {
        setFormData(prev => ({ ...prev, [field]: value }));

        if (field === 'policyExpiryDate' && typeof value === 'string') {
            if (!value) {
                setErrors(prev => ({ ...prev, policyExpiryDate: 'Policy Expiry Date is required' }));
            } else if (!isPolicyDateValid(value)) {
                setErrors(prev => ({ ...prev, policyExpiryDate: 'Expiry date must be today or a future date' }));
            } else {
                setErrors(prev => {
                    const newErrors = { ...prev };
                    delete newErrors.policyExpiryDate;
                    return newErrors;
                });
            }
        } else if (errors[field]) {
            setErrors(prev => {
                const newErrors = { ...prev };
                delete newErrors[field];
                return newErrors;
            });
        }
    };

    const handleAgreedChange = (checked: boolean) => {
        setAgreed(checked);
        if (errors.agreed) {
            setErrors(prev => {
                const newErrors = { ...prev };
                delete newErrors.agreed;
                return newErrors;
            });
        }
    };

    const handleContinue = (e: React.FormEvent) => {
        e.preventDefault();
        const newErrors: Record<string, string> = {};

        if (!formData.fullName.trim()) newErrors.fullName = 'Full Name is required';
        if (!formData.email.trim()) {
            newErrors.email = 'Email Address is required';
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
            newErrors.email = 'Please enter a valid email address';
        }

        if (!formData.password) {
            newErrors.password = 'Password is required';
        } else if (formData.password.length < 8) {
            newErrors.password = 'Password must be at least 8 characters';
        }

        if (!formData.confirmPassword) {
            newErrors.confirmPassword = 'Please confirm your password';
        } else if (formData.password !== formData.confirmPassword) {
            newErrors.confirmPassword = 'Passwords do not match';
        }

        setErrors(newErrors);

        if (Object.keys(newErrors).length === 0) {
            setIsStep1Loading(true);
            setTimeout(() => {
                setIsStep1Loading(false);
                setStep(2);
            }, 750);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const newErrors: Record<string, string> = {};

        if (!formData.insuranceType) newErrors.insuranceType = 'Insurance Type is required';
        if (!formData.insuranceProviderName.trim()) newErrors.insuranceProviderName = 'Provider Name is required';
        if (!formData.policyNumber.trim()) newErrors.policyNumber = 'Policy Number is required';
        if (!formData.policyExpiryDate) {
            newErrors.policyExpiryDate = 'Expiry Date is required';
        } else {
            const expiryDate = new Date(formData.policyExpiryDate);
            const today = new Date();
            today.setHours(0, 0, 0, 0); // Start of today

            if (expiryDate < today) {
                newErrors.policyExpiryDate = 'Expiry date must be in the future';
            }
        }

        if (!formData.insuranceDocument) newErrors.insuranceDocument = 'Insurance Document is required';

        if (!agreed) newErrors.agreed = 'You must agree to the Terms & Privacy Policy';

        setErrors(newErrors);

        if (Object.keys(newErrors).length === 0) {
            setIsLoading(true);
            try {
                const registerPayload = new FormData();
                registerPayload.append('user_type', 'supplier');
                registerPayload.append('company_name', formData.fullName);
                registerPayload.append('name', formData.fullName);
                registerPayload.append('email', formData.email);
                registerPayload.append('password', formData.password);
                registerPayload.append('password_confirmation', formData.confirmPassword);
                registerPayload.append('insurance_type', formData.insuranceType);
                registerPayload.append('insurance_provider_name', formData.insuranceProviderName);
                registerPayload.append('policy_number', formData.policyNumber);
                registerPayload.append('policy_expiry_date', formData.policyExpiryDate);

                if (formData.insuranceDocument instanceof File) {
                    registerPayload.append('insurance_document', formData.insuranceDocument);
                }
                if (formData.licenses instanceof File) {
                    registerPayload.append('license_document', formData.licenses);
                }

                await apiClient.post(ENDPOINTS.AUTH.REGISTER, registerPayload, {
                    headers: { 'Content-Type': 'multipart/form-data' }
                });

                navigate(`/web/verify-email-notice?email=${encodeURIComponent(formData.email)}`);
            } catch (err: any) {
                console.error('Supplier registration error:', err);
                const msg = err.data?.message || err.response?.data?.message || err.message || 'Registration failed. Please try again.';
                useToastStore.getState().showToast(msg, 'error');
            } finally {
                setIsLoading(false);
            }
        }
    };

    const insuranceOptions = getOptions('insurance_type', [
        { id: 'liability', name: 'General Liability' },
        { id: 'cargo', name: 'Cargo Insurance' },
        { id: 'auto', name: 'Commercial Auto' }
    ]);

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-[#0e1117] relative p-4">
            {/* Top Left Back Button */}
            <div className="absolute top-6 left-6">
                <button
                    onClick={() => step === 2 ? setStep(1) : navigate('/web/register')}
                    className="flex items-center text-sm font-medium text-[#FF4A1F] hover:text-[#D13915] transition-colors focus:outline-none"
                >
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    {step === 2 ? "Back to Account Details" : "Back to Account Type"}
                </button>
            </div>

            {/* The Main Centered Card */}
            <div className="main-auth-card flex flex-col md:flex-row w-full max-w-5xl bg-white dark:bg-[#181a20] rounded-lg shadow-[0_8px_30px_rgb(0,0,0,0.04)] dark:shadow-none overflow-hidden min-h-[700px]">

                {/* Left Side - Logo & Background */}
                <div className="hidden md:flex md:w-8/12 bg-[#f8fafc] dark:bg-[#12161c] flex-col items-center justify-center p-10 relative border-r border-gray-100 dark:border-[#384150]">
                    <div className="absolute inset-0 opacity-[0.4] dark:opacity-[0.1]" style={{ backgroundImage: 'radial-gradient(#cbd5e1 1px, transparent 1px)', backgroundSize: '20px 20px' }}></div>
                    <div className="relative z-10 flex flex-col items-center w-full">
                        <img src={LogoBlack} alt="GetItMoving Logo" className="w-full max-w-[400px] object-contain dark:hidden" />
                        <img src={LogoWhite} alt="GetItMoving Logo" className="w-full max-w-[400px] object-contain hidden dark:block" />
                        <h2 className="text-[15px] font-bold text-slate-800 dark:text-slate-200 mt-10 text-center tracking-tight">Supplier Portal</h2>
                        <p className="mt-3 text-sm text-gray-500 dark:text-slate-400 text-center leading-relaxed">
                            Join as a moving partner and get access to exclusive moving requests.
                        </p>
                    </div>
                </div>

                {/* Right Side - Form */}
                <div className="w-full md:w-8/12 p-8 md:p-12 flex flex-col justify-center bg-white dark:bg-[#181a20]">
                    <div className="mb-8">
                        <h2 className="text-xl font-extrabold text-slate-900 dark:text-white tracking-tight">
                            {step === 1 ? 'Create your account' : 'Compliance & Verification'}
                        </h2>
                        <p className="mt-2 text-sm text-gray-500 dark:text-slate-400">
                            {step === 1 ? 'It only takes a minute to get started.' : 'Please provide your insurance and licensing details.'}
                        </p>
                    </div>

                    {step === 1 ? (
                        <form onSubmit={handleContinue} className="space-y-3">
                            <div>
                                <label className="block text-[13px] font-medium text-gray-700 dark:text-slate-200 mb-1">Full Name <span className="text-red-500">*</span></label>
                                <div className="relative">
                                    <div className="absolute top-0 left-0 h-[42px] pl-3 flex items-center pointer-events-none z-10">
                                        <User className="h-4 w-4 text-gray-400" />
                                    </div>
                                    <Input
                                        type="text"
                                        className="pl-9 bg-white"
                                        placeholder="Full Name"
                                        value={formData.fullName}
                                        onChange={(e) => handleInputChange('fullName', e.target.value)}
                                        error={errors.fullName}
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-[13px] font-medium text-gray-700 dark:text-slate-200 mb-1">Email Address <span className="text-red-500">*</span></label>
                                <div className="relative">
                                    <div className="absolute top-0 left-0 h-[42px] pl-3 flex items-center pointer-events-none z-10">
                                        <Mail className="h-4 w-4 text-gray-400" />
                                    </div>
                                    <Input
                                        type="email"
                                        className="pl-9 bg-white"
                                        placeholder="you@example.com"
                                        value={formData.email}
                                        onChange={(e) => handleInputChange('email', e.target.value)}
                                        error={errors.email}
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-[13px] font-medium text-gray-700 dark:text-slate-200 mb-1">Password <span className="text-red-500">*</span></label>
                                <div className="relative">
                                    <div className="absolute top-0 left-0 h-[42px] pl-3 flex items-center pointer-events-none z-10">
                                        <Lock className="h-4 w-4 text-gray-400" />
                                    </div>
                                    <Input
                                        type={showPassword ? "text" : "password"}
                                        className="pl-9 pr-10 bg-white"
                                        placeholder="••••••••"
                                        value={formData.password}
                                        onChange={(e) => handleInputChange('password', e.target.value)}
                                        error={errors.password}
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute top-0 right-0 h-[42px] pr-3 flex items-center z-10 text-gray-400 hover:text-[#FF4A1F] focus:outline-none"
                                    >
                                        {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                                    </button>
                                </div>
                            </div>

                            <div>
                                <label className="block text-[13px] font-medium text-gray-700 dark:text-slate-200 mb-1">Confirm Password <span className="text-red-500">*</span></label>
                                <div className="relative">
                                    <div className="absolute top-0 left-0 h-[42px] pl-3 flex items-center pointer-events-none z-10">
                                        <Lock className="h-4 w-4 text-gray-400" />
                                    </div>
                                    <Input
                                        type={showConfirmPassword ? "text" : "password"}
                                        className="pl-9 pr-10 bg-white"
                                        placeholder="••••••••"
                                        value={formData.confirmPassword}
                                        onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
                                        error={errors.confirmPassword}
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                        className="absolute top-0 right-0 h-[42px] pr-3 flex items-center z-10 text-gray-400 hover:text-[#FF4A1F] focus:outline-none"
                                    >
                                        {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                                    </button>
                                </div>
                            </div>

                            <Button
                                type="submit"
                                isLoading={isStep1Loading}
                                fullWidth={true}
                                className="mt-6"
                            >
                                Continue
                            </Button>

                            <div className="mt-6">
                                <div className="relative">
                                    <div className="absolute inset-0 flex items-center">
                                        <div className="w-full border-t border-gray-300" />
                                    </div>
                                    <div className="relative flex justify-center text-sm">
                                        <span className="px-2 bg-white text-gray-500 font-medium">Or continue with</span>
                                    </div>
                                </div>

                                <div className="mt-6">
                                    <button
                                        type="button"
                                        className="w-full h-[42px] flex items-center justify-center px-4 border border-gray-300 rounded-md shadow-sm text-[14px] font-bold text-gray-700 bg-white hover:bg-gray-50 focus:outline-none"
                                    >
                                        <svg className="w-5 h-5 mr-2.5" viewBox="0 0 24 24">
                                            <path
                                                fill="#4285F4"
                                                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                                            />
                                            <path
                                                fill="#34A853"
                                                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                                            />
                                            <path
                                                fill="#FBBC05"
                                                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                                            />
                                            <path
                                                fill="#EA4335"
                                                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                                            />
                                        </svg>
                                        Sign up with Google
                                    </button>
                                </div>
                            </div>
                            <p className="mt-8 text-center text-sm text-gray-600">
                                Already have an account?{' '}
                                <Link to="/web/login" className="font-semibold text-[#FF4A1F] hover:text-[#D13915] transition-colors">
                                    Log In
                                </Link>
                            </p>
                        </form>
                    ) : (
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <label className="block text-[13px] font-medium text-slate-700 dark:text-slate-200 mb-1.5">Insurance Type <span className="text-red-500">*</span></label>
                                <Select
                                    value={formData.insuranceType}
                                    onChange={(e) => handleInputChange('insuranceType', e.target.value)}
                                    options={insuranceOptions}
                                    placeholder="Select a type"
                                    className="h-[42px] [&>div>button]:h-[42px]"
                                    error={errors.insuranceType}
                                />
                                {errors.insuranceType && <span className="text-[12px] text-[#d82c0d] mt-1 block">{errors.insuranceType}</span>}
                            </div>

                            <div>
                                <label className="block text-[13px] font-medium text-slate-700 dark:text-slate-200 mb-1.5">Insurance Provider Name <span className="text-red-500">*</span></label>
                                <div className="relative">
                                    <Input
                                        type="text"
                                        className="bg-white pr-10"
                                        placeholder="Enter provider name"
                                        value={formData.insuranceProviderName}
                                        onChange={(e) => handleInputChange('insuranceProviderName', e.target.value)}
                                        error={errors.insuranceProviderName}
                                    />
                                    <div className="absolute top-0 right-0 h-[42px] pr-3 flex items-center pointer-events-none z-0">
                                        <Building2 className="h-4 w-4 text-gray-400" />
                                    </div>
                                </div>
                            </div>

                            <div>
                                <label className="block text-[13px] font-medium text-slate-700 dark:text-slate-200 mb-1.5">Policy Number <span className="text-red-500">*</span></label>
                                <div className="relative">
                                    <Input
                                        type="text"
                                        className="bg-white pr-10"
                                        placeholder="Enter policy number"
                                        value={formData.policyNumber}
                                        onChange={(e) => handleInputChange('policyNumber', e.target.value)}
                                        error={errors.policyNumber}
                                    />
                                    <div className="absolute top-0 right-0 h-[42px] pr-3 flex items-center pointer-events-none z-0">
                                        <Hash className="h-4 w-4 text-gray-400" />
                                    </div>
                                </div>
                            </div>

                            <div>
                                <label className="block text-[13px] font-medium text-slate-700 dark:text-slate-200 mb-1.5">Policy Expiry Date <span className="text-red-500">*</span></label>
                                <Input
                                    type="date"
                                    className="bg-white pr-3"
                                    placeholder="mm/dd/yyyy"
                                    value={formData.policyExpiryDate}
                                    onChange={(e) => handleInputChange('policyExpiryDate', e.target.value)}
                                    error={errors.policyExpiryDate}
                                    min={new Date().toISOString().split('T')[0]}
                                />
                            </div>

                            <div>
                                <label className="block text-[13px] font-medium text-slate-700 dark:text-slate-200 mb-1.5">Insurance Document <span className="text-red-500">*</span></label>
                                <Input
                                    type="file"
                                    className="bg-white file:border-0 file:bg-[#F3F4F7] file:px-3 file:py-1 file:rounded-[3px] file:text-xs file:font-semibold file:text-gray-700 hover:file:bg-[#E5E7EB] cursor-pointer pt-[6px]"
                                    onChange={(e: any) => handleInputChange('insuranceDocument', e.target.files[0])}
                                    error={errors.insuranceDocument}
                                />
                                {formData.insuranceDocument && (
                                    <a
                                        href={typeof formData.insuranceDocument === 'string' ? formData.insuranceDocument : URL.createObjectURL(formData.insuranceDocument as unknown as File)}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-[12px] text-[#FF4A1F] hover:underline mt-1.5 inline-block font-medium flex items-center"
                                    >
                                        <Eye className="w-3.5 h-3.5 mr-1" /> View selected document
                                    </a>
                                )}
                            </div>

                            <div>
                                <label className="block text-[13px] font-medium text-slate-700 dark:text-slate-200 mb-1.5">Licenses / Certifications</label>
                                <Input
                                    type="file"
                                    className="bg-white file:border-0 file:bg-[#F3F4F7] file:px-3 file:py-1 file:rounded-[3px] file:text-xs file:font-semibold file:text-gray-700 hover:file:bg-[#E5E7EB] cursor-pointer pt-[6px]"
                                    onChange={(e: any) => handleInputChange('licenses', e.target.files[0])}
                                    error={errors.licenses}
                                />
                                {formData.licenses && (
                                    <a
                                        href={typeof formData.licenses === 'string' ? formData.licenses : URL.createObjectURL(formData.licenses as unknown as File)}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-[12px] text-[#FF4A1F] hover:underline mt-1.5 inline-block font-medium flex items-center"
                                    >
                                        <Eye className="w-3.5 h-3.5 mr-1" /> View selected document
                                    </a>
                                )}
                            </div>

                            <div className="flex flex-col pt-4 pb-2">
                                <div className="flex items-start">
                                    <div className="flex items-center h-5">
                                        <input
                                            id="terms"
                                            type="checkbox"
                                            checked={agreed}
                                            onChange={(e) => handleAgreedChange(e.target.checked)}
                                            className={`w-4 h-4 rounded cursor-pointer accent-[#FF4A1F] focus:ring-[#FF4A1F] ${errors.agreed ? 'border-[#d82c0d] text-[#d82c0d]' : 'border-gray-300 dark:border-slate-600 text-[#FF4A1F]'}`}
                                        />
                                    </div>
                                    <div className="ml-3 text-sm">
                                        <label htmlFor="terms" className="font-medium text-gray-700 dark:text-slate-300">
                                            I agree to the <a href="#" className="text-[#FF4A1F] hover:underline font-semibold">Terms of Service</a> and <a href="#" className="text-[#FF4A1F] hover:underline font-semibold">Privacy Policy</a>
                                        </label>
                                    </div>
                                </div>
                                {errors.agreed && <span className="text-[12px] text-[#d82c0d] mt-1 ml-7">{errors.agreed}</span>}
                            </div>

                            {(() => {
                                const isStep2Disabled = !formData.insuranceType ||
                                    !formData.insuranceProviderName.trim() ||
                                    !formData.policyNumber.trim() ||
                                    !formData.policyExpiryDate ||
                                    !isPolicyDateValid(formData.policyExpiryDate) ||
                                    !formData.insuranceDocument ||
                                    !agreed;

                                return (
                                    <Button
                                        type="submit"
                                        disabled={isStep2Disabled}
                                        isLoading={isLoading}
                                        fullWidth={true}
                                    >
                                        Create Account
                                    </Button>
                                );
                            })()}
                        </form>
                    )}
                </div>
            </div>
        </div>
    );
}
