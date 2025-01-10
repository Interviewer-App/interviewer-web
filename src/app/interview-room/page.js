// "use client";


// //MUI
// import { useToast } from "@/hooks/use-toast";
// import { ToastAction } from "@/components/ui/toast";
// import { getSession } from "next-auth/react";
// import { useSocket } from '@/hooks/useSocket';


// const InterviewRoomPage = () => {
//     const { socket } = useSocket();

//   const { toast } = useToast();

//   useEffect(() => {
//     socket.on('interviewStarted', ({ firstQuestion }) => {
//         router.push(`/interview/${sessionId}/question`);
//       });
  
//       return () => {
//         socket.off('interviewStarted');
//       };
//   }, []);

//   return (
//     <>
//         <div>
//            {} <h1>Waiting</h1>
//         </div>
//     </>
//   );
// };

// export default InterviewRoomPage;
