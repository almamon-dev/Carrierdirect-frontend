import React, { useState, useEffect, useRef } from "react";
import { Menu, X } from "lucide-react";
import { AllImages } from "@/components/AllPhotos/AllImages";
import { Link, useLocation, useNavigate } from "react-router-dom";
import authService from "@/services/authService";
import { NAVIGATION_LINKS } from "./landingHeaderConstants";
import { LandingAuthWidget } from "./LandingAuthWidget";
import { LandingMobileMenu } from "./LandingMobileMenu";
import { useLandingAuth } from "./useLandingAuth";

export default function Header() {
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const dropdownRef = useRef<HTMLDivElement>(null);

  const {
    currentUser,
    setCurrentUser,
    dashboardPath,
    profilePath,
    roleBadgeLabel,
  } = useLandingAuth();

  useEffect(() => {
    const onScroll = () => setIsScrolled(window.scrollY > 5);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
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
          const y = el.getBoundingClientRect().top + window.scrollY - 80;
          window.scrollTo({ top: y, behavior: "smooth" });
          window.history.pushState(null, "", `/#${sectionId}`);
        }
      }
    } else {
      navigate(`/#${sectionId}`);
    }
    if (isMobileOpen) setIsMobileOpen(false);
  };

  const handleLogout = async () => {
    await authService.logout();
    setCurrentUser(null);
    setDropdownOpen(false);
    navigate("/web/login");
  };

  const navTextCls = isScrolled
    ? "text-slate-700 dark:text-slate-200 hover:text-[#ff4a1f] dark:hover:text-[#ff4a1f]"
    : "text-slate-100 hover:text-[#ff4a1f] dark:text-slate-200 dark:hover:text-[#ff4a1f]";

  const loginBtnCls = isScrolled
    ? "border-slate-300 text-slate-700 hover:border-[#ff4a1f] hover:text-[#ff4a1f] hover:bg-orange-50/50 dark:border-slate-700 dark:text-slate-200 dark:hover:border-[#ff4a1f] dark:hover:text-[#ff4a1f] dark:hover:bg-[#ff4a1f]/15"
    : "border-white/50 text-white hover:border-white hover:bg-white/10 dark:border-slate-600 dark:text-slate-100 dark:hover:border-slate-400 dark:hover:bg-white/10";

  return (
    <header
      className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 py-3.5 ${isScrolled
        ? "bg-white/95 dark:bg-[#12161c]/95 border-b border-slate-200 dark:border-slate-800 shadow-sm backdrop-blur-md"
        : "bg-transparent border-b border-transparent shadow-none"
        }`}
    >
      <div className="max-w-7xl mx-auto flex items-center justify-between px-4 sm:px-6 lg:px-8">
        <div className="shrink-0">
          <Link to="/" onClick={(e) => handleNavClick(e, "home")}>
            {isScrolled ? (
              <>
                <img
                  src={AllImages.LogoBlack}
                  alt="GetItMoving Logo"
                  className="h-8 sm:h-9 md:h-10 w-auto object-contain dark:hidden"
                />
                <img
                  src={AllImages.Logo}
                  alt="GetItMoving Logo"
                  className="h-8 sm:h-9 md:h-10 w-auto object-contain hidden dark:block"
                />
              </>
            ) : (
              <img
                src={AllImages.Logo}
                alt="GetItMoving Logo"
                className="h-8 sm:h-9 md:h-10 w-auto object-contain"
              />
            )}
          </Link>
        </div>

        <div className="hidden lg:flex items-center justify-center flex-1 px-8">
          <ul className="flex items-center gap-8 xl:gap-12">
            {NAVIGATION_LINKS.map((item) => (
              <li key={item.id}>
                <a
                  href={`/#${item.sectionId}`}
                  onClick={(e) => handleNavClick(e, item.sectionId)}
                  className={`text-sm font-semibold transition-colors duration-200 cursor-pointer ${navTextCls}`}
                >
                  {item.navigationText}
                </a>
              </li>
            ))}
          </ul>
        </div>

        <div className="hidden sm:flex items-center gap-3">
          <LandingAuthWidget
            currentUser={currentUser}
            dropdownRef={dropdownRef}
            dropdownOpen={dropdownOpen}
            setDropdownOpen={setDropdownOpen}
            isScrolled={isScrolled}
            dashboardPath={dashboardPath}
            profilePath={profilePath}
            roleBadgeLabel={roleBadgeLabel}
            onLogout={handleLogout}
            onCloseMobile={() => setIsMobileOpen(false)}
            loginBtnCls={loginBtnCls}
          />
        </div>

        <button
          onClick={() => setIsMobileOpen(!isMobileOpen)}
          aria-label="Toggle menu"
          className={`lg:hidden p-2 rounded-md transition-colors ${isScrolled
            ? "text-slate-800 hover:bg-slate-100 dark:text-slate-200 dark:hover:bg-slate-800"
            : "text-white hover:bg-white/10 dark:text-slate-200 dark:hover:bg-slate-800/60"
            }`}
        >
          {isMobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {isMobileOpen && (
        <LandingMobileMenu
          isScrolled={isScrolled}
          navTextCls={navTextCls}
          onNavClick={handleNavClick}
          currentUser={currentUser}
          dropdownRef={dropdownRef}
          dropdownOpen={dropdownOpen}
          setDropdownOpen={setDropdownOpen}
          dashboardPath={dashboardPath}
          profilePath={profilePath}
          roleBadgeLabel={roleBadgeLabel}
          onLogout={handleLogout}
          onCloseMobile={() => setIsMobileOpen(false)}
          loginBtnCls={loginBtnCls}
        />
      )}
    </header>
  );
}
