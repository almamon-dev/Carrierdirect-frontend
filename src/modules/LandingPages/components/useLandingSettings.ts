import { useState, useEffect } from "react";
import apiClient from "@/lib/axios";

export interface LandingSettingsData {
  site_name: string;
  hero_badge: string;
  hero_title: string;
  hero_subtitle: string;
  hero_primary_btn: string;
  hero_secondary_btn: string;
  stat_carriers: string;
  stat_fmcsa: string;
  stat_tracking: string;
  stat_escrow: string;
  cta_title: string;
  cta_subtitle: string;
  cta_btn_text: string;
  company_phone: string;
  company_email: string;
  address: string;
  social_linkedin: string;
  social_twitter: string;
  social_facebook: string;
  isLoading: boolean;
}

const DEFAULT_SETTINGS: Omit<LandingSettingsData, 'isLoading'> = {
  site_name: "Carrier Direct",
  hero_badge: "Direct Carrier Marketplace",
  hero_title: "The Smarter Way to Ship Freight",
  hero_subtitle: "Connect with verified carriers, get real-time quotes, track shipments, and manage everything in one place.",
  hero_primary_btn: "Create a Quote",
  hero_secondary_btn: "Become a Supplier",
  stat_carriers: "Verified Carriers",
  stat_fmcsa: "EU Compliant",
  stat_tracking: "Real-time Tracking",
  stat_escrow: "Escrow Protected",
  cta_title: "Ready to Ship Smarter?",
  cta_subtitle: "Join thousands of shippers and carriers automating their logistics and increasing margins.",
  cta_btn_text: "Create Free Account",
  company_phone: "+49 30 12345678",
  company_email: "support@carrierdirect.eu",
  address: "Keizersgracht 421, 1016 EK Amsterdam, Netherlands",
  social_linkedin: "https://linkedin.com/company/carrierdirect",
  social_twitter: "https://twitter.com/carrierdirect",
  social_facebook: "https://facebook.com/carrierdirect",
};

export function useLandingSettings(): LandingSettingsData {
  const [settings, setSettings] = useState<LandingSettingsData>({
    ...DEFAULT_SETTINGS,
    isLoading: true,
  });

  useEffect(() => {
    let isMounted = true;

    apiClient
      .get("/settings")
      .then((res: any) => {
        if (!isMounted) return;
        const d = res.data?.data || res.data || {};

        setSettings({
          site_name: d.site_name || d.company_name || DEFAULT_SETTINGS.site_name,
          hero_badge: d.landing_hero_badge || DEFAULT_SETTINGS.hero_badge,
          hero_title: d.landing_hero_title || DEFAULT_SETTINGS.hero_title,
          hero_subtitle: d.landing_hero_subtitle || DEFAULT_SETTINGS.hero_subtitle,
          hero_primary_btn: d.landing_hero_primary_btn || DEFAULT_SETTINGS.hero_primary_btn,
          hero_secondary_btn: d.landing_hero_secondary_btn || DEFAULT_SETTINGS.hero_secondary_btn,
          stat_carriers: d.landing_stat_carriers || DEFAULT_SETTINGS.stat_carriers,
          stat_fmcsa: d.landing_stat_fmcsa || DEFAULT_SETTINGS.stat_fmcsa,
          stat_tracking: d.landing_stat_tracking || DEFAULT_SETTINGS.stat_tracking,
          stat_escrow: d.landing_stat_escrow || DEFAULT_SETTINGS.stat_escrow,
          cta_title: d.landing_cta_title || DEFAULT_SETTINGS.cta_title,
          cta_subtitle: d.landing_cta_subtitle || DEFAULT_SETTINGS.cta_subtitle,
          cta_btn_text: d.landing_cta_btn_text || DEFAULT_SETTINGS.cta_btn_text,
          company_phone: d.company_phone || d.contact_phone || DEFAULT_SETTINGS.company_phone,
          company_email: d.company_email || d.contact_email || DEFAULT_SETTINGS.company_email,
          address: d.address || DEFAULT_SETTINGS.address,
          social_linkedin: d.social_linkedin || DEFAULT_SETTINGS.social_linkedin,
          social_twitter: d.social_twitter || DEFAULT_SETTINGS.social_twitter,
          social_facebook: d.social_facebook || DEFAULT_SETTINGS.social_facebook,
          isLoading: false,
        });
      })
      .catch(() => {
        if (isMounted) {
          setSettings((prev) => ({ ...prev, isLoading: false }));
        }
      });

    return () => {
      isMounted = false;
    };
  }, []);

  return settings;
}
