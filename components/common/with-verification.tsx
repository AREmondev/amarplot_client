"use client"
import React, { useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useUserProfile } from '@/hooks/use-user-profile';
import { LoadingScreen } from './loading-screen';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';

interface WithVerificationProps {
  children: React.ReactNode;
}

const WithVerification: React.FC<WithVerificationProps> = ({ children }) => {
  const { data: session, status } = useSession();
  const { completionPercentage } = useUserProfile();

  const router = useRouter();

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/auth');
    }
  }, [status, router]);

  if (status === 'loading') {
    return <LoadingScreen message="Verifying your account..." fullScreen={true} />;
  }

  if (status === 'unauthenticated') {
    return <LoadingScreen message="Redirecting to login..." fullScreen={true} />;
  }

  if (status != 'authenticated') {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <div className="p-6 bg-white rounded-lg shadow-md text-center">
          <h2 className="text-xl font-semibold text-red-500 mb-4">Profile Incomplete</h2>
          <p className="text-gray-700 mb-2">Your profile is not fully verified or completed.</p>
          <p className="text-gray-700">Please complete your profile to access this content. Current completion: {completionPercentage}%</p>
          <Button 
            onClick={() => router.push('/profile')} 
            className="mt-4"
          >
            Complete Profile
          </Button>
        </div>
      </div>
    );
  }

  return <>{children}</>;
};

export default WithVerification;
