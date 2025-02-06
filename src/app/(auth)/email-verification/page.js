'use client'
import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import axios from 'axios';
import { verifyUserEmail } from '@/lib/api/authentication';

const VerifyEmail = () => {
  const router = useRouter();
  const searchParams = useSearchParams()
  const  token  = searchParams.get('token');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const verifyEmail = async () => {
        debugger
      if (!token) return;

      try {
        // Call your backend API to verify the email
        const response = await verifyUserEmail( token );
        if (response.data) {
          setMessage('Email verified successfully! Redirecting...');
          localStorage.setItem('isEmailVerified', response.data.isEmailVerified);
          setTimeout(() => {
            if(response.data.role === 'CANDIDATE'){
                router.push('/my-interviews')
            }else{
                router.push('/interviews')
            }
          }, 2000);
        } else {
          setMessage('Verification failed. Please try again.');
        }
      } catch (error) {
        setMessage('An error occurred during verification.');
      } finally {
        setLoading(false);
      }
    };

    verifyEmail();
  }, [token]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      {loading ? (
        <div className="text-xl text-gray-700 animate-pulse">
          Verifying your email...
        </div>
      ) : (
        <div
          className={`text-2xl font-bold text-center ${
            message.includes('successfully') ? 'text-green-600' : 'text-red-600'
          }`}
        >
          {message}
        </div>
      )}
    </div>
  );
};

export default VerifyEmail;