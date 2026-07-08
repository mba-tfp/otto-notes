import { AppLayout } from '@/components/layout/AppLayout';
import { ConversationList } from '@/components/aiAssistant/ConversationList';
import { ChatView } from '@/components/aiAssistant/ChatView';
import { AIAssistantProvider } from '@/contexts/AIAssistantContext';
import { Separator } from '@/components/ui/separator';
import { GlobalSessionsPanel } from '@/components/layout/GlobalSessionsPanel';
import { useSessionsPanel } from '@/contexts/SessionsPanelContext';

const AIAssistantContent = () => {
  const { isSessionsPanelVisible } = useSessionsPanel();

  return (
    <AppLayout hideGlobalSessionsPanel>
      <div className="flex h-screen overflow-hidden bg-background w-full">
        {/* Middle Pane - Show either sessions panel or conversation list */}
        {isSessionsPanelVisible ? (
          <div className="w-80 flex-shrink-0 h-full">
            <GlobalSessionsPanel />
          </div>
        ) : (
          <div className="w-80 flex-shrink-0 overflow-hidden border-r border-border">
            <ConversationList />
          </div>
        )}

        {/* Vertical Divider */}
        <Separator orientation="vertical" className="h-full" />

        {/* Right Pane - Chat View */}
        <div className="flex-1 min-w-0 overflow-hidden">
          <ChatView />
        </div>
      </div>
    </AppLayout>
  );
};

const AIAssistant = () => {
  return (
    <AIAssistantProvider>
      <AIAssistantContent />
    </AIAssistantProvider>
  );
};

export default AIAssistant;
