import React, { useState, useEffect } from "react";
import { Menu, X } from "lucide-react";
import { AllImages } from "@/components/AllPhotos/AllImages";
import { Link, useLocation, useNavigate } from "react-router-dom";

const NavigationLink = [
  { id: 1, navigationText: "Home", sectionId: "home" },
  { id: 2, navigationText: "Features", sectionId: "features" },
  { id: 3, navigationText: "Pricing", sectionId: "pricing" },
  { id: 4, navigationText: "How it Works", sectionId: "how-it-works" },
  { id: 5, navigationText: "Carriers", sectionId: "supplier" },
];

export default function Header() {
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const { pathname } = useLocation();
  const navigate = useNavigate();

  const [authState] = useState(() => {
    try {
      const token = localStorage.getItem('erp_access_token') || localStorage.getItem('token');
      const userStr = localStorage.getItem('erp_user_data') || localStorage.getItem('user');
      const user = userStr ? JSON.parse(userStr) : null;
      return { userToken: token, userType: user?.user_type || user?.role };
    } catch {
      return { userToken: null, userType: null };
    }
  });

  const { userToken, userType } = authState;
  const dashboardPath = userType === "supplier" ? "/supplier/dashboard" : "/customer/dashboard";

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 40);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleNavClick = (e: React.MouseEvent, sectionId?: string) => {
    if (!sectionId) return;

    if (pathname === "/") {
      e.preventDefault();
      if (sectionId === "home") {
        window.scrollTo({ top: 0, behavior: "smooth" });
        window.history.pushState(null, "", "/");
      } else {
        const el = document.getElementById(sectionId);
        if (el) {
          const yOffset = -80;
          const y = el.getBoundingClientRect().top + window.scrollY + yOffset;
          window.scrollTo({ top: y, behavior: "smooth" });
          window.history.pushState(null, "", `/#${sectionId}`);
        }
      }
    } else {
      navigate(`/#${sectionId}`);
    }

    if (isMobileOpen) setIsMobileOpen(false);
  };

  return (
    <header
      className={`fixed top-0 left-0 w-full z-50 transition-colors duration-200 py-4 ${
        isScrolled
          ? "bg-white border-b border-slate-100"
          : "bg-transparent"
      }`}
    >
      <div className="max-w-7xl mx-auto flex items-center justify-between px-4 sm:px-6 lg:px-8">

        {/* Logo */}
        <div className="shrink-0">
          <Link to="/" onClick={(e) => handleNavClick(e, "home")}>
            <img
              src={isScrolled ? AllImages.LogoBlack : AllImages.Logo}
              alt="GetItMoving Logo"
              className="h-8 sm:h-9 md:h-10 w-auto object-contain"
            />
          </Link>
        </div>

        {/* Desktop Nav Links */}
        <div className="hidden lg:flex items-center justify-center flex-1 px-8">
          <ul className="flex items-center gap-8 xl:gap-12">
            {NavigationLink.map((item) => (
              <li key={item.id}>
                <a
                  href={`/#${item.sectionId}`}
                  onClick={(e) => handleNavClick(e, item.sectionId)}
                  className={`text-sm font-semibold transition-colors duration-200 cursor-pointer ${
                    isScrolled
                      ? "text-slate-700 hover:text-[#ff4a1f]"
                      : "text-white/80 hover:text-white"
                  }`}
                >
                  {item.navigationText}
                </a>
              </li>
            ))}
          </ul>
        </div>

        {/* Right CTA Buttons */}
        <div className="hidden sm:flex items-center gap-3">
          {userToken ? (
            <Link to={dashboardPath}>
              <button className="px-6 py-2 rounded-full bg-[#ff4a1f] hover:bg-[#e63d15] text-white text-sm font-bold shadow-sm hover:scale-105 active:scale-95 transition-all duration-200 cursor-pointer">
                Dashboard
              </button>
            </Link>
          ) : (
            <>
              <Link to="/web/login">
                <button
                  className={`px-6 py-2 rounded-full text-sm font-bold transition-all duration-200 cursor-pointer border ${
                    isScrolled
                      ? "border-slate-300 text-slate-700 hover:border-[#ff4a1f] hover:text-[#ff4a1f]"
                      : "border-white/40 text-white hover:border-white hover:bg-white/10"
                  }`}
                >
                  Log In
                </button>
              </Link>
              <Link to="/web/register">
                <button className="px-6 py-2 rounded-full bg-[#ff4a1f] hover:bg-[#e63d15] text-white text-sm font-bold shadow-sm hover:scale-105 active:scale-95 transition-all duration-200 cursor-pointer">
                  Get Started
                </button>
              </Link>
            </>
          )}
        </div>

        {/* Mobile Toggle Button */}
        <button
          onClick={() => setIsMobileOpen(!isMobileOpen)}
          aria-label="Toggle menu"
          className={`lg:hidden p-2 rounded-lg transition-colors ${
            isScrolled ? "text-slate-900 hover:bg-slate-100" : "text-white hover:bg-white/10"
          }`}
        >
          {isMobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile Menu */}
      {isMobileOpen && (
        <div className={`lg:hidden px-6 py-6 space-y-4 shadow-xl ${
          isScrolled ? "bg-white text-slate-900 border-t border-slate-100" : "bg-[#0f0400] text-white"
        }`}>
          {NavigationLink.map((item) => (
            <a
              key={item.id}
              href={`/#${item.sectionId}`}
              onClick={(e) => handleNavClick(e, item.sectionId)}
              className={`block text-base font-semibold py-1 transition-colors ${
                isScrolled ? "text-slate-700 hover:text-[#ff4a1f]" : "text-white/80 hover:text-white"
              }`}
            >
              {item.navigationText}
            </a>
          ))}
          <div className="pt-4 border-t border-slate-200/40 flex flex-col gap-3">
            {userToken ? (
              <Link to={dashboardPath} onClick={() => setIsMobileOpen(false)}>
                <button className="w-full py-3 rounded-full bg-[#ff4a1f] text-white font-bold hover:bg-[#e63d15] shadow-sm transition-all">
                  Dashboard
                </button>
              </Link>
            ) : (
              <>
                <Link to="/web/login" onClick={() => setIsMobileOpen(false)}>
                  <button className={`w-full py-2.5 rounded-full font-bold border transition-all ${
                    isScrolled ? "border-slate-300 text-slate-700 hover:border-[#ff4a1f]" : "border-white/40 text-white"
                  }`}>
                    Log In
                  </button>
                </Link>
                <Link to="/web/register" onClick={() => setIsMobileOpen(false)}>
                  <button className="w-full py-2.5 rounded-full bg-[#ff4a1f] text-white font-bold hover:bg-[#e63d15] shadow-sm transition-all">
                    Get Started
                  </button>
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
