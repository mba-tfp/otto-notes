import { WifiOff } from 'lucide-react';
import { useOnlineStatus } from '@/hooks/useOnlineStatus';

export const OfflineBanner = () => {
  const { isDesktop, isOnline, retry } = useOnlineStatus();

  if (!isDesktop || isOnline) return null;

  return (
    <div className="flex items-center justify-between gap-3 px-5 py-2 bg-destructive/10 border-b border-destructive/30 animate-fade-in">
      <div className="flex items-center gap-2 min-w-0">
        <WifiOff className="h-4 w-4 text-destructive flex-shrink-0" />
        <p className="text-sm text-destructive truncate">
          You're offline. Otto Notes needs an internet connection to work.
        </p>
      </div>
      <button
        onClick={retry}
        className="text-sm font-medium text-destructive hover:underline flex-shrink-0"
      >
        Retry
      </button>
    </div>
  );
};
