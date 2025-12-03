import { useAuth } from "./useAuth";
/**
 * Safely call useAuth().
 * Returns undefined if not wrapped in <AuthProvider>.
 */
export function useSafeAuth() {
    try {
        return useAuth();
    } catch {
        return undefined;
    }
}