import { useState, useMemo, type ReactNode } from 'react';
import { Dialog, DialogContent, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Play, Clock, X, ExternalLink, ChevronDown, Check, CircleCheck } from 'lucide-react';
import { topics, ResourceTopic } from '@/data/resourceCenter';
import { useTrainingProgress } from '@/contexts/TrainingProgressContext';

interface Props {
  onBack: () => void;
  onFinish: () => void;
}

// Smooth height-animated accordion body. Uses the grid-rows technique
// (1fr <-> 0fr) so the height transition never clips content and runs
// in sync with the chevron rotation.
const AccordionBody = ({ open, children }: { open: boolean; children: ReactNode }) => (
  <div
    aria-hidden={!open}
    className={`grid transition-[grid-template-rows,visibility] duration-300 ease-out ${
      open ? 'visible grid-rows-[1fr]' : 'invisible grid-rows-[0fr]'
    }`}
  >
    <div className="min-h-0 overflow-hidden">{children}</div>
  </div>
);

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

export const OnboardingStepThree = ({ onBack, onFinish }: Props) => {
  const [activeVideo, setActiveVideo] = useState<ResourceTopic | null>(null);
  const [openSection, setOpenSection] = useState<'videos' | 'documents'>('videos');
  const { completedVideoIds, markVideoComplete } = useTrainingProgress();

  const videoGuides = useMemo(
    () => topics.filter((t) => t.categoryId === 'getting-started' && t.isVideo),
    []
  );
  const sopDocs = useMemo(
    () => topics.filter((t) => t.categoryId === 'getting-started' && t.isPdf),
    []
  );


  return (
    <div className="p-8 pb-6">
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

      {/* Training resources accordion */}
      <div className="mb-5 space-y-2">
        <section className="overflow-hidden rounded-lg border border-border">
          <Button
            type="button"
            variant="ghost"
            onClick={() => setOpenSection('videos')}
            aria-expanded={openSection === 'videos'}
            className="h-10 w-full justify-between rounded-none px-3 text-sm font-medium hover:bg-muted/50"
          >
            <span>Quick start videos</span>
            <ChevronDown
              className={`h-4 w-4 text-muted-foreground transition-transform duration-300 ease-out ${
                openSection === 'videos' ? 'rotate-180' : ''
              }`}
            />
          </Button>

          <AccordionBody open={openSection === 'videos'}>
            <div className="grid grid-cols-2 gap-2 border-t border-border p-2">
              {videoGuides.map((video) => {
                const Icon = video.icon;
                const completed = completedVideoIds.includes(video.id);
                return (
                  <button
                    key={video.id}
                    type="button"
                    tabIndex={openSection === 'videos' ? 0 : -1}
                    onClick={() => {
                      setActiveVideo(video);
                      void markVideoComplete(video.id);
                    }}
                    className={`group flex min-h-[76px] items-center gap-2 rounded-lg border p-2.5 text-left transition-colors ${completed ? 'border-primary/30 bg-primary/5' : 'border-border bg-muted/30 hover:bg-muted/60'}`}
                  >
                    <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-md bg-brand/10 text-brand">
                      {Icon && <Icon className="h-4 w-4" />}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="truncate text-xs font-medium leading-snug text-foreground">{video.title}</p>
                      <span className="mt-1 flex items-center gap-1 text-[11px] text-muted-foreground">
                        <Clock className="h-3 w-3" />{video.duration}
                      </span>
                    </div>
                    <div className={`flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-full transition-transform group-hover:scale-105 ${completed ? 'bg-primary text-primary-foreground' : 'bg-brand/90 text-primary-foreground'}`}>
                      {completed ? <Check className="h-3.5 w-3.5" /> : <Play className="ml-0.5 h-3 w-3" />}
                    </div>
                  </button>
                );
              })}
            </div>
          </AccordionBody>
        </section>

        {sopDocs.length > 0 && (
          <section className="overflow-hidden rounded-lg border border-border">
            <Button
              type="button"
              variant="ghost"
              onClick={() => setOpenSection('documents')}
              aria-expanded={openSection === 'documents'}
              className="h-10 w-full justify-between rounded-none px-3 text-sm font-medium hover:bg-muted/50"
            >
              <span>Documents</span>
              <ChevronDown
                className={`h-4 w-4 text-muted-foreground transition-transform duration-300 ease-out ${
                  openSection === 'documents' ? 'rotate-180' : ''
                }`}
              />
            </Button>

            <AccordionBody open={openSection === 'documents'}>
              <div className="flex flex-col gap-2 border-t border-border p-2">
                {sopDocs.map((doc) => {
                  const Icon = doc.icon;
                  return (
                    <a
                      key={doc.id}
                      href={doc.pdfUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      tabIndex={openSection === 'documents' ? 0 : -1}
                      className="group flex min-h-[68px] items-center gap-3 rounded-lg border border-border bg-muted/30 p-2.5 text-left transition-colors hover:bg-muted/60"
                    >
                      <div className="w-9 h-9 rounded-lg bg-brand/10 text-brand flex items-center justify-center flex-shrink-0">
                        {Icon && <Icon className="h-4 w-4" />}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-foreground leading-snug truncate">{doc.title}</p>
                        <p className="text-xs text-muted-foreground mt-0.5 line-clamp-1">{doc.description}</p>
                      </div>
                      <span className="text-[11px] text-muted-foreground flex items-center gap-1 flex-shrink-0">
                        PDF · {doc.version}
                        <ExternalLink className="h-3 w-3 ml-1" />
                      </span>
                    </a>
                  );
                })}
              </div>
            </AccordionBody>
          </section>
        )}
      </div>

      {/* Actions */}
      <div className="flex items-center justify-end gap-3">
        <Button onClick={onFinish} size="lg">
          Continue
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
