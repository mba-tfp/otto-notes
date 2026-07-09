import { useSettings } from '@/contexts/SettingsContext';
import { ProfileSettings } from './ProfileSettings';
import { SecuritySettings } from './SecuritySettings';
import { AISettings } from './AISettings';
import { PrivacySettings } from './PrivacySettings';
import { SignatureSettings } from './SignatureSettings';
import { UserManagement } from './UserManagement';

export const RightPane = () => {
  const { selectedCategory } = useSettings();

  const renderContent = () => {
    switch (selectedCategory) {
      case 'profile':
        return <ProfileSettings />;
      case 'ai-settings':
        return <AISettings />;
      case 'user-management':
        return <UserManagement />;
      case 'privacy':
        return <PrivacySettings />;
      case 'signature':
        return <SignatureSettings />;
      case 'security':
        return <SecuritySettings />;
      default:
        return null;
    }
  };

  return (
    <div className="flex-1 h-full overflow-y-auto bg-background">
      <div className="w-full max-w-[1100px] mx-auto px-6 py-6">
        {renderContent()}
      </div>
    </div>
  );
};
