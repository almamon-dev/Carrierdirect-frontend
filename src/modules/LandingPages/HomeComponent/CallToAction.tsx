import React, { useState, useEffect } from "react";
import CallToActionImg from "@/assets/Images/CallToActionImg.png";
import { Link } from "react-router-dom";
import useScrollReveal from "@/Hooks/useScrollReveal";

export default function CallToAction() {
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
  const reveal = useScrollReveal();

  return (
    <section className="w-full px-4 pt-12 pb-4 bg-transparent">
      <div 
        ref={reveal.ref}
        className={`relative mx-auto max-w-7xl overflow-hidden rounded-2xl bg-[#0f0400] shadow-md reveal ${reveal.isVisible ? "visible" : ""}`}
      >
        <div 
          className="absolute inset-0 bg-cover bg-center opacity-10 mix-blend-luminosity scale-105"
          style={{ backgroundImage: `url(${CallToActionImg})` }}
        />
        
        <div className="absolute inset-0 bg-gradient-to-r from-[#0f0400] via-[#0f0400]/90 to-[#ff4a1f]/10" />

        <div className="absolute top-0 right-0 w-[200px] h-[200px] bg-[#ff4a1f] rounded-full mix-blend-screen filter blur-[100px] opacity-30 translate-x-1/2 -translate-y-1/2" />

        <div className="relative z-10 flex flex-col md:flex-row items-center justify-between px-8 py-10 md:px-12 md:py-12 gap-6">

          <div className="flex-1 text-center md:text-left">
            <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full bg-white/10 border border-white/10 mb-3">
              <span className="w-1.5 h-1.5 rounded-full bg-[#ff4a1f] animate-pulse"></span>
              <span className="text-white/80 text-[10px] font-bold tracking-wider uppercase">Start Shipping Today</span>
            </div>

            <h2 className="text-white font-bold text-2xl sm:text-3xl tracking-tight mb-2 drop-shadow-sm">
              Ready to Ship Smarter?
            </h2>
            <p className="text-gray-400 text-sm max-w-md mx-auto md:mx-0">
              Join thousands of shippers and carriers automating their logistics and increasing margins.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto shrink-0">
            {isLoggedIn ? (
              <Link to={userType === "supplier" ? "/supplier/dashboard" : "/customer/dashboard"}>
                <button className="w-full sm:w-auto h-10 px-6 rounded-sm bg-[#ff4a1f] text-white font-bold text-xs hover:bg-[#e63d15] hover:shadow-md transition-all duration-200">
                  {userType === "supplier" ? "See Quote Requests" : "My Quotes"}
                </button>
              </Link>
            ) : (
              <>
                <Link to="/web/register">
                  <button className="w-full sm:w-auto h-10 px-6 rounded-sm bg-[#ff4a1f] text-[#ffffff] font-bold text-xs hover:bg-[#e63d15] hover:shadow-md transition-all duration-200 whitespace-nowrap">
                    Create Free Account
                  </button>
                </Link>
                <Link to="/web/register">
                  <button className="w-full sm:w-auto h-10 px-6 rounded-sm border border-white/20 bg-white/5 text-white font-bold text-xs hover:bg-white/10 hover:border-white/40 transition-all duration-200 whitespace-nowrap">
                    Become a Carrier
                  </button>
                </Link>
              </>
            )}
          </div>

        </div>
      </div>
    </section>
  );
}
