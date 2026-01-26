import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { profileService } from '@/lib/api/profile';

interface UserProfile {
  email?: string;
  phone?: string;
  isEmailVerified: boolean;
  isPhoneVerified: boolean;
  isNIDVerified: boolean;
  profileComplete: boolean;
}

export const useUserProfile = () => {
  const { data: session } = useSession();
  const [completionPercentage, setCompletionPercentage] = useState(0);
  const [profileColor, setProfileColor] = useState('null');
  const [isVerified, setIsVerified] = useState(false);

  useEffect(() => {
    const getUserProfile = async () => {
      if (session?.user?.token) {
        try {
          const userProfile = await profileService.getProfile(session.user.token);
          
          let percentage = 0;
          
          // Calculate completion percentage
          if (userProfile.isEmailVerified) {
            percentage += 33;
          }
          if (userProfile.isPhoneVerified) {
            percentage += 33;
          }
          if (userProfile.isNIDVerified) {
            percentage += 34;
          }

          setCompletionPercentage(percentage);
          
          // New verification logic:
          // - Unverified (red) only if user has no email/mobile
          // - Verified if any one (email or mobile) is verified
          const hasEmail = userProfile.email && userProfile.email.trim() !== '';
          const hasPhone = userProfile.phone && userProfile.phone.trim() !== '';
          const hasAnyContact = hasEmail || hasPhone;
          const hasAnyVerified = userProfile.isEmailVerified || userProfile.isPhoneVerified;
          
          if (!hasAnyContact) {
            // No email or phone provided - unverified (red)
            setProfileColor('red');
            setIsVerified(false);
          } else if (hasAnyVerified) {
            // At least one contact method is verified - verified (green)
            setProfileColor('green');
            setIsVerified(true);
          } else {
            // Has contact info but not verified - pending (yellow)
            setProfileColor('yellow');
            setIsVerified(false);
          }
        } catch (error) {
          console.error('Error fetching user profile:', error);
          // Default to unverified on error
          setCompletionPercentage(0);
          setProfileColor('red');
          setIsVerified(false);
        }
      }
    };

    getUserProfile();
  }, [session]);

  return { completionPercentage, profileColor, isVerified };
};