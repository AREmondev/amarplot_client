import React from 'react';
import { DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useChatStore } from '@/lib/store/chatStore';

export default function CreateGroupDialog() {
  const { 
    newGroupName, 
    setNewGroupName, 
    newGroupDescription, 
    setNewGroupDescription, 
    selectedUsers, 
    setSelectedUsers, 
    users, 
    createGroup,
    setShowCreateGroup
  } = useChatStore();

  const handleCreateGroup = async () => {
    await createGroup({
      name: newGroupName,
      description: newGroupDescription,
      members: selectedUsers,
    });
    setShowCreateGroup(false);
  };

  return (
    <DialogContent>
      <DialogHeader>
        <DialogTitle>Create Group</DialogTitle>
      </DialogHeader>
      <div className="space-y-4">
        <Input
          placeholder="Group name"
          value={newGroupName}
          onChange={(e) => setNewGroupName(e.target.value)}
        />
        <Textarea
          placeholder="Group description (optional)"
          value={newGroupDescription}
          onChange={(e) => setNewGroupDescription(e.target.value)}
        />
        <div>
          <p className="text-sm font-medium mb-2">Add members:</p>
          <div className="space-y-2 max-h-40 overflow-y-auto">
            {users.map((user: any) => (
              <div key={user._id} className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id={user._id}
                  checked={selectedUsers.includes(user._id)}
                  onChange={(e) => {
                    if (e.target.checked) {
                      setSelectedUsers([...selectedUsers, user._id]);
                    } else {
                      setSelectedUsers(selectedUsers.filter((id) => id !== user._id));
                    }
                  }}
                />
                <Avatar className="h-8 w-8">
                  <AvatarImage src={user.avatar || "/placeholder.svg"} />
                  <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
                </Avatar>
                <label htmlFor={user._id} className="flex-1 cursor-pointer" data-id={user._id}>
                  {user.name}
                </label>
              </div>
            ))}
          </div>
        </div>
        <Button
          onClick={handleCreateGroup}
          disabled={!newGroupName.trim() || selectedUsers.length === 0}
        >
          Create Group
        </Button>
      </div>
    </DialogContent>
  );
}
