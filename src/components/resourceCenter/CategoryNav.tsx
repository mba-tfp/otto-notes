import { useState } from 'react';
import { ChevronRight } from 'lucide-react';
import { categories, topics, ResourceTopic } from '@/data/resourceCenter';
import { TopicCard } from './TopicCard';
import { useTrainingProgress } from '@/contexts/TrainingProgressContext';

interface CategoryNavProps {
  selectedCategoryId: string;
  selectedTopicId: string | null;
  onSelectCategory: (id: string) => void;
  onSelectTopic: (topic: ResourceTopic) => void;
}

export const CategoryNav = ({
  selectedCategoryId,
  selectedTopicId,
  onSelectCategory,
  onSelectTopic,
}: CategoryNavProps) => {
  const { completedVideoIds, markVideoComplete } = useTrainingProgress();
  const [openCategories, setOpenCategories] = useState<Record<string, boolean>>(() => {
    const initial: Record<string, boolean> = {};
    categories.forEach(cat => {
      initial[cat.id] = cat.id === selectedCategoryId;
    });
    return initial;
  });

  // Sub-groups (Video guides / Documents) start expanded
  const [openGroups, setOpenGroups] = useState<Record<string, boolean>>({});

  const toggleGroup = (key: string) => {
    setOpenGroups(prev => ({ ...prev, [key]: !(prev[key] ?? true) }));
  };

  const toggleCategory = (catId: string) => {
    const catTopics = topics.filter(t => t.categoryId === catId);

    // Single-topic categories: directly select the topic
    if (catTopics.length === 1) {
      onSelectCategory(catId);
      onSelectTopic(catTopics[0]);
      return;
    }

    setOpenCategories(prev => ({ ...prev, [catId]: !prev[catId] }));
    onSelectCategory(catId);
  };

  return (
    <div className="w-80 h-full flex flex-col border-r border-border bg-card">
      <div className="px-5 pt-6 pb-4">
        <h2 className="text-lg font-semibold text-foreground">Help Center</h2>
        <p className="text-xs text-muted-foreground mt-1">Guides and support</p>
      </div>

      <div className="h-px bg-border mx-4" />

      <div className="flex-1 min-h-0 overflow-y-auto px-4 py-3">
        <div className="flex flex-col gap-1">
          {categories.map(cat => {
            const catTopics = topics.filter(t => t.categoryId === cat.id);
            const isSingleTopic = catTopics.length === 1;
            const isOpen = openCategories[cat.id] ?? false;
            const isActive = selectedCategoryId === cat.id;

            if (isSingleTopic) {
              return (
                <button
                  key={cat.id}
                  onClick={() => toggleCategory(cat.id)}
                  className={`
                    flex items-center gap-2 text-left px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200
                    ${isActive
                      ? 'bg-primary/10 text-primary'
                      : 'text-muted-foreground hover:text-foreground hover:bg-muted'}
                  `}
                >
                  <ChevronRight className="h-4 w-4 flex-shrink-0" />
                  {cat.label}
                </button>
              );
            }

            return (
              <div key={cat.id}>
                <button
                  onClick={() => toggleCategory(cat.id)}
                  className={`
                    flex items-center gap-2 text-left px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 w-full
                    ${isActive
                      ? 'bg-primary/10 text-primary'
                      : 'text-muted-foreground hover:text-foreground hover:bg-muted'}
                  `}
                >
                  <ChevronRight className={`h-4 w-4 flex-shrink-0 transition-transform duration-200 ${isOpen ? 'rotate-90' : ''}`} />
                  {cat.label}
                </button>
                {isOpen && (
                  <div className="flex flex-col gap-3 pl-4 pr-1 pt-1.5 pb-2">
                    {[
                      { key: 'videos', label: 'Video guides', items: catTopics.filter(t => t.isVideo) },
                      { key: 'documents', label: 'Documents', items: catTopics.filter(t => t.isPdf) },
                      { key: 'other', label: '', items: catTopics.filter(t => !t.isVideo && !t.isPdf) },
                    ]
                      .filter(g => g.items.length > 0)
                      .map(group => {
                        const showLabel = !!group.label && catTopics.some(t => t.isVideo) && catTopics.some(t => t.isPdf);
                        const isGroupOpen = openGroups[group.key] ?? true;

                        return (
                          <div key={group.key} className="flex flex-col gap-2">
                            {showLabel && (
                              <button
                                type="button"
                                onClick={() => toggleGroup(group.key)}
                                aria-expanded={isGroupOpen}
                                className="flex items-center gap-1 px-1 pt-1 text-[11px] font-semibold uppercase tracking-wide text-muted-foreground hover:text-foreground transition-colors"
                              >
                                <ChevronRight className={`h-3 w-3 flex-shrink-0 transition-transform duration-200 ${isGroupOpen ? 'rotate-90' : ''}`} />
                                {group.label}
                              </button>
                            )}
                            {isGroupOpen && group.items.map(topic => (
                              <TopicCard
                                key={topic.id}
                                topic={topic}
                                isSelected={selectedTopicId === topic.id}
                                onClick={() => onSelectTopic(topic)}
                               isCompleted={completedVideoIds.includes(topic.id)}
                               onMarkComplete={topic.isVideo ? () => void markVideoComplete(topic.id) : undefined}
                              />
                            ))}
                          </div>
                        );
                      })}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
