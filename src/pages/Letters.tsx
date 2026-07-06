import { useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { AppLayout } from '@/components/layout/AppLayout';
import { LettersList } from '@/components/letters/LettersList';
import { LetterDetail } from '@/components/letters/LetterDetail';
import { LettersProvider, useLetters } from '@/contexts/LettersContext';
import { Separator } from '@/components/ui/separator';
import { GlobalSessionsPanel } from '@/components/layout/GlobalSessionsPanel';
import { useSessionsPanel } from '@/contexts/SessionsPanelContext';
import { useBreakpoint } from '@/hooks/useBreakpoint';

const LettersContent = () => {
  const { isSessionsPanelVisible } = useSessionsPanel();
  const { id } = useParams();
  const navigate = useNavigate();
  const { selectedLetterId, setSelectedLetterId } = useLetters();
  const bp = useBreakpoint();
  const isMobile = bp === 'mobile';

  // Sync URL param → context
  useEffect(() => {
    if (id && id !== selectedLetterId) {
      setSelectedLetterId(id);
    } else if (!id && selectedLetterId && isMobile) {
      setSelectedLetterId(null);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id, isMobile]);

  const showList = !isMobile || !id;
  const showDetail = !isMobile || !!id;

  const listWidthClass =
    bp === 'desktop' ? 'w-80' : bp === 'tablet' ? 'w-72' : 'w-full';

  const handleBack = () => navigate('/letters');
  const handleSelectLetter = (letterId: string) => {
    if (isMobile) {
      navigate(`/letters/${letterId}`);
    } else {
      setSelectedLetterId(letterId);
    }
  };

  return (
    <AppLayout hideGlobalSessionsPanel>
      <div className="flex h-full overflow-hidden bg-background w-full">
        {/* Middle Pane */}
        {showList && (
          isSessionsPanelVisible && !isMobile ? (
            <div className="w-80 flex-shrink-0 h-full">
              <GlobalSessionsPanel />
            </div>
          ) : (
            <div className={`${listWidthClass} h-full flex-shrink-0 overflow-hidden`}>
              <LettersList onSelectLetter={handleSelectLetter} />
            </div>
          )
        )}

        {/* Vertical Divider — only when both visible */}
        {showList && showDetail && !isMobile && (
          <Separator orientation="vertical" className="h-full" />
        )}

        {/* Right Pane - Letter Detail */}
        {showDetail && (
          <div className="flex-1 min-w-0 overflow-hidden">
            <LetterDetail onBack={isMobile ? handleBack : undefined} />
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
