'use client'
import { useEffect } from "react";
import { useRouter,useSearchParams } from "next/navigation";
import { useSession, signIn } from "next-auth/react";
import Loading from "@/app/loading";

const AuthCallback = () => {
  const { data: session, status } = useSession();
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectUrl = searchParams.get("redirect");
  useEffect(() => {
    if (status === "authenticated") {
      // localStorage.setItem('accessToken', session.user.accessToken);
      if (!redirectUrl || redirectUrl === "null" || redirectUrl === "undefined") {
        router.push('/');
      } else {
        const profileUrl = `/auth/profile?redirect=${encodeURIComponent(redirectUrl)}`;
        router.push(redirectUrl);
      }
    } 
    else if (status === "unauthenticated") {
      signIn();
    }
  }, [status, session, router]);

  return <div><Loading/></div>;
};

export default AuthCallback;