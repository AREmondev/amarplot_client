import type React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface CommunityAboutProps {
  description: string;
}

const CommunityAbout: React.FC<CommunityAboutProps> = ({ description }) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>About</CardTitle>
      </CardHeader>
      <CardContent>
        <p>{description}</p>
      </CardContent>
    </Card>
  );
};

export default CommunityAbout;