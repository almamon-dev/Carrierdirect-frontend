import React, { useState } from 'react';
import { User, Truck, ArrowRight, ArrowLeft } from 'lucide-react';
import { useNavigate, Link } from 'react-router-dom';
import Button from '@/components/ui/button';
import LogoBlack from '../../../../assets/Images/LogoBlack.png';
import LogoWhite from '../../../../assets/Images/Logo.png';

export default function SelectRolePage() {
    const navigate = useNavigate();
    const [selectedType, setSelectedType] = useState<'customer' | 'supplier' | null>(null);
    const [isLoading, setIsLoading] = useState(false);

    const handleContinue = async () => {
        if (!selectedType) return;
        setIsLoading(true);
        await new Promise(resolve => setTimeout(resolve, 750));
        navigate(`/web/register/${selectedType}`);
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-[#0e1117] relative p-4 font-sans">
            {/* Top Left Back Button */}
            <div className="absolute top-6 left-6 z-20">
                <Link to="/web/login" className="flex items-center text-sm font-medium text-[#FF4A1F] hover:text-[#D13915] transition-colors">
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Back to Login
                </Link>
            </div>

            {/* The Main Centered Card */}
            <div className="main-auth-card flex flex-col md:flex-row w-full max-w-4xl bg-white dark:bg-[#181a20] rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] dark:shadow-none border-2 border-gray-200 dark:border-[#384150] overflow-hidden min-h-[500px]">

                {/* Left Side - Logo & Background */}
                <div className="md:w-1/2 bg-[#f8fafc] dark:bg-[#12161c] flex flex-col items-center justify-center p-12 relative border-r border-gray-100 dark:border-[#384150]">
                    {/* Subtle dot pattern background */}
                    <div className="absolute inset-0 opacity-[0.4] dark:opacity-[0.1]" style={{ backgroundImage: 'radial-gradient(#cbd5e1 1px, transparent 1px)', backgroundSize: '20px 20px' }}></div>

                    <div className="relative z-10 flex flex-col items-center w-full">
                        <img src={LogoBlack} alt="GetItMoving Logo" className="w-full max-w-[320px] md:max-w-[380px] object-contain scale-110 dark:hidden" />
                        <img src={LogoWhite} alt="GetItMoving Logo" className="w-full max-w-[320px] md:max-w-[380px] object-contain scale-110 hidden dark:block" />
                    </div>
                </div>

                {/* Right Side - Form */}
                <div className="md:w-1/2 p-8 md:p-12 flex flex-col justify-center bg-white dark:bg-[#181a20]">
                    <div className="mb-8">
                        <h2 className="text-xl md:text-2xl font-bold text-slate-800 dark:text-white">
                            Create your account
                        </h2>
                        <p className="mt-2 text-sm text-gray-500 dark:text-slate-400">
                            Select your account type to proceed
                        </p>
                    </div>

                    <div className="space-y-4 mb-8">
                        <label
                            className={`flex items-center p-4 rounded-lg cursor-pointer transition-all ${selectedType === 'customer'
                                ? 'role-card-selected bg-white dark:bg-[#1e2329]'
                                : 'border border-gray-200 dark:border-[#384150] bg-white dark:bg-[#1e2329] hover:border-[#FF4A1F]/50'
                                }`}
                        >
                            <input
                                type="radio"
                                name="accountType"
                                value="customer"
                                checked={selectedType === 'customer'}
                                onChange={() => setSelectedType('customer')}
                                className="w-4 h-4 text-[#FF4A1F] accent-[#FF4A1F] border-gray-300 dark:border-slate-600 focus:ring-[#FF4A1F] cursor-pointer"
                            />
                            <div className="ml-4 flex items-center gap-3">
                                <div className={`p-2 rounded-md transition-colors ${selectedType === 'customer' ? 'bg-[#FF4A1F]/15 dark:bg-[#FF4A1F]/20 text-[#FF4A1F]' : 'bg-gray-100 dark:bg-slate-800 text-gray-500 dark:text-slate-400'}`}>
                                    <User size={18} />
                                </div>
                                <div>
                                    <span className={`block text-sm font-semibold ${selectedType === 'customer' ? 'text-[#FF4A1F] dark:text-[#FF4A1F]' : 'text-gray-900 dark:text-slate-100'}`}>Customer</span>
                                    <span className={`block text-xs mt-0.5 ${selectedType === 'customer' ? 'text-gray-700 dark:text-slate-300' : 'text-gray-500 dark:text-slate-400'}`}>I want to request moving services</span>
                                </div>
                            </div>
                        </label>

                        <label
                            className={`flex items-center p-4 rounded-lg cursor-pointer transition-all ${selectedType === 'supplier'
                                ? 'role-card-selected bg-white dark:bg-[#1e2329]'
                                : 'border border-gray-200 dark:border-[#384150] bg-white dark:bg-[#1e2329] hover:border-[#FF4A1F]/50'
                                }`}
                        >
                            <input
                                type="radio"
                                name="accountType"
                                value="supplier"
                                checked={selectedType === 'supplier'}
                                onChange={() => setSelectedType('supplier')}
                                className="w-4 h-4 text-[#FF4A1F] accent-[#FF4A1F] border-gray-300 dark:border-slate-600 focus:ring-[#FF4A1F] cursor-pointer"
                            />
                            <div className="ml-4 flex items-center gap-3">
                                <div className={`p-2 rounded-md transition-colors ${selectedType === 'supplier' ? 'bg-[#FF4A1F]/15 dark:bg-[#FF4A1F]/20 text-[#FF4A1F]' : 'bg-gray-100 dark:bg-slate-800 text-gray-500 dark:text-slate-400'}`}>
                                    <Truck size={18} />
                                </div>
                                <div>
                                    <span className={`block text-sm font-semibold ${selectedType === 'supplier' ? 'text-[#FF4A1F] dark:text-[#FF4A1F]' : 'text-gray-900 dark:text-slate-100'}`}>Supplier</span>
                                    <span className={`block text-xs mt-0.5 ${selectedType === 'supplier' ? 'text-gray-700 dark:text-slate-300' : 'text-gray-500 dark:text-slate-400'}`}>I want to provide moving services</span>
                                </div>
                            </div>
                        </label>
                    </div>

                    <Button
                        type="button"
                        onClick={handleContinue}
                        disabled={!selectedType || isLoading}
                        isLoading={isLoading}
                        variant="primary"
                        className="w-full h-11 text-sm font-semibold bg-[#FF4A1F] hover:bg-[#E03E15] text-white rounded-md shadow-2xs flex items-center justify-center gap-2 cursor-pointer"
                    >
                        {selectedType === 'customer'
                            ? 'Continue as Customer'
                            : selectedType === 'supplier'
                                ? 'Continue as Supplier'
                                : 'Continue'}
                        {!isLoading && <ArrowRight size={18} />}
                    </Button>

                    <p className="mt-8 text-center text-sm text-gray-600 dark:text-slate-400">
                        Already have an account?{' '}
                        <Link to="/web/login" className="font-semibold text-[#FF4A1F] hover:underline transition-colors">
                            Log In
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
}
