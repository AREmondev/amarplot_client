// components/property/property-image-gallery.tsx
"use client";

import Image from "next/image";

interface PropertyImageGalleryProps {
  images: string[];
  title?: string;
}

export default function PropertyImageGallery({ images, title }: PropertyImageGalleryProps) {
  if (!images || images.length === 0) {
    return null; // Or a placeholder if no images
  }

  return (
    <div className="relative w-full h-96 mb-6 rounded-lg overflow-hidden">
      <Image
        src={images[0]}
        alt={title || "Property Image"}
        fill
        style={{ objectFit: "cover" }}
        className="rounded-lg"
      />
      {/* You can extend this to a full gallery/carousel if needed */}
    </div>
  );
}
