import React from 'react';
import Image from "next/image";
import { DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useChatStore } from '@/lib/store/chatStore';

export default function CreatePropertyGroupDialog() {
  const { 
    newGroupName, 
    setNewGroupName, 
    newGroupDescription, 
    setNewGroupDescription, 
    selectedUsers, 
    setSelectedUsers, 
    users, 
    createGroup,
    setShowPropertyGroupDialog,
    mockProperties,
    selectedProperty,
    setSelectedProperty
  } = useChatStore();

  const handleCreateGroup = async () => {
    await createGroup({
      name: newGroupName,
      description: newGroupDescription,
      members: selectedUsers,
      propertyReference: selectedProperty,
    });
    setShowPropertyGroupDialog(false);
  };

  return (
    <DialogContent>
      <DialogHeader>
        <DialogTitle>Create Property Group</DialogTitle>
      </DialogHeader>
      <div className="space-y-4">
        <div>
          <p className="text-sm font-medium mb-2">Select Property:</p>
          <div className="space-y-2">
            {mockProperties.map((property: any) => (
              <div
                key={property._id}
                className={`flex items-center gap-3 p-3 border rounded-lg cursor-pointer transition-colors ${selectedProperty?._id === property._id
                    ? "border-primary bg-primary/5"
                    : "hover:bg-muted"
                }`}
                onClick={() => setSelectedProperty(property)}
              >
                <Image
                  src={property.image || "/placeholder.svg"}
                  alt={property.title}
                  className="w-12 h-12 rounded object-cover"
                  width={48}
                  height={48}
                />
                <div className="flex-1">
                  <h4 className="font-medium">{property.title}</h4>
                  <p className="text-sm text-muted-foreground">{property.location}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
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
                  id={`prop-${user._id}`}
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
                <label htmlFor={`prop-${user._id}`} className="flex-1 cursor-pointer">
                  {user.name}
                </label>
              </div>
            ))}
          </div>
        </div>
        <Button
          onClick={handleCreateGroup}
          disabled={!newGroupName.trim() || selectedUsers.length === 0 || !selectedProperty}
        >
          Create Property Group
        </Button>
      </div>
    </DialogContent>
  );
}
