import React, { useState, useEffect, useRef } from "react";
import { Menu, X, ChevronDown, LogOut, LayoutDashboard, User } from "lucide-react";
import { AllImages } from "@/components/AllPhotos/AllImages";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { TOKEN_CONFIG } from "@/config/auth";
import authService from "@/services/authService";
import ThemeSwitcher from "@/components/common/theme-switcher";

const NavigationLink = [
  { id: 1, navigationText: "Home",       sectionId: "home" },
  { id: 2, navigationText: "Features",   sectionId: "features" },
  { id: 3, navigationText: "Pricing",    sectionId: "pricing" },
  { id: 4, navigationText: "How it Works", sectionId: "how-it-works" },
  { id: 5, navigationText: "Carriers",   sectionId: "supplier" },
];

function getInitials(name: string): string {
  return name
    .split(" ")
    .slice(0, 2)
    .map((w) => w[0]?.toUpperCase() ?? "")
    .join("");
}

export default function Header() {
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [isScrolled,   setIsScrolled]   = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const { pathname } = useLocation();
  const navigate     = useNavigate();
  const dropdownRef  = useRef<HTMLDivElement>(null);

  // ── Live auth state (re-reads localStorage on every render) ───────────────
  const [currentUser, setCurrentUser] = useState<{
    name: string;
    email: string;
    user_type: string;
  } | null>(null);

  useEffect(() => {
    const readAuth = () => {
      const token   = localStorage.getItem(TOKEN_CONFIG.accessTokenKey);
      const userStr = localStorage.getItem(TOKEN_CONFIG.userKey);
      if (!token || !userStr) { setCurrentUser(null); return; }
      try {
        const u = JSON.parse(userStr);
        setCurrentUser({ name: u.name ?? "User", email: u.email ?? "", user_type: u.user_type ?? "customer" });
      } catch {
        setCurrentUser(null);
      }
    };

    readAuth();

    // Re-sync when another tab changes localStorage
    window.addEventListener("storage", readAuth);
    return () => window.removeEventListener("storage", readAuth);
  }, []);

  const dashboardPath =
    currentUser?.user_type === "supplier"
      ? "/supplier/dashboard"
      : currentUser?.user_type === "admin"
      ? "/admin/dashboard"
      : "/customer/dashboard";

  // ── Scroll handler ─────────────────────────────────────────────────────────
  useEffect(() => {
    const onScroll = () => setIsScrolled(window.scrollY > 40);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // ── Close dropdown on outside click ───────────────────────────────────────
  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, []);

  // ── Nav scroll helper ──────────────────────────────────────────────────────
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

  // ── Logout ─────────────────────────────────────────────────────────────────
  const handleLogout = async () => {
    await authService.logout();
    setCurrentUser(null);
    setDropdownOpen(false);
    navigate("/web/login");
  };

  // ── Text colour helpers ────────────────────────────────────────────────────
  const navTextCls  = isScrolled ? "text-slate-700 dark:text-slate-200 hover:text-[#ff4a1f] dark:hover:text-[#ff4a1f]" : "text-white/80 hover:text-white";
  const loginBtnCls = isScrolled
    ? "border-slate-300 text-slate-700 hover:border-[#ff4a1f] hover:text-[#ff4a1f]"
    : "border-white/40 text-white hover:border-white hover:bg-white/10";

  // ── Authenticated right-side widget ───────────────────────────────────────
  const AuthWidget = ({ mobile = false }: { mobile?: boolean }) =>
    currentUser ? (
      <div ref={dropdownRef} className={`relative ${mobile ? "w-full" : ""}`}>
        <button
          onClick={() => setDropdownOpen((p) => !p)}
          className={`flex items-center gap-2.5 px-3 py-1.5 rounded-full font-semibold text-sm transition-all cursor-pointer ${
            isScrolled || mobile
              ? "bg-slate-100 hover:bg-slate-200 text-slate-800"
              : "bg-white/10 hover:bg-white/20 text-white"
          } ${mobile ? "w-full justify-between" : ""}`}
        >
          {/* Avatar initials */}
          <span className="h-7 w-7 rounded-full bg-[#ff4a1f] text-white text-xs font-bold flex items-center justify-center shrink-0">
            {getInitials(currentUser.name)}
          </span>
          <span className="max-w-[110px] truncate">{currentUser.name}</span>
          <ChevronDown
            size={14}
            className={`transition-transform shrink-0 ${dropdownOpen ? "rotate-180" : ""}`}
          />
        </button>

        {/* Dropdown */}
        {dropdownOpen && (
          <div
            className={`absolute ${mobile ? "bottom-full mb-2 left-0" : "right-0 mt-2 top-full"} w-52 bg-white rounded-xl shadow-xl border border-slate-100 z-50 overflow-hidden`}
          >
            {/* User info */}
            <div className="px-4 py-3 border-b border-slate-100">
              <p className="text-[13px] font-bold text-slate-800 truncate">{currentUser.name}</p>
              <p className="text-[11px] text-slate-400 truncate">{currentUser.email}</p>
              <span className="inline-block mt-1 px-2 py-0.5 rounded-full text-[10px] font-bold capitalize bg-orange-50 text-[#ff4a1f]">
                {currentUser.user_type}
              </span>
            </div>

            {/* Actions */}
            <Link
              to={dashboardPath}
              onClick={() => setDropdownOpen(false)}
              className="flex items-center gap-2.5 px-4 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-50 transition-colors"
            >
              <LayoutDashboard size={15} className="text-slate-400" />
              Dashboard
            </Link>
            <Link
              to={`${dashboardPath.split("/dashboard")[0]}/settings`}
              onClick={() => setDropdownOpen(false)}
              className="flex items-center gap-2.5 px-4 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-50 transition-colors"
            >
              <User size={15} className="text-slate-400" />
              Profile
            </Link>
            <div className="border-t border-slate-100" />
            <button
              onClick={handleLogout}
              className="w-full flex items-center gap-2.5 px-4 py-2.5 text-sm font-medium text-red-500 hover:bg-red-50 transition-colors cursor-pointer"
            >
              <LogOut size={15} />
              Log Out
            </button>
          </div>
        )}
      </div>
    ) : (
      <div className={`flex ${mobile ? "flex-col" : "items-center"} gap-3 ${mobile ? "w-full" : ""}`}>
        <Link to="/web/login" onClick={() => setIsMobileOpen(false)} className={mobile ? "w-full" : ""}>
          <button
            className={`${mobile ? "w-full py-2.5" : "px-6 py-2"} rounded-full font-bold border transition-all duration-200 cursor-pointer text-sm ${loginBtnCls}`}
          >
            Log In
          </button>
        </Link>
        <Link to="/web/register" onClick={() => setIsMobileOpen(false)} className={mobile ? "w-full" : ""}>
          <button className={`${mobile ? "w-full py-2.5" : "px-6 py-2"} rounded-full bg-[#ff4a1f] hover:bg-[#e63d15] text-white text-sm font-bold shadow-sm hover:scale-105 active:scale-95 transition-all duration-200 cursor-pointer`}>
            Get Started
          </button>
        </Link>
      </div>
    );

  // ── Render ─────────────────────────────────────────────────────────────────
  return (
    <header
      className={`fixed top-0 left-0 w-full z-50 transition-colors duration-200 py-4 ${
        isScrolled ? "bg-white border-b border-slate-100" : "bg-transparent"
      }`}
    >
      <div className="max-w-7xl mx-auto flex items-center justify-between px-4 sm:px-6 lg:px-8">

        {/* Logo */}
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

        {/* Desktop Nav */}
        <div className="hidden lg:flex items-center justify-center flex-1 px-8">
          <ul className="flex items-center gap-8 xl:gap-12">
            {NavigationLink.map((item) => (
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

        {/* Desktop CTA */}
        <div className="hidden sm:flex items-center gap-3">
          <ThemeSwitcher />
          <AuthWidget />
        </div>

        {/* Mobile Toggle */}
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
        <div
          className={`lg:hidden px-6 py-6 space-y-4 shadow-xl ${
            isScrolled ? "bg-white text-slate-900 border-t border-slate-100" : "bg-[#0f0400] text-white"
          }`}
        >
          {NavigationLink.map((item) => (
            <a
              key={item.id}
              href={`/#${item.sectionId}`}
              onClick={(e) => handleNavClick(e, item.sectionId)}
              className={`block text-base font-semibold py-1 transition-colors ${navTextCls}`}
            >
              {item.navigationText}
            </a>
          ))}

          <div className="pt-4 border-t border-slate-200/40 space-y-3">
            <div className="flex justify-start">
              <ThemeSwitcher showText />
            </div>
            <AuthWidget mobile />
          </div>
        </div>
      )}
    </header>
  );
}
