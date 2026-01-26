import type React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

// Mock member data
const members = [
  { id: 1, name: 'John Doe', role: 'Admin', avatar: '/placeholder-user.jpg' },
  { id: 2, name: 'Jane Smith', role: 'Moderator', avatar: '/placeholder-user.jpg' },
  { id: 3, name: 'Peter Jones', role: 'Member', avatar: '/placeholder-user.jpg' },
];

const CommunityMembers: React.FC = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Members</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {members.map((member) => (
            <div key={member.id} className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <Avatar>
                  <AvatarImage src={member.avatar} />
                  <AvatarFallback>{member.name.charAt(0)}</AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-medium">{member.name}</p>
                  <p className="text-sm text-muted-foreground">{member.role}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default CommunityMembers;