import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { GraduationCap } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogTitle } from '@/components/ui/dialog';
import { useTrainingProgress } from '@/contexts/TrainingProgressContext';

export const LegacyTrainingPrompt = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { shouldAskLegacyUser, isLoading, markAllComplete, acknowledgeLegacyPrompt } = useTrainingProgress();
  const [saving, setSaving] = useState(false);
  const open = !isLoading && shouldAskLegacyUser && location.pathname !== '/new-user-screen';

  const completeTraining = async () => {
    setSaving(true);
    try {
      await markAllComplete();
    } finally {
      setSaving(false);
    }
  };

  const viewTraining = async () => {
    setSaving(true);
    try {
      await acknowledgeLegacyPrompt();
      navigate('/resource-center?category=getting-started');
    } finally {
      setSaving(false);
    }
  };

  const dismiss = () => {
    if (!saving) void acknowledgeLegacyPrompt();
  };

  return (
    <Dialog open={open} onOpenChange={(nextOpen) => !nextOpen && dismiss()}>
      <DialogContent className="max-w-md p-0" onEscapeKeyDown={dismiss}>
        <div className="px-6 pt-7 pb-5 text-center">
          <div className="mx-auto mb-4 flex h-11 w-11 items-center justify-center rounded-full bg-primary/10 text-primary">
            <GraduationCap className="h-5 w-5" />
          </div>
          <DialogTitle className="text-xl">Have you completed Otto Notes training?</DialogTitle>
          <DialogDescription className="mt-2 leading-relaxed">
            Tell us once so we can keep your Help Center training reminders accurate.
          </DialogDescription>
        </div>
        <div className="flex flex-col gap-2 border-t border-border bg-muted/30 px-6 py-5">
          <Button onClick={completeTraining} disabled={saving}>Yes, I’ve completed it</Button>
          <Button variant="outline" onClick={viewTraining} disabled={saving}>Not yet — show me the training</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};