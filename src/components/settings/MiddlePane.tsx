import { User, Shield, Brain, Lock, Users, PenLine } from 'lucide-react';
import { useSettings } from '@/contexts/SettingsContext';
import { UserRole } from '@/types/user';

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

  const visibleCategories = settingsCategories.filter(category => {
    if (category.roles === 'all') return true;
    return category.roles.includes(user.role);
  });

  return (
    <div className="w-75 h-screen bg-card border-r border-border">
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
                  <Icon className={`h-5 w-5 ${isActive ? 'text-primary' : 'text-muted-foreground'}`} />
                  <span>{category.label}</span>
                </button>
              </li>
            );
          })}
        </ul>
      </nav>
    </div>
  );
};
