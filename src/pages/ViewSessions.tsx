import { AppLayout } from '@/components/layout/AppLayout';
import { SessionList } from '@/components/sessions/SessionList';
import { SessionDetail } from '@/components/sessions/SessionDetail';
import { SessionsLayoutProvider, useSessionsLayout } from '@/contexts/SessionsLayoutContext';

const ViewSessionsContent = () => {
  const { isSessionsListVisible } = useSessionsLayout();

  return (
    <AppLayout hideGlobalSessionsPanel>
      <div className="flex h-screen overflow-hidden bg-background w-full">
        {/* Middle Pane - Sessions List (fixed width like GlobalSessionsPanel) */}
        {isSessionsListVisible && (
          <div className="w-80 h-full flex-shrink-0">
            <SessionList />
          </div>
        )}

        {/* Right Pane - Session Detail */}
        <div className="flex-1 overflow-hidden">
          <SessionDetail />
        </div>
      </div>
    </AppLayout>
  );
};

const ViewSessions = () => {
  return (
    <SessionsLayoutProvider>
      <ViewSessionsContent />
    </SessionsLayoutProvider>
  );
};

export default ViewSessions;
