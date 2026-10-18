import React from 'react';
import { ArrowLeft, Search, PanelLeftClose } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Skeleton from '@/components/ui/skeleton';
import Button from '@/components/ui/button';

export const ChatSidebarSkeleton: React.FC = () => {
    const navigate = useNavigate();

    return (
        <div className="hidden lg:flex w-[360px] shrink-0 flex-col min-h-0 h-full bg-white dark:bg-[#12161c] border-r border-slate-200 dark:border-slate-800">
            {/* Real Header */}
            <div className="h-[60px] px-4 flex items-center justify-between border-b border-slate-200 dark:border-slate-800 shrink-0 box-border bg-white dark:bg-[#12161c]">
                <div className="flex items-center gap-3 min-w-0">
                    <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-slate-500 rounded-full hover:bg-slate-100 -ml-2 cursor-pointer shrink-0"
                        onClick={() => navigate('/supplier/quotes/negotiation')}
                        title="Back to table"
                    >
                        <ArrowLeft size={18} />
                    </Button>
                    <div className="min-w-0">
                        <h2 className="text-[15px] font-bold text-slate-800 dark:text-slate-100 tracking-tight leading-none truncate">
                            Negotiations
                        </h2>
                        <span className="text-[11px] text-slate-400 font-medium truncate block mt-0.5">
                            Quote Negotiations
                        </span>
                    </div>
                </div>
                <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 text-slate-500 hover:text-[#FF4A1F] hover:bg-orange-50 rounded-md cursor-pointer shrink-0 ml-1 transition-colors"
                    title="Collapse sidebar"
                >
                    <PanelLeftClose size={18} />
                </Button>
            </div>

            {/* Real Search Bar */}
            <div className="px-3.5 pt-3 pb-2">
                <div className="relative">
                    <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none z-10" />
                    <input
                        type="text"
                        disabled
                        placeholder="Search negotiations, routes..."
                        className="w-full h-[36px] pl-9 pr-4 text-[13px] bg-slate-100 dark:bg-slate-800/80 border-none rounded-full outline-none text-slate-800 dark:text-slate-200 placeholder-slate-400 font-medium"
                    />
                </div>
            </div>

            {/* Real Filter Tabs */}
            <div className="px-3.5 py-1.5 flex items-center gap-2 overflow-x-auto [&::-webkit-scrollbar]:hidden">
                <button
                    type="button"
                    className="rounded-full px-3.5 py-1 text-[11.5px] cursor-pointer outline-none bg-orange-50 text-[#FF4A1F] border border-orange-200/80 font-bold shadow-2xs"
                >
                    All
                </button>
                <button
                    type="button"
                    className="rounded-full px-3.5 py-1 text-[11.5px] cursor-pointer whitespace-nowrap outline-none bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 border border-slate-200/80 dark:border-slate-700/80 font-semibold"
                >
                    Unread
                </button>
            </div>

            {/* ONLY Dynamic Database Content: Chat Item List */}
            <div className="flex-1 overflow-y-auto px-2 py-2 space-y-1.5 [&::-webkit-scrollbar]:hidden">
                {[1, 2, 3, 4, 5, 6].map((i) => (
                    <div
                        key={i}
                        className={`p-2.5 rounded-lg flex gap-3 items-center border border-slate-200/60 dark:border-slate-800/80 ${
                            i === 1 ? 'bg-slate-50 dark:bg-[#181f28]' : 'bg-white dark:bg-[#12161c]'
                        }`}
                    >
                        <div className="relative shrink-0 w-10 h-10">
                            <Skeleton className="w-10 h-10 rounded-full aspect-square" />
                        </div>
                        <div className="min-w-0 flex-1 space-y-2">
                            <div className="flex items-center justify-between gap-2">
                                <Skeleton className="h-3.5 w-24 rounded-md" />
                                <Skeleton className="h-2.5 w-10 rounded-md" />
                            </div>
                            <Skeleton className="h-3 w-40 rounded-md" />
                            <div className="flex items-center justify-between pt-0.5">
                                <Skeleton className="h-3 w-16 rounded-md" />
                                <Skeleton className="h-3.5 w-14 rounded-md" />
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};
