import { useEffect, useRef } from "react";
import messageService from "@/services/messageService";
import { TOKEN_CONFIG } from "@/config/auth";

export const useUserHeartbeat = (enabled: boolean = true) => {
    const intervalRef = useRef<any>(null);

    useEffect(() => {
        if (!enabled) return;

        const checkHasAuth = () => {
            return Boolean(
                localStorage.getItem(TOKEN_CONFIG.accessTokenKey) ||
                localStorage.getItem("carrierdirect_access_token") ||
                localStorage.getItem("access_token") ||
                localStorage.getItem("token")
            );
        };

        const triggerHeartbeat = () => {
            if (typeof document !== "undefined" && document.visibilityState === "hidden") {
                return;
            }
            if (checkHasAuth()) {
                messageService.sendHeartbeat();
            }
        };

        // 1. Initial ping on mount
        triggerHeartbeat();

        // 2. Set interval every 45 seconds
        intervalRef.current = setInterval(triggerHeartbeat, 45000);

        // 3. Trigger on visibility change (when user returns to tab)
        const handleVisibilityChange = () => {
            if (document.visibilityState === "visible") {
                triggerHeartbeat();
            }
        };

        // 4. Trigger on user interaction (focus, click after idle)
        const handleFocus = () => {
            triggerHeartbeat();
        };

        window.addEventListener("visibilitychange", handleVisibilityChange);
        window.addEventListener("focus", handleFocus);

        return () => {
            if (intervalRef.current) {
                clearInterval(intervalRef.current);
            }
            window.removeEventListener("visibilitychange", handleVisibilityChange);
            window.removeEventListener("focus", handleFocus);
        };
    }, [enabled]);
};

export default useUserHeartbeat;
