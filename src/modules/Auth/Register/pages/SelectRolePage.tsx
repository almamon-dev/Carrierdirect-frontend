import React, { useState } from 'react';
import { User, Truck, ArrowRight, ArrowLeft } from 'lucide-react';
import { useNavigate, Link } from 'react-router-dom';
import Logo from '../../../../assets/Images/LogoBlack.png';

export default function SelectRolePage() {
    const navigate = useNavigate();
    const [selectedType, setSelectedType] = useState<'customer' | 'supplier' | null>(null);

    const handleContinue = () => {
        if (selectedType) {
            navigate(`/web/register/${selectedType}`);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 relative p-4">
            {/* Top Left Back Button */}
            <div className="absolute top-6 left-6">
                <Link to="/" className="flex items-center text-sm font-medium text-[#FF4A1F] hover:text-[#D13915] transition-colors">
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Back to Home
                </Link>
            </div>

            {/* The Main Centered Card */}
            <div className="flex flex-col md:flex-row w-full max-w-4xl bg-white rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] overflow-hidden min-h-[500px]">

                {/* Left Side - Logo & Background */}
                <div className="md:w-1/2 bg-[#f8fafc] flex flex-col items-center justify-center p-12 relative border-r border-gray-100">
                    {/* Subtle dot pattern background */}
                    <div className="absolute inset-0 opacity-[0.4]" style={{ backgroundImage: 'radial-gradient(#cbd5e1 1px, transparent 1px)', backgroundSize: '20px 20px' }}></div>

                    <div className="relative z-10 flex flex-col items-center w-full">
                        <img src={Logo} alt="GetItMoving Logo" className="w-full max-w-[320px] md:max-w-[380px] object-contain scale-110" />
                    </div>
                </div>

                {/* Right Side - Form */}
                <div className="md:w-1/2 p-8 md:p-12 flex flex-col justify-center">
                    <div className="mb-8">
                        <h2 className="text-[15px] font-bold text-slate-800">
                            Create an Account
                        </h2>
                        <p className="mt-2 text-sm text-gray-500">
                            Select your account type to proceed
                        </p>
                    </div>

                    <div className="space-y-4 mb-8">
                        <label
                            className={`flex items-center p-4 border rounded-lg cursor-pointer transition-all ${selectedType === 'customer'
                                ? 'border-[#FF4A1F] bg-[#FFF0EC]/50 ring-1 ring-[#FF4A1F]'
                                : 'border-gray-200 hover:border-[#FF9F89] hover:bg-gray-50'
                                }`}
                        >
                            <input
                                type="radio"
                                name="accountType"
                                value="customer"
                                checked={selectedType === 'customer'}
                                onChange={() => setSelectedType('customer')}
                                className="w-4 h-4 text-[#FF4A1F] border-gray-300 focus:ring-[#FF4A1F]"
                            />
                            <div className="ml-4 flex items-center gap-3">
                                <div className={`p-2 rounded-sm transition-colors ${selectedType === 'customer' ? 'bg-[#FFF0EC] text-[#D13915]' : 'bg-gray-100 text-gray-500'}`}>
                                    <User size={18} />
                                </div>
                                <div>
                                    <span className={`block text-sm font-semibold ${selectedType === 'customer' ? 'text-[#9B250B]' : 'text-gray-900'}`}>Customer</span>
                                    <span className="block text-xs text-gray-500 mt-0.5">I want to request moving services</span>
                                </div>
                            </div>
                        </label>

                        <label
                            className={`flex items-center p-4 border rounded-lg cursor-pointer transition-all ${selectedType === 'supplier'
                                ? 'border-[#FF4A1F] bg-[#FFF0EC]/50 ring-1 ring-[#FF4A1F]'
                                : 'border-gray-200 hover:border-[#FF9F89] hover:bg-gray-50'
                                }`}
                        >
                            <input
                                type="radio"
                                name="accountType"
                                value="supplier"
                                checked={selectedType === 'supplier'}
                                onChange={() => setSelectedType('supplier')}
                                className="w-4 h-4 text-[#FF4A1F] border-gray-300 focus:ring-[#FF4A1F]"
                            />
                            <div className="ml-4 flex items-center gap-3">
                                <div className={`p-2 rounded-sm transition-colors ${selectedType === 'supplier' ? 'bg-[#FFF0EC] text-[#D13915]' : 'bg-gray-100 text-gray-500'}`}>
                                    <Truck size={18} />
                                </div>
                                <div>
                                    <span className={`block text-sm font-semibold ${selectedType === 'supplier' ? 'text-[#9B250B]' : 'text-gray-900'}`}>Supplier</span>
                                    <span className="block text-xs text-gray-500 mt-0.5">I want to provide moving services</span>
                                </div>
                            </div>
                        </label>
                    </div>

                    <button
                        onClick={handleContinue}
                        disabled={!selectedType}
                        className={`w-full flex items-center justify-center gap-2 px-4 py-3 rounded-sm text-sm font-semibold transition-all ${selectedType
                            ? 'bg-[#FF4A1F] text-white hover:bg-[#E03E15] shadow-sm'
                            : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                            }`}
                    >
                        {selectedType === 'customer'
                            ? 'Continue as Customer'
                            : selectedType === 'supplier'
                                ? 'Continue as Supplier'
                                : 'Continue'}
                        <ArrowRight size={18} />
                    </button>

                    <p className="mt-8 text-center text-sm text-gray-600">
                        Already have an account?{' '}
                        <Link to="/web/login" className="font-semibold text-[#FF4A1F] hover:text-[#D13915] transition-colors">
                            Log In
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
}
