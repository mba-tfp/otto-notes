import { useState } from 'react';
import { Sparkles, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAppUpdateAvailable } from '@/hooks/useAppUpdateAvailable';
import { RelaunchConfirmDialog } from './RelaunchConfirmDialog';

export const UpdateAvailableBanner = () => {
  const { showBanner, dismissBanner, applyUpdate } = useAppUpdateAvailable();
  const [dialogOpen, setDialogOpen] = useState(false);

  if (!showBanner) return null;

  return (
    <>
      <div className="flex items-center justify-between gap-3 px-5 py-2 bg-primary/10 border-b border-primary/20 animate-fade-in">
        <div className="flex items-center gap-2 min-w-0">
          <Sparkles className="h-4 w-4 text-primary flex-shrink-0" />
          <p className="text-sm text-foreground truncate">
            A new version of Otto Notes is available.
          </p>
        </div>
        <div className="flex items-center gap-2 flex-shrink-0">
          <Button
            size="sm"
            onClick={() => setDialogOpen(true)}
            className="bg-[#FF887C] text-white hover:opacity-90 h-8"
          >
            Relaunch to update
          </Button>
          <button
            onClick={dismissBanner}
            className="p-1 rounded-md text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
            aria-label="Dismiss"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      </div>
      <RelaunchConfirmDialog open={dialogOpen} onOpenChange={setDialogOpen} onConfirm={applyUpdate} />
    </>
  );
};
