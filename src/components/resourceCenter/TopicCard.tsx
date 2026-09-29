import { ResourceTopic } from '@/data/resourceCenter';
import { Check, CircleCheck } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface TopicCardProps {
  topic: ResourceTopic;
  isSelected: boolean;
  onClick: () => void;
  isCompleted?: boolean;
  onMarkComplete?: () => void;
}

export const TopicCard = ({ topic, isSelected, onClick, isCompleted = false, onMarkComplete }: TopicCardProps) => {
  const Icon = topic.icon ?? (() => null);

  return (
    <div
      className={`
        w-full text-left p-4 rounded-xl border transition-all duration-200 group
        ${isSelected
          ? 'bg-primary/5 border-primary/20 shadow-subtle'
          : 'bg-card border-border hover:bg-muted hover:border-primary/10'}
      `}
    >
      <button type="button" onClick={onClick} className="flex w-full items-start gap-3 text-left">
        <div className={`
          flex items-center justify-center w-9 h-9 rounded-lg flex-shrink-0 transition-colors
          ${isSelected ? 'bg-primary/10 text-primary' : 'bg-muted text-muted-foreground group-hover:text-foreground'}
        `}>
          <Icon className="h-[18px] w-[18px]" />
        </div>
        <div className="min-w-0 flex-1">
          <h4 className={`text-sm font-semibold truncate ${isSelected ? 'text-primary' : 'text-foreground'}`}>
            {topic.title}
          </h4>
          <p className="text-xs text-muted-foreground mt-0.5 line-clamp-2">
            {topic.description}
          </p>
          {topic.isPdf && (
            <div className="flex items-center gap-2 mt-2">
              <span className="text-[10px] font-semibold uppercase tracking-wide px-1.5 py-0.5 rounded bg-primary/10 text-primary">
                PDF
              </span>
              {topic.version && (
                <span className="text-[11px] text-muted-foreground">
                  {topic.version}
                  {topic.date ? ` · ${topic.date}` : ''}
                </span>
              )}
            </div>
          )}
        </div>
      </button>
      {topic.isVideo && onMarkComplete && (
        <Button
          type="button"
          size="sm"
          variant={isCompleted ? 'ghost' : 'outline'}
          disabled={isCompleted}
          onClick={onMarkComplete}
          className="mt-3 h-8 w-full text-xs"
        >
          {isCompleted ? <CircleCheck className="mr-1.5 h-4 w-4 text-primary" /> : <Check className="mr-1.5 h-4 w-4" />}
          {isCompleted ? 'Completed' : 'Mark complete'}
        </Button>
      )}
    </div>
  );
};
