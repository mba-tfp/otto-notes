import { useState } from 'react';
import { ChevronRight } from 'lucide-react';
import { categories, topics, ResourceTopic } from '@/data/resourceCenter';
import { TopicCard } from './TopicCard';
import { ScrollArea } from '@/components/ui/scroll-area';

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
  const [openCategories, setOpenCategories] = useState<Record<string, boolean>>(() => {
    const initial: Record<string, boolean> = {};
    categories.forEach(cat => {
      initial[cat.id] = cat.id === selectedCategoryId;
    });
    return initial;
  });

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

      <ScrollArea className="flex-1 px-4 py-3">
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
                      { label: 'Video guides', items: catTopics.filter(t => t.isVideo) },
                      { label: 'Documents', items: catTopics.filter(t => t.isPdf) },
                      { label: '', items: catTopics.filter(t => !t.isVideo && !t.isPdf) },
                    ]
                      .filter(g => g.items.length > 0)
                      .map(group => (
                        <div key={group.label || 'other'} className="flex flex-col gap-2">
                          {group.label && catTopics.some(t => t.isVideo) && catTopics.some(t => t.isPdf) && (
                            <p className="text-[11px] font-semibold uppercase tracking-wide text-muted-foreground px-1 pt-1">
                              {group.label}
                            </p>
                          )}
                          {group.items.map(topic => (
                            <TopicCard
                              key={topic.id}
                              topic={topic}
                              isSelected={selectedTopicId === topic.id}
                              onClick={() => onSelectTopic(topic)}
                            />
                          ))}
                        </div>
                      ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </ScrollArea>
    </div>
  );
};
