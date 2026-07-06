import { SettingsProvider } from '@/contexts/SettingsContext';
import { AppLayout } from '@/components/layout/AppLayout';
import { MiddlePane } from '@/components/settings/MiddlePane';
import { RightPane } from '@/components/settings/RightPane';
import { GlobalSessionsPanel } from '@/components/layout/GlobalSessionsPanel';
import { useSessionsPanel } from '@/contexts/SessionsPanelContext';
import { useBreakpoint } from '@/hooks/useBreakpoint';

const SettingsContent = () => {
  const { isSessionsPanelVisible } = useSessionsPanel();
  const bp = useBreakpoint();
  const isMobile = bp === 'mobile';

  // Sessions panel swap only meaningful on desktop; on mobile/tablet it opens as a Sheet from AppLayout.
  const showSessionsPanel = isSessionsPanelVisible && !isMobile;

  return (
    <div className={`flex flex-1 min-w-0 h-full overflow-hidden ${isMobile ? 'flex-col' : 'flex-row'}`}>
      {showSessionsPanel ? (
        <div className="w-80 flex-shrink-0 h-full">
          <GlobalSessionsPanel />
        </div>
      ) : (
        <MiddlePane />
      )}
      <RightPane />
    </div>
  );
};

const Settings = () => {
  return (
    <AppLayout>
      <SettingsProvider>
        <SettingsContent />
      </SettingsProvider>
    </AppLayout>
  );
};

export default Settings;
