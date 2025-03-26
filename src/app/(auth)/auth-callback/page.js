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
      debugger
      localStorage.setItem('accessToken', session.user.accessToken);
      if(!session.user.isSurveyCompleted && session.user.role != 'ADMIN'){
        const surveyUrl = `/survey-form?redirect=${encodeURIComponent(redirectUrl)}`;
        router.push(surveyUrl);
      }else{
        if (!redirectUrl || redirectUrl === "null" || redirectUrl === "undefined") {
          const userRole = session?.user?.role;
  
          if (userRole === 'COMPANY') {
            router.push('/interviews');
          } else if (userRole === 'CANDIDATE') {
            router.push('/my-interviews');
          } else if (userRole === 'ADMIN')  {
            router.push('/dashboard');
          } else{
            router.push('/');
          }
        }else{
          router.push(redirectUrl);
        }
          
      }
      

    } else if (status === "unauthenticated") {
      // Redirect to sign-in page if not authenticated
      signIn();
    }
  }, [status, session, router]);

  return <div><Loading/></div>;
};

export default AuthCallback;