import { useState, useEffect, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import apiClient from '@/lib/axios';
import { toast } from '@/hooks/use-toast';
import {
    GoogleAuthRole,
    getGoogleOAuthUrl,
    saveGoogleAuthSession,
    resolvePostAuthPath,
} from '@/utils/googleAuth';

interface GoogleStatus {
    checked: boolean;
    enabled: boolean;
    configured: boolean;
    message?: string | null;
}

export function useGoogleAuth(role: GoogleAuthRole = 'customer') {
    const navigate = useNavigate();
    const [isGoogleLoading, setIsGoogleLoading] = useState(false);
    const [googleError, setGoogleError] = useState<string | null>(null);
    const statusRef = useRef<GoogleStatus>({
        checked: false,
        enabled: true,
        configured: true,
        message: null,
    });
    const activeCleanupRef = useRef<(() => void) | null>(null);

    // Pre-fetch social auth configuration silently so clicking never hits a broken redirect
    useEffect(() => {
        let mounted = true;
        apiClient
            .get('/auth/social-status', { silent: true })
            .then((res) => {
                if (!mounted) return;
                const g = res?.data?.google || res?.google;
                if (g) {
                    statusRef.current = {
                        checked: true,
                        enabled: Boolean(g.enabled),
                        configured: g.configured !== undefined ? Boolean(g.configured) : Boolean(g.enabled),
                        message: g.message || null,
                    };
                }
            })
            .catch(() => {
                // Keep default optimistic check; backend popup bridge handles errors cleanly
            });

        return () => {
            mounted = false;
            if (activeCleanupRef.current) {
                activeCleanupRef.current();
                activeCleanupRef.current = null;
            }
        };
    }, []);

    const handleAuthSuccess = useCallback(
        (payload: any) => {
            const token = payload?.token;
            const userData = payload?.user;
            const resRole = payload?.role || userData?.user_type || role;
            const isProfileCompleted = Boolean(payload?.is_profile_completed);

            if (!token) {
                const msg = 'No authentication token received from Google.';
                setGoogleError(msg);
                setIsGoogleLoading(false);
                toast({
                    title: 'Authentication Failed',
                    description: msg,
                    variant: 'destructive',
                });
                return;
            }

            saveGoogleAuthSession(token, userData);
            setIsGoogleLoading(false);
            setGoogleError(null);

            toast({
                title: 'Signed in with Google',
                description: `Welcome${userData?.name ? ', ' + userData.name : ''}!`,
            });

            const { path, isExternalAdmin } = resolvePostAuthPath(userData, resRole, isProfileCompleted);
            if (isExternalAdmin) {
                window.location.href = path;
            } else {
                // Zero-reload SPA navigation
                navigate(path, { replace: true });
            }
        },
        [navigate, role]
    );

    const handleAuthError = useCallback((errorMsg: string) => {
        const cleanMsg = errorMsg || 'Unable to sign in with Google.';
        setGoogleError(cleanMsg);
        setIsGoogleLoading(false);
        toast({
            title: 'Google Sign-In',
            description: cleanMsg,
            variant: 'destructive',
        });
    }, []);

    const signInWithGoogle = useCallback(() => {
        setGoogleError(null);

        // If pre-flight check already knows Google OAuth is not configured/enabled, fail fast with zero reload/popup
        if (statusRef.current.checked && !statusRef.current.enabled) {
            const msg =
                statusRef.current.message ||
                'Google Sign-In is not configured yet. Please configure Google Client ID & Secret in Admin Settings.';
            handleAuthError(msg);
            return;
        }

        // Clean up any previous listener
        if (activeCleanupRef.current) {
            activeCleanupRef.current();
            activeCleanupRef.current = null;
        }

        const oauthUrl = getGoogleOAuthUrl(role, 'popup');
        const width = 500;
        const height = 620;
        const left = window.screenX + Math.max(0, (window.outerWidth - width) / 2);
        const top = window.screenY + Math.max(0, (window.outerHeight - height) / 2);

        const popup = window.open(
            oauthUrl,
            'CarrierDirectGoogleAuth',
            `width=${width},height=${height},left=${left},top=${top},resizable=yes,scrollbars=yes,status=yes`
        );

        if (!popup || popup.closed || typeof popup.closed === 'undefined') {
            handleAuthError('Browser blocked the Google Sign-In popup. Please allow popups for this site and try again.');
            return;
        }

        setIsGoogleLoading(true);
        let settled = false;
        let channel: BroadcastChannel | null = null;
        let pollTimer: number | null = null;

        const cleanup = () => {
            window.removeEventListener('message', onMessage);
            if (channel) {
                try {
                    channel.close();
                } catch {}
                channel = null;
            }
            if (pollTimer !== null) {
                window.clearInterval(pollTimer);
                pollTimer = null;
            }
            activeCleanupRef.current = null;
        };

        const processMessage = (data: any) => {
            if (!data || settled) return;
            if (data.type === 'CARRIERDIRECT_GOOGLE_AUTH_SUCCESS') {
                settled = true;
                cleanup();
                try {
                    if (popup && !popup.closed) popup.close();
                } catch {}
                handleAuthSuccess(data.payload);
            } else if (data.type === 'CARRIERDIRECT_GOOGLE_AUTH_ERROR') {
                settled = true;
                cleanup();
                try {
                    if (popup && !popup.closed) popup.close();
                } catch {}
                handleAuthError(data.payload?.error || 'Google authentication was cancelled.');
            }
        };

        const onMessage = (event: MessageEvent) => {
            processMessage(event.data);
        };

        window.addEventListener('message', onMessage);

        if (typeof BroadcastChannel !== 'undefined') {
            try {
                channel = new BroadcastChannel('carrierdirect_google_auth');
                channel.onmessage = (event) => processMessage(event.data);
            } catch {}
        }

        // Detect if user manually closed the popup before completing auth
        pollTimer = window.setInterval(() => {
            if (popup && popup.closed && !settled) {
                settled = true;
                cleanup();
                setIsGoogleLoading(false);
            }
        }, 400);

        activeCleanupRef.current = cleanup;
    }, [role, handleAuthSuccess, handleAuthError]);

    return {
        signInWithGoogle,
        isGoogleLoading,
        googleError,
        clearGoogleError: () => setGoogleError(null),
    };
}
