import { AppLayout } from '@/components/layout/AppLayout';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { UserPlus } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface TeamMember {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'member';
  isCurrentUser?: boolean;
}

const demoTeamMembers: TeamMember[] = [
  { id: '1', name: 'Dr. Shahid Saya', email: 'shahid.saya@clinic.com', role: 'admin', isCurrentUser: true },
  { id: '2', name: 'Dr. Sarah Johnson', email: 'sarah.johnson@clinic.com', role: 'member' },
  { id: '3', name: 'Dr. Michael Chen', email: 'michael.chen@clinic.com', role: 'member' },
];

const Team = () => {
  const { toast } = useToast();

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase();
  };

  const handleInvite = () => {
    toast({
      title: 'Coming soon',
      description: 'Invite functionality will be available soon.',
    });
  };

  return (
    <AppLayout>
      <div className="flex-1 flex flex-col h-screen overflow-hidden bg-background">
        <div className="flex-1 overflow-y-auto p-6">
          <div className="max-w-3xl mx-auto">
            {/* Header */}
            <div className="flex items-center justify-between mb-8">
              <h1 className="text-2xl font-semibold">Team Members</h1>
              <Button onClick={handleInvite} className="gap-2">
                <UserPlus className="h-4 w-4" />
                Invite Member
              </Button>
            </div>

            {/* Team Members List */}
            <div className="space-y-3">
              {demoTeamMembers.map((member) => (
                <div
                  key={member.id}
                  className="flex items-center gap-4 p-4 rounded-lg border border-border bg-card hover:bg-accent/50 transition-colors"
                >
                  <Avatar className="h-12 w-12">
                    <AvatarFallback className="bg-primary text-primary-foreground font-semibold">
                      {getInitials(member.name)}
                    </AvatarFallback>
                  </Avatar>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <h3 className="font-medium truncate">{member.name}</h3>
                      {member.isCurrentUser && (
                        <Badge variant="secondary" className="text-xs">You</Badge>
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground truncate">{member.email}</p>
                  </div>

                  <Badge 
                    variant={member.role === 'admin' ? 'default' : 'outline'}
                    className="capitalize"
                  >
                    {member.role}
                  </Badge>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </AppLayout>
  );
};

export default Team;
