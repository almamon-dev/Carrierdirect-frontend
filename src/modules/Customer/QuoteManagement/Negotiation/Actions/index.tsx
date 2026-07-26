import React, { useState, useRef, useEffect } from 'react';
import { Paperclip, Image as ImageIcon, Smile, Send, X, File as FileIcon, DollarSign, Calculator, Plus, Trash2, Pencil, Check, Receipt } from 'lucide-react';
import Button from '@/components/ui/button';
import Input from '@/components/ui/input';
import Textarea from '@/components/ui/textarea';
import Modal from '@/components/modals/modal';

const EMOJIS = ['😀', '😂', '🥰', '😎', '🤔', '👍', '🙏', '🔥', '✨', '💯', '🎉', '💡', '✅', '❌', '🚚', '📦'];

interface CustomCharge {
    id: number;
    label: string;
    description?: string;
    amount: string;
}

export default function ChatInputActions({ 
    inputValue, 
    setInputValue, 
    scrollToBottom,
    onSendMessage,
    onSendCounterOffer,
    isSupplier = false,
    isEditing = false,
    onCancelEdit
}: { 
    inputValue: string; 
    setInputValue: (v: string) => void;
    scrollToBottom: () => void;
    onSendMessage?: (text: string, files?: File[]) => void;
    onSendCounterOffer?: (amount: number, note: string) => void;
    isSupplier?: boolean;
    isEditing?: boolean;
    onCancelEdit?: () => void;
}) {
    const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
    const [showEmojiPicker, setShowEmojiPicker] = useState(false);
    const [showCounterOfferModal, setShowCounterOfferModal] = useState(false);

    // Customer Target Total
    const [counterOfferAmount, setCounterOfferAmount] = useState('');
    const [counterOfferNote, setCounterOfferNote] = useState('');

    // Supplier Itemized Breakdown State
    const [baseFreight, setBaseFreight] = useState('35000');
    const [customCharges, setCustomCharges] = useState<CustomCharge[]>([
        { id: 1, label: 'Load / Unload Fee', description: '2 helpers included', amount: '3500' },
        { id: 2, label: 'Insurance Fee', description: 'Full goods coverage', amount: '1500' }
    ]);

    const addCustomCharge = () => {
        setCustomCharges(prev => [...prev, { id: Date.now(), label: '', description: '', amount: '' }]);
    };

    const updateCustomCharge = (id: number, field: 'label' | 'description' | 'amount', value: string) => {
        setCustomCharges(prev => prev.map(c => c.id === id ? { ...c, [field]: value } : c));
    };

    const removeCustomCharge = (id: number) => {
        setCustomCharges(prev => prev.filter(c => c.id !== id));
    };

    // Calculate itemized total for supplier
    const customTotal = customCharges.reduce((acc, c) => acc + (parseFloat(c.amount) || 0), 0);
    const supplierTotal = (parseFloat(baseFreight) || 0) + customTotal;

    const imageInputRef = useRef<HTMLInputElement>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const emojiPickerRef = useRef<HTMLDivElement>(null);
    const textareaRef = useRef<HTMLTextAreaElement>(null);

    // Close popovers when clicking outside
    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (emojiPickerRef.current && !emojiPickerRef.current.contains(event.target as Node)) {
                setShowEmojiPicker(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    // Auto-resize textarea
    useEffect(() => {
        if (textareaRef.current) {
            textareaRef.current.style.height = 'auto';
            textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 200)}px`;
        }
    }, [inputValue]);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            const filesArray = Array.from(e.target.files);
            setSelectedFiles(prev => [...prev, ...filesArray]);
        }
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
            if (onSendMessage) {
                onSendMessage(inputValue, selectedFiles);
            }
            setInputValue('');
            setSelectedFiles([]);
            setShowEmojiPicker(false);
            scrollToBottom();
        }
    };

    const handleSubmitCounterOffer = (e: React.FormEvent) => {
        e.preventDefault();
        const finalAmount = isSupplier ? supplierTotal : parseFloat(counterOfferAmount);
        
        if (!isNaN(finalAmount) && finalAmount > 0) {
            if (onSendCounterOffer) {
                const customDetails = customCharges.map(c => `${c.label || 'Fee'}${c.description ? ` (${c.description})` : ''}: €${c.amount}`).join(', ');
                const noteText = isSupplier 
                    ? `${counterOfferNote ? counterOfferNote + ' | ' : ''}Breakdown: Base Freight €${baseFreight}${customDetails ? ', ' + customDetails : ''}`
                    : counterOfferNote;
                onSendCounterOffer(finalAmount, noteText);
            }
            setCounterOfferAmount('');
            setCounterOfferNote('');
            setShowCounterOfferModal(false);
            scrollToBottom();
        }
    };

    return (
        <div className="bg-white p-4 border-t border-slate-200/90 z-10 flex flex-col gap-3 relative font-sans">
            {/* Counter Offer Modal */}
            <Modal
                isOpen={showCounterOfferModal}
                onClose={() => setShowCounterOfferModal(false)}
                size="2xl"
                title={
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-orange-50 text-[#FF4A1F] flex items-center justify-center font-bold">
                            <Receipt size={20} />
                        </div>
                        <div>
                            <h3 className="text-base font-bold text-slate-900">Make Counter Offer</h3>
                            <p className="text-xs text-slate-500 font-medium mt-0.5">Propose a new price amount & cost breakdown for this quote</p>
                        </div>
                    </div>
                }
                footer={
                    <div className="flex items-center justify-end gap-2.5 w-full">
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => setShowCounterOfferModal(false)}
                            className="px-4 py-2 text-xs font-bold text-slate-700 rounded-xl cursor-pointer"
                        >
                            Cancel
                        </Button>
                        <Button
                            type="submit"
                            form="counter-offer-form"
                            className="px-5 py-2 bg-[#FF4A1F] hover:bg-[#E03E15] text-white text-xs font-bold rounded-xl transition-all cursor-pointer shadow-md"
                        >
                            Send Counter Offer
                        </Button>
                    </div>
                }
            >
                <form id="counter-offer-form" onSubmit={handleSubmitCounterOffer} className="space-y-4 font-sans">
                    {isSupplier ? (
                        /* Supplier Breakdown Inputs */
                        <div className="space-y-4">
                            <div>
                                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                                    Base Freight (€) <span className="text-rose-500">*</span>
                                </label>
                                <Input
                                    type="number"
                                    placeholder="e.g. 35000"
                                    value={baseFreight}
                                    onChange={(e) => setBaseFreight(e.target.value)}
                                    required
                                    min="1"
                                    className="h-10 rounded-xl text-xs font-bold"
                                />
                            </div>

                            {/* Additional Charges */}
                            <div className="space-y-3 pt-2 border-t border-slate-100">
                                <div className="flex items-center justify-between">
                                    <span className="block text-xs font-bold text-slate-500 uppercase tracking-wider">
                                        Additional Charges & Fees
                                    </span>
                                    <button
                                        type="button"
                                        onClick={addCustomCharge}
                                        className="py-1 px-3 bg-orange-50 hover:bg-[#FF4A1F] text-[#FF4A1F] hover:text-white border border-orange-200/80 rounded-full text-xs font-bold transition-all flex items-center gap-1 cursor-pointer"
                                    >
                                        <Plus size={14} />
                                        <span>Add Fee</span>
                                    </button>
                                </div>

                                <div className="space-y-2">
                                    {customCharges.map((charge) => (
                                        <div key={charge.id} className="flex items-center gap-2 p-2.5 bg-slate-50 rounded-xl border border-slate-200/80">
                                            <div className="w-1/3 min-w-0">
                                                <Input
                                                    type="text"
                                                    placeholder="Fee Name (e.g. Loading)"
                                                    value={charge.label}
                                                    onChange={(e) => updateCustomCharge(charge.id, 'label', e.target.value)}
                                                    className="text-xs h-9 bg-white rounded-lg"
                                                />
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <Input
                                                    type="text"
                                                    placeholder="Description (Optional)"
                                                    value={charge.description || ''}
                                                    onChange={(e) => updateCustomCharge(charge.id, 'description', e.target.value)}
                                                    className="text-xs h-9 bg-white rounded-lg"
                                                />
                                            </div>
                                            <div className="w-28 shrink-0">
                                                <Input
                                                    type="number"
                                                    placeholder="€ Amount"
                                                    value={charge.amount}
                                                    onChange={(e) => updateCustomCharge(charge.id, 'amount', e.target.value)}
                                                    className="text-xs h-9 font-bold bg-white rounded-lg"
                                                    min="0"
                                                />
                                            </div>
                                            <button
                                                type="button"
                                                onClick={() => removeCustomCharge(charge.id)}
                                                className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer shrink-0"
                                                title="Remove Fee"
                                            >
                                                <Trash2 size={16} />
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <div className="flex justify-between items-center p-3.5 bg-slate-100/90 rounded-xl border border-slate-200">
                                <span className="text-xs font-bold text-slate-800">Total Calculated Offer:</span>
                                <span className="text-lg font-black text-[#FF4A1F]">€ {supplierTotal.toLocaleString()}</span>
                            </div>
                        </div>
                    ) : (
                        /* Customer Target Total Input */
                        <div>
                            <label className="block text-xs font-bold text-slate-700 mb-1.5">
                                Proposed Target Total (€) <span className="text-rose-500">*</span>
                            </label>
                            <Input
                                type="number"
                                placeholder="e.g. 38500"
                                value={counterOfferAmount}
                                onChange={(e) => setCounterOfferAmount(e.target.value)}
                                required
                                min="1"
                                className="h-10 rounded-xl text-xs font-bold"
                            />
                        </div>
                    )}

                    <div>
                        <Textarea
                            label="Note / Explanation (Optional)"
                            placeholder={isSupplier ? "Explain details regarding freight charges..." : "Add comments regarding your counter offer..."}
                            value={counterOfferNote}
                            onChange={(e) => setCounterOfferNote(e.target.value)}
                            rows={3}
                            className="text-xs rounded-xl"
                        />
                    </div>
                </form>
            </Modal>

            {/* Editing Message Banner */}
            {isEditing && (
                <div className="bg-amber-50 border border-amber-200 px-4 py-2 rounded-xl mb-1 flex items-center justify-between text-xs animate-fade-in">
                    <div className="flex items-center gap-2 min-w-0">
                        <Pencil size={14} className="text-amber-600 shrink-0" />
                        <span className="font-bold text-amber-900 shrink-0">Editing Message:</span>
                        <span className="text-slate-700 truncate font-medium">{inputValue}</span>
                    </div>
                    <button
                        type="button"
                        onClick={onCancelEdit}
                        className="p-1 text-slate-400 hover:text-slate-700 hover:bg-amber-100 rounded-full transition-colors cursor-pointer shrink-0 ml-2"
                        title="Cancel Editing"
                    >
                        <X size={14} />
                    </button>
                </div>
            )}

            {/* Selected File Previews */}
            {selectedFiles.length > 0 && (
                <div className="flex gap-2 px-1 overflow-x-auto pb-1">
                    {selectedFiles.map((file, idx) => (
                        <div key={idx} className="relative group bg-slate-50 rounded-xl p-2 flex items-center gap-2.5 border border-slate-200 pr-8 shrink-0 max-w-[220px]">
                            {file.type.startsWith('image/') ? (
                                <div className="w-9 h-9 rounded-lg bg-slate-200 overflow-hidden shrink-0 flex items-center justify-center">
                                    <img src={URL.createObjectURL(file)} alt="preview" className="w-full h-full object-cover" />
                                </div>
                            ) : (
                                <div className="w-9 h-9 rounded-lg bg-orange-50 text-[#FF4A1F] shrink-0 flex items-center justify-center font-bold">
                                    <FileIcon size={18} />
                                </div>
                            )}
                            <div className="text-xs font-semibold text-slate-700 truncate">{file.name}</div>
                            <button 
                                type="button"
                                onClick={() => removeFile(idx)}
                                className="absolute right-2 top-1/2 -translate-y-1/2 w-5 h-5 bg-white text-slate-500 hover:text-rose-600 hover:bg-rose-50 rounded-full flex items-center justify-center transition-colors shadow-xs cursor-pointer"
                            >
                                <X size={12} />
                            </button>
                        </div>
                    ))}
                </div>
            )}

            {/* Input Toolbar Bar */}
            <div className="flex items-center gap-2 relative">
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

                {/* Counter Offer Launcher Button */}
                <button
                    type="button"
                    onClick={() => setShowCounterOfferModal(true)}
                    className="h-10 px-3.5 bg-orange-50 hover:bg-[#FF4A1F] text-[#FF4A1F] hover:text-white border border-orange-200 hover:border-[#FF4A1F] rounded-xl text-xs font-bold transition-all flex items-center gap-2 shrink-0 cursor-pointer shadow-xs"
                    title={isSupplier ? "Submit itemized price breakdown" : "Submit a new counter offer"}
                >
                    {isSupplier ? <Calculator size={15} className="stroke-[2.5]" /> : <DollarSign size={15} className="stroke-[2.5]" />}
                    <span className="hidden sm:inline">Counter Offer</span>
                </button>

                <Button 
                    type="button"
                    variant="ghost" 
                    size="icon" 
                    className="h-10 w-10 text-slate-500 hover:text-[#FF4A1F] rounded-xl hover:bg-slate-100 shrink-0"
                    onClick={() => imageInputRef.current?.click()}
                    title="Send Image"
                >
                    <ImageIcon size={20} />
                </Button>
                <Button 
                    type="button"
                    variant="ghost" 
                    size="icon" 
                    className="h-10 w-10 text-slate-500 hover:text-[#FF4A1F] rounded-xl hover:bg-slate-100 shrink-0"
                    onClick={() => fileInputRef.current?.click()}
                    title="Attach File"
                >
                    <Paperclip size={20} />
                </Button>
                
                {/* Textarea Pill Container */}
                <div className="flex-1 bg-slate-100/80 rounded-2xl flex items-center pr-2 pl-4 py-1 border border-slate-200/80 focus-within:bg-white focus-within:border-[#FF4A1F] focus-within:ring-2 focus-within:ring-[#FF4A1F]/20 transition-all">
                    <textarea 
                        ref={textareaRef}
                        value={inputValue}
                        onChange={(e) => setInputValue(e.target.value)}
                        placeholder={isEditing ? "Edit message..." : "Type a message..."}
                        className="flex-1 bg-transparent border-none outline-none focus:outline-none focus:ring-0 focus:border-none resize-none py-1.5 text-xs sm:text-sm text-slate-900 placeholder-slate-400 font-medium leading-relaxed max-h-[160px] overflow-y-auto custom-scrollbar"
                        rows={1}
                        onKeyDown={(e) => {
                            if(e.key === 'Enter' && !e.shiftKey) {
                                e.preventDefault();
                                handleSend();
                            }
                        }}
                    />
                    
                    <div ref={emojiPickerRef} className="relative shrink-0 ml-1">
                        <Button 
                            type="button"
                            variant="ghost" 
                            size="icon" 
                            className={`h-8 w-8 rounded-full shrink-0 ${showEmojiPicker ? 'bg-orange-100 text-[#FF4A1F]' : 'text-slate-400 hover:text-[#FF4A1F] hover:bg-slate-200'}`}
                            onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                        >
                            <Smile size={18} />
                        </Button>

                        {/* Emoji Picker Popover */}
                        {showEmojiPicker && (
                            <div className="absolute bottom-full right-0 mb-3 bg-white border border-slate-200 rounded-2xl shadow-2xl p-3 w-[260px] z-30 font-sans">
                                <div className="grid grid-cols-5 gap-1 text-base">
                                    {EMOJIS.map(emoji => (
                                        <button
                                            key={emoji}
                                            type="button"
                                            onClick={() => handleEmojiClick(emoji)}
                                            className="h-9 w-9 text-lg flex items-center justify-center rounded-lg hover:bg-orange-50 transition-colors cursor-pointer"
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
                    type="button"
                    variant="ghost" 
                    size="icon" 
                    className={`h-10 w-10 rounded-full shrink-0 shadow-md transition-all ${
                        isEditing 
                            ? 'bg-[#FF4A1F] text-white hover:bg-[#E03E15]' 
                            : inputValue.trim() || selectedFiles.length > 0 
                                ? 'bg-[#FF4A1F] text-white hover:bg-[#E03E15]' 
                                : 'bg-slate-200 text-slate-400 hover:bg-slate-300'
                    }`}
                    onClick={handleSend}
                    title={isEditing ? "Save changes" : "Send message"}
                >
                    {isEditing ? (
                        <Check size={18} className="stroke-[2.5]" />
                    ) : (
                        <Send size={18} className="stroke-[2.5]" />
                    )}
                </Button>
            </div>
        </div>
    );
}
