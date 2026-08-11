import React, { useState, useEffect } from "react";
import { AllImages } from "@/components/AllPhotos/AllImages";
import { Link } from 'react-router-dom';
import { Shield, Check, Clock, Lock } from "lucide-react";

export default function HomeHero() {
  const [authState, setAuthState] = useState<{ isLoggedIn: boolean; userType: string | null }>({
    isLoggedIn: false,
    userType: null,
  });

  useEffect(() => {
    try {
      const token = localStorage.getItem('erp_access_token') || localStorage.getItem('token');
      const userStr = localStorage.getItem('erp_user_data') || localStorage.getItem('user');
      const user = userStr ? JSON.parse(userStr) : null;
      setAuthState({
        isLoggedIn: !!token,
        userType: user?.user_type || user?.role || null,
      });
    } catch {
      setAuthState({ isLoggedIn: false, userType: null });
    }
  }, []);

  const { isLoggedIn, userType } = authState;

  return (
    <section id="home" className="relative bg-[#0b0300] min-h-[640px] sm:min-h-[700px] lg:min-h-[760px] flex items-center overflow-hidden">
      
      {/* Background Image Container */}
      <div className="absolute inset-0 z-0">
        <img
          src={AllImages.Hero}
          alt="Freight Truck"
          className="w-full h-full object-cover object-right sm:object-center transition-all duration-300 dark:brightness-[0.75] dark:contrast-[1.1]"
        />
        
        {/* Soft Dark Gradient on Left Only (For Text Legibility) */}
        <div className="absolute inset-0 z-1 bg-gradient-to-r from-[#0b0300]/90 dark:from-[#060200]/98 via-[#0b0300]/40 dark:via-[#060200]/75 to-transparent w-full md:w-1/2 pointer-events-none" />

        {/* Fine Dark Grid Pattern */}
        <div 
          className="absolute inset-0 z-10 opacity-25 pointer-events-none"
          style={{
            backgroundImage: `linear-gradient(to right, rgba(255, 255, 255, 0.15) 1px, transparent 1px), linear-gradient(to bottom, rgba(255, 255, 255, 0.15) 1px, transparent 1px)`,
            backgroundSize: `40px 40px`,
          }}
        />

        {/* Subtle Bottom Blend Gradient */}
        <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-[#0b0300] dark:from-[#12161c] to-transparent z-20 pointer-events-none" />
      </div>

      {/* Hero Content Container */}
      <div className="relative z-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-36 pb-20 w-full">
        <div className="max-w-xl lg:max-w-2xl">
          
          {/* Main Headline - Matches Screenshot Typography Exactly */}
          <h1 className="text-white text-3xl sm:text-4xl lg:text-4xl xl:text-5xl font-bold tracking-tight leading-[1.1] mb-5">
            The Smarter Way to{" "}
            <span className="text-[#ff4a1f] inline sm:inline">Ship</span>
            <br />
            <span className="text-[#ff4a1f] inline sm:inline">Freight</span>
          </h1>

          {/* Subtitle */}
          <p className="text-white/80 text-sm sm:text-base leading-relaxed mb-8 max-w-md font-normal">
            Connect with verified carriers, get real-time quotes, track shipments, and manage everything in one place.
          </p>

          {/* Action Buttons: Create a Quote & Become a Supplier */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 mb-14">
            {isLoggedIn ? (
              <Link to={userType === "supplier" ? "/supplier/dashboard" : "/customer/dashboard"}>
                <button className="h-11 px-6 rounded-md bg-[#ff4a1f] hover:bg-[#e63d15] text-white font-bold text-sm shadow-md shadow-[#ff4a1f]/30 hover:scale-[1.02] active:scale-95 transition-all duration-200 cursor-pointer">
                  {userType === "supplier" ? "See Quote Requests" : "My Quotes"}
                </button>
              </Link>
            ) : (
              <>
                <Link to="/web/register" className="w-full sm:w-auto">
                  <button className="w-full sm:w-auto h-11 px-6 rounded-md bg-[#ff4a1f] hover:bg-[#e63d15] text-white font-bold text-sm shadow-md shadow-[#ff4a1f]/30 hover:scale-[1.02] active:scale-95 transition-all duration-200 cursor-pointer">
                    Create a Quote
                  </button>
                </Link>
                <Link to="/web/register" className="w-full sm:w-auto">
                  <button className="w-full sm:w-auto h-11 px-6 rounded-md border border-white/30 bg-white/5 text-white font-bold text-sm hover:bg-white/10 hover:border-white/60 active:scale-95 transition-all duration-200 cursor-pointer">
                    Become a Supplier
                  </button>
                </Link>
              </>
            )}
          </div>

          {/* Bottom Badges Bar - Matches Screenshot Icons & Separators */}
          <div className="flex flex-wrap items-center gap-x-3 gap-y-2 text-white/70 text-xs font-medium pt-2">
            <div className="flex items-center gap-1.5">
              <Shield className="w-3.5 h-3.5 text-white/70" />
              <span>Verified Carriers</span>
            </div>
            <span className="text-white/30">|</span>
            <div className="flex items-center gap-1.5">
              <Check className="w-3.5 h-3.5 text-white/70" />
              <span>FMCSA Compliant</span>
            </div>
            <span className="text-white/30">|</span>
            <div className="flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-white/70" />
              <span>Real-time Tracking</span>
            </div>
            <span className="text-white/30">|</span>
            <div className="flex items-center gap-1.5">
              <Lock className="w-3.5 h-3.5 text-white/70" />
              <span>Secure Payments</span>
            </div>
          </div>

        </div>
      </div>

    </section>
  );
}
