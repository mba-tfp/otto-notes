import { useEffect, useState, useCallback } from 'react';

const SESSION_DISMISS_KEY = 'otto-update-banner-dismissed';
const APPLIED_KEY = 'otto-update-applied';

/**
 * Stubbed version-polling hook.
 * In production this would poll `/version.json` and compare to the app's
 * running version. For now it returns `true` so the UI can be reviewed.
 */
export const useAppUpdateAvailable = () => {
  const [updateAvailable, setUpdateAvailable] = useState(false);
  const [bannerDismissed, setBannerDismissed] = useState(false);

  const isDesktop =
    typeof navigator !== 'undefined' &&
    (navigator.userAgent.includes('Electron') ||
      (typeof localStorage !== 'undefined' &&
        localStorage.getItem('otto-force-desktop') === 'true'));

  useEffect(() => {
    if (!isDesktop) return;

    const check = () => {
      const applied = localStorage.getItem(APPLIED_KEY) === 'true';
      const mocked = localStorage.getItem('otto-mock-update-available');
      // Default to true so design can see the UI. Set the mock key to 'false' to hide.
      const available = !applied && mocked !== 'false';
      setUpdateAvailable(available);
      setBannerDismissed(sessionStorage.getItem(SESSION_DISMISS_KEY) === 'true');
    };

    check();
    const interval = setInterval(check, 5 * 60 * 1000); // poll every 5 min
    return () => clearInterval(interval);
  }, [isDesktop]);

  const dismissBanner = useCallback(() => {
    sessionStorage.setItem(SESSION_DISMISS_KEY, 'true');
    setBannerDismissed(true);
  }, []);

  const applyUpdate = useCallback(() => {
    localStorage.setItem(APPLIED_KEY, 'true');
    sessionStorage.removeItem(SESSION_DISMISS_KEY);
    setUpdateAvailable(false);
  }, []);

  return {
    isDesktop,
    updateAvailable,
    showBanner: updateAvailable && !bannerDismissed,
    showSidebarPill: updateAvailable,
    dismissBanner,
    applyUpdate,
  };
};
