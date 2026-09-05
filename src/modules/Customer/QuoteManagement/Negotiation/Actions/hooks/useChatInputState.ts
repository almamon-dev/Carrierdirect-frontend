import React, { useState, useRef, useEffect } from 'react';

const MAX_FILE_SIZE_BYTES = 200 * 1024 * 1024; // 200 MB

interface UseChatInputStateParams {
    inputValue: string;
    setInputValue: (v: string) => void;
    scrollToBottom: () => void;
    onSendMessage?: (text: string, files?: File[]) => void;
    onTyping?: () => void;
}

export const useChatInputState = ({
    inputValue,
    setInputValue,
    scrollToBottom,
    onSendMessage,
    onTyping,
}: UseChatInputStateParams) => {
    const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
    const [previewModalFile, setPreviewModalFile] = useState<File | null>(null);
    const [showAllFilesModal, setShowAllFilesModal] = useState(false);
    const [showEmojiPicker, setShowEmojiPicker] = useState(false);
    const [showCounterOfferModal, setShowCounterOfferModal] = useState(false);
    const [fileErrorMessage, setFileErrorMessage] = useState<string | null>(null);

    const imageInputRef = useRef<HTMLInputElement>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const emojiPickerRef = useRef<HTMLDivElement>(null);
    const textareaRef = useRef<HTMLTextAreaElement>(null);

    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (emojiPickerRef.current && !emojiPickerRef.current.contains(event.target as Node)) {
                setShowEmojiPicker(false);
            }
        }
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    useEffect(() => {
        const textarea = textareaRef.current;
        if (textarea) {
            textarea.style.height = '20px';
            const scrollH = textarea.scrollHeight;
            if (scrollH > 20) {
                textarea.style.height = `${Math.min(scrollH, 120)}px`;
            }
        }
    }, [inputValue]);

    const handleSend = () => {
        if (!inputValue.trim() && selectedFiles.length === 0) return;
        if (onSendMessage) {
            onSendMessage(inputValue, selectedFiles.length > 0 ? selectedFiles : undefined);
        }
        setInputValue('');
        setSelectedFiles([]);
        if (textareaRef.current) textareaRef.current.style.height = '20px';
        setTimeout(scrollToBottom, 50);
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSend();
        }
    };

    const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files.length > 0) {
            const incomingFiles = Array.from(e.target.files);
            const validFiles: File[] = [];
            const oversizedFiles: File[] = [];

            incomingFiles.forEach(file => {
                if (file.size > MAX_FILE_SIZE_BYTES) {
                    oversizedFiles.push(file);
                } else {
                    validFiles.push(file);
                }
            });

            if (oversizedFiles.length > 0) {
                const sampleName = oversizedFiles[0].name;
                const sizeMb = (oversizedFiles[0].size / (1024 * 1024)).toFixed(1);
                setFileErrorMessage(`"${sampleName}" exceeds 200 MB limit (${sizeMb} MB).`);
                setTimeout(() => setFileErrorMessage(null), 6000);
            } else {
                setFileErrorMessage(null);
            }

            if (validFiles.length > 0) setSelectedFiles(prev => [...prev, ...validFiles]);
        }
        e.target.value = '';
    };

    const handleAddEmoji = (emoji: string) => {
        setInputValue(inputValue + emoji);
        setShowEmojiPicker(false);
        if (onTyping) onTyping();
        if (textareaRef.current) textareaRef.current.focus();
    };

    return {
        selectedFiles,
        setSelectedFiles,
        previewModalFile,
        setPreviewModalFile,
        showAllFilesModal,
        setShowAllFilesModal,
        showEmojiPicker,
        setShowEmojiPicker,
        showCounterOfferModal,
        setShowCounterOfferModal,
        fileErrorMessage,
        setFileErrorMessage,
        imageInputRef,
        fileInputRef,
        emojiPickerRef,
        textareaRef,
        handleSend,
        handleKeyDown,
        handleFileSelect,
        handleAddEmoji,
    };
};
