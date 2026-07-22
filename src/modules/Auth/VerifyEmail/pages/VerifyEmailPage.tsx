import React, { useState, useEffect } from 'react';
import { CheckCircle2, AlertCircle, ArrowRight, RefreshCw, Mail, ArrowLeft } from 'lucide-react';
import { useNavigate, Link } from 'react-router-dom';
import Logo from '../../../../assets/Images/LogoBlack.png';

export default function VerifyEmailPage() {
    const navigate = useNavigate();
    const [status, setStatus] = useState<'verifying' | 'success' | 'error'>('verifying');

    useEffect(() => {
        // Simulate background verification process from email link token
        const timer = setTimeout(() => {
            setStatus('success');
        }, 1500);

        return () => clearTimeout(timer);
    }, []);

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
                        <h2 className="text-xl font-bold text-slate-800 mt-10 text-center tracking-tight">Email Verification</h2>
                        <p className="mt-3 text-sm text-gray-500 text-center leading-relaxed">
                            Confirming your account details to keep your portal secure and active.
                        </p>
                    </div>
                </div>

                {/* Right Side - Status Content */}
                <div className="w-full md:w-7/12 p-8 md:p-12 flex flex-col justify-center text-center">

                    {/* State 1: Verifying Spinner */}
                    {status === 'verifying' && (
                        <div className="py-6">
                            <div className="w-16 h-16 bg-orange-50 text-[#ff4a1f] rounded-full flex items-center justify-center mx-auto mb-5 border border-orange-100 animate-pulse">
                                <RefreshCw className="w-8 h-8 animate-spin" />
                            </div>
                            
                            <h2 className="text-2xl font-bold text-slate-800 mb-2 tracking-tight">
                                Verifying your email...
                            </h2>
                            
                            <p className="text-sm text-gray-500 leading-relaxed max-w-md mx-auto">
                                Please wait a moment while we validate your email verification link.
                            </p>
                        </div>
                    )}

                    {/* State 2: Verification Success */}
                    {status === 'success' && (
                        <div className="py-2">
                            <div className="w-16 h-16 bg-emerald-50 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-5 border border-emerald-100">
                                <CheckCircle2 className="w-8 h-8" />
                            </div>
                            
                            <h2 className="text-2xl font-bold text-slate-800 mb-2 tracking-tight">
                                Email Verified Successfully!
                            </h2>
                            
                            <p className="text-sm text-gray-500 mb-8 leading-relaxed max-w-md mx-auto">
                                Thank you for verifying your email address. Your account is now fully active and ready to use.
                            </p>

                            <button
                                onClick={() => navigate('/web/login')}
                                className="w-full h-[42px] flex items-center justify-center gap-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-bold text-white bg-[#FF4A1F] hover:bg-[#E03E15] transition-all cursor-pointer max-w-md mx-auto"
                            >
                                <span>Proceed to Login</span>
                                <ArrowRight className="w-4 h-4" />
                            </button>
                        </div>
                    )}

                    {/* State 3: Verification Error */}
                    {status === 'error' && (
                        <div className="py-2">
                            <div className="w-16 h-16 bg-red-50 text-red-500 rounded-full flex items-center justify-center mx-auto mb-5 border border-red-100">
                                <AlertCircle className="w-8 h-8" />
                            </div>
                            
                            <h2 className="text-2xl font-bold text-slate-800 mb-2 tracking-tight">
                                Link Expired or Invalid
                            </h2>
                            
                            <p className="text-sm text-gray-500 mb-8 leading-relaxed max-w-md mx-auto">
                                The verification link is invalid or has expired. Please request a new verification link.
                            </p>

                            <button
                                onClick={() => setStatus('verifying')}
                                className="w-full h-[42px] flex items-center justify-center gap-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-bold text-white bg-[#FF4A1F] hover:bg-[#E03E15] transition-all cursor-pointer max-w-md mx-auto"
                            >
                                <Mail className="w-4 h-4" />
                                <span>Resend Verification Link</span>
                            </button>
                        </div>
                    )}

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
