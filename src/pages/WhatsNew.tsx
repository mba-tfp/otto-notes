import { useState, useEffect } from 'react';
import { AppLayout } from '@/components/layout/AppLayout';
import { ReleaseNotesList } from '@/components/releaseNotes/ReleaseNotesList';
import { ReleaseNoteDetail } from '@/components/releaseNotes/ReleaseNoteDetail';
import { Separator } from '@/components/ui/separator';
import { GlobalSessionsPanel } from '@/components/layout/GlobalSessionsPanel';
import { useSessionsPanel } from '@/contexts/SessionsPanelContext';
import { markReleasesSeen } from '@/hooks/useUnseenReleases';
import { useQueryClient } from '@tanstack/react-query';
import type { ReleaseNote } from '@/data/seedReleaseNotes';

const WhatsNewContent = () => {
  const { isSessionsPanelVisible } = useSessionsPanel();
  const [selectedNote, setSelectedNote] = useState<ReleaseNote | null>(null);
  const queryClient = useQueryClient();

  useEffect(() => {
    markReleasesSeen().then(() => {
      queryClient.invalidateQueries({ queryKey: ['unseen-releases'] });
    });
  }, [queryClient]);

  return (
    <AppLayout hideGlobalSessionsPanel>
      <div className="flex h-screen overflow-hidden bg-background w-full">
        {isSessionsPanelVisible ? (
          <div className="w-80 flex-shrink-0 h-full">
            <GlobalSessionsPanel />
          </div>
        ) : (
          <div className="w-80 flex-shrink-0 h-full">
            <ReleaseNotesList
              selectedNoteId={selectedNote?.id ?? null}
              onSelectNote={setSelectedNote}
            />
          </div>
        )}

        <Separator orientation="vertical" className="h-full" />

        <div className="flex-1 min-w-0 overflow-hidden">
          <ReleaseNoteDetail note={selectedNote} />
        </div>
      </div>
    </AppLayout>
  );
};

const WhatsNew = () => {
  return <WhatsNewContent />;
};

export default WhatsNew;
