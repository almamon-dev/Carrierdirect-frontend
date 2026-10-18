import { MessageAttachment } from '@/services/messageService';

export const quickEmojis = ['😊', '👍', '🚚', '📦', '🤝', '✍️', '🔥', '🚀', '💬', '📄', '✅', '📍', '🙌', '⭐', '❤️', '👏'];

export const quickStarters = [
  'Hi there! 👋',
  'Can you update me on the status?',
  'Thank you! 🙌',
  'Are you available today?'
];

export const isImageAttachment = (att: MessageAttachment | any): boolean => {
  if (!att) return false;
  if (att.type === 'image') return true;
  if (typeof att.mime_type === 'string' && att.mime_type.startsWith('image/')) return true;
  if (typeof att.mime === 'string' && att.mime.startsWith('image/')) return true;
  const name = String(att.name || att.file_name || att.filename || '').trim();
  if (/\.(jpg|jpeg|png|webp|gif|svg|bmp|avif)($|\?)/i.test(name)) return true;
  const url = String(att.url || att.path || '').trim();
  if (url.startsWith('data:image/') || url.startsWith('blob:')) return true;
  if (/\.(jpg|jpeg|png|webp|gif|svg|bmp|avif)($|\?)/i.test(url)) return true;
  return false;
};

export const getInitials = (name?: string): string => {
  if (!name) return 'CD';
  return name
    .trim()
    .split(/\s+/)
    .filter(Boolean)
    .map(n => n[0])
    .join('')
    .substring(0, 2)
    .toUpperCase() || 'CD';
};

export const getAvatarBg = (name?: string): string => {
  const colors = [
    'from-orange-500 to-amber-600',
    'from-blue-500 to-indigo-600',
    'from-emerald-500 to-teal-600',
    'from-purple-500 to-violet-600',
    'from-rose-500 to-pink-600',
  ];
  if (!name) return colors[0];
  let hash = 0;
  for (let i = 0; i < name.length; i++) hash += name.charCodeAt(i);
  return colors[Math.abs(hash) % colors.length];
};

export const formatChatTime = (timeStr?: string | null, dateStr?: string | null): string => {
  const val = dateStr || timeStr;
  if (!val) return '';
  const trimmed = String(val).trim();
  if (/^(just now|today|yesterday|\d+[mhsd] ago|\d{1,2}:\d{2}\s*(am|pm)?)$/i.test(trimmed)) {
    return trimmed;
  }
  try {
    let str = trimmed;
    if (!str.includes('Z') && !str.includes('+') && !str.includes('-0') && !str.includes('-1')) {
      str = str.replace(' ', 'T') + 'Z';
    }
    const d = new Date(str);
    if (isNaN(d.getTime())) return timeStr || '';
    return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  } catch {
    return timeStr || '';
  }
};
