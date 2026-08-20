import { ResourceTopic } from '@/data/resourceCenter';

interface TopicCardProps {
  topic: ResourceTopic;
  isSelected: boolean;
  onClick: () => void;
}

export const TopicCard = ({ topic, isSelected, onClick }: TopicCardProps) => {
  const Icon = topic.icon ?? (() => null);

  return (
    <button
      onClick={onClick}
      className={`
        w-full text-left p-4 rounded-xl border transition-all duration-200 group
        ${isSelected
          ? 'bg-primary/5 border-primary/20 shadow-subtle'
          : 'bg-card border-border hover:bg-muted hover:border-primary/10'}
      `}
    >
      <div className="flex items-start gap-3">
        <div className={`
          flex items-center justify-center w-9 h-9 rounded-lg flex-shrink-0 transition-colors
          ${isSelected ? 'bg-primary/10 text-primary' : 'bg-muted text-muted-foreground group-hover:text-foreground'}
        `}>
          <Icon className="h-[18px] w-[18px]" />
        </div>
        <div className="min-w-0">
          <h4 className={`text-sm font-semibold truncate ${isSelected ? 'text-primary' : 'text-foreground'}`}>
            {topic.title}
          </h4>
          <p className="text-xs text-muted-foreground mt-0.5 line-clamp-2">
            {topic.description}
          </p>
        </div>
      </div>
    </button>
  );
};
