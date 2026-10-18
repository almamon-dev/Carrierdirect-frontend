import React from "react";
import { NAVIGATION_LINKS } from "./landingHeaderConstants";
import { LandingAuthWidget } from "./LandingAuthWidget";

interface LandingMobileMenuProps {
  isScrolled: boolean;
  navTextCls: string;
  onNavClick: (e: React.MouseEvent, sectionId?: string) => void;
  currentUser: any | null;
  dropdownRef: React.RefObject<HTMLDivElement | null>;
  dropdownOpen: boolean;
  setDropdownOpen: React.Dispatch<React.SetStateAction<boolean>>;
  dashboardPath: string;
  profilePath: string;
  roleBadgeLabel: string;
  onLogout: () => void;
  onCloseMobile: () => void;
  loginBtnCls: string;
}

export const LandingMobileMenu: React.FC<LandingMobileMenuProps> = ({
  isScrolled,
  navTextCls,
  onNavClick,
  currentUser,
  dropdownRef,
  dropdownOpen,
  setDropdownOpen,
  dashboardPath,
  profilePath,
  roleBadgeLabel,
  onLogout,
  onCloseMobile,
  loginBtnCls,
}) => {
  return (
    <div
      className={`lg:hidden px-6 py-6 space-y-4 shadow-2xl border-t transition-all ${isScrolled
        ? "bg-white/95 dark:bg-[#12161c]/95 text-slate-900 dark:text-slate-100 border-slate-200/80 dark:border-slate-800 backdrop-blur-md"
        : "bg-[#0f0400]/95 dark:bg-[#12161c]/95 text-white dark:text-slate-100 border-white/10 dark:border-slate-800 backdrop-blur-md"
        }`}
    >
      {NAVIGATION_LINKS.map((item) => (
        <a
          key={item.id}
          href={`/#${item.sectionId}`}
          onClick={(e) => onNavClick(e, item.sectionId)}
          className={`block text-base font-semibold py-1 transition-colors ${navTextCls}`}
        >
          {item.navigationText}
        </a>
      ))}

      <div className="pt-4 border-t border-slate-200/40 dark:border-slate-800 space-y-3">
        <LandingAuthWidget
          currentUser={currentUser}
          dropdownRef={dropdownRef}
          dropdownOpen={dropdownOpen}
          setDropdownOpen={setDropdownOpen}
          isScrolled={isScrolled}
          mobile
          dashboardPath={dashboardPath}
          profilePath={profilePath}
          roleBadgeLabel={roleBadgeLabel}
          onLogout={onLogout}
          onCloseMobile={onCloseMobile}
          loginBtnCls={loginBtnCls}
        />
      </div>
    </div>
  );
};
