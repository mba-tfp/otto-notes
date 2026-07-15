import { useEffect, useState } from 'react';
import { toast } from 'sonner';
import { useAppUpdateAvailable } from '@/hooks/useAppUpdateAvailable';
import { RelaunchConfirmDialog } from './RelaunchConfirmDialog';

const SESSION_SHOWN_KEY = 'otto-update-toast-shown';
const TOAST_ID = 'otto-update';

export const UpdateAvailableToast = () => {
  const { updateAvailable, applyUpdate } = useAppUpdateAvailable();
  const [dialogOpen, setDialogOpen] = useState(false);

  useEffect(() => {
    if (!updateAvailable) return;
    if (sessionStorage.getItem(SESSION_SHOWN_KEY) === 'true') return;

    sessionStorage.setItem(SESSION_SHOWN_KEY, 'true');

    toast('New version ready', {
      id: TOAST_ID,
      description: 'Relaunch Otto Notes to install the latest update.',
      duration: Infinity,
      action: {
        label: 'Relaunch',
        onClick: () => setDialogOpen(true),
      },
      cancel: {
        label: 'Later',
        onClick: () => toast.dismiss(TOAST_ID),
      },
    });
  }, [updateAvailable]);

  return (
    <RelaunchConfirmDialog
      open={dialogOpen}
      onOpenChange={setDialogOpen}
      onConfirm={() => {
        toast.dismiss(TOAST_ID);
        applyUpdate();
      }}
    />
  );
};
