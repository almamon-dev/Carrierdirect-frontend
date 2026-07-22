import React from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { AllImages } from "@/components/AllPhotos/AllImages";

export default function Footer() {
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const settings = { pay_later_system_enabled: true };

  const handleScroll = (e: React.MouseEvent<HTMLAnchorElement>, sectionId: string) => {
    if (pathname === "/") {
      e.preventDefault();
      
      if (sectionId === "home") {
        window.scrollTo({ top: 0, behavior: "smooth" });
        window.history.pushState(null, "", "/");
      } else {
        const element = document.getElementById(sectionId);
        if (element) {
          const yOffset = -90;
          const y = element.getBoundingClientRect().top + window.scrollY + yOffset;
          window.scrollTo({ top: y, behavior: "smooth" });
          window.history.pushState(null, "", `/#${sectionId}`);
        }
      }
    } else {
      navigate(`/#${sectionId}`);
    }
  };

  const scrollToTop = (e: React.MouseEvent) => {
    if (pathname === "/") {
      e.preventDefault();
      window.scrollTo({ top: 0, behavior: "smooth" });
      window.history.pushState(null, "", "/");
    }
  };

  return (
    <footer className="w-full bg-[#0f0400] text-white pt-10 pb-6 border-t border-white/5 relative overflow-hidden">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-1 bg-gradient-to-r from-transparent via-[#ff4a1f]/30 to-transparent"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">

        <div className="grid grid-cols-2 md:grid-cols-5 gap-8 lg:gap-12 mb-10">

          <div className="col-span-2 md:col-span-2">
            <Link to="/" onClick={scrollToTop} className="inline-block mb-4">
              <img
                src={AllImages.Logo}
                alt="GetItMoving Logo"
                className="h-8 w-auto object-contain brightness-0 invert opacity-90"
              />
            </Link>
            <p className="text-white/50 text-xs leading-relaxed mb-5 max-w-[260px]">
              The smarter way to connect shippers with verified carriers. Fast, Reliable, Secure.
            </p>
          </div>

          <div className="col-span-1">
            <h3 className="text-white text-[11px] font-bold uppercase tracking-[0.2em] mb-4">Company</h3>
            <ul className="space-y-2.5">
              {["About Us", "Careers", "Contact Us", "News"].map((label, i) => (
                <li key={i}>
                  <Link
                    to={label === "Contact Us" ? "/contact-us" : "#"}
                    className="text-white/50 hover:text-white text-xs transition-colors duration-200"
                  >
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="col-span-1">
            <h3 className="text-white text-[11px] font-bold uppercase tracking-[0.2em] mb-4">Platform</h3>
            <ul className="space-y-2.5">
              {[
                { label: "Features", sectionId: "features" },
                { label: "Pricing", sectionId: "pricing" },
                { label: "How it Works", sectionId: "how-it-works" },
                { label: "Carriers", sectionId: "supplier" },
              ].map((link, i) => (
                <li key={i}>
                  <Link
                    to={`/#${link.sectionId}`}
                    onClick={(e) => handleScroll(e, link.sectionId)}
                    className="text-white/50 hover:text-white text-xs transition-colors duration-200"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
              {settings?.pay_later_system_enabled && (
                <li>
                  <Link
                    to="/pay-later-facility"
                    className="text-white/50 hover:text-white text-xs transition-colors duration-200"
                  >
                    Pay Later
                  </Link>
                </li>
              )}
            </ul>
          </div>

          <div className="col-span-1">
            <h3 className="text-white text-[11px] font-bold uppercase tracking-[0.2em] mb-4">Legal</h3>
            <ul className="space-y-2.5">
              {[
                { label: "Terms & Conditions", href: "/terms-and-conditions" },
                { label: "Privacy Policy", href: "/privacy-policy" },
                { label: "Cookie Policy", href: "#" },
              ].map(({ label, href }, i) => (
                <li key={i}>
                  <Link
                    to={href}
                    className="text-white/50 hover:text-white text-xs transition-colors duration-200"
                  >
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

        </div>

        <div className="border-t border-white/10 pt-5 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-white/40 text-[11px]">
            © {new Date().getFullYear()} GetItMoving. All rights reserved.
          </p>
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-1.5 text-white/40 text-[11px]">
              <span className="w-1.5 h-1.5 rounded-full bg-green-500"></span>
              All systems operational
            </div>
            <button
              onClick={scrollToTop}
              className="text-white/40 hover:text-white text-[11px] transition-colors cursor-pointer"
            >
              Back to top ↑
            </button>
          </div>
        </div>

      </div>
    </footer>
  );
}
