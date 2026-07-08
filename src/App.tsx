import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { SessionsProvider } from "./contexts/SessionsContext";
import { PatientsProvider } from "./contexts/PatientsContext";
import { SessionsPanelProvider } from "./contexts/SessionsPanelContext";
import { LettersProvider } from "./contexts/LettersContext";
import { OnboardingTourProvider } from "./contexts/OnboardingTourContext";
import { SettingsProvider } from "./contexts/SettingsContext";
import { TourOverlay } from "./components/onboarding/TourOverlay";
import { KeyboardShortcutsHandler } from "./components/KeyboardShortcutsHandler";
import Index from "./pages/Index";
import Settings from "./pages/Settings";
import MyTemplates from "./pages/MyTemplates";
import TemplateHub from "./pages/TemplateHub";

import NewSession from "./pages/NewSession";
import NewUserScreen from "./pages/NewUserScreen";
import ViewSessions from "./pages/ViewSessions";
import AIAssistant from "./pages/AIAssistant";
import Letters from "./pages/Letters";
import WhatsNew from "./pages/WhatsNew";
import ResourceCenter from "./pages/ResourceCenter";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <SettingsProvider>
      <SessionsProvider>
        <PatientsProvider>
          <LettersProvider>
            <OnboardingTourProvider>
              <TooltipProvider>
              <Toaster />
              <Sonner />
              <TourOverlay />
              <BrowserRouter>
                <KeyboardShortcutsHandler />
                <SessionsPanelProvider>
                  <Routes>
                    <Route path="/" element={<Index />} />
                    <Route path="/new-session" element={<NewSession />} />
                    <Route path="/new-user-screen" element={<NewUserScreen />} />
                    <Route path="/sessions" element={<ViewSessions />} />
                    <Route path="/ai-assistant" element={<AIAssistant />} />
                    <Route path="/settings" element={<Settings />} />
                    <Route path="/my-templates" element={<MyTemplates />} />
                    <Route path="/template-hub" element={<TemplateHub />} />
                    
                    <Route path="/letters" element={<Letters />} />
                    <Route path="/whats-new" element={<WhatsNew />} />
                    <Route path="/resource-center" element={<ResourceCenter />} />
                    {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
                    <Route path="*" element={<NotFound />} />
                  </Routes>
                </SessionsPanelProvider>
              </BrowserRouter>
              </TooltipProvider>
            </OnboardingTourProvider>
          </LettersProvider>
        </PatientsProvider>
      </SessionsProvider>
    </SettingsProvider>
  </QueryClientProvider>
);

export default App;
