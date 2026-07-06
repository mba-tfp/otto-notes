import { Menu } from 'lucide-react';
import ottoLogo from '@/assets/otto-logo.png';
import { useSidebarMobile } from '@/contexts/SidebarMobileContext';

export const MobileTopBar = () => {
  const { open } = useSidebarMobile();
  return (
    <div className="md:hidden h-14 flex items-center justify-between px-3 border-b border-border bg-background flex-shrink-0">
      <button
        onClick={open}
        className="p-2 rounded-lg hover:bg-muted text-foreground transition-colors"
        aria-label="Open menu"
      >
        <Menu className="h-5 w-5" />
      </button>
      <img src={ottoLogo} alt="Otto Notes" className="h-7" />
      <div className="w-9" aria-hidden />
    </div>
  );
};
