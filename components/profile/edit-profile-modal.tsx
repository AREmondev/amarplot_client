"use client"

import type React from "react"

import { useState, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Camera } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface EditProfileModalProps {
  profile: {
    name?: string
    email?: string
    phone?: string
    location?: string
    bio?: string
    avatar?: string
    isEmailVerified?: boolean
    isPhoneVerified?: boolean
    isNIDVerified?: boolean
  }
  onUpdateProfile: (updatedProfile: any) => void
  onCancel: () => void
}

export default function EditProfileModal({ profile, onUpdateProfile, onCancel }: EditProfileModalProps) {
  const [formData, setFormData] = useState({
    name: profile?.name || "",
    email: profile?.email || "",
    phone: profile?.phone || "",
    location: profile?.location || "",
    bio: profile?.bio || "",
    avatar: profile?.avatar || "",
    isEmailVerified: profile?.isEmailVerified || false,
    isPhoneVerified: profile?.isPhoneVerified || false,
    isNIDVerified: profile?.isNIDVerified || false,
  })
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [previewUrl, setPreviewUrl] = useState<string>(profile?.avatar || "")
  const [isLoading, setIsLoading] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const { toast } = useToast()

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }))
  }

  const handleAvatarUpload = () => {
    fileInputRef.current?.click()
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        toast({
          title: "Invalid File Type",
          description: "Please select an image file.",
          variant: "destructive",
        })
        return
      }

      // Validate file size (5MB limit)
      if (file.size > 5 * 1024 * 1024) {
        toast({
          title: "File Too Large",
          description: "Please select an image smaller than 5MB.",
          variant: "destructive",
        })
        return
      }

      setSelectedFile(file)
      const url = URL.createObjectURL(file)
      setPreviewUrl(url)
      
      toast({
        title: "Image Selected",
        description: "Your profile picture will be updated when you save.",
      })
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate required fields
    if (!formData.name.trim()) {
      toast({
        title: "Validation Error",
        description: "Name is required.",
        variant: "destructive",
      });
      return;
    }
    
    if (!formData.phone.trim()) {
      toast({
        title: "Validation Error",
        description: "Phone number is required.",
        variant: "destructive",
      });
      return;
    }
    
    if (!formData.location.trim()) {
      toast({
        title: "Validation Error",
        description: "Location is required.",
        variant: "destructive",
      });
      return;
    }
    
    if (!formData.bio.trim()) {
      toast({
        title: "Validation Error",
        description: "Bio is required.",
        variant: "destructive",
      });
      return;
    }
    
    setIsLoading(true);

    try {
      // Create FormData if there's a file to upload
      if (selectedFile) {
        const formDataToSend = new FormData()
        formDataToSend.append('name', formData.name)
        formDataToSend.append('phone', formData.phone)
        formDataToSend.append('location', formData.location)
        formDataToSend.append('bio', formData.bio)
        formDataToSend.append('avatar', selectedFile)
        formDataToSend.append('isEmailVerified', formData.isEmailVerified.toString())
        formDataToSend.append('isPhoneVerified', formData.isPhoneVerified.toString())
        formDataToSend.append('isNIDVerified', formData.isNIDVerified.toString())
        
        onUpdateProfile(formDataToSend)
      } else {
        // Send regular JSON data if no file
        const { avatar, ...dataToSend } = formData
        onUpdateProfile(dataToSend)
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update profile. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <DialogHeader>
        <DialogTitle>Edit Profile</DialogTitle>
      </DialogHeader>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Avatar Section */}
        <div className="flex flex-col items-center space-y-4">
          <Avatar className="h-24 w-24">
            <AvatarImage src={previewUrl || "/placeholder.svg"} />
            <AvatarFallback className="text-xl">{formData.name?.charAt(0) || "U"}</AvatarFallback>
          </Avatar>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="hidden"
          />
          <Button
            type="button"
            variant="outline"
            onClick={handleAvatarUpload}
            className="flex items-center gap-2 bg-transparent"
          >
            <Camera className="h-4 w-4" />
            {selectedFile ? "Change Avatar" : "Upload Avatar"}
          </Button>
          {selectedFile && (
            <p className="text-xs text-muted-foreground">
              Selected: {selectedFile.name}
            </p>
          )}
        </div>

        {/* Form Fields */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="name">Full Name *</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => handleInputChange("name", e.target.value)}
              placeholder="Enter your full name"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              value={formData.email}
              onChange={(e) => handleInputChange("email", e.target.value)}
              placeholder="Enter your email"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="phone">Phone *</Label>
            <Input
              id="phone"
              value={formData.phone}
              onChange={(e) => handleInputChange("phone", e.target.value)}
              placeholder="Enter your phone number"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="location">Location *</Label>
            <Input
              id="location"
              value={formData.location}
              onChange={(e) => handleInputChange("location", e.target.value)}
              placeholder="Enter your location"
              required
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="bio">Bio *</Label>
          <Textarea
            id="bio"
            value={formData.bio}
            onChange={(e) => handleInputChange("bio", e.target.value)}
            placeholder="Tell us about yourself..."
            rows={4}
            maxLength={500}
            required
          />
          <div className="text-xs text-muted-foreground text-right">{formData.bio.length}/500</div>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-end space-x-4">
          <Button type="button" variant="outline" onClick={onCancel} disabled={isLoading}>
            Cancel
          </Button>
          <Button type="submit" disabled={isLoading}>
            {isLoading ? "Saving..." : "Save Changes"}
          </Button>
        </div>
      </form>
    </div>
  )
}
