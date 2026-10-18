import React from 'react';
import { Link } from 'react-router-dom';
import LogoBlack from '../../../../assets/Images/LogoBlack.png';
import LogoWhite from '../../../../assets/Images/Logo.png';

export const LoginLeftBanner: React.FC = () => {
    return (
        <div className="hidden md:flex md:w-1/2 bg-[#f8fafc] dark:bg-[#12161c] flex-col items-center justify-center p-12 relative border-r border-gray-100 dark:border-[#384150]">
            <div
                className="absolute inset-0 opacity-[0.4] dark:opacity-[0.1]"
                style={{ backgroundImage: 'radial-gradient(#cbd5e1 1px, transparent 1px)', backgroundSize: '20px 20px' }}
            />

            <div className="relative z-10 flex flex-col items-center w-full">
                <Link to="/">
                    <img src={LogoBlack} alt="CarrierDirect Logo" className="w-full max-w-[300px] md:max-w-[340px] object-contain scale-110 dark:hidden" />
                    <img src={LogoWhite} alt="CarrierDirect Logo" className="w-full max-w-[300px] md:max-w-[340px] object-contain scale-110 hidden dark:block" />
                </Link>
                <h2 className="text-[15px] font-bold text-slate-800 dark:text-white mt-10 text-center tracking-tight">Direct Carrier Marketplace</h2>
                <p className="mt-3 text-sm text-gray-500 dark:text-slate-400 text-center leading-relaxed max-w-xs">
                    Connecting shippers and verified carriers directly with real-time tracking.
                </p>
            </div>
        </div>
    );
};
