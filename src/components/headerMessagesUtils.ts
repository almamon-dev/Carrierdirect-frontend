export const formatChatTime = (timeStr?: string | null, lastMsg?: any): string => {
    if (lastMsg?.created_at_human && typeof lastMsg.created_at_human === 'string' && lastMsg.created_at_human !== 'null') {
        return lastMsg.created_at_human;
    }
    const val = timeStr || lastMsg?.time || lastMsg?.created_at || lastMsg?.last_message_at;
    if (!val) return '';

    if (typeof val === 'string') {
        const trimmed = val.trim();
        if (/^(just now|today|yesterday|\d+[mhsd] ago|\d{1,2}:\d{2}\s*(am|pm)?)$/i.test(trimmed)) {
            return trimmed;
        }
    }

    try {
        let str = String(val).trim();
        if (!str.includes('Z') && !str.includes('+') && !str.includes('-0') && !str.includes('-1')) {
            str = str.replace(' ', 'T') + 'Z';
        }
        const d = new Date(str);
        if (isNaN(d.getTime())) return String(val);

        const now = new Date();
        const diffMs = now.getTime() - d.getTime();
        const diffSecs = Math.floor(diffMs / 1000);
        const diffMins = Math.floor(diffSecs / 60);

        if (diffMins < 1) return 'Just now';
        if (diffMins < 60) return `${diffMins}m ago`;
        const diffHours = Math.floor(diffMins / 60);
        if (diffHours < 24) return `${diffHours}h ago`;
        const diffDays = Math.floor(diffHours / 24);
        if (diffDays === 1) return 'Yesterday';
        if (diffDays < 7) return `${diffDays}d ago`;
        return d.toLocaleDateString([], { month: 'short', day: 'numeric' });
    } catch {
        return String(val || '');
    }
};
