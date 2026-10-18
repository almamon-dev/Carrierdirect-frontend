import React from 'react';
import { useNegotiationChatWidgetState } from './useNegotiationChatWidgetState';
import { ChatWidgetFabButton } from './ChatWidgetFabButton';
import { ChatWidgetLightbox } from './ChatWidgetLightbox';
import { ChatWidgetConversationsView } from './ChatWidgetConversationsView';
import { ChatWidgetActiveHeader } from './ChatWidgetActiveHeader';
import { ChatWidgetMessageStream } from './ChatWidgetMessageStream';
import { ChatWidgetInputBar } from './ChatWidgetInputBar';

export default function NegotiationChatWidget() {
  const state = useNegotiationChatWidgetState();

  return (
    <>
      <ChatWidgetFabButton
        btnPos={state.btnPos}
        isOpen={state.isOpen}
        unreadCount={state.unreadCount}
        onLauncherClick={state.handleLauncherClick}
        onDragStart={state.handleDragStart}
      />

      {state.isOpen && (
        <div
          style={
            typeof window !== 'undefined' && window.innerWidth < 640
              ? { left: '3vw', right: '3vw', bottom: '80px', width: '94vw' }
              : state.btnPos
              ? {
                  right: `${Math.max(16, window.innerWidth - state.btnPos.x - 56)}px`,
                  bottom: `${Math.max(88, window.innerHeight - state.btnPos.y + 12)}px`,
                }
              : { right: '24px', bottom: '88px' }
          }
          className="fixed z-50 w-[94vw] sm:w-[410px] h-[590px] max-h-[84vh] bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200/90 dark:border-slate-800 flex flex-col overflow-hidden font-sans animate-in fade-in zoom-in-95 duration-200"
        >
          <input
            type="file"
            ref={state.imageInputRef}
            onChange={state.handleFileChange}
            accept="image/*"
            multiple
            className="hidden"
          />
          <input
            type="file"
            ref={state.fileInputRef}
            onChange={state.handleFileChange}
            accept=".pdf,.doc,.docx,.xls,.xlsx,.csv,.txt"
            multiple
            className="hidden"
          />

          <ChatWidgetLightbox imageSrc={state.lightboxImage} onClose={() => state.setLightboxImage(null)} />

          {state.viewMode === 'conversations' && (
            <ChatWidgetConversationsView
              conversations={state.conversations}
              directoryUsers={state.directoryUsers}
              unreadCount={state.unreadCount}
              isLoadingConversations={state.isLoadingConversations}
              activePartnerId={state.activePartnerId}
              searchQuery={state.searchQuery}
              setSearchQuery={state.setSearchQuery}
              onSelectPartner={state.handleSelectPartner}
              onStartWithDirectory={state.handleStartWithDirectory}
              onRefresh={() => state.fetchConversations(false)}
              onClose={() => state.setIsOpen(false)}
            />
          )}

          {state.viewMode === 'chat' && state.activePartner && (
            <div className="flex-1 flex flex-col h-full bg-white dark:bg-slate-900">
              <ChatWidgetActiveHeader
                activePartner={state.activePartner}
                conversations={state.conversations}
                showSwitchDropdown={state.showSwitchDropdown}
                setShowSwitchDropdown={state.setShowSwitchDropdown}
                switchDropdownRef={state.switchDropdownRef}
                onBack={() => state.setViewMode('conversations')}
                onSelectPartner={state.handleSelectPartner}
                onNavigateToFullChat={state.navigateToFullChat}
                onClose={() => state.setIsOpen(false)}
              />
              <ChatWidgetMessageStream
                isLoadingMessages={state.isLoadingMessages}
                messages={state.messages}
                activePartner={state.activePartner}
                messagesEndRef={state.messagesEndRef}
                onQuickStarterClick={(starter) => state.setInputValue(starter)}
                onLightboxOpen={(url) => state.setLightboxImage(url)}
              />
              <ChatWidgetInputBar
                stagedFiles={state.stagedFiles}
                onRemoveStagedFile={(idx) => state.setStagedFiles((prev) => prev.filter((_, i) => i !== idx))}
                onImageAttachClick={() => state.imageInputRef.current?.click()}
                onFileAttachClick={() => state.fileInputRef.current?.click()}
                inputValue={state.inputValue}
                setInputValue={state.setInputValue}
                isSending={state.isSending}
                showEmojiPicker={state.showEmojiPicker}
                setShowEmojiPicker={state.setShowEmojiPicker}
                emojiPickerRef={state.emojiPickerRef}
                onSendMessage={state.handleSendMessage}
                onInsertEmoji={(emoji) => {
                  state.setInputValue((prev) => prev + emoji);
                  state.setShowEmojiPicker(false);
                }}
              />
            </div>
          )}
        </div>
      )}
    </>
  );
}

export { NegotiationChatWidget };
export const GeneralChatWidget = NegotiationChatWidget;
