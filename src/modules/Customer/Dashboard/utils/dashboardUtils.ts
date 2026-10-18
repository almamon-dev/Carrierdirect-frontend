import {
  Euro,
  FileText,
  Package,
  Star,
  Truck,
  Bell,
} from "lucide-react";

export function formatCurrency(num: number | string | undefined): string {
  const val = Number(num) || 0;
  return `€${val.toLocaleString("en-US", { minimumFractionDigits: 0, maximumFractionDigits: 2 })}`;
}

export function timeAgo(dateString?: string): string {
  if (!dateString) return "Just now";
  const now = new Date();
  const past = new Date(dateString);
  const diffMs = now.getTime() - past.getTime();
  const diffSec = Math.floor(diffMs / 1000);
  const diffMin = Math.floor(diffSec / 60);
  const diffHr = Math.floor(diffMin / 60);
  const diffDays = Math.floor(diffHr / 24);

  if (diffMin < 1) return "Just now";
  if (diffMin < 60) return `${diffMin}m ago`;
  if (diffHr < 24) return `${diffHr}h ago`;
  if (diffDays === 1) return "Yesterday";
  if (diffDays < 30) return `${diffDays}d ago`;
  return past.toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

export function getOrderProgress(statusStr: string): number {
  const s = (statusStr || "").toLowerCase();
  if (s.includes("deliver") || s.includes("complete")) return 100;
  if (s.includes("out") || s.includes("arrival")) return 85;
  if (s.includes("transit") || s.includes("progress")) return 65;
  if (s.includes("load") || s.includes("picked") || s.includes("pickup")) return 40;
  if (s.includes("confirm") || s.includes("accept") || s.includes("booked")) return 25;
  if (s.includes("pending") || s.includes("process")) return 15;
  if (s.includes("cancel")) return 0;
  return 20;
}

export function getOrderStatusConfig(statusStr: string) {
  const s = (statusStr || "").toLowerCase();
  if (s.includes("transit") || s.includes("progress")) {
    return {
      label: "In Transit",
      color: "bg-emerald-50 dark:bg-emerald-950/50 text-emerald-600 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800/50",
      progressColor: "bg-emerald-500",
    };
  }
  if (s.includes("load") || s.includes("picked") || s.includes("pickup")) {
    return {
      label: "Loading",
      color: "bg-amber-50 dark:bg-amber-950/50 text-amber-600 dark:text-amber-400 border-amber-200 dark:border-amber-800/50",
      progressColor: "bg-amber-500",
    };
  }
  if (s.includes("out")) {
    return {
      label: "Out for Delivery",
      color: "bg-emerald-50 dark:bg-emerald-950/50 text-emerald-600 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800/50",
      progressColor: "bg-emerald-500",
    };
  }
  if (s.includes("deliver") || s.includes("complete")) {
    return {
      label: "Delivered",
      color: "bg-blue-50 dark:bg-blue-950/50 text-blue-600 dark:text-blue-400 border-blue-200 dark:border-blue-800/50",
      progressColor: "bg-blue-500",
    };
  }
  if (s.includes("cancel")) {
    return {
      label: "Cancelled",
      color: "bg-rose-50 dark:bg-rose-950/50 text-rose-600 dark:text-rose-400 border-rose-200 dark:border-rose-800/50",
      progressColor: "bg-rose-500",
    };
  }
  if (s.includes("booked") || s.includes("confirm")) {
    return {
      label: "Booked",
      color: "bg-emerald-50 dark:bg-emerald-950/50 text-emerald-600 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800/50",
      progressColor: "bg-emerald-500",
    };
  }
  return {
    label: statusStr || "Pending",
    color: "bg-brand-light dark:bg-[#ff4a1f]/20 text-brand border-brand/20 dark:border-[#ff4a1f]/30",
    progressColor: "bg-brand",
  };
}

export function getRequestStatusConfig(statusStr: string) {
  const s = (statusStr || "").toLowerCase();
  if (s.includes("draft")) {
    return { label: "Draft", color: "bg-slate-100 dark:bg-slate-800/80 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-700/60" };
  }
  if (s.includes("quot") || s.includes("received")) {
    return { label: "Quoting", color: "bg-amber-50 dark:bg-amber-950/50 text-amber-600 dark:text-amber-400 border-amber-200 dark:border-amber-800/50" };
  }
  if (s.includes("book") || s.includes("accept") || s.includes("confirmed")) {
    return { label: "Booked", color: "bg-emerald-50 dark:bg-emerald-950/50 text-emerald-600 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800/50" };
  }
  if (s.includes("action") || s.includes("require")) {
    return { label: "Action Required", color: "bg-rose-50 dark:bg-rose-950/50 text-rose-600 dark:text-rose-400 border-rose-200 dark:border-rose-800/50" };
  }
  if (s.includes("review") || s.includes("pending")) {
    return { label: "Reviewing", color: "bg-brand-light dark:bg-[#ff4a1f]/20 text-brand border-brand/20 dark:border-[#ff4a1f]/30" };
  }
  if (s.includes("cancel")) {
    return { label: "Cancelled", color: "bg-slate-100 dark:bg-slate-800/80 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-700/60" };
  }
  return { label: statusStr || "Active", color: "bg-brand-light dark:bg-[#ff4a1f]/20 text-brand border-brand/20 dark:border-[#ff4a1f]/30" };
}

export function getNotificationConfig(notif: any) {
  const text = notif.data?.message || notif.message || notif.title || notif.text || "New notification";
  const t = text.toLowerCase();

  if (t.includes("quote")) {
    return {
      icon: FileText,
      bg: "bg-purple-100 dark:bg-purple-950/60",
      color: "text-purple-600 dark:text-purple-400",
    };
  }
  if (t.includes("booked") || t.includes("booking") || t.includes("order")) {
    return {
      icon: Package,
      bg: "bg-emerald-100 dark:bg-emerald-950/60",
      color: "text-emerald-600 dark:text-emerald-400",
    };
  }
  if (t.includes("transit") || t.includes("deliver") || t.includes("truck") || t.includes("status")) {
    return {
      icon: Truck,
      bg: "bg-blue-100 dark:bg-blue-950/60",
      color: "text-[#ff4a1f]",
    };
  }
  if (t.includes("payment") || t.includes("invoice") || t.includes("paid") || t.includes("€") || t.includes("euro")) {
    return {
      icon: Euro,
      bg: "bg-emerald-100 dark:bg-emerald-950/60",
      color: "text-emerald-600 dark:text-emerald-400",
    };
  }
  if (t.includes("rate") || t.includes("review") || t.includes("star")) {
    return {
      icon: Star,
      bg: "bg-amber-100 dark:bg-amber-950/60",
      color: "text-amber-600 dark:text-amber-400",
    };
  }
  return {
    icon: Bell,
    bg: "bg-slate-100 dark:bg-slate-800",
    color: "text-slate-600 dark:text-slate-300",
  };
}
