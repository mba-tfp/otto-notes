import { useEffect, useState } from 'react';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Monitor, Zap, Mic } from 'lucide-react';
import ottoLogo from '@/assets/otto-logo.png';

const DISMISS_KEY = 'otto-desktop-promo-dismissed';
export const DESKTOP_APP_DOWNLOAD_URL = '#';

export const DesktopAppPromoModal = () => {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (localStorage.getItem(DISMISS_KEY) === 'true') return;
    const t = setTimeout(() => setOpen(true), 600);
    return () => clearTimeout(t);
  }, []);

  const dismiss = () => {
    localStorage.setItem(DISMISS_KEY, 'true');
    setOpen(false);
  };

  const handleDownload = () => {
    window.open(DESKTOP_APP_DOWNLOAD_URL, '_blank', 'noopener,noreferrer');
    dismiss();
  };

  return (
    <Dialog open={open} onOpenChange={(v) => { if (!v) dismiss(); }}>
      <DialogContent className="max-w-md max-h-[90vh] p-0 overflow-hidden flex flex-col gap-0 border-0">

        {/* Header with brand bloom */}
        <div className="relative px-8 pt-10 pb-6 bg-gradient-to-br from-primary/10 via-background to-background">
          <div className="flex items-center gap-3 mb-5">
            <div className="h-12 w-12 rounded-2xl bg-session-action text-session-action-foreground flex items-center justify-center shadow-subtle">
              <Monitor className="h-6 w-6" strokeWidth={2} />
            </div>
            <img src={ottoLogo} alt="Otto Notes" className="h-8" />
          </div>
          <h2 className="text-2xl font-semibold text-foreground leading-tight">
            Otto Notes is now on desktop
          </h2>
          <p className="mt-2 text-sm text-muted-foreground">
            A faster, more focused way to document your consults.
          </p>
        </div>

        {/* Body */}
        <div className="px-8 pt-2 pb-6 space-y-3 overflow-y-auto">
          <FeatureRow icon={Zap} title="Faster performance" description="Native app speed, no browser overhead." />
          <FeatureRow icon={Mic} title="Better microphone access" description="Reliable, low-latency dictation." />
        </div>

        {/* Footer */}
        <div className="px-8 pb-8 pt-2 flex flex-col gap-2">
          <Button
            onClick={handleDownload}
            className="w-full bg-brand hover:bg-[hsl(5_85%_68%)] text-brand-foreground h-11 font-semibold"
          >
            Download desktop app
          </Button>
          <Button
            onClick={dismiss}
            variant="ghost"
            className="w-full h-10 text-muted-foreground hover:text-foreground"
          >
            Maybe later
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

const FeatureRow = ({ icon: Icon, title, description }: { icon: typeof Zap; title: string; description: string }) => (
  <div className="flex items-start gap-3">
    <div className="flex-shrink-0 h-9 w-9 rounded-xl bg-muted flex items-center justify-center text-foreground">
      <Icon className="h-4 w-4" strokeWidth={2} />
    </div>
    <div className="min-w-0">
      <div className="text-sm font-semibold text-foreground">{title}</div>
      <div className="text-xs text-muted-foreground">{description}</div>
    </div>
  </div>
);
