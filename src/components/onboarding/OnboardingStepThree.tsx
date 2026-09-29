import { useState, useMemo } from 'react';
import { Dialog, DialogContent, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { ArrowLeft, Play, Clock, X } from 'lucide-react';
import { topics, ResourceTopic } from '@/data/resourceCenter';

interface Props {
  onBack: () => void;
  onSkip: () => void;
  onFinish: () => void;
}

// Lightweight renderer for the guide's markdown-ish content
function renderGuideContent(content: string) {
  return content
    .trim()
    .split('\n')
    .map((line, i) => {
      const trimmed = line.trim();
      if (!trimmed) return null;
      if (trimmed.startsWith('### ')) {
        return (
          <h4 key={i} className="text-sm font-semibold text-foreground mt-4">
            {trimmed.slice(4)}
          </h4>
        );
      }
      if (trimmed.startsWith('## ')) {
        return (
          <h3 key={i} className="text-base font-semibold text-foreground mt-4">
            {trimmed.slice(3)}
          </h3>
        );
      }
      const parts = trimmed.split(/(\*\*[^*]+\*\*)/g);
      return (
        <p key={i} className="text-sm text-muted-foreground leading-relaxed mt-1.5">
          {parts.map((part, j) =>
            part.startsWith('**') && part.endsWith('**') ? (
              <strong key={j} className="font-medium text-foreground">
                {part.slice(2, -2)}
              </strong>
            ) : (
              part
            )
          )}
        </p>
      );
    });
}

export const OnboardingStepThree = ({ onBack, onSkip, onFinish }: Props) => {
  const [noTraining, setNoTraining] = useState(false);
  const [activeVideo, setActiveVideo] = useState<ResourceTopic | null>(null);

  const videoGuides = useMemo(
    () => topics.filter((t) => t.categoryId === 'getting-started' && t.isVideo),
    []
  );

  const handleFinish = () => {
    if (noTraining) {
      localStorage.setItem('otto-training-dismissed', 'true');
    }
    onFinish();
  };

  const handleSkip = () => {
    localStorage.setItem('otto-training-skipped-at', Date.now().toString());
    onSkip();
  };

  return (
    <div className="overflow-y-auto max-h-[90vh] p-8 pb-6">
      {/* Back */}
      <button
        onClick={onBack}
        className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors mb-4"
      >
        <ArrowLeft className="h-4 w-4" />
        Back
      </button>

      {/* Header */}
      <div className="flex flex-col items-center mb-6">
        <DialogTitle className="text-2xl font-semibold text-foreground text-center">
          Training & Resources
        </DialogTitle>
        <DialogDescription className="text-sm text-muted-foreground text-center mt-1">
          Get started with Otto Notes — watch a quick guide to learn the basics.
        </DialogDescription>
      </div>

      {/* Video Guides — matches Help Center */}
      <div className="mb-6">
        <h3 className="text-sm font-medium text-foreground mb-3">Quick start videos</h3>
        <div className="max-h-[380px] overflow-y-auto pr-1">
          <div className="flex flex-col gap-2 pr-1">
            {videoGuides.map((video) => {
              const Icon = video.icon;
              return (
                <button
                  key={video.id}
                  onClick={() => setActiveVideo(video)}
                  className="group flex items-center gap-3 rounded-xl border border-border bg-muted/30 hover:bg-muted/60 transition-colors text-left p-3"
                >
                  <div className="w-9 h-9 rounded-lg bg-brand/10 text-brand flex items-center justify-center flex-shrink-0">
                    {Icon && <Icon className="h-4 w-4" />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-foreground leading-snug truncate">
                      {video.title}
                    </p>
                    <p className="text-xs text-muted-foreground mt-0.5 line-clamp-1">
                      {video.description}
                    </p>
                  </div>
                  <div className="flex items-center gap-2 flex-shrink-0">
                    <span className="text-[11px] text-muted-foreground flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      {video.duration}
                    </span>
                    <div className="w-8 h-8 rounded-full bg-brand/90 text-white flex items-center justify-center shadow-sm group-hover:scale-110 transition-transform">
                      <Play className="h-3.5 w-3.5 ml-0.5" />
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Opt-out */}
      <div className="mb-6">
        <div className="flex items-start gap-2.5">
          <Checkbox
            id="no-training"
            checked={noTraining}
            onCheckedChange={(checked) => setNoTraining(checked === true)}
            className="mt-0.5"
          />
          <label htmlFor="no-training" className="text-sm text-muted-foreground leading-snug cursor-pointer">
            I don't need training to use Otto Notes
          </label>
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center justify-between gap-3">
        <Button variant="ghost" onClick={handleSkip} className="text-muted-foreground">
          Skip for now
        </Button>
        <Button onClick={handleFinish} size="lg">
          {noTraining ? 'Finish setup' : 'Continue'}
        </Button>
      </div>

      {/* Video player dialog */}
      <Dialog open={!!activeVideo} onOpenChange={(open) => !open && setActiveVideo(null)}>
        <DialogContent className="max-w-2xl max-h-[90vh] p-0 gap-0 overflow-hidden flex flex-col">
          {activeVideo && (
            <>
              <div className="flex items-center justify-between px-5 py-3 border-b border-border flex-shrink-0">
                <div className="min-w-0">
                  <DialogTitle className="text-base font-semibold text-foreground truncate">
                    {activeVideo.title}
                  </DialogTitle>
                  <DialogDescription className="text-xs text-muted-foreground mt-0.5 flex items-center gap-1">
                    <Clock className="h-3 w-3" />
                    {activeVideo.duration}
                  </DialogDescription>
                </div>
                <button
                  onClick={() => setActiveVideo(null)}
                  className="text-muted-foreground hover:text-foreground transition-colors flex-shrink-0 ml-3"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
              <div className="overflow-y-auto flex-1">
                {activeVideo.videoUrl && (
                  <div className="relative w-full" style={{ paddingTop: '56.25%' }}>
                    <iframe
                      src={activeVideo.videoUrl}
                      className="absolute top-0 left-0 w-full h-full"
                      frameBorder="0"
                      allow="autoplay; fullscreen; picture-in-picture; clipboard-write; encrypted-media"
                      allowFullScreen
                      title={activeVideo.title}
                    />
                  </div>
                )}
                <div className="px-5 py-4 pb-6">
                  {renderGuideContent(activeVideo.content)}
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};
