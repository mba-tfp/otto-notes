import { useState } from 'react';
import { Globe } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

type Language = 'en' | 'fr';

export const AppFooter = () => {
  const [language, setLanguage] = useState<Language>('en');

  const toggleLanguage = () => {
    setLanguage(prev => prev === 'en' ? 'fr' : 'en');
  };

  return (
    <footer className="w-full py-3 px-6 bg-gradient-to-r from-[hsl(var(--tertiary-sky)/0.15)] via-[hsl(var(--background))] to-[hsl(var(--tertiary-light-salmon)/0.3)] border-t border-border/50">
      <div className="flex items-center justify-between text-xs text-muted-foreground">
        <div className="flex items-center gap-4">
          <span>© 2025 TFP. All Rights Reserved.</span>
          <button 
            onClick={() => window.open('/privacy', '_blank')}
            className="hover:text-foreground transition-colors underline underline-offset-2"
          >
            Privacy Policy
          </button>
        </div>
        
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5">
            <Globe className="h-3.5 w-3.5" />
            <span>Canada ({language === 'en' ? 'English' : 'Français'})</span>
          </div>
          <TooltipProvider delayDuration={300}>
            <Tooltip>
              <TooltipTrigger asChild>
                <button
                  onClick={toggleLanguage}
                  className="px-2 py-1 rounded-md hover:bg-muted transition-colors font-medium text-foreground/70 hover:text-foreground"
                >
                  {language === 'en' ? 'Français' : 'English'}
                </button>
              </TooltipTrigger>
              <TooltipContent side="top" className="text-xs">Switch language</TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      </div>
    </footer>
  );
};
