import { useState, useEffect } from 'react';
import { X, GraduationCap } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { OnboardingStepThree } from '@/components/onboarding/OnboardingStepThree';
import { useTrainingProgress } from '@/contexts/TrainingProgressContext';

const NUDGE_DELAY_MS = 5 * 60 * 1000; // 5 minutes

export const TrainingBanner = () => {
  const { isComplete, isLoading } = useTrainingProgress();
  const [visible, setVisible] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);

  useEffect(() => {
    if (isLoading || isComplete) {
      setVisible(false);
      return;
    }

    const skippedAt = localStorage.getItem('otto-training-skipped-at');
    if (!skippedAt) return;

    const elapsed = Date.now() - parseInt(skippedAt, 10);
    if (elapsed >= NUDGE_DELAY_MS) {
      setVisible(true);
    } else {
      const timer = setTimeout(() => setVisible(true), NUDGE_DELAY_MS - elapsed);
      return () => clearTimeout(timer);
    }
  }, [isComplete, isLoading]);

  const handleDismiss = () => {
    setVisible(false);
    // Reset skip timestamp so it comes back again later
    localStorage.setItem('otto-training-skipped-at', Date.now().toString());
  };

  const handleView = () => {
    setVisible(false);
    setDialogOpen(true);
  };

  const handleFinish = () => {
    setDialogOpen(false);
  };

  if (!visible && !dialogOpen) return null;

  return (
    <>
      {visible && (
        <div className="fixed top-4 right-4 z-50 flex items-center gap-3 rounded-xl border border-border bg-background shadow-lg px-4 py-3 animate-fade-in max-w-sm">
          <GraduationCap className="h-5 w-5 text-brand flex-shrink-0" />
          <p className="text-sm text-foreground flex-1">
            You have training resources available.
          </p>
          <Button size="sm" onClick={handleView} className="flex-shrink-0">
            View
          </Button>
          <button onClick={handleDismiss} className="text-muted-foreground hover:text-foreground transition-colors">
            <X className="h-4 w-4" />
          </button>
        </div>
      )}

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] p-0 gap-0 overflow-hidden">
          <OnboardingStepThree
            onBack={() => setDialogOpen(false)}
            onSkip={handleSkip}
            onFinish={handleFinish}
          />
        </DialogContent>
      </Dialog>
    </>
  );
};
