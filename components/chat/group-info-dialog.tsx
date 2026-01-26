import React from 'react';
import Image from "next/image";
import { DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Separator } from '@/components/ui/separator';
import { Button } from '@/components/ui/button';
import { Crown, Shield, UserMinus, LogOut, Trash2, UserPlus } from 'lucide-react';
import { useChatStore } from '@/lib/store/chatStore';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';

export default function GroupInfoDialog() {
  const { selectedConversation, currentUser, removeGroupMember, leaveGroup, deleteGroup, setConversations } = useChatStore();

  if (!selectedConversation || selectedConversation.type !== "group" || !selectedConversation.group) {
    return null;
  }

  const { group } = selectedConversation;

  const isGroupAdmin = (group: any) => {
    return group.members.find((m: any) => m.user._id === currentUser?._id)?.role === "admin";
  };

  return (
    <DialogContent className="max-w-md">
      <DialogHeader>
        <DialogTitle>Group Info</DialogTitle>
      </DialogHeader>
      <div className="space-y-4">
        <div className="text-center">
          <Avatar className="h-20 w-20 mx-auto mb-4">
            <AvatarImage src={group.avatar || "/placeholder.svg"} />
            <AvatarFallback className="text-2xl">
              {group.name.charAt(0)}
            </AvatarFallback>
          </Avatar>
          <h3 className="text-xl font-semibold">{group.name}</h3>
          <p className="text-muted-foreground">{group.description}</p>
        </div>

        {group.propertyReference && (
          <>
            <Separator />
            <div>
              <h4 className="font-semibold mb-2">Property Reference</h4>
              <div className="flex items-center gap-3 p-3 border rounded-lg">
                <Image
                  src={group.propertyReference.image || "/placeholder.svg"}
                  alt={group.propertyReference.title}
                  className="w-12 h-12 rounded object-cover"
                  width={48}
                  height={48}
                />
                <div className="flex-1">
                  <h5 className="font-medium">
                    {group.propertyReference.title}
                  </h5>
                  <p className="text-sm text-muted-foreground">
                    {group.propertyReference.location}
                  </p>
                </div>
              </div>
            </div>
          </>
        )}

        <Separator />
        <div>
          <h4 className="font-semibold mb-2">
            Members ({group.members.length})
          </h4>
          <div className="space-y-2 max-h-40 overflow-y-auto">
            {group.members.map((member: any) => (
              <div key={member.user._id} className="flex items-center gap-3">
                <Avatar className="h-8 w-8">
                  <AvatarImage src={member.user.avatar || "/placeholder.svg"} />
                  <AvatarFallback>{member.user.name.charAt(0)}</AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <p className="font-medium">{member.user.name}</p>
                  <p className="text-xs text-muted-foreground">
                    {/* Joined {formatDistanceToNow(new Date(member?.joinedAt), { addSuffix: true })} */}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  {member.role === "admin" && <Crown className="h-4 w-4 text-yellow-500" />}
                  {member.role === "moderator" && <Shield className="h-4 w-4 text-blue-500" />}
                  {isGroupAdmin(group) &&
                    member.user._id !== currentUser?._id && (
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
                            <UserMinus className="h-3 w-3" />
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Remove Member</AlertDialogTitle>
                            <AlertDialogDescription>
                              Are you sure you want to remove {member.user.name} from the group?
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction
                              onClick={() => removeGroupMember(group._id, member.user._id)}
                            >
                              Remove
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    )}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="flex gap-2">
          {group.createdBy === currentUser?._id && (
            <Button className="flex-1">
              <UserPlus className="h-4 w-4 mr-2" />
              Add Members
            </Button>
          )}
          {group.members.find((m: any) => m.user._id === currentUser?._id)?.role !==
            "admin" && (
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="outline" className="flex-1 bg-transparent">
                  <LogOut className="h-4 w-4 mr-2" />
                  Leave Group
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Leave Group</AlertDialogTitle>
                  <AlertDialogDescription>
                    Are you sure you want to leave this group? You won&apos;t be able to see new
                    messages.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction
                    onClick={() => leaveGroup(group._id)}
                  >
                    Leave
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          )}
          {group.createdBy === currentUser?._id && (
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="destructive" className="flex-1">
                  <Trash2 className="h-4 w-4 mr-2" />
                  Delete Group
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Delete Group</AlertDialogTitle>
                  <AlertDialogDescription>
                    Are you sure you want to delete this group? This action cannot be undone and
                    all messages will be lost.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction
                    onClick={() => deleteGroup(group._id)}
                    className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                  >
                    Delete
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          )}
        </div>
      </div>
    </DialogContent>
  );
}
