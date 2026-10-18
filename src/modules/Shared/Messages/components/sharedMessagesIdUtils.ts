export const encryptId = (id: number | string): string => {
    try {
        return btoa(String(id)).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
    } catch {
        return String(id);
    }
};

export const decryptId = (hash?: string): string | undefined => {
    if (!hash) return undefined;
    const str = String(hash).trim();
    if (/^\d+$/.test(str)) return str;
    try {
        let base64 = str.replace(/-/g, '+').replace(/_/g, '/');
        while (base64.length % 4) base64 += '=';
        const decoded = atob(base64);
        if (/^\d+$/.test(decoded)) return decoded;
        return str;
    } catch {
        return str;
    }
};
