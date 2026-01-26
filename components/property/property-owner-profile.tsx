// components/property/property-owner-profile.tsx
"use client";

import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { 
  User, 
  UserPlus, 
  UserMinus, 
  Building, 
  Star, 
  MapPin, 
  Phone, 
  Mail,
  Calendar,
  Award
} from "lucide-react";

interface OwnerProfile {
  id: string;
  name: string;
  email?: string;
  phone?: string;
  avatar?: string;
  company?: {
    name: string;
    type: "Individual" | "Agency" | "Developer" | "Broker";
    established?: string;
    location?: string;
  };
  stats: {
    totalProperties: number;
    activeListings: number;
    rating: number;
    reviewsCount: number;
    joinedDate: string;
  };
  isVerified: boolean;
  badges?: string[];
}

interface PropertyOwnerProfileProps {
  owner?: OwnerProfile;
  contactInfo?: {
    phone?: string;
    email?: string;
  };
}

// Dummy data for demonstration
const dummyOwner: OwnerProfile = {
  id: "owner-123",
  name: "Ahmed Rahman",
  email: "ahmed.rahman@example.com",
  phone: "+880 1712-345678",
  avatar: "/placeholder.svg?height=80&width=80",
  company: {
    name: "Rahman Properties",
    type: "Agency",
    established: "2018",
    location: "Dhaka, Bangladesh"
  },
  stats: {
    totalProperties: 45,
    activeListings: 12,
    rating: 4.8,
    reviewsCount: 127,
    joinedDate: "2018-03-15"
  },
  isVerified: true,
  badges: ["Top Seller", "Quick Response", "Verified Agent"]
};

export function PropertyOwnerProfile({ owner = dummyOwner, contactInfo }: PropertyOwnerProfileProps) {
  const [isFollowing, setIsFollowing] = useState(false);
  const [followersCount, setFollowersCount] = useState(234); // Dummy followers count

  const handleFollowToggle = () => {
    setIsFollowing(!isFollowing);
    setFollowersCount(prev => isFollowing ? prev - 1 : prev + 1);
  };

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  };

  const formatJoinDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { year: 'numeric', month: 'long' });
  };

  return (
    <Card className="border-none shadow-sm">
      <CardContent className="p-6">
        {/* Owner Header */}
        <div className="flex items-start gap-4 mb-6">
          <Avatar className="h-16 w-16">
            <AvatarImage src={owner.avatar} alt={owner.name} />
            <AvatarFallback className="bg-blue-100 text-blue-700 text-lg font-semibold">
              {getInitials(owner.name)}
            </AvatarFallback>
          </Avatar>
          
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <h3 className="text-lg font-semibold text-gray-900">{owner.name}</h3>
              {/* Verified tag - hidden as requested */}
              {/* {owner.isVerified && (
                <Badge variant="secondary" className="bg-blue-100 text-blue-700 text-xs">
                  <Award className="h-3 w-3 mr-1" />
                  Verified
                </Badge>
              )} */}
            </div>
            
            {/* Company name and Agency badge - hidden as requested */}
            {/* {owner.company && (
              <div className="flex items-center gap-2 text-sm text-gray-600 mb-2">
                <Building className="h-4 w-4" />
                <span>{owner.company.name}</span>
                <Badge variant="outline" className="text-xs">
                  {owner.company.type}
                </Badge>
              </div>
            )} */}
            
            {/* Rating and reviews - hidden as requested */}
            {/* <div className="flex items-center gap-4 text-sm text-gray-500">
              <div className="flex items-center gap-1">
                <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                <span>{owner.stats.rating}</span>
                <span>({owner.stats.reviewsCount} reviews)</span>
              </div>
              <div className="flex items-center gap-1">
                <User className="h-4 w-4" />
                <span>{followersCount} followers</span>
              </div>
            </div> */}
            
            <div className="flex items-center gap-1 text-sm text-gray-500">
              <User className="h-4 w-4" />
              <span>{followersCount} followers</span>
            </div>
          </div>
        </div>

        {/* Follow Button */}
        <Button 
          onClick={handleFollowToggle}
          variant={isFollowing ? "outline" : "default"}
          className={`w-full mb-4 transition-all duration-200 ${
            isFollowing 
              ? 'border-red-200 text-red-600 hover:bg-red-50 hover:border-red-300 hover:text-red-700' 
              : 'bg-blue-600 hover:bg-blue-700 text-white'
          }`}
        >
          {isFollowing ? (
            <>
              <UserMinus className="h-4 w-4 mr-2" />
              Following
            </>
          ) : (
            <>
              <UserPlus className="h-4 w-4 mr-2" />
              Follow
            </>
          )}
        </Button>

        {/* Owner Stats */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          <div className="text-center p-3 bg-gray-50 rounded-lg">
            <p className="text-2xl font-bold text-gray-900">{owner.stats.totalProperties}</p>
            <p className="text-xs text-gray-600">Total Properties</p>
          </div>
          <div className="text-center p-3 bg-gray-50 rounded-lg">
            <p className="text-2xl font-bold text-green-600">{owner.stats.activeListings}</p>
            <p className="text-xs text-gray-600">Active Listings</p>
          </div>
        </div>

        {/* Achievements - hidden as requested */}
        {/* {owner.badges && owner.badges.length > 0 && (
          <div className="mb-6">
            <h4 className="text-sm font-medium text-gray-900 mb-2">Achievements</h4>
            <div className="flex flex-wrap gap-2">
              {owner.badges.map((badge, index) => (
                <Badge key={index} variant="secondary" className="text-xs">
                  {badge}
                </Badge>
              ))}
            </div>
          </div>
        )} */}

        {/* Company Info - hidden as requested */}
        {/* {owner.company && (
          <div className="border-t pt-4 mb-4">
            <h4 className="text-sm font-medium text-gray-900 mb-3">Company Information</h4>
            <div className="space-y-2 text-sm">
              {owner.company.established && (
                <div className="flex items-center gap-2 text-gray-600">
                  <Calendar className="h-4 w-4" />
                  <span>Established in {owner.company.established}</span>
                </div>
              )}
              {owner.company.location && (
                <div className="flex items-center gap-2 text-gray-600">
                  <MapPin className="h-4 w-4" />
                  <span>{owner.company.location}</span>
                </div>
              )}
            </div>
          </div>
        )} */}

        {/* Contact Information - hidden as requested */}
        {/* <div className="border-t pt-4">
          <h4 className="text-sm font-medium text-gray-900 mb-3">Contact Information</h4>
          <div className="space-y-2">
            {(contactInfo?.phone || owner.phone) && (
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <Phone className="h-4 w-4" />
                <span>{contactInfo?.phone || owner.phone}</span>
              </div>
            )}
            {(contactInfo?.email || owner.email) && (
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <Mail className="h-4 w-4" />
                <span>{contactInfo?.email || owner.email}</span>
              </div>
            )}
            <div className="flex items-center gap-2 text-sm text-gray-500">
              <Calendar className="h-4 w-4" />
              <span>Member since {formatJoinDate(owner.stats.joinedDate)}</span>
            </div>
          </div>
        </div> */}

        {/* Quick Actions */}
        <div className="border-t pt-4 mt-4">
          <p className="text-xs text-gray-500 text-center">
            Following this agent will notify you of their new listings and updates.
          </p>
        </div>
      </CardContent>
    </Card>
  );
}