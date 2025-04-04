import { useState } from 'react';
import { Button } from '@/components/ui/button';
// import { useAuth } from '@/hooks/useAuth';
import { api } from '@/lib/api/api';
import { useSession, signIn } from "next-auth/react";

export const GoogleAuthButton = () => {
  const [isConnecting, setIsConnecting] = useState(false);
  const { data: session, status } = useSession();

//   const { user } = useAuth();

  const handleGoogleAuth = async () => {
    if (!session?.user) return;
    
    setIsConnecting(true);
    try {
      // Get auth URL from backend
      const response = await api.get('/google/auth-url');
      const { url } = response.data;
      
      // Add user ID as state parameter
      const authUrl = new URL(url);
      authUrl.searchParams.set('state', session?.user?.id);
      
      // Open popup for authentication
      const width = 600;
      const height = 700;
      const left = window.innerWidth / 2 - width / 2;
      const top = window.innerHeight / 2 - height / 2;
      
      const popup = window.open(
        authUrl.toString(),
        'Google Authentication',
        `width=${width},height=${height},left=${left},top=${top}`
      );
      
      // Listen for message from popup
      const handleMessage = (event) => {
        if (event.data.type === 'GOOGLE_AUTH_SUCCESS') {
          window.removeEventListener('message', handleMessage);
          setIsConnecting(false);
          // Refresh user data or update state to show connected status
        } else if (event.data.type === 'GOOGLE_AUTH_ERROR') {
          window.removeEventListener('message', handleMessage);
          setIsConnecting(false);
          console.error('Google auth error:', event.data.error);
        }
      };
      
      window.addEventListener('message', handleMessage);
    } catch (error) {
      console.error('Failed to get Google auth URL:', error);
      setIsConnecting(false);
    }
  };

  return (
    <Button 
    type="button"
      onClick={handleGoogleAuth} 
      disabled={isConnecting}
      variant="outline"
      className="flex items-center gap-2"
    >
      {isConnecting ? 'Connecting...' : 'Connect Google Calendar'}
      <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor">
        <path d="M12 22a10 10 0 1 1 0-20 10 10 0 0 1 0 20zm-1-9H5v-2h6V5h2v6h6v2h-6v6h-2v-6z"/>
      </svg>
    </Button>
  );
};
