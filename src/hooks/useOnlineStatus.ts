import { useCallback, useEffect, useRef, useState } from 'react';
import { showSuccessToast } from '@/lib/toast';

const isDesktopEnv = () =>
  typeof navigator !== 'undefined' &&
  (navigator.userAgent.includes('Electron') ||
    (typeof localStorage !== 'undefined' &&
      localStorage.getItem('otto-force-desktop') === 'true'));

export const useOnlineStatus = () => {
  const isDesktop = isDesktopEnv();
  const [isOnline, setIsOnline] = useState<boolean>(
    typeof navigator !== 'undefined' ? navigator.onLine : true,
  );
  const prevOnlineRef = useRef(isOnline);

  useEffect(() => {
    if (!isDesktop) return;
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, [isDesktop]);

  useEffect(() => {
    if (!isDesktop) return;
    if (prevOnlineRef.current === false && isOnline === true) {
      showSuccessToast('Back online');
    }
    prevOnlineRef.current = isOnline;
  }, [isOnline, isDesktop]);

  const retry = useCallback(async () => {
    try {
      await fetch(window.location.origin + '/favicon.ico', {
        method: 'HEAD',
        cache: 'no-store',
      });
      setIsOnline(true);
    } catch {
      setIsOnline(false);
    }
  }, []);

  return {
    isDesktop,
    isOnline: isDesktop ? isOnline : true,
    retry,
  };
};
