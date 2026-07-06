import { ArrowLeft } from 'lucide-react';
import { AppLayout } from '@/components/layout/AppLayout';
import { LettersList } from '@/components/letters/LettersList';
import { LetterDetail } from '@/components/letters/LetterDetail';
import { LettersProvider, useLetters } from '@/contexts/LettersContext';
import { Separator } from '@/components/ui/separator';
import { Button } from '@/components/ui/button';
import { GlobalSessionsPanel } from '@/components/layout/GlobalSessionsPanel';
import { useSessionsPanel } from '@/contexts/SessionsPanelContext';
import { useBreakpoint } from '@/hooks/useBreakpoint';

const LettersContent = () => {
  const { isSessionsPanelVisible } = useSessionsPanel();
  const { selectedLetterId, setSelectedLetterId } = useLetters();
  const bp = useBreakpoint();

  const isMobile = bp === 'mobile';
  const showDetailOnly = isMobile && !!selectedLetterId;
  const showListOnly = isMobile && !selectedLetterId;

  return (
    <AppLayout hideGlobalSessionsPanel>
      <div className="flex h-screen overflow-hidden bg-background w-full">
        {/* List/Panel pane */}
        {!showDetailOnly && (
          isSessionsPanelVisible ? (
            <div className={isMobile ? 'flex-1 min-w-0 h-full' : 'w-80 flex-shrink-0 h-full'}>
              <GlobalSessionsPanel />
            </div>
          ) : (
            <div
              className={
                isMobile
                  ? 'flex-1 min-w-0 h-full overflow-hidden'
                  : 'flex-shrink-0 overflow-hidden'
              }
            >
              <LettersList />
            </div>
          )
        )}

        {/* Divider (desktop/tablet only) */}
        {!isMobile && <Separator orientation="vertical" className="h-full" />}

        {/* Detail pane */}
        {!showListOnly && (
          <div className="flex-1 min-w-0 overflow-hidden flex flex-col">
            {isMobile && selectedLetterId && (
              <div className="border-b border-border px-3 py-2 flex items-center gap-2 shrink-0">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setSelectedLetterId(null)}
                  className="gap-1.5"
                >
                  <ArrowLeft className="h-4 w-4" />
                  Letters
                </Button>
              </div>
            )}
            <div className="flex-1 overflow-hidden">
              <LetterDetail />
            </div>
          </div>
        )}
      </div>
    </AppLayout>
  );
};

const Letters = () => {
  return (
    <LettersProvider>
      <LettersContent />
    </LettersProvider>
  );
};

export default Letters;
