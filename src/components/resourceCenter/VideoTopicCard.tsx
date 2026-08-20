import { Play } from 'lucide-react';
import { ResourceTopic } from '@/data/resourceCenter';

interface VideoTopicCardProps {
  topic: ResourceTopic;
  isSelected: boolean;
  onClick: () => void;
}

export const VideoTopicCard = ({ topic, isSelected, onClick }: VideoTopicCardProps) => {
  return (
    <button
      onClick={onClick}
      className={`
        w-full text-left rounded-xl border overflow-hidden transition-all duration-200 group
        ${isSelected
          ? 'bg-primary/5 border-primary/30 shadow-subtle'
          : 'bg-card border-border hover:border-primary/20'}
      `}
    >
      {/* Thumbnail */}
      <div className="relative aspect-video w-full overflow-hidden bg-gradient-to-br from-[#1a2b4a] to-[#263F6A]">
        {/* Decorative circles */}
        <div className="absolute -top-6 -right-6 w-24 h-24 rounded-full bg-white/5" />
        <div className="absolute bottom-4 left-4 w-12 h-12 rounded-full bg-white/5" />
        
        {/* Title overlay */}
        <div className="absolute inset-0 flex items-center justify-center p-4">
          <span className="text-white/90 text-sm font-semibold text-center line-clamp-2 drop-shadow-sm">
            {topic.title}
          </span>
        </div>

        {/* Play button */}
        <div className={`
          absolute inset-0 flex items-center justify-center
          transition-opacity duration-200
          ${isSelected ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'}
        `}>
          <div className="w-12 h-12 rounded-full bg-white/90 flex items-center justify-center shadow-lg">
            <Play className="h-5 w-5 text-[#263F6A] fill-[#263F6A] ml-0.5" />
          </div>
        </div>

        {/* Duration badge */}
        {topic.duration && (
          <div className="absolute bottom-2 right-2 px-1.5 py-0.5 rounded bg-black/70 text-white text-[10px] font-medium">
            {topic.duration}
          </div>
        )}
      </div>

      {/* Meta */}
      <div className="p-3">
        <h4 className={`text-sm font-semibold truncate ${isSelected ? 'text-primary' : 'text-foreground'}`}>
          {topic.title}
        </h4>
        {topic.date && (
          <p className="text-xs text-muted-foreground mt-0.5">
            {topic.date}
          </p>
        )}
      </div>
    </button>
  );
};
