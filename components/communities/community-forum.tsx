import type React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import CreatePostModal from '@/components/communities/create-post-modal';
import PostCard from '@/components/communities/post-card';

// Mock post data
const posts = [
  {
    id: 1,
    author: {
      id: 1,
      name: 'John Doe',
      avatar: '/placeholder-user.jpg',
      verified: true,
      role: 'Admin',
    },
    createdAt: '2024-07-20T10:00:00Z',
    updatedAt: '2024-07-20T10:00:00Z',
    title: 'Welcome to the community!',
    content: 'This is the first post in the community. Feel free to introduce yourselves!',
    tags: ['welcome', 'introductions'],
    views: 120,
    comments: 15,
    reactions: { like: 25, heart: 10, bookmark: 5 },
    userReaction: null,
    isPinned: true,
    isLocked: false,
    category: 'Announcements',
  },
  // ... more posts
];

const CommunityForum: React.FC = () => {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Forum</CardTitle>
        <CreatePostModal />
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {posts.map((post) => (
            <PostCard key={post.id} post={post} onReaction={() => {}} onClick={() => {}} currentUser={{}} userRole="member" />
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default CommunityForum;
