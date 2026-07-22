import React from 'react';
import { Clock, ArrowRight, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';
import Logo from '../../../../assets/Images/LogoBlack.png';

export default function SessionExpiredPage() {
    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50/50 relative p-4 sm:p-6">
            
            {/* Top-Left Screen Corner Link */}
            <Link 
                to="/" 
                className="absolute top-5 left-5 sm:top-8 sm:left-8 z-30 inline-flex items-center gap-1.5 text-xs sm:text-sm font-semibold text-[#ff4a1f] hover:underline transition-colors"
            >
                <ArrowLeft className="w-4 h-4 text-[#ff4a1f]" />
                Back to Home
            </Link>

            {/* Main Card Container */}
            <div className="flex flex-col md:flex-row w-full max-w-5xl bg-white rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.06)] overflow-hidden min-h-[560px]">

                {/* Left Side - Logo & Background */}
                <div className="hidden md:flex md:w-5/12 bg-[#f8fafc] flex-col items-center justify-center p-10 relative border-r border-gray-100">
                    <div className="absolute inset-0 opacity-[0.4]" style={{ backgroundImage: 'radial-gradient(#cbd5e1 1px, transparent 1px)', backgroundSize: '20px 20px' }}></div>
                    <div className="relative z-10 flex flex-col items-center w-full">
                        <Link to="/">
                            <img src={Logo} alt="GetItMoving Logo" className="w-full max-w-[280px] object-contain" />
                        </Link>
                        <h2 className="text-xl font-bold text-slate-800 mt-10 text-center tracking-tight">Security Timeout</h2>
                        <p className="mt-3 text-sm text-gray-500 text-center leading-relaxed">
                            Protecting your account by logging out after extended periods of inactivity.
                        </p>
                    </div>
                </div>

                {/* Right Side - Session Expired Content */}
                <div className="w-full md:w-7/12 p-8 md:p-12 flex flex-col justify-center text-center">

                    <div className="mb-6">
                        <div className="w-16 h-16 bg-orange-50 text-[#ff4a1f] rounded-full flex items-center justify-center mx-auto mb-5 border border-orange-100">
                            <Clock className="w-8 h-8" />
                        </div>
                        
                        <h2 className="text-2xl font-bold text-slate-800 mb-2 tracking-tight">
                            Session Expired
                        </h2>
                        
                        <p className="text-sm text-gray-500 leading-relaxed max-w-md mx-auto">
                            For your security, you have been automatically logged out due to inactivity. Please log in again to continue managing your shipments and quotes.
                        </p>
                    </div>

                    <div className="pt-2">
                        <Link
                            to="/web/login"
                            className="w-full h-[42px] flex items-center justify-center gap-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-bold text-white bg-[#FF4A1F] hover:bg-[#E03E15] transition-all cursor-pointer max-w-md mx-auto"
                        >
                            <span>Log In Again</span>
                            <ArrowRight className="w-4 h-4" />
                        </Link>
                    </div>

                    <div className="mt-8 pt-6 border-t border-gray-100">
                        <Link to="/" className="inline-flex items-center gap-1.5 text-xs font-bold text-[#FF4A1F] hover:underline transition-colors">
                            <span>&larr; Return to Home Page</span>
                        </Link>
                    </div>

                </div>
            </div>
        </div>
    );
}
