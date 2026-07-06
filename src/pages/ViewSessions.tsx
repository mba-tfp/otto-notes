import { ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { AppLayout } from '@/components/layout/AppLayout';
import { SessionList } from '@/components/sessions/SessionList';
import { SessionDetail } from '@/components/sessions/SessionDetail';
import { SessionsLayoutProvider, useSessionsLayout } from '@/contexts/SessionsLayoutContext';
import { useSessions } from '@/contexts/SessionsContext';
import { useBreakpoint } from '@/hooks/useBreakpoint';
import { Button } from '@/components/ui/button';

const ViewSessionsContent = () => {
  const { isSessionsListVisible, selectedSessionId, setSelectedSessionId } = useSessionsLayout();
  const { getSession } = useSessions();
  const navigate = useNavigate();
  const bp = useBreakpoint();

  const handleSelect = (id: string | null) => {
    if (!id) {
      setSelectedSessionId(null);
      return;
    }
    const session = getSession(id);
    if (session && (session.status === 'draft' || session.status === 'empty')) {
      navigate(`/new-session?id=${id}`);
      return;
    }
    setSelectedSessionId(id);
  };

  const bp = useBreakpoint();

  const isMobile = bp === 'mobile';
  const showDetailOnly = isMobile && !!selectedSessionId;
  const showListOnly = isMobile && !selectedSessionId;

  return (
    <AppLayout hideGlobalSessionsPanel>
      <div className="flex h-screen overflow-hidden bg-background w-full">
        {/* List pane */}
        {isSessionsListVisible && !showDetailOnly && (
          <div
            className={
              isMobile
                ? 'flex-1 h-full min-w-0'
                : 'w-80 h-full flex-shrink-0'
            }
          >
            <SessionList onSessionSelect={handleSelect} />
          </div>
        )}

        {/* Detail pane */}
        {!showListOnly && (
          <div className="flex-1 min-w-0 overflow-hidden flex flex-col">
            {isMobile && selectedSessionId && (
              <div className="border-b border-border px-3 py-2 flex items-center gap-2 shrink-0">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setSelectedSessionId(null)}
                  className="gap-1.5"
                >
                  <ArrowLeft className="h-4 w-4" />
                  Sessions
                </Button>
              </div>
            )}
            <div className="flex-1 overflow-hidden">
              <SessionDetail />
            </div>
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
