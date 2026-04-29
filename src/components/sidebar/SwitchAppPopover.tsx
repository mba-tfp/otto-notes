import { useState } from 'react';
import { LayoutGrid } from 'lucide-react';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

interface SwitchAppPopoverProps {
  isCollapsed: boolean;
}

const apps = [
  { id: 'cnp', name: 'Onboarding Platform', initials: 'CNP', color: 'bg-[#263F6A]' },
  { id: 'fertiwise', name: 'Fertiwise', initials: 'FW', color: 'bg-[#263F6A]' },
  { id: 'sop', name: 'SOP AI', initials: 'SOP', color: 'bg-[#263F6A]' },
  { id: 'pulse', name: 'Otto Pulse', initials: 'OP', color: 'bg-[#263F6A]' },
];

export const SwitchAppPopover = ({ isCollapsed }: SwitchAppPopoverProps) => {
  const [open, setOpen] = useState(false);

  const handleAppClick = (appId: string) => {
    console.log(`Switching to app: ${appId}`);
  };

  const TriggerButton = (
    <button className={`
      w-full flex items-center ${isCollapsed ? 'justify-center p-2.5' : 'gap-3 px-3 py-2.5'}
      rounded-xl text-sm transition-all duration-200 group
      hover:bg-muted hover:text-foreground
      text-muted-foreground font-medium
    `}>
      <div className={`
        flex items-center justify-center ${isCollapsed ? 'w-9 h-9' : ''}
        rounded-xl transition-all duration-200 group-hover:scale-105
      `}>
        <LayoutGrid className="h-[18px] w-[18px]" strokeWidth={1.75} />
      </div>
      {!isCollapsed && <span className="flex-1 text-left">Switch App</span>}
    </button>
  );

  const PopoverContentComponent = (
    <PopoverContent
      side="right"
      align="end"
      sideOffset={8}
      className="w-52 p-3 bg-card border border-border/50 shadow-xl rounded-2xl"
    >
      <p className="px-2 pb-2 text-[10px] font-semibold text-muted-foreground uppercase tracking-[0.1em]">
        Switch to
      </p>
      <div className="grid grid-cols-2 gap-2">
        {apps.map((app) => (
          <button
            key={app.id}
            onClick={() => handleAppClick(app.id)}
            className="flex flex-col items-center gap-1.5 p-2.5 rounded-xl border border-transparent hover:bg-muted/50 hover:border-border transition-all duration-200"
          >
            <div className={`
              w-9 h-9 rounded-full ${app.color}
              flex items-center justify-center
              text-white text-[10px] font-bold shadow-sm
            `}>
              {app.initials}
            </div>
            <span className="text-[11px] text-foreground/80 font-medium text-center w-full">
              {app.name}
            </span>
          </button>
        ))}
      </div>
    </PopoverContent>
  );

  if (isCollapsed) {
    return (
      <Popover open={open} onOpenChange={setOpen}>
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <PopoverTrigger asChild>
                {TriggerButton}
              </PopoverTrigger>
            </TooltipTrigger>
            <TooltipContent side="right" className="bg-card border-border text-foreground shadow-lg font-medium">
              <p>Switch App</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
        {PopoverContentComponent}
      </Popover>
    );
  }

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        {TriggerButton}
      </PopoverTrigger>
      {PopoverContentComponent}
    </Popover>
  );
};
