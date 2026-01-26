import React from 'react';
import Image from "next/image";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Download, ExternalLink } from 'lucide-react';
import { useChatStore } from '@/lib/store/chatStore';

export default function ImageViewerDialog() {
  const { showImageViewer, setShowImageViewer, viewingImage } = useChatStore();

  return (
    <Dialog open={showImageViewer} onOpenChange={setShowImageViewer}>
      <DialogContent className="max-w-4xl max-h-[90vh] p-0">
        <DialogHeader className="p-6 pb-0">
          <DialogTitle>Image Viewer</DialogTitle>
        </DialogHeader>
        <div className="p-6 pt-0">
          <Image
            src={viewingImage || "/placeholder.svg"}
            alt="Full size image"
            className="w-full h-auto max-h-[70vh] object-contain rounded-lg"
            width={800}
            height={600}
          />
          <div className="flex justify-center gap-2 mt-4">
            <Button variant="outline" onClick={() => window.open(viewingImage, "_blank")}>
              <ExternalLink className="h-4 w-4 mr-2" />
              Open in New Tab
            </Button>
            <Button
              variant="outline"
              onClick={() => {
                const link = document.createElement("a");
                link.href = viewingImage;
                link.download = "image";
                link.click();
              }}
            >
              <Download className="h-4 w-4 mr-2" />
              Download
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
