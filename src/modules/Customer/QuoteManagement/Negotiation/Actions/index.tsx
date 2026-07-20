import React from 'react';
import { Paperclip, Image as ImageIcon, Smile, Send } from 'lucide-react';
import Button from '@/components/ui/button';

export default function ChatInputActions({ 
    inputValue, 
    setInputValue, 
    scrollToBottom 
}: { 
    inputValue: string; 
    setInputValue: (v: string) => void;
    scrollToBottom: () => void;
}) {
    return (
        <div className="bg-white p-3 z-10">
            <div className="flex items-end gap-2">
                <Button variant="ghost" size="icon" className="h-9 w-9 text-indigo-600 rounded-full hover:bg-slate-100 shrink-0">
                    <div className="w-5 h-5 rounded-full border-2 border-indigo-600 flex items-center justify-center">
                        <span className="text-lg leading-none font-bold mb-[2px]">+</span>
                    </div>
                </Button>
                <Button variant="ghost" size="icon" className="h-9 w-9 text-indigo-600 rounded-full hover:bg-slate-100 shrink-0">
                    <ImageIcon size={22} />
                </Button>
                <Button variant="ghost" size="icon" className="h-9 w-9 text-indigo-600 rounded-full hover:bg-slate-100 shrink-0">
                    <Paperclip size={22} />
                </Button>
                
                <div className="flex-1 bg-slate-100 rounded-[20px] flex items-center pr-2 pl-4 py-1.5 min-h-[38px]">
                    <textarea 
                        value={inputValue}
                        onChange={(e) => setInputValue(e.target.value)}
                        placeholder="Aa"
                        className="flex-1 max-h-32 bg-transparent border-none focus:ring-0 resize-none py-1 px-0 text-[14.5px] text-slate-900 placeholder-slate-500 leading-tight"
                        rows={1}
                        onKeyDown={(e) => {
                            if(e.key === 'Enter' && !e.shiftKey) {
                                e.preventDefault();
                                if(inputValue.trim()) {
                                    setInputValue('');
                                    scrollToBottom();
                                }
                            }
                        }}
                    />
                    <Button variant="ghost" size="icon" className="h-8 w-8 text-indigo-600 rounded-full hover:bg-slate-200 shrink-0">
                        <Smile size={20} />
                    </Button>
                </div>

                <Button 
                    variant="ghost" 
                    size="icon" 
                    className="h-9 w-9 rounded-full shrink-0 text-indigo-600 hover:bg-slate-100"
                >
                    <Send size={22} className={inputValue.trim() ? 'fill-indigo-600 text-indigo-600' : ''} />
                </Button>
            </div>
        </div>
    );
}
