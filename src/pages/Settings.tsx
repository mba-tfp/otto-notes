import { SettingsProvider } from '@/contexts/SettingsContext';
import { AppLayout } from '@/components/layout/AppLayout';
import { MiddlePane } from '@/components/settings/MiddlePane';
import { RightPane } from '@/components/settings/RightPane';
import { GlobalSessionsPanel } from '@/components/layout/GlobalSessionsPanel';
import { useSessionsPanel } from '@/contexts/SessionsPanelContext';

const SettingsContent = () => {
  const { isSessionsPanelVisible } = useSessionsPanel();

  return (
    <div className="flex flex-1 min-w-0 h-full overflow-hidden">
      {/* Show either sessions panel or settings middle pane */}
      {isSessionsPanelVisible ? (
        <div className="w-80 flex-shrink-0 h-screen">
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
