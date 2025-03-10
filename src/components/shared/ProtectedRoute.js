'use client'
import { useEffect } from 'react';

import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';

const ProtectedRoute = ({ allowedRoles, children }) => {
  const { user, loading } = useAuth();
  const router = useRouter();
  // if (loading) return <div>Loading...</div>;

  useEffect(() => {
    
    if (loading) return;

    if (!user) {
      router.push('/login');
    }

    if (!allowedRoles.includes(user.role)) {
        router.push('/');

      }
  }, [allowedRoles, loading, router, user]);

  

//   if (!user) {
//     router.push('/login');
//     return null;
//   }

//   if (!allowedRoles.includes(user.role)) {
//     router.push('/');
//     return null;
//   }

  if (loading) return <div>Loading...</div>;

  return <>{children}</>;
};

export default ProtectedRoute;