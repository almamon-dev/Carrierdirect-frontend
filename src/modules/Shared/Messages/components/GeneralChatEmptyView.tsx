import React from 'react';
import { MessageSquare } from 'lucide-react';

interface GeneralChatEmptyViewProps {
    title?: string;
    description?: string;
    compact?: boolean;
}

export const GeneralChatEmptyView: React.FC<GeneralChatEmptyViewProps> = ({
    title = 'No chat selected',
    description = 'Choose a conversation from the sidebar or start a new message directly.',
    compact = false
}) => {
    return (
        <div className={`flex flex-col items-center justify-center text-center text-slate-400 ${compact ? 'py-8 px-3' : 'h-full flex-1 p-8'}`}>
            <div className="w-14 h-14 rounded-2xl bg-orange-50 dark:bg-orange-950/40 text-[#FF4A1F] flex items-center justify-center mb-3 shadow-2xs">
                <MessageSquare size={26} />
            </div>
            <h3 className="text-sm font-bold text-slate-800 dark:text-slate-200">{title}</h3>
            <p className="text-xs text-slate-400 max-w-xs mt-1 leading-relaxed">
                {description}
            </p>
        </div>
    );
};

export default GeneralChatEmptyView;
