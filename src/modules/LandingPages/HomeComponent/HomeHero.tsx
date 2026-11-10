import React, { useState, useEffect } from "react";
import { AllImages } from "@/components/AllPhotos/AllImages";
import { useNavigate } from 'react-router-dom';
import { Shield, Check, Clock, Lock, ShieldCheck, Award, MapPin } from "lucide-react";
import { TOKEN_CONFIG } from "@/config/auth";
import { getRoleDashboardUrl, getUserEffectiveRole } from "@/utils/roleDashboard";
import { useLandingSettings } from "../components/useLandingSettings";
import { useLandingCMS } from "../components/useLandingCMS";
import Button from "@/components/ui/button";

export default function HomeHero() {
  const navigate = useNavigate();
  const landingSettings = useLandingSettings();
  const { getSection, isSectionEnabled } = useLandingCMS();
  const cmsHero = getSection("hero");

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

  if (!isSectionEnabled("hero")) {
    return null;
  }

  const { isLoggedIn } = authState;

  const heroBadge = cmsHero?.badge || landingSettings.hero_badge || "Direct Carrier Marketplace";
  const heroTitle = cmsHero?.title || landingSettings.hero_title || "The Smarter Way to Ship Freight";
  const heroSubtitle = cmsHero?.subtitle || landingSettings.hero_subtitle || "Connect with verified carriers, get real-time quotes, track shipments, and manage everything in one place.";

  const primaryBtnText = cmsHero?.content?.primary_btn_text || landingSettings.hero_primary_btn || "Create a Quote";
  const primaryBtnLink = cmsHero?.content?.primary_btn_link ?? "";

  const secondaryBtnText = cmsHero?.content?.secondary_btn_text || landingSettings.hero_secondary_btn || "Become a Supplier";
  const secondaryBtnLink = cmsHero?.content?.secondary_btn_link ?? "";

  const heroBgImage = (cmsHero?.content?.bg_image && typeof cmsHero.content.bg_image === "string" && cmsHero.content.bg_image.trim() !== "")
    ? cmsHero.content.bg_image.trim()
    : AllImages.Hero;

  const trustBadges = (Array.isArray(cmsHero?.content?.trust_badges) && cmsHero.content.trust_badges.length > 0)
    ? cmsHero.content.trust_badges
    : [
        { label: landingSettings.stat_carriers || "Verified Carriers", icon: "Shield" },
        { label: landingSettings.stat_fmcsa || "EU Compliant", icon: "Check" },
        { label: landingSettings.stat_tracking || "Real-time Tracking", icon: "Clock" },
        { label: landingSettings.stat_escrow || "Escrow Protected", icon: "Lock" },
      ];

  const renderBadgeIcon = (iconName?: string) => {
    switch (iconName) {
      case "ShieldCheck":
      case "Shield":
        return <Shield className="w-3.5 h-3.5 text-white/70" />;
      case "Award":
      case "Check":
        return <Check className="w-3.5 h-3.5 text-white/70" />;
      case "MapPin":
      case "Clock":
        return <Clock className="w-3.5 h-3.5 text-white/70" />;
      case "Lock":
      default:
        return <Lock className="w-3.5 h-3.5 text-white/70" />;
    }
  };

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
    <section id="home" className="relative bg-[#0b0300] min-h-[500px] sm:min-h-[560px] lg:min-h-[620px] flex items-center overflow-hidden">
      
      {/* Background Image Container */}
      <div className="absolute inset-0 z-0">
        <img
          src={heroBgImage}
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
        <div className="absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-[#0b0300] dark:from-[#12161c] to-transparent z-20 pointer-events-none" />
      </div>

      {/* Hero Content Container */}
      <div className="relative z-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-28 sm:pt-32 pb-12 sm:pb-14 w-full">
        <div className="max-w-xl lg:max-w-2xl">
          
          {/* Badge Pill */}
          {heroBadge && (
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-white/10 text-orange-300 border border-white/10 mb-3 backdrop-blur-xs">
              <span className="w-1.5 h-1.5 rounded-full bg-[#ff4a1f]" />
              {heroBadge}
            </div>
          )}

          {/* Main Headline */}
          <h1 className="text-white text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight leading-[1.15] mb-3 sm:mb-4">
            {heroTitle === "The Smarter Way to Ship Freight" ? (
              <>
                The Smarter Way to{" "}
                <span className="text-[#ff4a1f] inline sm:inline">Ship</span>
                <br />
                <span className="text-[#ff4a1f] inline sm:inline">Freight</span>
              </>
            ) : (
              heroTitle
            )}
          </h1>

          {/* Subtitle */}
          <p className="text-white/80 text-xs sm:text-sm leading-relaxed mb-6 max-w-md font-normal">
            {heroSubtitle}
          </p>

          {/* Action Buttons: Create a Quote & Become a Supplier */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5 mb-8 sm:mb-10">
            {isLoggedIn ? (
              <Button 
                variant="default"
                size="sm"
                isLoading={loadingAction === "dashboard"}
                onClick={handleDashboardClick}
                className="h-9.5 px-5 rounded-[4px] bg-[#ff4a1f] hover:bg-[#e63d15] text-white font-bold text-xs sm:text-sm shadow-md shadow-[#ff4a1f]/30 hover:scale-[1.02] active:scale-95 transition-all duration-200 cursor-pointer"
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
                  className="w-full sm:w-auto h-9.5 px-5 rounded-[4px] bg-[#ff4a1f] hover:bg-[#e63d15] text-white font-bold text-xs sm:text-sm shadow-md shadow-[#ff4a1f]/30 hover:scale-[1.02] active:scale-95 transition-all duration-200 cursor-pointer"
                >
                  {primaryBtnText}
                </Button>
                <Button
                  variant="dark-outline"
                  isLoading={loadingAction === "secondary"}
                  onClick={(e) => handleActionClick(e, secondaryBtnLink, "secondary")}
                  className="w-full sm:w-auto h-9.5 px-5 rounded-[4px] font-bold text-xs sm:text-sm transition-all duration-200 cursor-pointer"
                >
                  {secondaryBtnText}
                </Button>
              </>
            )}
          </div>

          {/* Bottom Badges Bar */}
          <div className="flex flex-wrap items-center gap-x-2.5 gap-y-1.5 text-white/70 text-[11px] font-medium pt-1">
            {trustBadges.map((badge: any, bIdx: number) => (
              <React.Fragment key={bIdx}>
                {bIdx > 0 && <span className="text-white/30">|</span>}
                <div className="flex items-center gap-1.5">
                  {renderBadgeIcon(badge.icon)}
                  <span>{badge.label}</span>
                </div>
              </React.Fragment>
            ))}
          </div>

        </div>
      </div>

    </section>
  );
}
