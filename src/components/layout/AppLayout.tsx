import { ReactNode } from 'react';
import { LeftPane } from '@/components/settings/LeftPane';
import { GlobalSessionsPanel } from './GlobalSessionsPanel';
import { AppFooter } from './AppFooter';
import { useLocation } from 'react-router-dom';
import { useSessionsPanel } from '@/contexts/SessionsPanelContext';
import { TrainingBanner } from '@/components/onboarding/TrainingBanner';
import { FeedbackNudgeBanner } from '@/components/onboarding/FeedbackNudgeBanner';
import { useBreakpoint } from '@/hooks/useBreakpoint';
import { Sheet, SheetContent } from '@/components/ui/sheet';

interface AppLayoutProps {
  children: ReactNode;
  hideGlobalSessionsPanel?: boolean;
}

// Routes where global sessions panel should NOT be shown
const ROUTES_WITHOUT_SESSIONS_PANEL = ['/settings', '/sessions', '/chart-prep'];

export const AppLayout = ({ children, hideGlobalSessionsPanel = false }: AppLayoutProps) => {
  const location = useLocation();
  const { isSessionsPanelVisible, toggleSessionsPanel } = useSessionsPanel();
  const bp = useBreakpoint();

  const shouldShowGlobalSessionsPanel =
    !hideGlobalSessionsPanel &&
    !ROUTES_WITHOUT_SESSIONS_PANEL.some((route) => location.pathname.startsWith(route));

  const showInlinePanel =
    shouldShowGlobalSessionsPanel && isSessionsPanelVisible && bp === 'desktop';

  const showSheetPanel =
    shouldShowGlobalSessionsPanel && isSessionsPanelVisible && bp !== 'desktop';

  return (
    <div className="flex h-screen w-full overflow-hidden bg-background">
      <LeftPane />
      <div
        className="h-full flex-shrink-0 overflow-hidden transition-all duration-200 ease-in-out"
        style={{ width: showInlinePanel ? 320 : 0 }}
      >
        {showInlinePanel && <GlobalSessionsPanel />}
      </div>
      <div className="flex-1 min-w-0 flex flex-col overflow-hidden">
        <div className="flex-1 overflow-hidden">{children}</div>
        <AppFooter />
      </div>

      {/* Sessions panel as slide-in Sheet on tablet & mobile */}
      <Sheet
        open={showSheetPanel}
        onOpenChange={(open) => {
          if (!open) toggleSessionsPanel();
        }}
      >
        <SheetContent
          side="left"
          className="p-0 w-[320px] sm:max-w-[320px]"
        >
          <div className="h-full w-full overflow-hidden">
            {shouldShowGlobalSessionsPanel && <GlobalSessionsPanel />}
          </div>
        </SheetContent>
      </Sheet>

      <TrainingBanner />
      <FeedbackNudgeBanner />
    </div>
  );
};
