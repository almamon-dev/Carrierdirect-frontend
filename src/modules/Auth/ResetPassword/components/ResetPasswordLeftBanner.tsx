import React from 'react';
import { Link } from 'react-router-dom';
import LogoBlack from '../../../../assets/Images/LogoBlack.png';
import LogoWhite from '../../../../assets/Images/Logo.png';

export const ResetPasswordLeftBanner: React.FC = () => {
    return (
        <div className="hidden md:flex md:w-5/12 bg-[#f8fafc] flex-col items-center justify-center p-10 relative border-r border-gray-100">
            <div
                className="absolute inset-0 opacity-[0.4]"
                style={{ backgroundImage: 'radial-gradient(#cbd5e1 1px, transparent 1px)', backgroundSize: '20px 20px' }}
            />
            <div className="relative z-10 flex flex-col items-center w-full">
                <Link to="/">
                    <img src={LogoBlack} alt="CarrierDirect Logo" className="w-full max-w-[240px] object-contain dark:hidden" />
                    <img src={LogoWhite} alt="CarrierDirect Logo" className="w-full max-w-[240px] object-contain hidden dark:block" />
                </Link>
                <h2 className="text-xl font-bold text-slate-800 mt-8 text-center tracking-tight">Create New Password</h2>
                <p className="mt-2 text-sm text-gray-500 text-center leading-relaxed">
                    Your security is our priority. Set a strong password for your account.
                </p>
            </div>
        </div>
    );
};
