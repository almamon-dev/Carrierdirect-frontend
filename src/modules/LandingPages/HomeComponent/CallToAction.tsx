import React, { useState, useEffect } from "react";
import CallToActionImg from "@/assets/Images/CallToActionImg.png";
import { AllImages } from "@/components/AllPhotos/AllImages";
import { useNavigate } from "react-router-dom";
import useScrollReveal from "@/Hooks/useScrollReveal";
import { TOKEN_CONFIG } from "@/config/auth";
import { getRoleDashboardUrl, getUserEffectiveRole } from "@/utils/roleDashboard";
import { useLandingSettings } from "../components/useLandingSettings";
import { useLandingCMS } from "../components/useLandingCMS";
import Button from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

export default function CallToAction() {
  const navigate = useNavigate();
  const landingSettings = useLandingSettings();
  const { getSection, isSectionEnabled } = useLandingCMS();
  const cmsCta = getSection("cta");

  const [loadingAction, setLoadingAction] = useState<string | null>(null);

  const [authState, setAuthState] = useState<{ isLoggedIn: boolean; userType: string | null; user: any | null }>({
    isLoggedIn: false,
    userType: null,
    user: null,
  });

  useEffect(() => {
    try {
      const token = localStorage.getItem(TOKEN_CONFIG.accessTokenKey) || localStorage.getItem('carrierdirect_access_token') || localStorage.getItem('token');
      const userStr = localStorage.getItem(TOKEN_CONFIG.userKey) || localStorage.getItem('carrierdirect_user_data') || localStorage.getItem('user');
      const user = userStr ? JSON.parse(userStr) : null;
      setAuthState({
        isLoggedIn: !!token,
        userType: user?.user_type || user?.role || null,
        user,
      });
    } catch {
      setAuthState({ isLoggedIn: false, userType: null, user: null });
    }
  }, []);

  if (!isSectionEnabled("cta")) {
    return null;
  }

  const { isLoggedIn } = authState;
  const reveal = useScrollReveal();

  const ctaTitle = cmsCta?.title || landingSettings.cta_title || "Ready to Modernize Your Transport Operations?";
  const ctaSubtitle = cmsCta?.subtitle || landingSettings.cta_subtitle || "Join hundreds of shippers, carriers and transport operators using CarrierDirect.";
  const ctaBadge = cmsCta?.badge || "Get Started";

  const primaryBtnText = cmsCta?.content?.btn_text || landingSettings.cta_btn_text || "Book a Demo";
  const primaryBtnLink = cmsCta?.content?.btn_link || "/contact";

  const secondaryBtnText = cmsCta?.content?.secondary_btn_text || "Contact Sales";
  const secondaryBtnLink = cmsCta?.content?.secondary_btn_link || "/contact";

  const ctaBgImage = (cmsCta?.content?.bg_image && typeof cmsCta.content.bg_image === "string" && cmsCta.content.bg_image.trim() !== "")
    ? cmsCta.content.bg_image.trim()
    : (AllImages.white_freight_truck || CallToActionImg);

  const handleActionClick = (e: React.MouseEvent, href: string | undefined | null, btnKey: string) => {
    e.preventDefault();
    if (!href || href.trim() === "" || href === "#") {
      return;
    }
    setLoadingAction(btnKey);
    const trimmed = href.trim();
    if (trimmed.startsWith("http://") || trimmed.startsWith("https://")) {
      try {
        const url = new URL(trimmed);
        if (url.origin === window.location.origin) {
          setTimeout(() => {
            navigate(url.pathname + url.search + url.hash);
            setLoadingAction(null);
          }, 300);
          return;
        } else {
          setTimeout(() => {
            window.open(trimmed, "_blank", "noopener,noreferrer");
            setLoadingAction(null);
          }, 300);
          return;
        }
      } catch {
        window.open(trimmed, "_blank", "noopener,noreferrer");
        setLoadingAction(null);
        return;
      }
    }
    setTimeout(() => {
      navigate(trimmed);
      setLoadingAction(null);
    }, 300);
  };

  const handleDashboardClick = () => {
    setLoadingAction("dashboard");
    setTimeout(() => {
      navigate(getRoleDashboardUrl(authState.user));
      setLoadingAction(null);
    }, 300);
  };

  return (
    <section className="w-full px-4 pt-8 pb-3 bg-transparent">
      <div 
        ref={reveal.ref}
        className={`relative mx-auto max-w-7xl overflow-hidden rounded-xl bg-[#0f0400] shadow-md reveal ${reveal.isVisible ? "visible" : ""}`}
      >
        <div 
          className="absolute inset-0 bg-cover bg-center opacity-10 mix-blend-luminosity scale-105"
          style={{ backgroundImage: `url(${ctaBgImage})` }}
        />
        
        <div className="absolute inset-0 bg-gradient-to-r from-[#0f0400] via-[#0f0400]/90 to-[#ff4a1f]/10" />

        <div className="absolute top-0 right-0 w-[200px] h-[200px] bg-[#ff4a1f] rounded-full mix-blend-screen filter blur-[100px] opacity-30 translate-x-1/2 -translate-y-1/2" />

        <div className="relative z-10 flex flex-col md:flex-row items-center justify-between px-6 py-6 md:px-8 md:py-7 gap-4">

          <div className="flex-1 text-center md:text-left">
            <div className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-white/10 border border-white/10 mb-2">
              <span className="w-1.5 h-1.5 rounded-full bg-[#ff4a1f] animate-pulse"></span>
              <span className="text-white/80 text-[10px] font-bold tracking-wider ">{ctaBadge}</span>
            </div>

            <h2 className="text-white font-extrabold text-xl sm:text-2xl tracking-tight mb-1.5 drop-shadow-sm">
              {ctaTitle}
            </h2>
            <p className="text-gray-400 text-xs sm:text-sm max-w-md mx-auto md:mx-0">
              {ctaSubtitle}
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-2.5 w-full sm:w-auto shrink-0">
            {isLoggedIn ? (
              <Button 
                variant="default"
                isLoading={loadingAction === "dashboard"}
                onClick={handleDashboardClick}
                className="w-full sm:w-auto h-9.5 px-5 rounded-[4px] bg-[#ff4a1f] text-white font-bold text-xs hover:bg-[#e63d15] hover:shadow-md transition-all duration-200"
              >
                {getUserEffectiveRole(authState.user) === "driver"
                  ? "Driver Dashboard"
                  : getUserEffectiveRole(authState.user) === "supplier"
                    ? "Supplier Dashboard"
                    : "Customer Dashboard"}
              </Button>
            ) : (
              <>
                <Button
                  variant="default"
                  isLoading={loadingAction === "primary"}
                  onClick={(e) => handleActionClick(e, primaryBtnLink, "primary")}
                  className="w-full sm:w-auto h-9.5 px-5 rounded-lg bg-[#ea580c] hover:bg-[#c2410c] text-white font-bold text-xs shadow-md shadow-[#ea580c]/30 hover:scale-[1.02] active:scale-95 transition-all duration-200 cursor-pointer flex items-center justify-center gap-1.5"
                >
                  <span>{primaryBtnText}</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Button>
                <Button
                  variant="dark-outline"
                  isLoading={loadingAction === "secondary"}
                  onClick={(e) => handleActionClick(e, secondaryBtnLink, "secondary")}
                  className="w-full sm:w-auto h-9.5 px-5 rounded-lg bg-white/10 hover:bg-white/15 text-white font-bold text-xs border border-white/20 transition-all duration-200 cursor-pointer"
                >
                  {secondaryBtnText}
                </Button>
              </>
            )}
          </div>

        </div>
      </div>
    </section>
  );
}
