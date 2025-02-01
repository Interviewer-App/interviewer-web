'use client';
import { StreamVideoClient } from '@stream-io/video-react-sdk';
import { StreamCall } from '@stream-io/video-react-sdk';
import axiosInstance from "./axioinstance";
import { getSession } from 'next-auth/react';

export const initializeStreamClient = async (userId) => {
    const session = await getSession();
  // Get token from your backend
//   const response = await fetch(`/api/auth/stream-token?userId=${userId}`);
  const response = await axiosInstance.get(
   `/interview-session/stream-token?userId=${userId}`
  );
  const  token  = await response.data.token;

  return new StreamVideoClient({
    apiKey: process.env.NEXT_PUBLIC_STREAM_API_KEY,
    user: {
      id: userId,
      name: session.user.email, // Add user name from your auth system
    },
    token,
    options: {
        logLevel: 'debug', // Enable debug logging
        browser: true,
        // Add region if needed (default 'us-east')
        // region: 'eu-west',
      },
  });
};