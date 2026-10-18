import { useState, useRef, useEffect, useCallback } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useGeneralMessages } from '@/hooks/useGeneralMessages';
import { ConversationUser } from '@/services/messageService';
import { encryptId } from '@/lib/encryption';
import { useChatWidgetDrag } from './useChatWidgetDrag';

export function useNegotiationChatWidgetState() {
  const navigate = useNavigate();
  const location = useLocation();

  const generalMessages = useGeneralMessages();
  const {
    conversations,
    activePartner,
    selectPartner,
    startNewConversation,
    sendMessage,
  } = generalMessages;

  const [isOpen, setIsOpen] = useState(false);
  const [viewMode, setViewMode] = useState<'conversations' | 'chat'>('conversations');
  const [searchQuery, setSearchQuery] = useState('');
  const [inputValue, setInputValue] = useState('');
  const [stagedFiles, setStagedFiles] = useState<File[]>([]);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [showSwitchDropdown, setShowSwitchDropdown] = useState(false);
  const [lightboxImage, setLightboxImage] = useState<string | null>(null);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const imageInputRef = useRef<HTMLInputElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const switchDropdownRef = useRef<HTMLDivElement>(null);
  const emojiPickerRef = useRef<HTMLDivElement>(null);

  const { btnPos, handleDragStart, handleLauncherClick } = useChatWidgetDrag(
    isOpen,
    setIsOpen,
    () => {
      if (!isOpen && !activePartner && conversations.length > 0) {
        setViewMode('conversations');
      }
    }
  );

  const isSupplierContext = location.pathname.startsWith('/supplier');

  useEffect(() => {
    if (activePartner && viewMode !== 'chat') {
      setViewMode('chat');
    }
  }, [activePartner]);

  useEffect(() => {
    if (viewMode === 'chat' && isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [generalMessages.messages, viewMode, isOpen]);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (switchDropdownRef.current && !switchDropdownRef.current.contains(e.target as Node)) {
        setShowSwitchDropdown(false);
      }
      if (emojiPickerRef.current && !emojiPickerRef.current.contains(e.target as Node)) {
        setShowEmojiPicker(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSelectPartner = useCallback((user: ConversationUser) => {
    selectPartner(user.id);
    setViewMode('chat');
    setShowSwitchDropdown(false);
  }, [selectPartner]);

  const handleStartWithDirectory = useCallback(async (user: ConversationUser) => {
    await startNewConversation(user);
    setViewMode('chat');
  }, [startNewConversation]);

  const handleSendMessage = useCallback(async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if ((!inputValue.trim() && stagedFiles.length === 0) || generalMessages.isSending || !activePartner) return;
    const textToSend = inputValue.trim();
    const filesToSend = [...stagedFiles];
    setInputValue('');
    setStagedFiles([]);
    try {
      await sendMessage(textToSend, filesToSend);
    } catch (err) {
      console.error('Failed to send message:', err);
    }
  }, [inputValue, stagedFiles, generalMessages.isSending, activePartner, sendMessage]);

  const handleFileChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setStagedFiles((prev) => [...prev, ...Array.from(e.target.files || [])]);
    }
    e.target.value = '';
  }, []);

  const navigateToFullChat = useCallback(() => {
    if (!activePartner) return;
    const basePath = isSupplierContext ? '/supplier/messages' : '/customer/messages';
    navigate(`${basePath}/${encryptId(activePartner.id)}`);
    setIsOpen(false);
  }, [activePartner, isSupplierContext, navigate]);

  return {
    ...generalMessages,
    isOpen,
    setIsOpen,
    viewMode,
    setViewMode,
    searchQuery,
    setSearchQuery,
    inputValue,
    setInputValue,
    stagedFiles,
    setStagedFiles,
    showEmojiPicker,
    setShowEmojiPicker,
    showSwitchDropdown,
    setShowSwitchDropdown,
    lightboxImage,
    setLightboxImage,
    messagesEndRef,
    imageInputRef,
    fileInputRef,
    switchDropdownRef,
    emojiPickerRef,
    btnPos,
    handleDragStart,
    handleLauncherClick,
    handleSelectPartner,
    handleStartWithDirectory,
    handleSendMessage,
    handleFileChange,
    navigateToFullChat,
  };
}
