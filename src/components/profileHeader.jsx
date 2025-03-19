import React from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Camera, Download, Mail, Pencil, Phone } from 'lucide-react';
import { useSession } from 'next-auth/react';

const ProfileHeader = () => {
  const { data: session, status } = useSession();

  const getInitials = (name) => {
    if (!name) return 'U';
    return name
      .split(' ')
      .map(part => part[0]?.toUpperCase())
      .join('')
      .substring(0, 2);
  };

  return (
    <Card className="border-border bg-card overflow-hidden">
      <div className="h-32 bg-gradient-to-r from-accent/20 to-accent/5"></div>
      <div className="px-6 pb-6 relative">
        <div className="flex flex-col md:flex-row gap-6 items-start">
          <Avatar className="h-24 w-24 border-4 border-background mt-[-3rem] bg-background relative">
            <AvatarFallback className="text-3xl">
              {getInitials(session?.user?.firstName || 'User')}
            </AvatarFallback>
            <Button variant="outline" size="icon" className="absolute bottom-0 right-0 rounded-full h-8 w-8 bg-background">
              <Camera size={14} />
            </Button>
          </Avatar>
          
          <div className="flex flex-col items-start mt-4 md:mt-0">
            <h1 className="text-3xl font-bold">{session?.user?.firstName || 'Candidate Profile'}</h1>
            <div className="flex items-center mt-1 gap-2">
              <Mail size={14} className="text-muted-foreground" />
              <p className="text-muted-foreground text-sm">{session?.user?.email || 'user@example.com'}</p>
            </div>
            <div className="flex items-center mt-1 gap-2">
              <Phone size={14} className="text-muted-foreground" />
              <p className="text-muted-foreground text-sm">+1 (555) 000-0000</p>
            </div>
            <div className="flex items-center mt-3 space-x-3">
              <Badge variant="secondary" className="bg-accent text-accent-foreground uppercase">
                {session?.user?.role || 'Candidate'}
              </Badge>
            </div>
          </div>
          
          <div className="ml-auto flex flex-col sm:flex-row gap-2 mt-4 md:mt-0">
            <Button variant="outline" size="sm" className="flex items-center gap-2">
              <Download size={16} /> Download PDF
            </Button>
            <Button className="flex items-center gap-2">
              <Pencil size={16} /> Edit Profile
            </Button>
          </div>
        </div>
      </div>
    </Card>
  );
};

export default ProfileHeader;