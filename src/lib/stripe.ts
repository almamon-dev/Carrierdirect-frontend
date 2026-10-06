import { loadStripe, Stripe } from "@stripe/stripe-js";
import apiClient from "@/lib/axios";

let stripePromise: Promise<Stripe | null> | null = null;
let cachedPublishableKey: string | null = null;

/**
 * Fetch Stripe Publishable Key dynamically from Backend GET API
 */
export async function fetchStripePublicKey(): Promise<string | null> {
    if (cachedPublishableKey) return cachedPublishableKey;

    try {
        const res: any = await apiClient.get("/stripe/public-key");
        const key =
            res?.data?.publishable_key ||
            res?.data?.key ||
            res?.data?.data?.publishable_key ||
            res?.data?.data?.key ||
            res?.data?.data?.stripe_key;

        if (key && typeof key === "string" && key.startsWith("pk_")) {
            cachedPublishableKey = key;
            return key;
        }
    } catch (err) {
        console.warn("Could not fetch Stripe public key from /stripe/public-key:", err);
    }

    try {
        const resSettings: any = await apiClient.get("/settings");
        const key = resSettings?.data?.data?.stripe_public_key || resSettings?.data?.stripe_public_key;
        if (key && typeof key === "string" && key.startsWith("pk_")) {
            cachedPublishableKey = key;
            return key;
        }
    } catch (err) {
        console.warn("Could not fetch Stripe public key from /settings:", err);
    }

    return null;
}

/**
 * Dynamically load Stripe instance using key provided or fetched from backend GET API.
 */
export async function getStripe(providedKey?: string): Promise<Stripe | null> {
    const key = providedKey || cachedPublishableKey || (await fetchStripePublicKey());

    if (!key) {
        console.error("Stripe Publishable Key not available from backend.");
        return null;
    }

    if (!stripePromise || cachedPublishableKey !== key) {
        cachedPublishableKey = key;
        stripePromise = loadStripe(key);
    }

    return stripePromise;
}
