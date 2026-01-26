"use client";

import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Upload, X } from "lucide-react";
import { useFormContext } from "react-hook-form";
import { ListingFormData } from "@/lib/schemas/property";

interface MediaUploadsStepProps {}

export function MediaUploadsStep({}: MediaUploadsStepProps) {
  const {
    formState: { errors },
    watch,
    setValue,
  } = useFormContext<ListingFormData>();
  const formData = watch();

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    console.log("e.target.files", e.target.files);
    if (e.target.files) {
      const files = Array.from(e.target.files);
      // Update imageFiles in form state
      setValue("imageFiles", [...(formData.imageFiles || []), ...files]);
      // Update images (URLs) in form state for display
      const imageUrls = files.map((file) => URL.createObjectURL(file));
      setValue("images", [...(formData.images || []), ...imageUrls]);
    }
  };

  const removeImage = (index: number) => {
    // Remove from imageFiles in form state
    setValue(
      "imageFiles",
      formData.imageFiles?.filter((_, i) => i !== index),
    );
    // Remove from images (URLs) in form state
    setValue(
      "images",
      formData.images?.filter((_, i) => i !== index),
    );
  };

  return (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <Upload className="w-16 h-16 text-purple-600 mx-auto mb-4" />
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Media Uploads</h2>
        <p className="text-gray-600">Upload images, videos, and other media.</p>
      </div>
      <div>
        <Label>Images</Label>
        <div className="border-2 border-dashed border-gray-300 rounded-xl p-12 text-center hover:border-blue-400 transition-colors cursor-pointer">
          <input
            type="file"
            multiple
            accept="image/*"
            onChange={handleImageUpload}
            className="hidden"
            id="image-upload"
          />
          <label htmlFor="image-upload" className="cursor-pointer block">
            <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              Drag & drop images here
            </h3>
            <p className="text-gray-600 mb-4">or click to browse files</p>
            {/* <Button type="button" variant="outline">Choose Images</Button> */}
          </label>
        </div>
        {errors.images && (
          <p className="text-red-500 text-sm">{errors.images.message}</p>
        )}
        {formData.images && formData.images.length > 0 && (
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-4">
            {formData.images.map((image, index) => (
              <div key={index} className="relative group">
                <img
                  src={image || "/placeholder.svg"}
                  alt={`Property ${index + 1}`}
                  className="w-full h-32 object-cover rounded-lg"
                />
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={() => removeImage(index)}
                  className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity w-8 h-8 p-0"
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
