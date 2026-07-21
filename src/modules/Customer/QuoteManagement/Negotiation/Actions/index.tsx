import React, { useState, useRef, useEffect } from 'react';
import { Paperclip, Image as ImageIcon, Smile, Send, X, File as FileIcon } from 'lucide-react';
import Button from '@/components/ui/button';

const EMOJIS = ['😀', '😂', '🥰', '😎', '🤔', '👍', '🙏', '🔥', '✨', '💯', '🎉', '💡', '✅', '❌'];

export default function ChatInputActions({ 
    inputValue, 
    setInputValue, 
    scrollToBottom 
}: { 
    inputValue: string; 
    setInputValue: (v: string) => void;
    scrollToBottom: () => void;
}) {
    const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
    const [showEmojiPicker, setShowEmojiPicker] = useState(false);
    
    const imageInputRef = useRef<HTMLInputElement>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const emojiPickerRef = useRef<HTMLDivElement>(null);
    const textareaRef = useRef<HTMLTextAreaElement>(null);

    // Close emoji picker when clicking outside
    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (emojiPickerRef.current && !emojiPickerRef.current.contains(event.target as Node)) {
                setShowEmojiPicker(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            const filesArray = Array.from(e.target.files);
            setSelectedFiles(prev => [...prev, ...filesArray]);
        }
        // reset input so the same file can be selected again if removed
        e.target.value = '';
    };

    const removeFile = (indexToRemove: number) => {
        setSelectedFiles(prev => prev.filter((_, index) => index !== indexToRemove));
    };

    const handleEmojiClick = (emoji: string) => {
        setInputValue(inputValue + emoji);
        textareaRef.current?.focus();
    };

    const handleSend = () => {
        if (inputValue.trim() || selectedFiles.length > 0) {
            setInputValue('');
            setSelectedFiles([]);
            setShowEmojiPicker(false);
            scrollToBottom();
        }
    };

    return (
        <div className="bg-white p-3 z-10 flex flex-col gap-2">
            {/* File Previews */}
            {selectedFiles.length > 0 && (
                <div className="flex gap-2 px-1 overflow-x-auto pb-1">
                    {selectedFiles.map((file, idx) => (
                        <div key={idx} className="relative group bg-slate-100 rounded-lg p-2 flex items-center gap-2 border border-slate-200 pr-8 shrink-0 max-w-[200px]">
                            {file.type.startsWith('image/') ? (
                                <div className="w-8 h-8 rounded bg-slate-200 overflow-hidden shrink-0 flex items-center justify-center">
                                    <img src={URL.createObjectURL(file)} alt="preview" className="w-full h-full object-cover" />
                                </div>
                            ) : (
                                <div className="w-8 h-8 rounded bg-indigo-50 text-indigo-500 shrink-0 flex items-center justify-center">
                                    <FileIcon size={16} />
                                </div>
                            )}
                            <div className="text-[12px] font-medium text-slate-700 truncate">{file.name}</div>
                            <button 
                                onClick={() => removeFile(idx)}
                                className="absolute right-1.5 top-1/2 -translate-y-1/2 w-5 h-5 bg-white text-slate-500 hover:text-red-500 hover:bg-red-50 rounded-full flex items-center justify-center transition-colors shadow-sm"
                            >
                                <X size={12} />
                            </button>
                        </div>
                    ))}
                </div>
            )}

            <div className="flex items-end gap-2 relative">
                {/* Hidden File Inputs */}
                <input 
                    type="file" 
                    ref={imageInputRef} 
                    className="hidden" 
                    accept="image/*" 
                    multiple 
                    onChange={handleFileChange} 
                />
                <input 
                    type="file" 
                    ref={fileInputRef} 
                    className="hidden" 
                    multiple 
                    onChange={handleFileChange} 
                />
                <Button variant="ghost" size="icon" className="h-9 w-9 text-indigo-600 rounded-full hover:bg-slate-100 shrink-0">
                    <div className="w-5 h-5 rounded-full border-2 border-indigo-600 flex items-center justify-center">
                        <span className="text-lg leading-none font-bold mb-[2px]">+</span>
                    </div>
                </Button>
                <Button 
                    variant="ghost" 
                    size="icon" 
                    className="h-9 w-9 text-indigo-600 rounded-full hover:bg-slate-100 shrink-0"
                    onClick={() => imageInputRef.current?.click()}
                >
                    <ImageIcon size={22} />
                </Button>
                <Button 
                    variant="ghost" 
                    size="icon" 
                    className="h-9 w-9 text-indigo-600 rounded-full hover:bg-slate-100 shrink-0"
                    onClick={() => fileInputRef.current?.click()}
                >
                    <Paperclip size={22} />
                </Button>
                
                <div className="flex-1 bg-slate-100 rounded-[20px] flex items-center pr-2 pl-4 py-1.5 min-h-[38px] relative">
                    <textarea 
                        ref={textareaRef}
                        value={inputValue}
                        onChange={(e) => setInputValue(e.target.value)}
                        placeholder="Aa"
                        className="flex-1 max-h-32 bg-transparent border-none focus:ring-0 resize-none py-1 px-0 text-[14.5px] text-slate-900 placeholder-slate-500 leading-tight"
                        rows={1}
                        onKeyDown={(e) => {
                            if(e.key === 'Enter' && !e.shiftKey) {
                                e.preventDefault();
                                handleSend();
                            }
                        }}
                    />
                    
                    <div ref={emojiPickerRef} className="relative">
                        <Button 
                            variant="ghost" 
                            size="icon" 
                            className={`h-8 w-8 rounded-full shrink-0 ${showEmojiPicker ? 'bg-indigo-100 text-indigo-700' : 'text-indigo-600 hover:bg-slate-200'}`}
                            onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                        >
                            <Smile size={20} />
                        </Button>

                        {/* Emoji Picker Popover */}
                        {showEmojiPicker && (
                            <div className="absolute bottom-full right-0 mb-2 bg-white border border-slate-200 rounded-xl shadow-lg p-2 w-[240px] z-50">
                                <div className="grid grid-cols-5 gap-1">
                                    {EMOJIS.map(emoji => (
                                        <button
                                            key={emoji}
                                            onClick={() => handleEmojiClick(emoji)}
                                            className="h-10 w-10 text-xl flex items-center justify-center rounded-lg hover:bg-slate-100 transition-colors"
                                        >
                                            {emoji}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                <Button 
                    variant="ghost" 
                    size="icon" 
                    className="h-9 w-9 rounded-full shrink-0 text-indigo-600 hover:bg-slate-100"
                    onClick={handleSend}
                >
                    <Send size={22} className={(inputValue.trim() || selectedFiles.length > 0) ? 'fill-indigo-600 text-indigo-600' : ''} />
                </Button>
            </div>
        </div>
    );
}
