import React, { useState, useEffect } from 'react';
import { Search, X, FileText, Package, Users, Settings, Activity, ArrowUpRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function GlobalSearch({ isOpen, onClose }: { isOpen: boolean, onClose: () => void }) {
    const [query, setQuery] = useState('');
    const navigate = useNavigate();

    // Close on escape
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'Escape') onClose();
        };
        if (isOpen) {
            window.addEventListener('keydown', handleKeyDown);
            // Prevent body scrolling
            document.body.style.overflow = 'hidden';
        }
        return () => {
            window.removeEventListener('keydown', handleKeyDown);
            document.body.style.overflow = 'unset';
        };
    }, [isOpen, onClose]);

    if (!isOpen) return null;

    const quickLinks = [
        { name: 'Active Orders', path: '/supplier/orders/active-jobs', icon: Package },
        { name: 'Quote Requests', path: '/supplier/quotes/requests', icon: FileText },
        { name: 'Team Management', path: '/supplier/team', icon: Users },
        { name: 'Dashboard Overview', path: '/supplier/dashboard', icon: Activity },
        { name: 'Settings', path: '/supplier/settings', icon: Settings },
    ];

    const filteredLinks = query.trim() === ''
        ? quickLinks
        : quickLinks.filter(link => link.name.toLowerCase().includes(query.toLowerCase()));

    return (
        <div className="fixed inset-0 z-[100] flex items-start justify-center pt-[12vh] sm:pt-[16vh] px-4">
            <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs transition-opacity" onClick={onClose} />

            <div className="relative bg-white rounded-[3px] shadow-xl w-full max-w-lg overflow-hidden flex flex-col border border-slate-200/90 animate-in fade-in zoom-in-95 duration-150 font-sans">
                {/* Search Input Bar (Compact) */}
                <div className="flex items-center px-3.5 py-2.5 border-b border-slate-100 gap-2.5">
                    <Search className="text-[#FF4A1F] shrink-0" size={17} />
                    <input
                        autoFocus
                        type="text"
                        placeholder="Search for orders, quotes, settings..."
                        className="flex-1 bg-transparent border-none outline-none text-slate-800 placeholder-slate-400 text-[13.5px]"
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                    />
                    <button
                        onClick={onClose}
                        className="p-1 rounded-[3px] text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors cursor-pointer"
                        title="Close (Esc)"
                    >
                        <X size={16} />
                    </button>
                </div>

                {/* Quick Links List (Compact) */}
                <div className="p-1.5 max-h-[50vh] overflow-y-auto">
                    {query.trim() === '' && (
                        <div className="px-2.5 pt-1.5 pb-1 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                            Suggested Quick Links
                        </div>
                    )}

                    {filteredLinks.length > 0 ? (
                        <div className="space-y-0.5">
                            {filteredLinks.map((link, i) => (
                                <button
                                    key={i}
                                    onClick={() => {
                                        navigate(link.path);
                                        onClose();
                                    }}
                                    className="w-full flex items-center px-2.5 py-2 rounded-[3px] hover:bg-orange-50/80 text-left group transition-colors cursor-pointer"
                                >
                                    <div className="w-6 h-6 rounded-[3px] bg-slate-100 group-hover:bg-orange-100 flex items-center justify-center mr-2.5 transition-colors shrink-0">
                                        <link.icon size={14} className="text-slate-500 group-hover:text-[#FF4A1F] transition-colors" />
                                    </div>
                                    <span className="text-[13px] font-medium text-slate-700 group-hover:text-[#FF4A1F] transition-colors truncate">
                                        {link.name}
                                    </span>
                                    <span className="ml-auto text-[11px] text-slate-400 group-hover:text-[#FF4A1F] flex items-center gap-0.5 transition-colors shrink-0">
                                        Jump to <ArrowUpRight size={11} />
                                    </span>
                                </button>
                            ))}
                        </div>
                    ) : (
                        <div className="py-8 text-center">
                            <Search className="mx-auto text-slate-300 mb-2" size={24} />
                            <p className="text-slate-500 text-xs font-medium">No results found for "{query}"</p>
                        </div>
                    )}
                </div>

                {/* Compact Keyboard Shortcuts Footer */}
                <div className="bg-slate-50/90 px-3.5 py-2 border-t border-slate-100 text-[11px] text-slate-400 flex items-center gap-3">
                    <span className="flex items-center gap-1">
                        <kbd className="bg-white border border-slate-200 rounded-[3px] px-1.5 py-0.5 text-[9.5px] font-bold shadow-2xs text-slate-500">esc</kbd> to close
                    </span>
                    <span className="flex items-center gap-1">
                        <kbd className="bg-white border border-slate-200 rounded-[3px] px-1.5 py-0.5 text-[9.5px] font-bold shadow-2xs text-slate-500">enter</kbd> to select
                    </span>
                </div>
            </div>
        </div>
    );
}
