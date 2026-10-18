import React from 'react';
import LogoBlack from '../../../../assets/Images/LogoBlack.png';
import LogoWhite from '../../../../assets/Images/Logo.png';

export const CustomerRegisterLeftBanner: React.FC = () => {
    return (
        <div className="hidden md:flex md:w-8/12 bg-[#f8fafc] flex-col items-center justify-center p-10 relative border-r border-gray-100">
            <div
                className="absolute inset-0 opacity-[0.4]"
                style={{ backgroundImage: 'radial-gradient(#cbd5e1 1px, transparent 1px)', backgroundSize: '20px 20px' }}
            />
            <div className="relative z-10 flex flex-col items-center w-full">
                <img src={LogoBlack} alt="GetItMoving Logo" className="w-full max-w-[400px] object-contain dark:hidden" />
                <img src={LogoWhite} alt="GetItMoving Logo" className="w-full max-w-[400px] object-contain hidden dark:block" />
                <h2 className="text-[15px] font-bold text-slate-800 mt-10 text-center tracking-tight">Customer Portal</h2>
                <p className="mt-3 text-sm text-gray-500 text-center leading-relaxed">
                    Find top-rated movers and request moving quotes instantly.
                </p>
            </div>
        </div>
    );
};
