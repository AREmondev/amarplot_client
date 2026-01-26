'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { 
  Users, 
  MessageCircle, 
  Heart, 
  Share2, 
  ArrowLeft,
  Send,
  Plus
} from 'lucide-react'

interface Post {
    id: string;
    author: {
        name: string;
        avatar: string;
    };
    content: string;
    likes: number;
    comments: Comment[];
    createdAt: string;
    reactions: { like: number; heart: number; bookmark: number; };
    userReaction: 'like' | 'heart' | 'bookmark' | null;
}

interface Comment {
    id: string;
    author: {
        name: string;
        avatar: string;
    };
    content: string;
    createdAt: string;
}

interface Community {
  id: string;
  name: string;
  type: "Public" | "Private";
  description: string;
  members: number;
  postsCount: number;
  image: string;
  membersList: any[];
  posts: Post[];
  createdAt: string;
}

interface CommunityDetailsClientProps {
  community: Community;
}

export default function CommunityDetailsClient({ community }: CommunityDetailsClientProps) {
  const [isJoined, setIsJoined] = useState(false);
  const [newPost, setNewPost] = useState('');
  const [posts, setPosts] = useState<Post[]>(community.posts.map(post => ({
    ...post,
    likes: post.likes || 0, // Ensure likes is always a number
    reactions: { ...post.reactions, like: post.reactions?.like || 0 } // Ensure reactions.like is always a number
  })) || []);
  const [showComments, setShowComments] = useState<Record<string, boolean>>({});
  const [newComment, setNewComment] = useState<Record<string, string>>({});
  const router = useRouter();

  const handleJoin = () => {
    setIsJoined(!isJoined);
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: community.name,
        text: community.description,
        url: window.location.href,
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
    }
  };

  const handleCreatePost = () => {
    if (newPost.trim()) {
      const post: Post = {
        id: Date.now().toString(),
        author: {
          name: 'You',
          avatar: '/placeholder-user.jpg',
        },
        content: newPost,
        likes: 0,
        comments: [],
        createdAt: new Date().toISOString(),
      };
      setPosts([post, ...posts]);
      setNewPost('');
    }
  };

  const handleLikePost = (postId: string) => {
    setPosts(posts.map(post => {
      if (post.id === postId) {
        const newLikes = post.userReaction === 'like' ? post.likes - 1 : post.likes + 1;
        const newUserReaction = post.userReaction === 'like' ? null : 'like';
        return { 
          ...post, 
          likes: newLikes, 
          userReaction: newUserReaction,
          reactions: { ...post.reactions, like: newLikes } // Update the reactions object as well
        };
      }
      return post;
    }));
  };

  const handleCreateComment = (postId: string) => {
    if (newComment[postId]?.trim()) {
        const comment: Comment = {
            id: Date.now().toString(),
            author: {
                name: 'You',
                avatar: '/placeholder-user.jpg',
            },
            content: newComment[postId],
            createdAt: new Date().toISOString(),
        };
        setPosts(posts.map(post => 
            post.id === postId 
                ? { ...post, comments: [...post.comments, comment] }
                : post
        ));
        setNewComment({ ...newComment, [postId]: '' });
    }
  };

  return (
    <div className="container mx-auto py-8">
      <Button
        variant="ghost"
        onClick={() => router.back()}
        className="mb-6"
      >
        <ArrowLeft className="h-4 w-4 mr-2" />
        Back to Communities
      </Button>

      <Card className="mb-8">
        <div className="relative">
          <Image
            src={community.image}
            alt={community.name}
            className="w-full h-64 object-cover rounded-t-lg"
            width={1024}
            height={256}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
          <CardContent className="absolute bottom-0 left-0 p-6 text-white">
            <h1 className="text-4xl font-bold mb-2">{community.name}</h1>
            <p className="text-lg mb-4">{community.description}</p>
            <div className="flex items-center gap-6 text-sm">
              <div className="flex items-center gap-1"><Users className="h-4 w-4" /><span>{community.members.toLocaleString()} members</span></div>
              <div className="flex items-center gap-1"><MessageCircle className="h-4 w-4" /><span>{posts.length} posts</span></div>
            </div>
          </CardContent>
        </div>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          {isJoined && (
            <Card>
              <CardHeader><CardTitle>Create a Post</CardTitle></CardHeader>
              <CardContent>
                <Textarea
                  placeholder="Share something with the community..."
                  value={newPost}
                  onChange={(e) => setNewPost(e.target.value)}
                  className="min-h-[100px] mb-4"
                />
                <Button onClick={handleCreatePost} disabled={!newPost.trim()}><Send className="h-4 w-4 mr-2" />Post</Button>
              </CardContent>
            </Card>
          )}

          <h2 className="text-2xl font-bold">Community Posts</h2>
          {posts.map((post) => (
            <Card key={post.id}>
              <CardContent className="p-6">
                <div className="flex items-start gap-4">
                  <Image src={post.author.avatar} alt={post.author.name} className="w-10 h-10 rounded-full" width={40} height={40} />
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="font-medium">{post.author.name}</span>
                      <span className="text-sm text-gray-500">{new Date(post.createdAt).toLocaleDateString()}</span>
                    </div>
                    <p className="text-gray-700 mb-4">{post.content}</p>
                    <div className="flex items-center gap-4">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleLikePost(post.id)}
                        className={post.userReaction === 'like' ? 'text-red-500 hover:text-red-600' : 'text-gray-500 hover:text-red-500'}
                      >
                        <Heart className={`h-4 w-4 mr-1 ${post.userReaction === 'like' ? 'fill-current' : ''}`} />
                        {post.likes}
                      </Button>
                      <Button variant="ghost" size="sm" onClick={() => setShowComments({ ...showComments, [post.id]: !showComments[post.id] })}><MessageCircle className="h-4 w-4 mr-1" />{post.comments.length}</Button>
                    </div>
                    {showComments[post.id] && (
                        <div className="mt-4 space-y-4">
                            {(post.comments || []).map(comment => (
                                <div key={comment.id} className="flex items-start gap-2">
                                    <img src={comment.author.avatar} alt={comment.author.name} className="w-8 h-8 rounded-full" />
                                    <div className="flex-1 bg-gray-100 p-3 rounded-lg">
                                        <div className="flex items-center gap-2 mb-1">
                                            <span className="font-medium text-sm">{comment.author.name}</span>
                                            <span className="text-xs text-gray-500">{new Date(comment.createdAt).toLocaleDateString()}</span>
                                        </div>
                                        <p className="text-sm text-gray-600">{comment.content}</p>
                                    </div>
                                </div>
                            ))}
                            <div className="flex items-center gap-2">
                                <Input value={newComment[post.id] || ''} onChange={(e) => setNewComment({ ...newComment, [post.id]: e.target.value })} placeholder="Write a comment..." />
                                <Button onClick={() => handleCreateComment(post.id)} disabled={!newComment[post.id]?.trim()}>Reply</Button>
                            </div>
                        </div>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="lg:col-span-1">
          <Card className="sticky top-24">
            <CardContent className="p-6">
              <Button onClick={handleJoin} className="w-full mb-4">{isJoined ? 'Joined' : 'Join Community'}</Button>
              <Button onClick={handleShare} variant="outline" className="w-full">Share</Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
