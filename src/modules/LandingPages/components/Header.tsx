import React, { useState, useEffect, useRef } from "react";
import { Menu, X, ChevronDown, LogOut, LayoutDashboard, User } from "lucide-react";
import { AllImages } from "@/components/AllPhotos/AllImages";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { TOKEN_CONFIG } from "@/config/auth";
import authService from "@/services/authService";
import ThemeSwitcher from "@/components/common/theme-switcher";

const NavigationLink = [
  { id: 1, navigationText: "Home", sectionId: "home" },
  { id: 2, navigationText: "Features", sectionId: "features" },
  { id: 3, navigationText: "Pricing", sectionId: "pricing" },
  { id: 4, navigationText: "How it Works", sectionId: "how-it-works" },
  { id: 5, navigationText: "Carriers", sectionId: "supplier" },
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
  const [isScrolled, setIsScrolled] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const dropdownRef = useRef<HTMLDivElement>(null);

  // ── Live auth state (re-reads localStorage on every render) ───────────────
  const [currentUser, setCurrentUser] = useState<{
    name: string;
    email: string;
    user_type: string;
  } | null>(null);

  useEffect(() => {
    const readAuth = () => {
      const token = localStorage.getItem(TOKEN_CONFIG.accessTokenKey);
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
    const onScroll = () => setIsScrolled(window.scrollY > 5);
    onScroll();
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
  const navTextCls = isScrolled
    ? "text-slate-700 dark:text-slate-200 hover:text-[#ff4a1f] dark:hover:text-[#ff4a1f]"
    : "text-slate-100 hover:text-[#ff4a1f] dark:text-slate-200 dark:hover:text-[#ff4a1f]";

  const loginBtnCls = isScrolled
    ? "border-slate-300 text-slate-700 hover:border-[#ff4a1f] hover:text-[#ff4a1f] hover:bg-orange-50/50 dark:border-slate-700 dark:text-slate-200 dark:hover:border-[#ff4a1f] dark:hover:text-[#ff4a1f] dark:hover:bg-[#ff4a1f]/15"
    : "border-white/50 text-white hover:border-white hover:bg-white/10 dark:border-slate-600 dark:text-slate-100 dark:hover:border-slate-400 dark:hover:bg-white/10";

  // ── Authenticated right-side widget ───────────────────────────────────────
  const AuthWidget = ({ mobile = false }: { mobile?: boolean }) =>
    currentUser ? (
      <div ref={dropdownRef} className={`relative ${mobile ? "w-full" : ""}`}>
        <button
          onClick={() => setDropdownOpen((p) => !p)}
          className={`flex items-center gap-2.5 px-3 py-1.5 rounded-full font-semibold text-sm transition-all cursor-pointer border ${isScrolled || mobile
            ? "bg-slate-100/90 border-slate-200/80 hover:bg-slate-200/80 text-slate-800 dark:bg-[#1e2329] dark:border-slate-700/80 dark:text-slate-100"
            : "bg-white/10 border-white/20 hover:bg-white/20 text-white dark:bg-[#1e2329]/80 dark:border-slate-700/80 dark:text-slate-100"
            } ${mobile ? "w-full justify-between" : ""}`}
        >
          {/* Avatar initials */}
          <span className="h-7 w-7 rounded-full bg-[#ff4a1f] text-white text-xs font-extrabold flex items-center justify-center shrink-0 shadow-xs">
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
            className={`absolute ${mobile ? "bottom-full mb-2 left-0" : "right-0 mt-2 top-full"} w-56 bg-white dark:bg-[#1e2329] rounded-2xl shadow-2xl border border-slate-200/80 dark:border-slate-700/80 z-50 overflow-hidden text-slate-800 dark:text-slate-100`}
          >
            {/* User info */}
            <div className="px-4 py-3.5 border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-[#181a20]/50">
              <p className="text-sm font-bold text-slate-900 dark:text-slate-100 truncate">{currentUser.name}</p>
              <p className="text-xs text-slate-500 dark:text-slate-400 truncate mt-0.5">{currentUser.email}</p>
              <span className="inline-block mt-1.5 px-2 py-0.5 rounded-full text-[10px] font-bold capitalize bg-orange-100/70 text-[#ff4a1f] dark:bg-[#ff4a1f]/15 dark:text-[#ff4a1f] border border-orange-200/50 dark:border-orange-500/20">
                {currentUser.user_type}
              </span>
            </div>

            {/* Actions */}
            <div className="p-1.5 space-y-0.5">
              <Link
                to={dashboardPath}
                onClick={() => setDropdownOpen(false)}
                className="flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-semibold text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800/70 transition-colors"
              >
                <LayoutDashboard size={15} className="text-slate-400 dark:text-slate-400" />
                Dashboard
              </Link>
              <Link
                to={`${dashboardPath.split("/dashboard")[0]}/settings`}
                onClick={() => setDropdownOpen(false)}
                className="flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-semibold text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800/70 transition-colors"
              >
                <User size={15} className="text-slate-400 dark:text-slate-400" />
                Profile
              </Link>
              <div className="border-t border-slate-100 dark:border-slate-800 my-1" />
              <button
                onClick={handleLogout}
                className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-semibold text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-500/10 transition-colors cursor-pointer"
              >
                <LogOut size={15} />
                Log Out
              </button>
            </div>
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
          <button className={`${mobile ? "w-full py-2.5" : "px-6 py-2"} rounded-full bg-[#ff4a1f] hover:bg-[#e63d15] dark:bg-[#ff4a1f] dark:hover:bg-[#ff5a2d] text-white text-sm font-bold shadow-sm dark:shadow-[0_0_14px_rgba(255,74,31,0.4)] hover:scale-105 active:scale-95 transition-all duration-200 cursor-pointer`}>
            Get Started
          </button>
        </Link>
      </div>
    );

  // ── Render ─────────────────────────────────────────────────────────────────
  return (
    <header
      className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 py-3.5 ${isScrolled
        ? "bg-white/95 dark:bg-[#12161c]/95 border-b border-slate-200 dark:border-slate-800 shadow-sm backdrop-blur-md"
        : "bg-transparent border-b border-transparent shadow-none"
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
          <ThemeSwitcher variant={isScrolled ? 'default' : 'hero'} />
          <AuthWidget />
        </div>

        {/* Mobile Toggle */}
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

      {/* Mobile Menu */}
      {isMobileOpen && (
        <div
          className={`lg:hidden px-6 py-6 space-y-4 shadow-2xl border-t transition-all ${isScrolled
            ? "bg-white/95 dark:bg-[#12161c]/95 text-slate-900 dark:text-slate-100 border-slate-200/80 dark:border-slate-800 backdrop-blur-md"
            : "bg-[#0f0400]/95 dark:bg-[#12161c]/95 text-white dark:text-slate-100 border-white/10 dark:border-slate-800 backdrop-blur-md"
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

          <div className="pt-4 border-t border-slate-200/40 dark:border-slate-800 space-y-3">
            <div className="flex justify-start">
              <ThemeSwitcher showText variant={isScrolled ? 'default' : 'hero'} />
            </div>
            <AuthWidget mobile />
          </div>
        </div>
      )}
    </header>
  );
}
