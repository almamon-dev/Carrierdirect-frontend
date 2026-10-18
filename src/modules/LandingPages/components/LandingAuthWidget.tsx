import React, { RefObject } from "react";
import { Link } from "react-router-dom";
import { ChevronDown, LogOut, LayoutDashboard, User } from "lucide-react";
import { getInitials } from "./landingHeaderConstants";

interface LandingAuthWidgetProps {
  currentUser: any | null;
  dropdownRef: RefObject<HTMLDivElement | null>;
  dropdownOpen: boolean;
  setDropdownOpen: React.Dispatch<React.SetStateAction<boolean>>;
  isScrolled: boolean;
  mobile?: boolean;
  dashboardPath: string;
  profilePath: string;
  roleBadgeLabel: string;
  onLogout: () => void;
  onCloseMobile: () => void;
  loginBtnCls: string;
}

export const LandingAuthWidget: React.FC<LandingAuthWidgetProps> = ({
  currentUser,
  dropdownRef,
  dropdownOpen,
  setDropdownOpen,
  isScrolled,
  mobile = false,
  dashboardPath,
  profilePath,
  roleBadgeLabel,
  onLogout,
  onCloseMobile,
  loginBtnCls,
}) => {
  if (currentUser) {
    return (
      <div ref={dropdownRef} className={`relative ${mobile ? "w-full" : ""}`}>
        <button
          onClick={() => setDropdownOpen((p) => !p)}
          className={`flex items-center gap-2.5 px-3 py-1.5 rounded-full font-semibold text-sm transition-all cursor-pointer border ${
            isScrolled || mobile
              ? "bg-slate-100/90 border-slate-200/80 hover:bg-slate-200/80 text-slate-800 dark:bg-[#1e2329] dark:border-slate-700/80 dark:text-slate-100"
              : "bg-white/10 border-white/20 hover:bg-white/20 text-white dark:bg-[#1e2329]/80 dark:border-slate-700/80 dark:text-slate-100"
          } ${mobile ? "w-full justify-between" : ""}`}
        >
          <span className="h-7 w-7 rounded-full bg-[#ff4a1f] text-white text-xs font-extrabold flex items-center justify-center shrink-0 shadow-xs">
            {getInitials(currentUser.name)}
          </span>
          <span className="max-w-[110px] truncate">{currentUser.name || "User"}</span>
          <ChevronDown
            size={14}
            className={`transition-transform shrink-0 ${dropdownOpen ? "rotate-180" : ""}`}
          />
        </button>

        {dropdownOpen && (
          <div
            className={`absolute ${mobile ? "bottom-full mb-2 left-0" : "right-0 mt-2 top-full"} w-56 bg-white dark:bg-[#1e2329] rounded-2xl shadow-2xl border border-slate-200/80 dark:border-slate-700/80 z-50 overflow-hidden text-slate-800 dark:text-slate-100`}
          >
            <div className="px-4 py-3.5 border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-[#181a20]/50">
              <p className="text-sm font-bold text-slate-900 dark:text-slate-100 truncate">{currentUser.name || "User"}</p>
              <p className="text-xs text-slate-500 dark:text-slate-400 truncate mt-0.5">{currentUser.email || ""}</p>
              <span className="inline-block mt-1.5 px-2 py-0.5 rounded-full text-[10px] font-bold capitalize bg-orange-100/70 text-[#ff4a1f] dark:bg-[#ff4a1f]/15 dark:text-[#ff4a1f] border border-orange-200/50 dark:border-orange-500/20">
                {roleBadgeLabel}
              </span>
            </div>

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
                to={profilePath}
                onClick={() => setDropdownOpen(false)}
                className="flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-semibold text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800/70 transition-colors"
              >
                <User size={15} className="text-slate-400 dark:text-slate-400" />
                Profile
              </Link>
              <div className="border-t border-slate-100 dark:border-slate-800 my-1" />
              <button
                onClick={onLogout}
                className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-semibold text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-500/10 transition-colors cursor-pointer"
              >
                <LogOut size={15} />
                Log Out
              </button>
            </div>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className={`flex ${mobile ? "flex-col" : "items-center"} gap-3 ${mobile ? "w-full" : ""}`}>
      <Link to="/web/login" onClick={onCloseMobile} className={mobile ? "w-full" : ""}>
        <button
          className={`${mobile ? "w-full py-2.5" : "px-6 py-2"} rounded-full font-bold border transition-all duration-200 cursor-pointer text-sm ${loginBtnCls}`}
        >
          Log In
        </button>
      </Link>
      <Link to="/web/register" onClick={onCloseMobile} className={mobile ? "w-full" : ""}>
        <button className={`${mobile ? "w-full py-2.5" : "px-6 py-2"} rounded-full bg-[#ff4a1f] hover:bg-[#e63d15] dark:bg-[#ff4a1f] dark:hover:bg-[#ff5a2d] text-white text-sm font-bold shadow-sm dark:shadow-[0_0_14px_rgba(255,74,31,0.4)] hover:scale-105 active:scale-95 transition-all duration-200 cursor-pointer`}>
          Get Started
        </button>
      </Link>
    </div>
  );
};
