import React, { useState, useEffect } from "react";
import CallToActionImg from "@/assets/Images/CallToActionImg.png";
import { useNavigate } from "react-router-dom";
import useScrollReveal from "@/Hooks/useScrollReveal";
import { TOKEN_CONFIG } from "@/config/auth";
import { getRoleDashboardUrl, getUserEffectiveRole } from "@/utils/roleDashboard";
import { useLandingSettings } from "../components/useLandingSettings";
import { useLandingCMS } from "../components/useLandingCMS";
import Button from "@/components/ui/button";

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

  const ctaTitle = cmsCta?.title || landingSettings.cta_title || "Ready to Ship Smarter?";
  const ctaSubtitle = cmsCta?.subtitle || landingSettings.cta_subtitle || "Join thousands of shippers and carriers automating their logistics and increasing margins.";
  const ctaBadge = cmsCta?.badge || "Start Shipping Today";

  const primaryBtnText = cmsCta?.content?.btn_text || landingSettings.cta_btn_text || "Create Free Account";
  const primaryBtnLink = cmsCta?.content?.btn_link ?? "";

  const secondaryBtnText = cmsCta?.content?.secondary_btn_text || "Contact Sales";
  const secondaryBtnLink = cmsCta?.content?.secondary_btn_link ?? "";

  const ctaBgImage = (cmsCta?.content?.bg_image && typeof cmsCta.content.bg_image === "string" && cmsCta.content.bg_image.trim() !== "")
    ? cmsCta.content.bg_image.trim()
    : CallToActionImg;

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
    <section className="w-full px-4 pt-12 pb-4 bg-transparent">
      <div 
        ref={reveal.ref}
        className={`relative mx-auto max-w-7xl overflow-hidden rounded-2xl bg-[#0f0400] shadow-md reveal ${reveal.isVisible ? "visible" : ""}`}
      >
        <div 
          className="absolute inset-0 bg-cover bg-center opacity-10 mix-blend-luminosity scale-105"
          style={{ backgroundImage: `url(${ctaBgImage})` }}
        />
        
        <div className="absolute inset-0 bg-gradient-to-r from-[#0f0400] via-[#0f0400]/90 to-[#ff4a1f]/10" />

        <div className="absolute top-0 right-0 w-[200px] h-[200px] bg-[#ff4a1f] rounded-full mix-blend-screen filter blur-[100px] opacity-30 translate-x-1/2 -translate-y-1/2" />

        <div className="relative z-10 flex flex-col md:flex-row items-center justify-between px-8 py-10 md:px-12 md:py-12 gap-6">

          <div className="flex-1 text-center md:text-left">
            <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full bg-white/10 border border-white/10 mb-3">
              <span className="w-1.5 h-1.5 rounded-full bg-[#ff4a1f] animate-pulse"></span>
              <span className="text-white/80 text-[10px] font-bold tracking-wider ">{ctaBadge}</span>
            </div>

            <h2 className="text-white font-bold text-2xl sm:text-3xl tracking-tight mb-2 drop-shadow-sm">
              {ctaTitle}
            </h2>
            <p className="text-gray-400 text-sm max-w-md mx-auto md:mx-0">
              {ctaSubtitle}
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto shrink-0">
            {isLoggedIn ? (
              <Button 
                variant="default"
                isLoading={loadingAction === "dashboard"}
                onClick={handleDashboardClick}
                className="w-full sm:w-auto h-10 px-6 rounded-[4px] bg-[#ff4a1f] text-white font-bold text-xs hover:bg-[#e63d15] hover:shadow-md transition-all duration-200"
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
                  className="w-full sm:w-auto h-10 px-6 rounded-[4px] bg-[#ff4a1f] text-white font-bold text-xs hover:bg-[#e63d15] hover:shadow-md transition-all duration-200"
                >
                  {primaryBtnText}
                </Button>
                <Button
                  variant="dark-outline"
                  isLoading={loadingAction === "secondary"}
                  onClick={(e) => handleActionClick(e, secondaryBtnLink, "secondary")}
                  className="w-full sm:w-auto h-10 px-6 rounded-[4px] text-white font-bold text-xs hover:bg-white/10 transition-all duration-200"
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
