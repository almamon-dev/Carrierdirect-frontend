import React, { useState, useEffect } from "react";
import { useNavigate, useSearchParams, Link } from "react-router-dom";
import { CheckCircle2, AlertCircle, ArrowRight, RefreshCw, Lock, Mail, Users, ArrowLeft, Copy, Check } from "lucide-react";
import LogoBlack from "../../../../assets/Images/LogoBlack.png";
import LogoWhite from "../../../../assets/Images/Logo.png";
import Button from "../../../../components/ui/button";
import apiClient from "../../../../lib/axios";
import { TOKEN_CONFIG } from "../../../../config/auth";
import { getRoleDashboardUrl } from "../../../../utils/roleDashboard";

export default function InvitationAcceptedPage() {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const token = searchParams.get("token") || searchParams.get("invitation_token") || "";
    const emailParam = searchParams.get("email") || "";
    const passwordParam = searchParams.get("password") || searchParams.get("temp_pass") || searchParams.get("pass") || "";

    const [status, setStatus] = useState<"verifying" | "success" | "error">("verifying");
    const [userData, setUserData] = useState<any>(null);
    const [errorMessage, setErrorMessage] = useState<string>("");
    const [isNavigating, setIsNavigating] = useState<boolean>(false);
    const [copied, setCopied] = useState<boolean>(false);

    useEffect(() => {
        if (!token) {
            if (emailParam) {
                setStatus("success");
            } else {
                setStatus("error");
                setErrorMessage("No invitation token provided. Please check your invitation email.");
            }
            return;
        }

        const acceptInvite = async () => {
            try {
                const response = await apiClient.post("/auth/accept-invitation", { token });
                const resData = response.data?.data || response.data;
                
                if (resData?.user) {
                    setUserData(resData.user);
                }

                // If backend returned auth token, save session
                if (response.data?.token || resData?.token) {
                    const authToken = response.data?.token || resData?.token;
                    localStorage.setItem(TOKEN_CONFIG.accessTokenKey, authToken);
                    if (resData?.user) {
                        localStorage.setItem(TOKEN_CONFIG.userKey, JSON.stringify(resData.user));
                    }
                }

                setStatus("success");
            } catch (err: any) {
                console.error("Accept invitation error:", err);
                const msg = err.response?.data?.message || err.response?.data?.error || err.message;
                
                if (msg && (msg.toLowerCase().includes("already accepted") || msg.toLowerCase().includes("active"))) {
                    setStatus("success");
                } else {
                    setStatus("error");
                    setErrorMessage(msg || "This invitation link is invalid or has expired.");
                }
            }
        };

        acceptInvite();
    }, [token, emailParam]);

    const handleContinue = () => {
        setIsNavigating(true);
        const storedUser = localStorage.getItem(TOKEN_CONFIG.userKey);
        const storedToken = localStorage.getItem(TOKEN_CONFIG.accessTokenKey);

        if (storedToken && storedUser) {
            try {
                const user = JSON.parse(storedUser);
                navigate(getRoleDashboardUrl(user));
                return;
            } catch {
                // fall through
            }
        }

        const queryParams = new URLSearchParams();
        if (emailParam || userData?.email) queryParams.set("email", emailParam || userData?.email);
        if (passwordParam) queryParams.set("password", passwordParam);
        navigate(`/web/login?${queryParams.toString()}`);
    };

    const handleCopyPassword = () => {
        if (!passwordParam) return;
        navigator.clipboard.writeText(passwordParam);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
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

            {/* The Main Centered Split Card */}
            <div className="main-auth-card flex flex-col md:flex-row w-full max-w-4xl bg-white dark:bg-[#181a20] rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] dark:shadow-none border-2 border-gray-200 dark:border-[#384150] overflow-hidden min-h-[460px]">

                {/* Left Side - Logo & Branding */}
                <div className="hidden md:flex md:w-1/2 bg-[#f8fafc] dark:bg-[#12161c] flex-col items-center justify-center p-8 md:p-10 relative border-r border-gray-100 dark:border-[#384150]">
                    <div className="absolute inset-0 opacity-[0.4] dark:opacity-[0.1]" style={{ backgroundImage: 'radial-gradient(#cbd5e1 1px, transparent 1px)', backgroundSize: '20px 20px' }}></div>

                    <div className="relative z-10 flex flex-col items-center w-full">
                        <Link to="/">
                            <img src={LogoBlack} alt="CarrierDirect Logo" className="w-full max-w-[240px] md:max-w-[280px] object-contain scale-105 dark:hidden" />
                            <img src={LogoWhite} alt="CarrierDirect Logo" className="w-full max-w-[240px] md:max-w-[280px] object-contain scale-105 hidden dark:block" />
                        </Link>
                        <h2 className="text-[15px] font-bold text-slate-800 dark:text-white mt-8 text-center tracking-tight">Team Onboarding</h2>
                        <p className="mt-2 text-xs text-gray-500 dark:text-slate-400 text-center leading-relaxed max-w-xs">
                            Welcome to CarrierDirect. Your workspace is configured and ready for action.
                        </p>
                    </div>
                </div>

                {/* Right Side - Status Content */}
                <div className="w-full md:w-1/2 p-6 sm:p-8 md:p-10 flex flex-col justify-center text-center bg-white dark:bg-[#181a20]">

                    {/* State 1: Verifying */}
                    {status === "verifying" && (
                        <div className="py-4 animate-in fade-in">
                            <div className="w-12 h-12 bg-orange-50 dark:bg-[#ff4a1f]/10 text-[#ff4a1f] rounded-full flex items-center justify-center mx-auto mb-4 border border-orange-100 dark:border-[#ff4a1f]/20 animate-pulse">
                                <RefreshCw className="w-6 h-6 animate-spin" />
                            </div>
                            
                            <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-1.5 tracking-tight">
                                Activating Your Invitation...
                            </h2>
                            
                            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed max-w-sm mx-auto">
                                Please wait a moment while we verify your invitation token and activate your team account.
                            </p>
                        </div>
                    )}

                    {/* State 2: Invitation Accepted Successfully */}
                    {status === "success" && (
                        <div className="py-2 animate-in fade-in">
                            <div className="w-12 h-12 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 rounded-full flex items-center justify-center mx-auto mb-3.5 border border-emerald-100 dark:border-emerald-800/40 shadow-2xs">
                                <CheckCircle2 className="w-6 h-6" />
                            </div>
                            
                            <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-1 tracking-tight">
                                Welcome to the Team! 🎉
                            </h2>
                            
                            <p className="text-xs text-slate-500 dark:text-slate-400 mb-4 leading-relaxed max-w-sm mx-auto">
                                Your invitation has been successfully accepted. Your account is now active and ready to use.
                            </p>

                            {/* Credentials Reminder Box */}
                            {(emailParam || passwordParam) && (
                                <div className="mb-4 p-3 bg-slate-50 dark:bg-slate-900/60 rounded-[4px] border border-slate-200 dark:border-slate-800 max-w-sm mx-auto text-left text-xs space-y-2">
                                    <div className="text-[10.5px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
                                        Your Login Credentials
                                    </div>
                                    
                                    {emailParam && (
                                        <div className="flex items-center justify-between py-0.5 text-xs">
                                            <span className="text-slate-500 dark:text-slate-400 font-medium">Email:</span>
                                            <span className="font-semibold text-slate-800 dark:text-slate-200">{emailParam}</span>
                                        </div>
                                    )}

                                    {passwordParam && (
                                        <div className="flex items-center justify-between py-1 border-t border-slate-200/60 dark:border-slate-800 pt-1.5 text-xs">
                                            <span className="text-slate-500 dark:text-slate-400 font-medium">Password:</span>
                                            <div className="flex items-center gap-1.5">
                                                <code className="px-2 py-0.5 rounded-[3px] bg-white dark:bg-[#1e2329] border border-slate-200 dark:border-slate-700 font-mono font-bold text-xs text-slate-800 dark:text-slate-100">
                                                    {passwordParam}
                                                </code>
                                                <button
                                                    type="button"
                                                    onClick={handleCopyPassword}
                                                    className="p-1 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 cursor-pointer"
                                                    title="Copy Password"
                                                >
                                                    {copied ? <Check size={14} className="text-emerald-500" /> : <Copy size={14} />}
                                                </button>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            )}

                            <div className="space-y-2.5 max-w-sm mx-auto w-full">
                                <Button
                                    onClick={handleContinue}
                                    isLoading={isNavigating}
                                    disabled={isNavigating}
                                    variant="primary"
                                    className="w-full h-10 text-xs font-bold text-white bg-[#ff4a1f] hover:bg-[#e03e15] rounded-[4px] shadow-2xs flex items-center justify-center gap-2 cursor-pointer"
                                >
                                    <span>Continue to Dashboard / Sign In</span>
                                    {!isNavigating && <ArrowRight className="w-4 h-4" />}
                                </Button>

                                <Link
                                    to="/"
                                    className="w-full h-10 flex items-center justify-center gap-2 px-4 border border-slate-200 dark:border-slate-700 rounded-[4px] text-xs font-semibold text-slate-700 dark:text-slate-300 bg-white dark:bg-[#1e2329] hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors shadow-2xs cursor-pointer"
                                >
                                    <span>Return to Home</span>
                                </Link>
                            </div>
                        </div>
                    )}

                    {/* State 3: Error */}
                    {status === "error" && (
                        <div className="py-2 animate-in fade-in">
                            <div className="w-12 h-12 bg-red-50 dark:bg-red-950/40 text-red-500 rounded-full flex items-center justify-center mx-auto mb-3.5 border border-red-100 dark:border-red-800/40">
                                <AlertCircle className="w-6 h-6" />
                            </div>
                            
                            <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-1.5 tracking-tight">
                                Invalid or Expired Invitation
                            </h2>
                            
                            <p className="text-xs text-slate-500 dark:text-slate-400 mb-5 leading-relaxed max-w-sm mx-auto">
                                {errorMessage || "This invitation token is invalid or has already been used."}
                            </p>

                            <div className="space-y-2.5 max-w-sm mx-auto w-full">
                                <Link
                                    to="/web/login"
                                    className="w-full h-10 text-xs font-bold text-white bg-[#ff4a1f] hover:bg-[#e03e15] rounded-[4px] shadow-2xs flex items-center justify-center gap-2 cursor-pointer"
                                >
                                    <span>Proceed to Login</span>
                                    <ArrowRight className="w-4 h-4" />
                                </Link>

                                <Link
                                    to="/contact-us"
                                    className="w-full h-10 flex items-center justify-center gap-2 px-4 border border-slate-200 dark:border-slate-700 rounded-[4px] text-xs font-semibold text-slate-700 dark:text-slate-300 bg-white dark:bg-[#1e2329] hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors shadow-2xs cursor-pointer"
                                >
                                    <span>Contact Support</span>
                                </Link>
                            </div>
                        </div>
                    )}

                </div>
            </div>
        </div>
    );
}
