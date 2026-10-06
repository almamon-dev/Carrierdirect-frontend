import React from 'react';
import { ArrowLeft, Search, PanelLeftClose, MoreVertical, Paperclip, Image, Send } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Skeleton from '@/components/ui/skeleton';
import Button from '@/components/ui/button';

export function CustomerChatSkeletonLoader() {
    const navigate = useNavigate();

    return (
        <div className="p-0 sm:p-2 md:p-3 w-full mx-auto h-full flex flex-col font-sans min-h-0 overflow-hidden box-border">
            <div className="flex flex-1 min-h-0 min-w-0 bg-white dark:bg-[#12161c] border-0 sm:border border-slate-200 dark:border-slate-800 rounded-none sm:rounded-lg overflow-hidden shadow-none sm:shadow-xs relative">
                {/* Left Sidebar (Real UI frame, skeletons ONLY on database items) */}
                <div className="hidden lg:flex w-[320px] 2xl:w-[350px] shrink-0 flex-col min-h-0 h-full bg-white dark:bg-[#12161c] border-r border-slate-200 dark:border-slate-800">
                    {/* Real Header */}
                    <div className="h-[60px] px-4 flex items-center justify-between border-b border-slate-200 dark:border-slate-800 shrink-0 box-border bg-white dark:bg-[#12161c]">
                        <div className="flex items-center gap-3 min-w-0">
                            <Button
                                variant="ghost"
                                size="icon"
                                className="h-8 w-8 text-slate-500 rounded-full hover:bg-slate-100 -ml-2 cursor-pointer shrink-0"
                                onClick={() => navigate('/customer/quotes/negotiation')}
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
                        {[1, 2, 3, 4, 5].map((i) => (
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
                                        <Skeleton className="h-2.5 w-12 rounded-md" />
                                    </div>
                                    <Skeleton className="h-3 w-40 rounded-md" />
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Middle Chat Center Panel (Real UI frame, skeletons ONLY on database items) */}
                <div className="flex-1 min-w-0 flex flex-col min-h-0 h-full bg-[#F8FAFC] dark:bg-[#0f1318] relative">
                    {/* Real Header: Avatar & Name from DB have skeletons */}
                    <div className="h-[60px] bg-white dark:bg-[#12161c] border-b border-slate-200 dark:border-slate-800 px-3 sm:px-4 flex items-center justify-between z-10 sticky top-0 shadow-2xs font-sans shrink-0 box-border">
                        <div className="flex items-center gap-3 min-w-0">
                            {/* Avatar from DB */}
                            <Skeleton className="w-10 h-10 rounded-full aspect-square shrink-0" />
                            {/* Name & status from DB */}
                            <div className="min-w-0 space-y-1.5">
                                <div className="flex items-center gap-2">
                                    <Skeleton className="h-4 w-32 rounded-md" />
                                    <Skeleton className="h-3.5 w-3.5 rounded-full" />
                                </div>
                                <div className="flex items-center gap-2">
                                    <Skeleton className="h-3 w-16 rounded-md" />
                                    <span className="text-slate-300 dark:text-slate-700">•</span>
                                    <Skeleton className="h-3 w-16 rounded-md" />
                                </div>
                            </div>
                        </div>

                        {/* Real More Options Button */}
                        <div className="flex items-center gap-2 shrink-0">
                            <button
                                type="button"
                                className="h-8 w-8 rounded-[4px] flex items-center justify-center text-slate-500 hover:text-slate-800 hover:bg-slate-100 transition-colors"
                                title="More Options"
                            >
                                <MoreVertical size={18} />
                            </button>
                        </div>
                    </div>

                    {/* Messages Body (Messages come from DB, so only messages have skeletons) */}
                    <div className="flex-1 min-h-0 min-w-0 overflow-y-auto p-3 sm:p-5 md:p-6 space-y-4 bg-[#F8FAFC] dark:bg-[#0f1318] [&::-webkit-scrollbar]:hidden">
                        {/* 1. Customer initial inquiry */}
                        <div className="flex items-start gap-2.5 max-w-lg">
                            <Skeleton className="w-8 h-8 rounded-full shrink-0 aspect-square mt-0.5" />
                            <div className="space-y-1 max-w-[85%]">
                                <div className="p-3.5 rounded-2xl rounded-tl-xs bg-white dark:bg-[#182029] border border-slate-200/80 dark:border-slate-800 shadow-2xs space-y-2">
                                    <Skeleton className="h-3.5 w-60 rounded-md" />
                                    <Skeleton className="h-3.5 w-44 rounded-md" />
                                </div>
                                <Skeleton className="h-2.5 w-12 rounded-md ml-1" />
                            </div>
                        </div>

                        {/* 2. Quotation Offer Details Card */}
                        <div className="flex justify-start w-full my-1.5 pl-0 sm:pl-10">
                            <div className="w-[440px] sm:w-[460px] max-w-full bg-white dark:bg-[#182029] border border-slate-200/90 dark:border-slate-800 rounded-xl p-4 shadow-2xs space-y-3 font-sans">
                                {/* Card Header */}
                                <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
                                    <div className="flex items-center gap-2.5">
                                        <Skeleton className="w-7 h-7 rounded-lg shrink-0" />
                                        <div className="space-y-1">
                                            <Skeleton className="h-3.5 w-36 rounded-md" />
                                            <Skeleton className="h-2.5 w-14 rounded-md" />
                                        </div>
                                    </div>
                                    <Skeleton className="h-6 w-20 rounded-full" />
                                </div>

                                {/* Route section */}
                                <div className="py-1 space-y-2">
                                    <div className="flex items-center justify-between">
                                        <Skeleton className="h-3.5 w-44 rounded-md" />
                                        <Skeleton className="h-3 w-16 rounded-md" />
                                    </div>
                                    <Skeleton className="h-3.5 w-48 rounded-md" />
                                </div>

                                {/* Pricing Breakdown */}
                                <div className="border-t border-slate-100 dark:border-slate-800 pt-2.5 space-y-2">
                                    {[1, 2, 3].map((i) => (
                                        <div key={i} className="flex items-center justify-between">
                                            <Skeleton className="h-3 w-28 rounded-md" />
                                            <Skeleton className="h-3.5 w-16 rounded-md" />
                                        </div>
                                    ))}
                                </div>

                                {/* Total Offered Rate */}
                                <div className="border-t border-slate-100 dark:border-slate-800 pt-3 flex items-center justify-between">
                                    <Skeleton className="h-4 w-32 rounded-md" />
                                    <Skeleton className="h-5 w-24 rounded-md" />
                                </div>

                                {/* Action Buttons */}
                                <div className="pt-2 space-y-2">
                                    <Skeleton className="h-9 w-full rounded-lg" />
                                    <Skeleton className="h-9 w-full rounded-lg" />
                                </div>
                            </div>
                        </div>

                        {/* 3. Right-aligned Customer Message Bubble */}
                        <div className="flex justify-end w-full">
                            <div className="space-y-1 flex flex-col items-end max-w-[80%] sm:max-w-[70%]">
                                <div className="p-3.5 rounded-2xl rounded-tr-xs bg-white dark:bg-[#182029] border border-slate-200/80 dark:border-slate-800 shadow-2xs space-y-2">
                                    <Skeleton className="h-3.5 w-56 rounded-md" />
                                    <Skeleton className="h-3.5 w-40 rounded-md" />
                                </div>
                                <Skeleton className="h-2.5 w-14 rounded-md mr-1" />
                            </div>
                        </div>
                    </div>

                    {/* REAL Input Bar (NOT skeleton!) */}
                    <div className="flex items-end gap-2 sm:gap-2.5 px-3 sm:px-4 py-2 sm:py-2.5 bg-white dark:bg-[#12161c] border-t border-slate-200/80 dark:border-slate-800 shrink-0 box-border">
                        <div className="flex items-center gap-1 text-slate-500 dark:text-slate-400 pb-0.5 shrink-0">
                            <button
                                type="button"
                                disabled
                                className="p-2 text-slate-400 hover:text-slate-600 rounded-full hover:bg-slate-100 transition-colors"
                                title="Attach Document"
                            >
                                <Paperclip size={18} />
                            </button>
                            <button
                                type="button"
                                disabled
                                className="p-2 text-slate-400 hover:text-slate-600 rounded-full hover:bg-slate-100 transition-colors"
                                title="Attach Image"
                            >
                                <Image size={18} />
                            </button>
                        </div>
                        <div className="flex-1 min-w-0 bg-[#F8FAFC] dark:bg-[#202c33] rounded-full px-4 py-2 border border-[#E5E7EB] dark:border-slate-700 flex items-center shadow-2xs h-[42px] box-border">
                            <input
                                type="text"
                                disabled
                                placeholder="Type a message or counter offer..."
                                className="w-full bg-transparent border-none outline-none text-[13.5px] text-slate-800 dark:text-slate-200 placeholder-slate-400"
                            />
                        </div>
                        <div className="flex items-center gap-2 shrink-0 pb-0.5">
                            <button
                                type="button"
                                disabled
                                className="h-10 w-10 rounded-full bg-[#FF4A1F] text-white flex items-center justify-center opacity-60 cursor-not-allowed shadow-2xs shrink-0"
                            >
                                <Send size={16} />
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
