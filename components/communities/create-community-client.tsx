"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import { ArrowLeft, Upload, X } from "lucide-react";
import { COMMUNITY_CATEGORIES } from "@/lib/constants";
import { communitiesService } from "@/lib/services/communities";
import Image from "next/image";

interface CreateCommunityForm {
  name: string;
  description: string;
  category: string;
  coverImage: File | null;
}

export default function CreateCommunityClient() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [coverImagePreview, setCoverImagePreview] = useState<string | null>(null);
  const [formData, setFormData] = useState<CreateCommunityForm>({
    name: "",
    description: "",
    category: "",
    coverImage: null,
  });

  const handleInputChange = (field: keyof CreateCommunityForm, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) { // 5MB limit
        toast.error("Image size should be less than 5MB");
        return;
      }
      
      setFormData(prev => ({ ...prev, coverImage: file }));
      
      // Create preview
      const reader = new FileReader();
      reader.onload = (e) => {
        setCoverImagePreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const removeImage = () => {
    setFormData(prev => ({ ...prev, coverImage: null }));
    setCoverImagePreview(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name.trim()) {
      toast.error("Community name is required");
      return;
    }
    
    if (!formData.description.trim()) {
      toast.error("Community description is required");
      return;
    }
    
    if (!formData.category) {
      toast.error("Please select a category");
      return;
    }

    setIsLoading(true);
    
    try {
      const submitData = new FormData();
      submitData.append("name", formData.name.trim());
      submitData.append("description", formData.description.trim());
      submitData.append("category", formData.category);
      
      if (formData.coverImage) {
        submitData.append("coverImage", formData.coverImage);
      }

      const response = await communitiesService.createCommunity(submitData);
      
      toast.success("Community created successfully!");
      router.push(`/communities/${response.id}`);
    } catch (error: any) {
      console.error("Error creating community:", error);
      toast.error(error.message || "Failed to create community");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => router.back()}
                className="flex items-center space-x-2"
              >
                <ArrowLeft className="h-4 w-4" />
                <span>Back</span>
              </Button>
              <h1 className="text-xl font-semibold text-gray-900">
                Create New Community
              </h1>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Basic Information */}
          <Card>
            <CardHeader>
              <CardTitle>Basic Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Community Name */}
              <div className="space-y-2">
                <Label htmlFor="name">Community Name *</Label>
                <Input
                  id="name"
                  type="text"
                  placeholder="Enter community name"
                  value={formData.name}
                  onChange={(e) => handleInputChange("name", e.target.value)}
                  maxLength={100}
                  required
                />
                <p className="text-sm text-gray-500">
                  {formData.name.length}/100 characters
                </p>
              </div>

              {/* Description */}
              <div className="space-y-2">
                <Label htmlFor="description">Description *</Label>
                <Textarea
                  id="description"
                  placeholder="Describe your community..."
                  value={formData.description}
                  onChange={(e) => handleInputChange("description", e.target.value)}
                  rows={4}
                  maxLength={500}
                  required
                />
                <p className="text-sm text-gray-500">
                  {formData.description.length}/500 characters
                </p>
              </div>

              {/* Category */}
              <div className="space-y-2">
                <Label htmlFor="category">Category *</Label>
                <Select
                  value={formData.category}
                  onValueChange={(value) => handleInputChange("category", value)}
                  required
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select a category" />
                  </SelectTrigger>
                  <SelectContent>
                    {COMMUNITY_CATEGORIES.map((category) => (
                      <SelectItem key={category.value} value={category.value}>
                        {category.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {/* Cover Image */}
          <Card>
            <CardHeader>
              <CardTitle>Cover Image</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {!coverImagePreview ? (
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-gray-400 transition-colors">
                    <Upload className="mx-auto h-12 w-12 text-gray-400" />
                    <div className="mt-4">
                      <Label
                        htmlFor="cover-image"
                        className="cursor-pointer inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
                      >
                        Upload Cover Image
                      </Label>
                      <Input
                        id="cover-image"
                        type="file"
                        accept="image/*"
                        onChange={handleImageUpload}
                        className="hidden"
                      />
                    </div>
                    <p className="mt-2 text-sm text-gray-500">
                      PNG, JPG, GIF up to 5MB
                    </p>
                  </div>
                ) : (
                  <div className="relative">
                    <div className="relative w-full h-48 rounded-lg overflow-hidden">
                      <Image
                        src={coverImagePreview}
                        alt="Cover preview"
                        fill
                        className="object-cover"
                      />
                    </div>
                    <Button
                      type="button"
                      variant="destructive"
                      size="sm"
                      onClick={removeImage}
                      className="absolute top-2 right-2"
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Submit Button */}
          <div className="flex justify-end space-x-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => router.back()}
              disabled={isLoading}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isLoading}
              className="min-w-[120px]"
            >
              {isLoading ? "Creating..." : "Create Community"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}