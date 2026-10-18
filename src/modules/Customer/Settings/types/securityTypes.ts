export interface SessionItem {
  id: string;
  device: string;
  isCurrent: boolean;
  isMobile: boolean;
  lastActive: string;
}

export function formatSecretKey(raw: string): string {
  return raw.match(/.{1,4}/g)?.join('-') || raw;
}
