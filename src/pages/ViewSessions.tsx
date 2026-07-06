import { AppLayout } from '@/components/layout/AppLayout';
import { SessionList } from '@/components/sessions/SessionList';
import { SessionDetail } from '@/components/sessions/SessionDetail';
import { SessionsLayoutProvider, useSessionsLayout } from '@/contexts/SessionsLayoutContext';
import { useBreakpoint } from '@/hooks/useBreakpoint';

const ViewSessionsContent = () => {
  const { isSessionsListVisible } = useSessionsLayout();
  const bp = useBreakpoint();
  const isMobile = bp === 'mobile';

  const listWidthClass =
    bp === 'desktop' ? 'w-80' : bp === 'tablet' ? 'w-72' : 'w-full';

  return (
    <AppLayout hideGlobalSessionsPanel>
      <div className="flex h-full overflow-hidden bg-background w-full">
        {/* Middle Pane - Sessions List */}
        {isSessionsListVisible && (
          <div className={`${listWidthClass} h-full flex-shrink-0 overflow-hidden`}>
            <SessionList />
          </div>
        )}

        {/* Right Pane - Session Detail (hidden on mobile since selection navigates to /new-session) */}
        {!isMobile && (
          <div className="flex-1 min-w-0 overflow-hidden">
            <SessionDetail />
          </div>
        )}
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
