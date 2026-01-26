"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import {
  User,
  Bell,
  MapPin,
  Phone,
  Mail,
  Edit,
  Users,
  Search,
  ExternalLink,
  LogOut,
  Shield,
  Calendar,
} from "lucide-react";
import SavedListings from "@/components/listings/saved-listings";
import AlertManagement from "@/components/alerts/alert-management";
import EditProfileModal from "@/components/profile/edit-profile-modal";
import EmailVerificationModal from "@/components/profile/email-verification-modal";
import MobileVerificationModal from "@/components/profile/mobile-verification-modal";
import { useToast } from "@/hooks/use-toast";
import Image from "next/image";
import { useSession } from "next-auth/react";
import { profileService } from "@/lib/api/profile";
import { User as UserType, Community, Activity } from "@/types";

export default function ProfilePage() {
  const [user, setUser] = useState<UserType | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showEmailVerificationModal, setShowEmailVerificationModal] =
    useState(false);
  const [showMobileVerificationModal, setShowMobileVerificationModal] =
    useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [communityFilter, setCommunityFilter] = useState("all"); // all, active, inactive
  const [recentActivities, setRecentActivities] = useState<Activity[]>([]);
  const { toast } = useToast();
  const { data: session } = useSession();

  useEffect(() => {
    const fetchUser = async () => {
      try {
        if (!session?.user?.token) return;
        const userData = await profileService.getProfile(session.user.token);
        setUser(userData);
      } catch (err: any) {
        setError(err.message);
        toast({
          title: "Error",
          description: err.message || "An unexpected error occurred.",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [session]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        Loading profile...
      </div>
    );
  }

  if (error || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center text-red-500">
        Error: {error || "User not found"}
      </div>
    );
  }

  const filteredCommunities = user.joinedCommunities.filter((community) => {
    const matchesSearch =
      community.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      community.category.toLowerCase().includes(searchQuery.toLowerCase());

    if (communityFilter === "active")
      return matchesSearch && community.isActive;
    if (communityFilter === "inactive")
      return matchesSearch && !community.isActive;
    return matchesSearch;
  });

  const activeCommunities = user.joinedCommunities.filter((c) => c.isActive);
  const inactiveCommunities = user.joinedCommunities.filter((c) => !c.isActive);

  const handleLeaveCommunity = async (communityId: string) => {
    try {
      if (!user || !session?.user?.token) return;
      await profileService.leaveCommunity(session.user.token);

      setUser((prevUser) => {
        if (!prevUser) return null;
        return {
          ...prevUser,
          joinedCommunities: prevUser.joinedCommunities.filter(
            (c) => c._id !== communityId,
          ),
          stats: {
            ...prevUser.stats,
            communities: prevUser.stats.communities - 1,
          },
        };
      });
      toast({
        title: "Left community",
        description: "You have successfully left the community.",
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description:
          error.message || "Failed to leave community. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleRejoinCommunity = async (communityId: string) => {
    try {
      if (!user || !session?.user?.token) return;
      const updatedCommunity = await profileService.rejoinCommunity(
        session.user.token,
      );

      setUser((prevUser) => {
        if (!prevUser) return null;
        return {
          ...prevUser,
          joinedCommunities: [...prevUser.joinedCommunities, updatedCommunity],
          stats: {
            ...prevUser.stats,
            communities: prevUser.stats.communities + 1,
          },
        };
      });
      toast({
        title: "Rejoined community",
        description: "You have successfully rejoined the community.",
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description:
          error.message || "Failed to rejoin community. Please try again.",
        variant: "destructive",
      });
    }
  };

  const getRoleColor = (role: string) => {
    switch (role.toLowerCase()) {
      case "admin":
        return "bg-red-500 text-white";
      case "moderator":
        return "bg-blue-500 text-white";
      default:
        return "bg-gray-500 text-white";
    }
  };

  const getRoleIcon = (role: string) => {
    switch (role.toLowerCase()) {
      case "admin":
        return "👑";
      case "moderator":
        return "🛡️";
      default:
        return "👤";
    }
  };

  const formatJoinDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const handleUpdateProfile = async (updatedProfile: Partial<UserType>) => {
    try {
      if (!user || !session?.user?.token) return;
      const updatedUserData = await profileService.updateProfile(
        session.user.token,
        updatedProfile,
      );
      setUser(updatedUserData);
      setShowEditModal(false);
      toast({
        title: "Profile Updated",
        description: "Your profile has been successfully updated.",
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description:
          error.message || "Failed to update profile. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleRemoveSavedProperty = async (propertyId: string) => {
    try {
      if (!user || !session?.user?.token) return;
      await profileService.removeSavedProperty(session.user.token);

      // Update the local state to reflect the removal
      setUser((prevUser) => {
        if (!prevUser) return null;
        return {
          ...prevUser,
          savedProperties: prevUser.savedProperties.filter(
            (id) => id !== propertyId,
          ),
        };
      });

      toast({
        title: "Property Removed",
        description: "Property removed from your saved list.",
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description:
          error.message || "Failed to remove property. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        {/* Profile Header */}
        <Card className="mb-8">
          <CardContent className="p-8">
            <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
              <Avatar className="h-32 w-32">
                <AvatarImage
                  src={user.avatar || "/placeholder.svg"}
                  alt={user.name}
                />
                <AvatarFallback className="text-2xl">
                  {user.name?.charAt(0) || "U"}
                </AvatarFallback>
              </Avatar>

              <div className="flex-1">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                  <div>
                    <h1 className="text-3xl font-bold mb-2">{user.name}</h1>
                    <div className="space-y-2 text-muted-foreground">
                      <div className="flex items-center gap-2">
                        <Mail className="h-4 w-4" />
                        {user.email || "No email provided"}
                        {user.isEmailVerified ? (
                          <Badge
                            variant="secondary"
                            className="text-xs bg-green-100 text-green-800"
                          >
                            ✓ Verified
                          </Badge>
                        ) : user.email ? (
                          <Badge
                            variant="secondary"
                            className="text-xs bg-yellow-100 text-yellow-800"
                          >
                            Pending
                          </Badge>
                        ) : (
                          <Badge variant="destructive" className="text-xs">
                            Missing
                          </Badge>
                        )}
                      </div>
                      <div className="flex items-center gap-2">
                        <Phone className="h-4 w-4" />
                        {user.phone || "No phone provided"}
                        {user.isPhoneVerified ? (
                          <Badge
                            variant="secondary"
                            className="text-xs bg-green-100 text-green-800"
                          >
                            ✓ Verified
                          </Badge>
                        ) : user.phone ? (
                          <Badge
                            variant="secondary"
                            className="text-xs bg-yellow-100 text-yellow-800"
                          >
                            Pending
                          </Badge>
                        ) : (
                          <Badge variant="destructive" className="text-xs">
                            Missing
                          </Badge>
                        )}
                      </div>
                      <div className="flex items-center gap-2">
                        <MapPin className="h-4 w-4" />
                        {user.location}
                      </div>
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4" />
                        Joined {formatJoinDate(user.joinedAt)}
                      </div>
                    </div>
                    {user.bio && (
                      <p className="mt-4 text-muted-foreground max-w-2xl">
                        {user.bio}
                      </p>
                    )}
                  </div>

                  <Button
                    onClick={() => setShowEditModal(true)}
                    className="w-fit"
                  >
                    <Edit className="h-4 w-4 mr-2" />
                    Edit Profile
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Profile Stats */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-8">
          {/* <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-primary mb-1">
                {user.stats.listings}
              </div>
              <div className="text-sm text-muted-foreground">Listings</div>
            </CardContent>
          </Card> */}

          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-accent mb-1">
                {user.stats.communities}
              </div>
              <div className="text-sm text-muted-foreground">Communities</div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-green-600 mb-1">
                {user.stats.posts}
              </div>
              <div className="text-sm text-muted-foreground">Posts</div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-blue-600 mb-1">
                {user.stats.comments}
              </div>
              <div className="text-sm text-muted-foreground">Comments</div>
            </CardContent>
          </Card>
        </div>

        {/* Profile Content Tabs */}
        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="communities">Communities</TabsTrigger>
            <TabsTrigger value="alerts">Alerts</TabsTrigger>
            <TabsTrigger value="saved">Saved</TabsTrigger>
          </TabsList>

          <TabsContent value="overview">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Verification Status */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Shield className="h-5 w-5" />
                    Verification Status
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Mail className="h-4 w-4" />
                      <span>Email</span>
                    </div>
                    {user.isEmailVerified ? (
                      <Badge
                        variant="secondary"
                        className="bg-green-100 text-green-800"
                      >
                        ✓ Verified
                      </Badge>
                    ) : (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setShowEmailVerificationModal(true)}
                      >
                        Verify
                      </Button>
                    )}
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Phone className="h-4 w-4" />
                      <span>Phone</span>
                    </div>
                    {user.isPhoneVerified ? (
                      <Badge
                        variant="secondary"
                        className="bg-green-100 text-green-800"
                      >
                        ✓ Verified
                      </Badge>
                    ) : (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setShowMobileVerificationModal(true)}
                      >
                        Verify
                      </Button>
                    )}
                  </div>

                  {/* NID Verification is hidden as requested */}
                </CardContent>
              </Card>

              {/* Recent Activity */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Bell className="h-5 w-5" />
                    Recent Activity
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {recentActivities.length > 0 ? (
                    recentActivities.map((activity) => (
                      <div
                        key={activity._id}
                        className="flex items-start gap-3"
                      >
                        <div className="h-2 w-2 bg-primary rounded-full mt-2"></div>
                        <div className="flex-1">
                          <p className="text-sm">{activity.description}</p>
                          <p className="text-xs text-muted-foreground">
                            {new Date(
                              activity.timestamp || Date.now(),
                            ).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                    ))
                  ) : (
                    <p className="text-muted-foreground text-sm">
                      No recent activity.
                    </p>
                  )}
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="communities">
            <Card>
              <CardHeader>
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                  <CardTitle className="flex items-center gap-2">
                    <Users className="h-5 w-5" />
                    My Communities ({user.joinedCommunities.length})
                  </CardTitle>
                  <div className="flex flex-col md:flex-row gap-4">
                    <div className="relative w-full md:w-80">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                      <Input
                        placeholder="Search communities..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="pl-10"
                      />
                    </div>
                    <div className="flex gap-2">
                      <Button
                        variant={
                          communityFilter === "all" ? "default" : "outline"
                        }
                        size="sm"
                        onClick={() => setCommunityFilter("all")}
                      >
                        All ({user.joinedCommunities.length})
                      </Button>
                      <Button
                        variant={
                          communityFilter === "active" ? "default" : "outline"
                        }
                        size="sm"
                        onClick={() => setCommunityFilter("active")}
                      >
                        Active ({activeCommunities.length})
                      </Button>
                      <Button
                        variant={
                          communityFilter === "inactive" ? "default" : "outline"
                        }
                        size="sm"
                        onClick={() => setCommunityFilter("inactive")}
                      >
                        Left ({inactiveCommunities.length})
                      </Button>
                    </div>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                {/* Communities Grid */}
                {filteredCommunities.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredCommunities.map((community) => (
                      <Card
                        key={community._id}
                        className={`hover:shadow-md transition-all duration-200 ${
                          !community.isActive ? "opacity-60" : ""
                        }`}
                      >
                        <CardContent className="p-6">
                          <div className="flex items-start gap-4 mb-4">
                            <Image
                              src={community.image || "/placeholder.svg"}
                              alt={community.name}
                              width={60}
                              height={60}
                              className={`rounded-full border ${!community.isActive ? "grayscale" : ""}`}
                            />
                            <div className="flex-1 min-w-0">
                              <h4 className="font-semibold text-lg truncate">
                                {community.name}
                              </h4>
                              <p className="text-sm text-muted-foreground">
                                {community.members.toLocaleString()} members
                              </p>
                              <Badge variant="outline" className="mt-1 text-xs">
                                {community.category}
                              </Badge>
                            </div>
                          </div>

                          <div className="flex items-center justify-between mb-4">
                            <Badge
                              className={`text-xs ${getRoleColor(community.role)}`}
                            >
                              {getRoleIcon(community.role)} {community.role}
                            </Badge>
                            <span className="text-xs text-muted-foreground">
                              Joined {formatJoinDate(community.joinedAt)}
                            </span>
                          </div>

                          {/* Activity Stats */}
                          <div className="grid grid-cols-3 gap-2 mb-4 text-center">
                            <div>
                              <div className="text-sm font-semibold">
                                {community.posts}
                              </div>
                              <div className="text-xs text-muted-foreground">
                                Posts
                              </div>
                            </div>
                            <div>
                              <div className="text-sm font-semibold">
                                {community.comments}
                              </div>
                              <div className="text-xs text-muted-foreground">
                                Comments
                              </div>
                            </div>
                            <div>
                              <div className="text-sm font-semibold">
                                {community.likes}
                              </div>
                              <div className="text-xs text-muted-foreground">
                                Likes
                              </div>
                            </div>
                          </div>

                          {/* Action Buttons */}
                          <div className="flex gap-2">
                            {community.isActive ? (
                              <>
                                <Button
                                  variant="outline"
                                  size="sm"
                                  className="flex-1 bg-transparent"
                                >
                                  <ExternalLink className="h-3 w-3 mr-1" />
                                  Visit
                                </Button>
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() =>
                                    handleLeaveCommunity(community._id)
                                  }
                                  className="text-red-600 hover:text-red-700 hover:bg-red-50"
                                >
                                  <LogOut className="h-3 w-3 mr-1" />
                                  Leave
                                </Button>
                              </>
                            ) : (
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() =>
                                  handleRejoinCommunity(community._id)
                                }
                                className="w-full"
                              >
                                Rejoin Community
                              </Button>
                            )}
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    {searchQuery ? (
                      <>
                        <Search className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                        <h3 className="text-lg font-semibold mb-2">
                          No communities found
                        </h3>
                        <p className="text-muted-foreground">
                          No communities match "{searchQuery}"
                        </p>
                      </>
                    ) : (
                      <>
                        <Users className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                        <h3 className="text-lg font-semibold mb-2">
                          No communities yet
                        </h3>
                        <p className="text-muted-foreground mb-4">
                          Join communities to connect with like-minded property
                          enthusiasts
                        </p>
                        <Button>Explore Communities</Button>
                      </>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="alerts">
            <AlertManagement />
          </TabsContent>

          <TabsContent value="saved">
            <SavedListings
              savedPropertyIds={user.savedProperties}
              userId={user._id}
              onRemoveSavedProperty={handleRemoveSavedProperty}
            />
          </TabsContent>
        </Tabs>
      </div>

      {/* Edit Profile Modal */}
      <Dialog open={showEditModal} onOpenChange={setShowEditModal}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <EditProfileModal
            profile={user}
            onUpdateProfile={handleUpdateProfile}
            onCancel={() => setShowEditModal(false)}
          />
        </DialogContent>
      </Dialog>

      {/* Email Verification Modal */}
      <EmailVerificationModal
        isOpen={showEmailVerificationModal}
        onClose={() => setShowEmailVerificationModal(false)}
        currentEmail={user?.email || ""}
        onVerificationSuccess={() => {
          setShowEmailVerificationModal(false);
          // Refresh user data to update verification status
          if (session?.user?.token) {
            profileService.getProfile(session.user.token).then(setUser);
          }
        }}
      />

      {/* Mobile Verification Modal */}
      <MobileVerificationModal
        isOpen={showMobileVerificationModal}
        onClose={() => setShowMobileVerificationModal(false)}
        currentMobile={user?.phone || ""}
        onVerificationSuccess={() => {
          setShowMobileVerificationModal(false);
          // Refresh user data to update verification status
          if (session?.user?.token) {
            profileService.getProfile(session.user.token).then(setUser);
          }
        }}
      />
    </div>
  );
}
