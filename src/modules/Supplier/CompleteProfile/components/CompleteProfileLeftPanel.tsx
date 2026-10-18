import React from 'react';
import { ShieldCheck } from 'lucide-react';
import { Link } from 'react-router-dom';
import LogoBlack from '@/assets/Images/LogoBlack.png';
import LogoWhite from '@/assets/Images/Logo.png';

export function CompleteProfileLeftPanel() {
    return (
        <div className="hidden md:flex md:w-5/12 bg-[#f8fafc] flex-col items-center justify-center p-10 relative border-r border-gray-100">
            <div
                className="absolute inset-0 opacity-[0.4]"
                style={{
                    backgroundImage: 'radial-gradient(#cbd5e1 1px, transparent 1px)',
                    backgroundSize: '20px 20px',
                }}
            />
            <div className="relative z-10 flex flex-col items-center w-full text-center">
                <Link to="/" className="cursor-pointer hover:opacity-85 transition-opacity">
                    <img src={LogoBlack} alt="CarrierDirect Logo" className="w-full max-w-[260px] object-contain dark:hidden" />
                    <img src={LogoWhite} alt="CarrierDirect Logo" className="w-full max-w-[260px] object-contain hidden dark:block" />
                </Link>
                <h2 className="text-[15px] font-bold text-slate-800 mt-8 tracking-tight">Supplier Portal Setup</h2>
                <p className="mt-2 text-xs text-gray-500 leading-relaxed max-w-xs">
                    Complete your location and contact details to activate your supplier portal and receive carrier quote requests.
                </p>

                <div className="mt-8 inline-flex items-center gap-2 px-3 py-1.5 bg-orange-50 text-[#FF4A1F] border border-orange-100 rounded-full text-xs font-semibold">
                    <ShieldCheck className="w-4 h-4 text-[#FF4A1F]" />
                    <span>Step 2 of 2: Profile Activation</span>
                </div>
            </div>
        </div>
    );
}
export default CompleteProfileLeftPanel;
