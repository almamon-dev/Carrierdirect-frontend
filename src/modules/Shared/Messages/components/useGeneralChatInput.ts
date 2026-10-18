import { useState, useRef, useEffect } from 'react';
import { GeneralMessage } from '@/services/messageService';

interface UseGeneralChatInputProps {
    onSendMessage: (text: string, files: File[], replyToId?: number | null) => void;
    replyingTo?: GeneralMessage | null;
    onCancelReply?: () => void;
    editingMessage?: GeneralMessage | null;
    onCancelEdit?: () => void;
    onSaveEdit?: (messageId: number | string, newText: string) => Promise<boolean | any>;
}

export const useGeneralChatInput = ({
    onSendMessage,
    replyingTo = null,
    onCancelReply,
    editingMessage = null,
    onCancelEdit,
    onSaveEdit,
}: UseGeneralChatInputProps) => {
    const [inputText, setInputText] = useState('');
    const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
    const [showEmojiPicker, setShowEmojiPicker] = useState(false);
    const [isSaving, setIsSaving] = useState(false);

    const textareaRef = useRef<HTMLTextAreaElement>(null);
    const imageInputRef = useRef<HTMLInputElement>(null);
    const docInputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        if (editingMessage) {
            const text = editingMessage.message || '';
            setInputText(text);
            setTimeout(() => {
                if (textareaRef.current) {
                    textareaRef.current.focus();
                    textareaRef.current.style.height = 'auto';
                    textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 140)}px`;
                    textareaRef.current.setSelectionRange(text.length, text.length);
                }
            }, 50);
        }
    }, [editingMessage]);

    useEffect(() => {
        if (replyingTo && textareaRef.current) {
            textareaRef.current.focus();
        }
    }, [replyingTo]);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files.length > 0) {
            setSelectedFiles((prev) => [...prev, ...Array.from(e.target.files!)].slice(0, 5));
        }
        if (e.target) e.target.value = '';
    };

    const handleTextareaInput = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        setInputText(e.target.value);
        if (textareaRef.current) {
            textareaRef.current.style.height = 'auto';
            textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 140)}px`;
        }
    };

    const handleSubmit = async (e?: React.FormEvent) => {
        if (e) e.preventDefault();
        const trimmed = inputText.trim();
        if (!trimmed && selectedFiles.length === 0) return;

        if (editingMessage && onSaveEdit) {
            if (trimmed && trimmed !== editingMessage.message?.trim()) {
                setIsSaving(true);
                try {
                    await onSaveEdit(editingMessage.id, trimmed);
                } finally {
                    setIsSaving(false);
                }
            }
            if (onCancelEdit) onCancelEdit();
            setInputText('');
            if (textareaRef.current) textareaRef.current.style.height = 'auto';
            return;
        }

        let finalMessage = trimmed;
        if (replyingTo) {
            const replySnippet = (replyingTo.message || 'Attachment').slice(0, 60);
            finalMessage = `Replying to: "${replySnippet}"\n${trimmed}`;
            if (onCancelReply) onCancelReply();
        }

        onSendMessage(finalMessage, selectedFiles);
        setInputText('');
        setSelectedFiles([]);
        if (textareaRef.current) textareaRef.current.style.height = 'auto';
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSubmit();
        } else if (e.key === 'Escape') {
            if (editingMessage && onCancelEdit) {
                onCancelEdit();
                setInputText('');
                if (textareaRef.current) textareaRef.current.style.height = 'auto';
            } else if (replyingTo && onCancelReply) {
                onCancelReply();
            }
        }
    };

    return {
        inputText,
        setInputText,
        selectedFiles,
        setSelectedFiles,
        showEmojiPicker,
        setShowEmojiPicker,
        isSaving,
        textareaRef,
        imageInputRef,
        docInputRef,
        handleFileChange,
        handleTextareaInput,
        handleSubmit,
        handleKeyDown,
        hasContent: Boolean(inputText.trim() || selectedFiles.length > 0),
    };
};
