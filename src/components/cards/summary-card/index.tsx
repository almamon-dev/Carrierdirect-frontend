import React from 'react';
import {
  CheckCircle2,
  LucideIcon,
  Package,
  Truck,
  ClipboardList,
  Radio,
  ShieldCheck,
  Navigation,
  Wallet,
  Sparkles,
  Users,
  MapPin,
  FileCheck,
  Calendar,
  BarChart3,
  Layers,
  Monitor,
  Smartphone,
  Link2,
  Sliders,
} from 'lucide-react';

const ICON_MAP: Record<string, React.ComponentType<{ className?: string }>> = {
  Package,
  Truck,
  ClipboardList,
  CheckCircle2,
  Radio,
  ShieldCheck,
  Navigation,
  Wallet,
  Sparkles,
  Users,
  MapPin,
  FileCheck,
  Calendar,
  BarChart3,
  Layers,
  Monitor,
  Smartphone,
  Link2,
  Sliders,
};

export interface SummaryCardProps {
  stepNumber?: number | string;
  badge?: string;
  title: string;
  description: string;
  highlight?: string;
  icon?: LucideIcon | React.ComponentType<{ className?: string }> | React.ReactNode | string;
  iconBgClass?: string;
  isLast?: boolean;
  className?: string;
  onClick?: () => void;
  children?: React.ReactNode;
}

export default function SummaryCard({
  title,
  description,
  highlight,
  icon,
  iconBgClass,
  className = '',
  onClick,
  children,
}: SummaryCardProps) {
  const renderIcon = () => {
    if (!icon) return null;
    if (React.isValidElement(icon)) {
      return icon;
    }
    if (typeof icon === 'string') {
      const ResolvedIcon = ICON_MAP[icon] || Package;
      return <ResolvedIcon className="w-4 h-4 text-inherit" />;
    }
    const IconComponent = icon as React.ComponentType<{ className?: string }>;
    return <IconComponent className="w-4 h-4 text-inherit" />;
  };

  return (
    <div
      onClick={onClick}
      className={`bg-white dark:bg-[#1e2329] rounded-[4px] p-3.5 sm:p-4 border border-slate-200/90 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 transition-colors flex flex-col justify-between h-full shadow-2xs ${
        onClick ? 'cursor-pointer' : ''
      } ${className}`}
    >
      <div className="flex-1 flex flex-col">
        {/* Minimal Icon Header */}
        {icon && (
          <div
            className={`w-7 h-7 sm:w-8 sm:h-8 rounded-[4px] bg-orange-50 dark:bg-[#ff4a1f]/10 text-[#ea580c] dark:text-[#ff4a1f] flex items-center justify-center shrink-0 mb-2.5 ${
              iconBgClass || ''
            }`}
          >
            {renderIcon()}
          </div>
        )}

        {/* Title */}
        <h3 className="font-bold text-slate-900 dark:text-slate-100 text-xs sm:text-sm mb-1 leading-snug">
          {title}
        </h3>

        {/* Description */}
        <p className="text-slate-500 dark:text-slate-400 text-xs leading-relaxed">
          {description}
        </p>

        {children}
      </div>

      {/* Bottom Minimal Highlight */}
      {highlight && (
        <div className="mt-3 pt-2.5 border-t border-slate-100 dark:border-slate-800 flex items-center gap-1.5 text-[11px] font-medium text-slate-600 dark:text-slate-400">
          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
          <span className="truncate">{highlight}</span>
        </div>
      )}
    </div>
  );
}
