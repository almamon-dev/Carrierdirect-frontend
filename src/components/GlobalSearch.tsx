import React, { useState, useEffect } from 'react';
import { Search, X, FileText, Package, Users, Settings, Activity } from 'lucide-react';
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
        <div className="fixed inset-0 z-[100] flex items-start justify-center pt-[10vh] sm:pt-[20vh] px-4">
            <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm" onClick={onClose} />
            
            <div className="relative bg-white rounded-xl shadow-2xl w-full max-w-2xl overflow-hidden flex flex-col border border-slate-200 animate-in fade-in zoom-in-95 duration-200">
                <div className="flex items-center px-4 py-4 border-b border-slate-100">
                    <Search className="text-[#FF4A1F] mr-3 shrink-0" size={20} />
                    <input
                        autoFocus
                        type="text"
                        placeholder="Search for orders, quotes, settings..."
                        className="flex-1 bg-transparent border-none outline-none text-slate-800 placeholder-slate-400 text-lg"
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                    />
                    <button 
                        onClick={onClose}
                        className="p-1 rounded-sm text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
                    >
                        <X size={20} />
                    </button>
                </div>

                <div className="p-2 max-h-[60vh] overflow-y-auto">
                    {query.trim() === '' && (
                        <div className="px-3 py-2 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                            Suggested Quick Links
                        </div>
                    )}
                    
                    {filteredLinks.length > 0 ? (
                        <div className="space-y-1">
                            {filteredLinks.map((link, i) => (
                                <button
                                    key={i}
                                    onClick={() => {
                                        navigate(link.path);
                                        onClose();
                                    }}
                                    className="w-full flex items-center px-3 py-3 rounded-lg hover:bg-[#FFF0ED] text-left group transition-colors"
                                >
                                    <link.icon size={18} className="text-slate-400 group-hover:text-[#FF4A1F] mr-3" />
                                    <span className="text-[14px] font-semibold text-slate-700 group-hover:text-[#FF4A1F]">{link.name}</span>
                                    <span className="ml-auto text-xs text-slate-400 group-hover:text-[#FF4A1F]">Jump to</span>
                                </button>
                            ))}
                        </div>
                    ) : (
                        <div className="py-12 text-center">
                            <Search className="mx-auto text-slate-300 mb-3" size={32} />
                            <p className="text-slate-500 text-[14px] font-medium">No results found for "{query}"</p>
                        </div>
                    )}
                </div>
                
                <div className="bg-slate-50 px-4 py-3 border-t border-slate-100 text-xs text-slate-500 flex items-center gap-4">
                    <span className="flex items-center gap-1">
                        <kbd className="bg-white border border-slate-200 rounded px-1.5 py-0.5 font-sans font-bold shadow-sm">esc</kbd> to close
                    </span>
                    <span className="flex items-center gap-1">
                        <kbd className="bg-white border border-slate-200 rounded px-1.5 py-0.5 font-sans font-bold shadow-sm">enter</kbd> to select
                    </span>
                </div>
            </div>
        </div>
    );
}
