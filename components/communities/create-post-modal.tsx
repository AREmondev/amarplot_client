import type React from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';

const CreatePostModal: React.FC = () => {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button>Create Post</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create a new post</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="title">Title</Label>
            <Input id="title" placeholder="Post title" />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="content">Content</Label>
            <Textarea id="content" placeholder="Post content" />
          </div>
        </div>
        <Button>Submit Post</Button>
      </DialogContent>
    </Dialog>
  );
};

export default CreatePostModal;