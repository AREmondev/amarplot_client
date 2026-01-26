// components/property/save-property-button.tsx
"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Heart, Loader2 } from "lucide-react";
import { useSession } from "next-auth/react";
import { useToast } from "@/hooks/use-toast";
import LoginModal from "@/components/auth/login-modal";
import api from "@/lib/api/axios";
import { userService } from "@/lib/api/user";

interface SavePropertyButtonProps {
  propertyId: string;
}

export default function SavePropertyButton({ propertyId }: SavePropertyButtonProps) {
  const { data: session } = useSession();
  const { toast } = useToast();
  const [isSaved, setIsSaved] = useState(false);
  const [loading, setLoading] = useState(true);
  const [showLoginModal, setShowLoginModal] = useState(false);

  useEffect(() => {
    const checkSavedStatus = async () => {
      if ((session as any)?.user?.token) {
        try {
          const response = await api.get(`/user/me/saved-properties/${propertyId}`, {
            headers: { Authorization: `Bearer ${(session as any).user.token}` }
          });
          setIsSaved(response.data.data.isSaved);
        } catch (error) {
          console.error("Error checking saved status:", error);
          // Don't show error toast for checking status, just assume not saved
          setIsSaved(false);
        } finally {
          setLoading(false);
        }
      } else {
        setLoading(false);
      }
    };

    checkSavedStatus();
  }, [session, propertyId]);

  const handleSaveToggle = async () => {
    if (!(session as any)?.user?.token) {
      setShowLoginModal(true);
      return;
    }

    setLoading(true);
    try {
      if (isSaved) {
        // await api.delete(`/user/me/saved-properties/${propertyId}`, {
        //   headers: { Authorization: `Bearer ${(session as any).user.token}` }
        // });
        setIsSaved(false);
        toast({
          title: "Property Unsaved",
          description: "The property has been removed from your saved list.",
        });
      } else {
        // await api.post(`/user/me/saved-properties/${propertyId}`, null, {
        //   headers: { Authorization: `Bearer ${(session as any).user.token}` }
        // });
        await userService.savedProperty({propertyId});
        setIsSaved(true);
        toast({
          title: "Property Saved",
          description: "The property has been added to your saved list.",
        });
      }
    } catch (error: any) {
      console.error("Error toggling saved status:", error);
      const errorMessage = error.response?.data?.error || "Failed to update saved property status.";
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleLoginSuccess = () => {
    // After successful login, the useEffect will automatically check the saved status
    toast({
      title: "Welcome back!",
      description: "You can now save properties to your list.",
    });
  };

  return (
    <>
      <Button
        variant="outline"
        size="icon"
        onClick={handleSaveToggle}
        disabled={loading}
        className={`transition-all duration-200 ${
          isSaved 
            ? "text-red-500 border-red-500 hover:text-red-600 hover:border-red-600 bg-red-50 hover:bg-red-100" 
            : "hover:text-red-500 hover:border-red-500"
        }`}
        title={isSaved ? "Remove from saved" : "Save property"}
      >
        {loading ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : (
          <Heart 
            className={`h-4 w-4 transition-all duration-200 ${
              isSaved ? "fill-current" : "fill-none"
            }`}
          />
        )}
      </Button>
      
      <LoginModal
        isOpen={showLoginModal}
        onClose={() => setShowLoginModal(false)}
        onSuccess={handleLoginSuccess}
        title="Save Property"
        description="Sign in to save this property to your favorites and access it anytime."
      />
    </>
  );
}
