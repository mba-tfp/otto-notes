import { useState } from 'react';
import { Mail, FileText, MessageSquare, Store, Settings, BookOpen, Plus, ChevronDown, LogOut, ChevronRight, ChevronLeft, Menu, X, Monitor, Sparkles } from 'lucide-react';
import { useSessionsPanel } from '@/contexts/SessionsPanelContext';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { HoverCard, HoverCardContent, HoverCardTrigger } from '@/components/ui/hover-card';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAppUpdateAvailable } from '@/hooks/useAppUpdateAvailable';
import { RelaunchConfirmDialog } from '@/components/updates/RelaunchConfirmDialog';

import ottoLogo from '@/assets/otto-logo.png';
import { SwitchAppPopover } from '@/components/sidebar/SwitchAppPopover';


// Mock user - in production, this would come from auth context
const mockUser = {
  name: "Dr. Shahid Saya",
  email: "shahid.saya@fertilitypartners.ca",
  role: 'Physician' as const,
  clinic: "Fertility Partners - Toronto",
  profileImage: undefined
};
export const LeftPane = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const user = mockUser;
  
  
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(() => {
    const saved = localStorage.getItem('sidebar-collapsed');
    return saved === 'true';
  });
  const { showSidebarPill, applyUpdate } = useAppUpdateAvailable();
  const [relaunchDialogOpen, setRelaunchDialogOpen] = useState(false);

  // Get global sessions panel context
  const {
    sessionsPaneOpen,
    toggleSessionsPanel,
    isSessionsPanelAllowed
  } = useSessionsPanel();
  const isSessionsPage = location.pathname === '/sessions';
  const toggleSidebar = () => {
    const newState = !isCollapsed;
    setIsCollapsed(newState);
    localStorage.setItem('sidebar-collapsed', String(newState));
  };
  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  };
  const navItems = [{
    icon: Plus,
    label: 'New session',
    id: 'new-session',
    route: '/new-session'
  }, {
    icon: FileText,
    label: 'View sessions',
    id: 'sessions',
    route: '/sessions',
    isToggleable: true
  }, {
    type: 'separator'
  }, {
    icon: MessageSquare,
    label: 'AI Assistant',
    id: 'ai-assistant',
    route: '/ai-assistant'
  }, {
    type: 'separator'
  }, {
    icon: Mail,
    label: 'Letters',
    id: 'letters',
    route: '/letters'
  }, {
    type: 'separator'
  }, {
    label: 'Templates',
    type: 'header'
  }, {
    icon: FileText,
    label: 'My Templates',
    id: 'my-templates',
    route: '/my-templates'
  }, {
    icon: Store,
    label: 'Template Hub',
    id: 'template-hub',
    route: '/template-hub'
  }, {
    type: 'separator'
  }, {
    icon: Settings,
    label: 'Settings',
    id: 'settings',
    route: '/settings'
  }];
  const footerItems = [{
    icon: Monitor,
    label: 'Get desktop app',
    id: 'desktop-app'
  }, {
    icon: BookOpen,
    label: 'Help Center',
    id: 'resource-center'
  }];
  return <>
      {/* Mobile Hamburger Button */}
      <button onClick={() => setIsMobileMenuOpen(true)} className="md:hidden fixed top-4 left-4 z-40 p-2.5 rounded-xl bg-sidebar text-foreground hover:bg-muted shadow-subtle transition-all" aria-label="Open menu">
        <Menu className="h-5 w-5" />
      </button>

      {/* Mobile Backdrop */}
      {isMobileMenuOpen && <div className="md:hidden fixed inset-0 bg-foreground/40 backdrop-blur-sm z-40 transition-opacity duration-300" onClick={() => setIsMobileMenuOpen(false)} />}

      {/* Sidebar */}
      <div className={`
        h-screen bg-sidebar flex flex-col transition-all duration-[250ms] ease-out
        shadow-subtle rounded-2xl m-2
        ${isCollapsed ? 'w-[72px]' : 'w-64'}
        hidden md:flex
        ${isMobileMenuOpen ? '!flex fixed inset-y-0 left-0 z-50 w-64 m-2 rounded-2xl' : ''}
      `}>
        {/* Mobile Close Button */}
        <button onClick={() => setIsMobileMenuOpen(false)} className="md:hidden absolute top-5 right-4 z-10 p-2 rounded-xl hover:bg-muted text-muted-foreground hover:text-foreground transition-all" aria-label="Close menu">
          <X className="h-5 w-5" />
        </button>

        {/* Logo and Collapse Toggle */}
        <div className={`flex items-center ${isCollapsed ? 'justify-center' : 'justify-between'} px-4 pt-4 pb-2`}>
          {/* Logo */}
          <div className={`flex items-center ${isCollapsed ? 'hidden' : ''}`}>
            <img src={ottoLogo} alt="Otto Notes" className="h-9" />
          </div>
          
          {/* Collapsed state: just show icon mark */}
          {isCollapsed && <img src={ottoLogo} alt="Otto Notes" className="h-6 w-auto" style={{
          clipPath: 'inset(0 75% 0 0)'
        }} />}
          
          {/* Collapse Toggle Button */}
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <button onClick={toggleSidebar} className={`hidden md:flex items-center justify-center w-8 h-8 rounded-full bg-card border border-border shadow-subtle hover:shadow-lg text-muted-foreground hover:text-foreground hover:bg-muted transition-all duration-200 ${isCollapsed ? 'mt-2' : ''}`} aria-label={isCollapsed ? "Expand sidebar" : "Minimise sidebar"}>
                  <ChevronRight className={`h-4 w-4 transition-transform duration-200 ${isCollapsed ? '' : 'rotate-180'}`} />
                </button>
              </TooltipTrigger>
              <TooltipContent side="right" className="bg-card border-border text-foreground shadow-lg">
                <p>{isCollapsed ? "Expand sidebar" : "Minimise sidebar"}</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>

        {/* User Profile Section */}
        <div className={`border-b border-sidebar-border relative ${isCollapsed ? 'px-3 py-5' : 'px-5 py-6'}`}>
          <div className={`flex items-center ${isCollapsed ? 'justify-center' : 'justify-between'}`}>
            {!isCollapsed && <DropdownMenu>
                <DropdownMenuTrigger className="flex-1 min-w-0 focus:outline-none">
                  <div className="flex items-center gap-3 p-2 -m-2 rounded-xl hover:bg-muted cursor-pointer group transition-all duration-200">
                    <Avatar className="h-10 w-10 flex-shrink-0 shadow-subtle ring-2 ring-card">
                      <AvatarImage src={user.profileImage} />
                      <AvatarFallback className="relative bg-transparent text-session-action-foreground font-semibold text-sm">
                        <div className="absolute inset-0 bg-session-action/50 rounded-full" />
                        <span className="relative z-10">{getInitials(user.name)}</span>
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 text-left min-w-0 overflow-hidden">
                      <div className="font-semibold text-sm text-foreground truncate">{user.name}</div>
                      <div className="text-xs text-muted-foreground truncate max-w-[140px]">{user.email}</div>
                    </div>
                    <ChevronDown className="h-4 w-4 text-muted-foreground group-hover:text-foreground flex-shrink-0 transition-colors" />
                  </div>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="start" className="w-56 bg-card border-border rounded-xl shadow-lg">
                  <DropdownMenuItem disabled className="opacity-50 text-muted-foreground">
                    <span className="text-xs">Switch Clinic (Coming Soon)</span>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator className="bg-border" />
                  <DropdownMenuItem className="text-foreground hover:bg-muted rounded-lg cursor-pointer">
                    <LogOut className="h-4 w-4 mr-2" />
                    <span>Logout</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>}
            {isCollapsed && <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <div className="flex items-center justify-center">
                      <Avatar className="h-10 w-10 shadow-subtle ring-2 ring-card cursor-pointer hover:scale-105 transition-transform">
                        <AvatarImage src={user.profileImage} />
                        <AvatarFallback className="relative bg-transparent text-session-action-foreground font-semibold text-sm">
                          <div className="absolute inset-0 bg-session-action/50 rounded-full" />
                          <span className="relative z-10">{getInitials(user.name)}</span>
                        </AvatarFallback>
                      </Avatar>
                    </div>
                  </TooltipTrigger>
                  <TooltipContent side="right" className="bg-card border-border text-foreground shadow-lg">
                    <p className="font-medium">{user.name}</p>
                    <p className="text-xs text-muted-foreground">{user.email}</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>}
          </div>
          
      </div>


        {/* Navigation Items */}
        <nav className={`flex-1 overflow-y-auto ${isCollapsed ? 'px-2 py-4' : 'px-4 py-5'}`}>
          <ul className="space-y-1">
            {navItems.map((item, index) => {
            if (item.type === 'separator') {
              return <li key={`sep-${index}`} className="h-px bg-sidebar-border my-3 mx-2" />;
            }
            if (item.type === 'header') {
              return !isCollapsed ? <li key={item.label} className="px-3 pt-4 pb-2 text-[10px] font-semibold text-muted-foreground uppercase tracking-[0.1em]">
                    {item.label}
                  </li> : <li key={item.label} className="h-px bg-sidebar-border my-3" />;
            }
            const Icon = item.icon!;
            const isActive = item.route ? location.pathname === item.route : false;

            // For toggleable items (View sessions), show different label when panel is open
            // and we're on an allowed page (not settings, not /sessions page itself)
            const canToggle = item.isToggleable && isSessionsPanelAllowed && !isSessionsPage;
            let displayLabel = item.label;
            let ArrowIcon: typeof ChevronLeft | null = null;
            if (canToggle) {
              displayLabel = sessionsPaneOpen ? 'Hide sessions' : item.label;
              ArrowIcon = sessionsPaneOpen ? ChevronLeft : ChevronRight;
            }
            const handleClick = () => {
              // Close mobile menu when navigating
              setIsMobileMenuOpen(false);
              if (item.id === 'sessions') {
                // If we're on /sessions page, navigate there
                // If we're on another allowed page, toggle the sessions panel
                // If we're on settings, just navigate to /sessions
                if (isSessionsPage) {
                  // Already on sessions page, do nothing or could navigate
                  navigate('/sessions');
                } else if (isSessionsPanelAllowed) {
                  // On an allowed page, toggle the panel
                  toggleSessionsPanel();
                } else {
                  // On a disallowed page (settings), navigate to sessions
                  navigate('/sessions');
                }
              } else if (item.route) {
                navigate(item.route);
              }
            };
            return <li key={item.id}>
                  {isCollapsed ? <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <button onClick={handleClick} className={`
                              w-full flex items-center justify-center p-2.5 rounded-xl text-sm
                              transition-all duration-200 group
                              ${isActive ? 'bg-sidebar-accent text-foreground border border-primary/20 shadow-subtle' : 'text-foreground hover:bg-muted'}
                            `}>
                            <div className={`
                              flex items-center justify-center w-9 h-9 rounded-xl transition-all duration-200
                              ${item.id === 'new-session' ? 'bg-session-action text-session-action-foreground shadow-subtle' : isActive ? 'border-2 border-white shadow-subtle' : 'group-hover:scale-105'}
                            `}>
                              <Icon className="h-[18px] w-[18px]" strokeWidth={isActive ? 2.5 : 1.75} />
                            </div>
                          </button>
                        </TooltipTrigger>
                        <TooltipContent side="right" className="bg-card border-border text-foreground shadow-lg font-medium">
                          <p>{displayLabel}</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider> : <button onClick={handleClick} className={`
                        w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm
                        transition-all duration-200 group
                        ${isActive ? 'bg-sidebar-accent text-foreground font-semibold border border-primary/20 shadow-subtle' : 'text-foreground hover:bg-muted font-medium'}
                      `}>
                      <div className={`
                        flex items-center justify-center w-8 h-8 rounded-lg transition-all duration-200
                        ${item.id === 'new-session' ? 'bg-session-action text-session-action-foreground shadow-subtle' : isActive ? 'border-2 border-white shadow-subtle' : 'group-hover:scale-105'}
                      `}>
                        <Icon className="h-[18px] w-[18px]" strokeWidth={isActive ? 2.5 : 1.75} />
                      </div>
                      <span className="flex-1 text-left transition-all duration-200">{displayLabel}</span>
                      {ArrowIcon && <ArrowIcon className="h-4 w-4" />}
                    </button>}
                </li>;
          })}
          </ul>
        </nav>

        {/* Footer Section */}
        <div className={`${isCollapsed ? 'px-2 py-4' : 'px-4 py-5'}`}>
          <ul className="space-y-1">
            {showSidebarPill && (
              <li>
                {isCollapsed ? (
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <button
                          onClick={() => setRelaunchDialogOpen(true)}
                          className="relative w-full flex items-center justify-center p-2.5 rounded-xl text-sm transition-all duration-200 group hover:bg-muted text-foreground"
                        >
                          <div className="relative flex items-center justify-center w-9 h-9 rounded-xl transition-all duration-200 group-hover:scale-105">
                            <Sparkles className="h-[18px] w-[18px]" strokeWidth={1.75} />
                            <span className="absolute top-1 right-1 h-2 w-2 rounded-full bg-emerald-500 ring-2 ring-sidebar" />
                          </div>
                        </button>
                      </TooltipTrigger>
                      <TooltipContent side="right" className="bg-card border-border text-foreground shadow-lg font-medium">
                        <p>Update available — click to relaunch</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                ) : (
                  <button
                    onClick={() => setRelaunchDialogOpen(true)}
                    className="relative w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm transition-all duration-200 group hover:bg-muted text-foreground font-medium"
                  >
                    <div className="relative flex items-center justify-center w-[18px] h-[18px]">
                      <Sparkles className="h-[18px] w-[18px] text-primary" strokeWidth={1.75} />
                    </div>
                    <span className="flex-1 text-left">Relaunch to update</span>
                    <span className="h-2 w-2 rounded-full bg-emerald-500" />
                  </button>
                )}
              </li>
            )}

            {footerItems.filter(i => i.id === 'desktop-app').map(item => renderFooterItem(item))}

            {/* Switch App button */}
            <li>
              <SwitchAppPopover isCollapsed={isCollapsed} />
            </li>

            {footerItems.filter(i => i.id !== 'desktop-app').map(item => renderFooterItem(item))}
          </ul>
        </div>
      </div>

      <RelaunchConfirmDialog
        open={relaunchDialogOpen}
        onOpenChange={setRelaunchDialogOpen}
        onConfirm={applyUpdate}
      />
    </>;

  function renderFooterItem(item: (typeof footerItems)[number]) {
    const Icon = item.icon;
    const opensInNewTab = item.id === 'desktop-app';
    const itemRoute = item.id === 'desktop-app' ? '#' : '/resource-center';
    const isActive = !opensInNewTab && location.pathname === itemRoute;
    const handleClick = () => {
      setIsMobileMenuOpen(false);
      if (opensInNewTab) {
        window.open(itemRoute, '_blank', 'noopener,noreferrer');
        return;
      }
      navigate(itemRoute);
    };

    const buttonEl = isCollapsed ? (
      <button onClick={handleClick} className={`relative w-full flex items-center justify-center p-2.5 rounded-xl text-sm transition-all duration-200 group hover:bg-muted hover:text-foreground ${isActive ? 'text-foreground' : 'text-muted-foreground'}`}>
        {isActive && <span className="absolute left-0 top-1/2 -translate-y-1/2 h-[60%] w-[3px] rounded-r-full bg-primary" />}
        <div className="flex items-center justify-center w-9 h-9 rounded-xl transition-all duration-200 group-hover:scale-105">
          <Icon className="h-[18px] w-[18px]" strokeWidth={isActive ? 2.5 : 1.75} />
        </div>
      </button>
    ) : (
      <button onClick={handleClick} className={`relative w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm transition-all duration-200 group hover:bg-muted hover:text-foreground ${isActive ? 'text-foreground font-semibold' : 'text-muted-foreground font-medium'}`}>
        {isActive && <span className="absolute left-0 top-1/2 -translate-y-1/2 h-[60%] w-[3px] rounded-r-full bg-primary" />}
        <Icon className="h-[18px] w-[18px]" strokeWidth={isActive ? 2.5 : 1.75} />
        <span className="flex-1 text-left">{item.label}</span>
      </button>
    );

    if (item.id === 'desktop-app') {
      return (
        <li key={item.id}>
          <HoverCard openDelay={150} closeDelay={100}>
            <HoverCardTrigger asChild>{buttonEl}</HoverCardTrigger>
            <HoverCardContent side="right" align="end" className="w-72 p-4 bg-card border-border shadow-lg rounded-xl">
              <div className="flex items-start gap-3">
                <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-primary/10 text-primary flex-shrink-0">
                  <Monitor className="h-5 w-5" />
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="text-sm font-semibold text-foreground">Otto Notes for Desktop</h4>
                  <p className="text-xs text-muted-foreground mt-1 leading-relaxed">
                    Faster performance, native microphone access, and works offline. Available for macOS and Windows.
                  </p>
                  <button
                    onClick={handleClick}
                    className="mt-3 inline-flex items-center justify-center px-3 py-1.5 rounded-lg text-xs font-semibold bg-[#FF887C] text-white hover:opacity-90 transition-opacity"
                  >
                    Download now
                  </button>
                </div>
              </div>
            </HoverCardContent>
          </HoverCard>
        </li>
      );
    }

    return (
      <li key={item.id}>
        {isCollapsed ? (
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>{buttonEl}</TooltipTrigger>
              <TooltipContent side="right" className="bg-card border-border text-foreground shadow-lg font-medium">
                <p>{item.label}</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        ) : (
          buttonEl
        )}
      </li>
    );
  }
};
