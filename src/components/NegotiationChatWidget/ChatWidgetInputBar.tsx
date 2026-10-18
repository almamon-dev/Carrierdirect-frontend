import React from 'react';
import {
  Image as ImageIcon,
  FileText,
  X as CloseIcon,
  Smile as SmileIcon,
  Paperclip as AttachIcon,
  Loader2,
  Send as SendIcon,
  Lock,
} from 'lucide-react';
import { quickEmojis } from './negotiationChatWidgetUtils';

interface ChatWidgetInputBarProps {
  stagedFiles: File[];
  onRemoveStagedFile: (idx: number) => void;
  onImageAttachClick: () => void;
  onFileAttachClick: () => void;
  inputValue: string;
  setInputValue: (val: string | ((prev: string) => string)) => void;
  isSending: boolean;
  showEmojiPicker: boolean;
  setShowEmojiPicker: (show: boolean | ((p: boolean) => boolean)) => void;
  emojiPickerRef: React.RefObject<HTMLDivElement | null>;
  onSendMessage: (e?: React.FormEvent) => void;
  onInsertEmoji: (emoji: string) => void;
}

export const ChatWidgetInputBar: React.FC<ChatWidgetInputBarProps> = ({
  stagedFiles,
  onRemoveStagedFile,
  onImageAttachClick,
  onFileAttachClick,
  inputValue,
  setInputValue,
  isSending,
  showEmojiPicker,
  setShowEmojiPicker,
  emojiPickerRef,
  onSendMessage,
  onInsertEmoji,
}) => {
  return (
    <>
      {stagedFiles.length > 0 && (
        <div className="px-3 py-2 bg-slate-50 dark:bg-slate-800 border-t border-slate-200/60 dark:border-slate-700 flex flex-wrap gap-2 shrink-0">
          {stagedFiles.map((file, idx) => (
            <div
              key={idx}
              className="flex items-center gap-1.5 px-2 py-1 bg-white dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-700 text-xs text-slate-700 dark:text-slate-300 shadow-2xs"
            >
              {file.type.startsWith('image/') ? (
                <ImageIcon className="w-3.5 h-3.5 text-blue-500 shrink-0" />
              ) : (
                <FileText className="w-3.5 h-3.5 text-orange-500 shrink-0" />
              )}
              <span className="max-w-[120px] truncate text-[11px]">{file.name}</span>
              <button
                type="button"
                onClick={() => onRemoveStagedFile(idx)}
                className="w-4 h-4 rounded-full border border-slate-200 dark:border-slate-600 flex items-center justify-center text-slate-400 hover:text-red-500 hover:border-red-200 ml-0.5 transition-colors"
                title="Remove file"
              >
                <CloseIcon className="w-2.5 h-2.5" />
              </button>
            </div>
          ))}
        </div>
      )}

      <div className="bg-white dark:bg-slate-900 px-3 py-2.5 border-t border-slate-100 dark:border-slate-800 space-y-1 shrink-0 relative">
        <form onSubmit={onSendMessage} className="flex items-center gap-1.5">
          <div className="flex items-center gap-0.5 shrink-0">
            <button
              type="button"
              onClick={onImageAttachClick}
              className="p-1.5 text-slate-400 hover:text-[#ff4a1f] rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
              title="Attach Photo"
            >
              <ImageIcon className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={onFileAttachClick}
              className="p-1.5 text-slate-400 hover:text-[#ff4a1f] rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
              title="Attach Document"
            >
              <AttachIcon className="w-4 h-4" />
            </button>
          </div>

          <div className="relative flex-1 flex items-center" ref={emojiPickerRef}>
            <input
              type="text"
              placeholder="Type a message..."
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              disabled={isSending}
              className="w-full h-9 pl-3.5 pr-8 text-xs bg-slate-100 dark:bg-slate-800 border border-slate-200/60 dark:border-slate-700 rounded-full focus:outline-none focus:bg-white dark:focus:bg-slate-900 focus:border-[#ff4a1f] text-slate-900 dark:text-slate-100 placeholder:text-slate-400"
            />
            <button
              type="button"
              onClick={() => setShowEmojiPicker((prev) => !prev)}
              className={`absolute right-2.5 top-1/2 -translate-y-1/2 p-0.5 rounded-full transition-colors cursor-pointer ${
                showEmojiPicker ? 'text-[#ff4a1f]' : 'text-slate-400 hover:text-[#ff4a1f]'
              }`}
              title="Insert Emoji"
            >
              <SmileIcon className="w-4 h-4" />
            </button>

            {showEmojiPicker && (
              <div className="absolute bottom-11 right-0 w-60 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-2xl z-50 p-2.5 animate-in fade-in">
                <div className="px-1 pb-1.5 mb-1.5 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between text-[11px] font-bold text-slate-800 dark:text-slate-200">
                  <span>Quick emojis</span>
                  <button
                    type="button"
                    onClick={() => setShowEmojiPicker(false)}
                    className="w-5 h-5 rounded-full border border-slate-200 dark:border-slate-700 flex items-center justify-center text-slate-400 hover:text-[#ff4a1f] transition-colors cursor-pointer"
                    title="Close"
                  >
                    <CloseIcon className="w-3 h-3" />
                  </button>
                </div>
                <div className="grid grid-cols-8 gap-1 text-base">
                  {quickEmojis.map((emoji, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => onInsertEmoji(emoji)}
                      className="w-6 h-6 hover:bg-orange-50 dark:hover:bg-orange-950/40 rounded flex items-center justify-center cursor-pointer transition-transform hover:scale-125"
                    >
                      {emoji}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          <button
            type="submit"
            disabled={(!inputValue.trim() && stagedFiles.length === 0) || isSending}
            className="w-9 h-9 bg-[#ff4a1f] hover:bg-[#e63d15] text-white disabled:opacity-30 rounded-full transition-all duration-200 hover:scale-105 active:scale-95 shadow-2xs cursor-pointer shrink-0 flex items-center justify-center disabled:hover:scale-100"
            title="Send Message"
          >
            {isSending ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <SendIcon className="w-4 h-4" />
            )}
          </button>
        </form>

        <div className="flex items-center justify-center gap-1 text-[9.5px] text-slate-400 font-normal pt-0.5">
          <Lock className="w-2.5 h-2.5 text-slate-400" />
          <span>Encrypted & secure messaging channel</span>
        </div>
      </div>
    </>
  );
};
