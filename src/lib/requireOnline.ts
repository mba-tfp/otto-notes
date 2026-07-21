import { showErrorToast } from '@/lib/toast';

const isDesktopEnv = () =>
  typeof navigator !== 'undefined' &&
  (navigator.userAgent.includes('Electron') ||
    (typeof localStorage !== 'undefined' &&
      localStorage.getItem('otto-force-desktop') === 'true'));

/**
 * Guard an action that requires an internet connection (desktop app).
 * Returns true if the action may proceed; otherwise fires a toast and returns false.
 */
export const requireOnline = (actionLabel: string): boolean => {
  if (!isDesktopEnv()) return true;
  if (typeof navigator !== 'undefined' && navigator.onLine) return true;
  showErrorToast(`You're offline. Please reconnect to ${actionLabel}.`);
  return false;
};
