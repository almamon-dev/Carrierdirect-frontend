import React, { useState } from 'react';
import { Mail, ArrowLeft, CheckCircle2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import Logo from '../../../../assets/Images/LogoBlack.png';
import Input from '../../../../components/ui/input';

export default function ForgotPasswordPage() {
    const [email, setEmail] = useState('');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [isSubmitted, setIsSubmitted] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        
        if (!email.trim()) {
            setError('Email Address is required');
            return;
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
            setError('Please enter a valid email address');
            return;
        }

        setError('');
        setIsLoading(true);

        try {
            // Simulate API call to send reset email link
            await new Promise((resolve) => setTimeout(resolve, 800));
            setIsSubmitted(true);
        } catch (err) {
            console.error(err);
            setError('Failed to send reset link. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50/50 relative p-4 sm:p-6">
            {/* Top-Left Screen Corner Link */}
            <Link 
                to="/web/login" 
                className="absolute top-5 left-5 sm:top-8 sm:left-8 z-30 inline-flex items-center gap-1.5 text-xs sm:text-sm font-semibold text-[#ff4a1f] hover:underline transition-colors"
            >
                <ArrowLeft className="w-4 h-4 text-[#ff4a1f]" />
                Back to Login
            </Link>

            {/* Main Card Container */}
            <div className="flex flex-col md:flex-row w-full max-w-4xl bg-white rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.06)] overflow-hidden min-h-[520px]">

                {/* Left Side - Logo & Background */}
                <div className="hidden md:flex md:w-5/12 bg-[#f8fafc] flex-col items-center justify-center p-10 relative border-r border-gray-100">
                    <div className="absolute inset-0 opacity-[0.4]" style={{ backgroundImage: 'radial-gradient(#cbd5e1 1px, transparent 1px)', backgroundSize: '20px 20px' }}></div>
                    <div className="relative z-10 flex flex-col items-center w-full">
                        <Link to="/">
                            <img src={Logo} alt="GetItMoving Logo" className="w-full max-w-[240px] object-contain" />
                        </Link>
                        <h2 className="text-xl font-bold text-slate-800 mt-8 text-center tracking-tight">Password Recovery</h2>
                        <p className="mt-2 text-sm text-gray-500 text-center leading-relaxed">
                            Don't worry! It happens. We'll help you get back to your account safely.
                        </p>
                    </div>
                </div>

                {/* Right Side - Form / State Content */}
                <div className="w-full md:w-7/12 p-8 md:p-12 flex flex-col justify-center">
                    
                    {!isSubmitted ? (
                        <>
                            <div className="mb-6">
                                <h2 className="text-2xl font-bold text-slate-800">
                                    Forgot your password?
                                </h2>
                                <p className="mt-1.5 text-sm text-gray-500 leading-relaxed">
                                    Enter your registered email address and we'll send you a link to reset your password.
                                </p>
                            </div>

                            <form onSubmit={handleSubmit} className="space-y-5">
                                <div>
                                    <label className="block text-[13px] font-bold text-gray-700 mb-1">
                                        Email Address <span className="text-red-500">*</span>
                                    </label>
                                    <Input
                                        type="email"
                                        icon={<Mail className="h-4 w-4 text-gray-400" />}
                                        placeholder="you@example.com"
                                        value={email}
                                        onChange={(e) => {
                                            setEmail(e.target.value);
                                            if (error) setError('');
                                        }}
                                        error={error}
                                    />
                                </div>

                                <button
                                    type="submit"
                                    disabled={isLoading}
                                    className="w-full h-[42px] flex items-center justify-center px-4 border border-transparent rounded-md shadow-sm text-sm font-bold text-white bg-[#FF4A1F] hover:bg-[#E03E15] focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed transition-all cursor-pointer"
                                >
                                    {isLoading ? 'Sending Reset Link...' : 'Send Reset Link'}
                                </button>
                            </form>
                        </>
                    ) : (
                        <div className="text-center py-4">
                            <div className="w-14 h-14 bg-emerald-50 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-4 border border-emerald-100">
                                <CheckCircle2 className="w-8 h-8" />
                            </div>
                            <h2 className="text-2xl font-bold text-slate-800 mb-2">
                                Check Your Email
                            </h2>
                            <p className="text-sm text-gray-500 mb-6 leading-relaxed max-w-md mx-auto">
                                We've sent a password reset link to <span className="font-bold text-slate-800">{email}</span>. Please check your inbox and follow the link.
                            </p>
                            
                            <div className="p-4 bg-orange-50/60 border border-orange-100 rounded-md text-xs text-gray-600 mb-6 text-left">
                                <p className="font-bold text-slate-800 mb-1">Didn't receive the email?</p>
                                <p>Check your spam/junk folder or request a new reset link.</p>
                            </div>

                            <div className="flex flex-col sm:flex-row gap-3 justify-center">
                                <button
                                    onClick={() => setIsSubmitted(false)}
                                    className="px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded-md text-xs font-bold hover:bg-gray-50 transition-colors cursor-pointer"
                                >
                                    Resend Link
                                </button>
                                <Link
                                    to="/web/login"
                                    className="px-6 py-2 bg-[#FF4A1F] text-white rounded-md text-xs font-bold hover:bg-[#E03E15] transition-colors inline-block text-center"
                                >
                                    Back to Login
                                </Link>
                            </div>
                        </div>
                    )}

                    <div className="mt-8 pt-6 border-t border-gray-100 text-center">
                        <p className="text-sm text-gray-600">
                            Remembered your password?{' '}
                            <Link to="/web/login" className="font-semibold text-[#FF4A1F] hover:text-[#D13915] transition-colors">
                                Log In
                            </Link>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
