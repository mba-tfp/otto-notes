import { User, Shield, Brain, Lock, Users, PenLine } from 'lucide-react';
import { useSettings } from '@/contexts/SettingsContext';
import { UserRole } from '@/types/user';
import { useBreakpoint } from '@/hooks/useBreakpoint';

interface SettingsCategory {
  id: string;
  label: string;
  icon: React.ElementType;
  roles: UserRole[] | 'all';
}

const settingsCategories: SettingsCategory[] = [
  { id: 'profile', label: 'Profile', icon: User, roles: 'all' },
  { id: 'signature', label: 'Signature', icon: PenLine, roles: 'all' },
  { id: 'ai-settings', label: 'AI Settings', icon: Brain, roles: 'all' },
  { id: 'privacy', label: 'Privacy', icon: Lock, roles: 'all' },
  { id: 'security', label: 'Security', icon: Shield, roles: 'all' },
  { id: 'user-management', label: 'User management', icon: Users, roles: 'all' },
];

export const MiddlePane = () => {
  const { selectedCategory, setSelectedCategory, user } = useSettings();
  const bp = useBreakpoint();
  const isMobile = bp === 'mobile';

  const visibleCategories = settingsCategories.filter(category => {
    if (category.roles === 'all') return true;
    return category.roles.includes(user.role);
  });

  // Mobile: horizontal scrolling pill bar
  if (isMobile) {
    return (
      <div className="w-full bg-card border-b border-border flex-shrink-0">
        <div className="px-4 pt-4 pb-2">
          <h2 className="text-xl font-bold text-foreground">Settings</h2>
        </div>
        <nav className="px-3 pb-3 overflow-x-auto">
          <ul className="flex items-center gap-1.5 min-w-max">
            {visibleCategories.map(category => {
              const Icon = category.icon;
              const isActive = selectedCategory === category.id;
              return (
                <li key={category.id}>
                  <button
                    onClick={() => setSelectedCategory(category.id)}
                    className={`
                      flex items-center gap-2 px-3 py-2 rounded-full text-xs font-medium whitespace-nowrap
                      transition-all duration-200 border
                      ${isActive
                        ? 'bg-primary-light text-primary border-primary/30 font-semibold'
                        : 'text-foreground bg-transparent border-border hover:bg-nav-hover'
                      }
                    `}
                  >
                    <Icon className={`h-3.5 w-3.5 ${isActive ? 'text-primary' : 'text-muted-foreground'}`} />
                    <span>{category.label}</span>
                  </button>
                </li>
              );
            })}
          </ul>
        </nav>
      </div>
    );
  }

  // Tablet + Desktop: vertical rail (tablet narrower)
  const widthClass = bp === 'tablet' ? 'w-56' : 'w-75';

  return (
    <div className={`${widthClass} h-full flex-shrink-0 bg-card border-r border-border overflow-y-auto`}>
      <div className="p-6">
        <h2 className="text-2xl font-bold text-foreground mb-1">Settings</h2>
        <p className="text-sm text-muted-foreground">Manage your account and preferences</p>
      </div>

      <nav className="px-3">
        <ul className="space-y-0.5">
          {visibleCategories.map(category => {
            const Icon = category.icon;
            const isActive = selectedCategory === category.id;

            return (
              <li key={category.id}>
                <button
                  onClick={() => setSelectedCategory(category.id)}
                  className={`
                    w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium
                    transition-all duration-200
                    ${isActive
                      ? 'bg-primary-light text-primary border-l-3 border-primary font-semibold shadow-sm'
                      : 'text-foreground hover:bg-nav-hover'
                    }
                  `}
                >
                  <Icon className={`h-5 w-5 flex-shrink-0 ${isActive ? 'text-primary' : 'text-muted-foreground'}`} />
                  <span className="truncate">{category.label}</span>
                </button>
              </li>
            );
          })}
        </ul>
      </nav>
    </div>
  );
};
