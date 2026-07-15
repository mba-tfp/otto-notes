import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

interface RelaunchConfirmDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: () => void;
}

export const RelaunchConfirmDialog = ({ open, onOpenChange, onConfirm }: RelaunchConfirmDialogProps) => {
  const handleConfirm = () => {
    onConfirm();
    toast.success('Relaunching Otto Notes…');
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Relaunch to update?</DialogTitle>
          <DialogDescription className="pt-2">
            Otto Notes will close and reopen to install the latest version. Any unsaved work in the current session may be lost.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="mt-4">
          <Button variant="ghost" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleConfirm} className="bg-[#FF887C] text-white hover:opacity-90">
            Relaunch now
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
