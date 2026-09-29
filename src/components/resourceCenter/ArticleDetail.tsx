import { ResourceTopic } from '@/data/resourceCenter';
import { BookOpen, Download, ExternalLink, Check, CircleCheck } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { ContactSupport } from './ContactSupport';
import { FeedbackForm } from './FeedbackForm';
import { useTrainingProgress } from '@/contexts/TrainingProgressContext';

interface ArticleDetailProps {
  topic: ResourceTopic | null;
}

export const ArticleDetail = ({ topic }: ArticleDetailProps) => {
  const { completedVideoIds, markVideoComplete } = useTrainingProgress();
  if (!topic) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-center p-8">
        <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mb-6">
          <BookOpen className="h-8 w-8 text-muted-foreground" />
        </div>
        <h3 className="text-xl font-semibold text-foreground mb-2">Select a topic</h3>
        <p className="text-sm text-muted-foreground max-w-sm">
          Choose a topic from the left to view guides or contact our support team.
        </p>
      </div>
    );
  }

  // Contact support renders its own UI
  if (topic.id === 'send-message') {
    return <ContactSupport />;
  }

  // Feedback form renders its own UI
  if (topic.id === 'give-feedback-form') {
    return <FeedbackForm />;
  }

  // PDF documents render in an embedded viewer
  if (topic.isPdf && topic.pdfUrl) {
    return (
      <div className="flex flex-col h-full">
        <div className="flex items-start justify-between gap-4 px-6 py-4 border-b border-border bg-card">
          <div className="min-w-0">
            <h2 className="text-base font-semibold text-foreground truncate">{topic.title}</h2>
            <p className="text-xs text-muted-foreground mt-0.5">
              {[topic.version, topic.date, topic.fileSize].filter(Boolean).join(' · ')}
            </p>
          </div>
          <div className="flex items-center gap-2 flex-shrink-0">
            <Button variant="outline" size="sm" asChild>
              <a href={topic.pdfUrl} target="_blank" rel="noreferrer">
                <ExternalLink className="h-4 w-4 mr-1.5" />
                Open in new tab
              </a>
            </Button>
            <Button size="sm" asChild>
              <a href={topic.pdfUrl} download>
                <Download className="h-4 w-4 mr-1.5" />
                Download PDF
              </a>
            </Button>
          </div>
        </div>
        <div className="flex-1 min-h-0 bg-muted p-4">
          <iframe
            src={`${topic.pdfUrl}#view=FitH`}
            title={topic.title}
            className="w-full h-full rounded-lg border border-border bg-background"
          />
        </div>
      </div>
    );
  }

  // Parse simple markdown-like content
  const renderContent = (content: string) => {
    const lines = content.trim().split('\n');
    const elements: React.ReactNode[] = [];

    lines.forEach((line, i) => {
      const trimmed = line.trim();
      if (!trimmed) {
        elements.push(<div key={i} className="h-3" />);
      } else if (trimmed.startsWith('## ')) {
        elements.push(
          <h2 key={i} className="text-xl font-semibold text-foreground mt-6 mb-3">
            {trimmed.slice(3)}
          </h2>
        );
      } else if (trimmed.startsWith('### ')) {
        elements.push(
          <h3 key={i} className="text-base font-semibold text-foreground mt-5 mb-2">
            {trimmed.slice(4)}
          </h3>
        );
      } else if (trimmed.startsWith('- **')) {
        const match = trimmed.match(/^- \*\*(.+?)\*\*:?\s*(.*)$/);
        if (match) {
          elements.push(
            <div key={i} className="flex gap-2 ml-4 mb-1.5">
              <span className="text-muted-foreground mt-1.5">•</span>
              <p className="text-sm text-muted-foreground">
                <span className="font-semibold text-foreground">{match[1]}</span>
                {match[2] ? `: ${match[2]}` : ''}
              </p>
            </div>
          );
        }
      } else if (trimmed.startsWith('- ')) {
        elements.push(
          <div key={i} className="flex gap-2 ml-4 mb-1.5">
            <span className="text-muted-foreground mt-1.5">•</span>
            <p className="text-sm text-muted-foreground">{renderInlineFormatting(trimmed.slice(2))}</p>
          </div>
        );
      } else if (/^\d+\.\s/.test(trimmed)) {
        const num = trimmed.match(/^(\d+)\.\s(.*)$/);
        if (num) {
          elements.push(
            <div key={i} className="flex gap-2 ml-4 mb-1.5">
              <span className="text-xs font-semibold text-primary bg-primary/10 rounded-full w-5 h-5 flex items-center justify-center flex-shrink-0 mt-0.5">
                {num[1]}
              </span>
              <p className="text-sm text-muted-foreground">{renderInlineFormatting(num[2])}</p>
            </div>
          );
        }
      } else {
        elements.push(
          <p key={i} className="text-sm text-muted-foreground leading-relaxed">
            {renderInlineFormatting(trimmed)}
          </p>
        );
      }
    });

    return elements;
  };

  const renderInlineFormatting = (text: string): React.ReactNode => {
    // Handle **bold** formatting
    const parts = text.split(/\*\*(.+?)\*\*/g);
    return parts.map((part, i) =>
      i % 2 === 1 ? (
        <span key={i} className="font-semibold text-foreground">{part}</span>
      ) : (
        part
      )
    );
  };

  return (
    <ScrollArea className="h-full">
      <div className="max-w-2xl mx-auto p-8">
        {/* Video Player */}
        {topic.videoUrl && (
          <div className="mb-8">
            <div className="relative w-full aspect-video rounded-xl overflow-hidden bg-muted">
              <iframe
                src={topic.videoUrl}
                title={topic.title}
                className="w-full h-full"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>
            <div className="mt-3 flex justify-end">
              <Button
                variant={completedVideoIds.includes(topic.id) ? 'ghost' : 'outline'}
                disabled={completedVideoIds.includes(topic.id)}
                onClick={() => void markVideoComplete(topic.id)}
              >
                {completedVideoIds.includes(topic.id) ? <CircleCheck className="mr-2 h-4 w-4 text-primary" /> : <Check className="mr-2 h-4 w-4" />}
                {completedVideoIds.includes(topic.id) ? 'Completed' : 'Mark complete'}
              </Button>
            </div>
          </div>
        )}

        {/* Article Content */}
        <div className="prose-sm">
          {renderContent(topic.content)}
        </div>
      </div>
    </ScrollArea>
  );
};
