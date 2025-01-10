"use client";


//MUI
import { useToast } from "@/hooks/use-toast";
import { ToastAction } from "@/components/ui/toast";
import { getSession } from "next-auth/react";
import  socket  from '../../../lib/utils/socket';
import { useEffect, useState } from "react";

const InterviewRoomPage = ({ params }) => {
    // const { socket } = useSocket();
    const { toast } = useToast();
    const [sessionId, setSessionId] = useState(null);
    const [questions, setQuestions] = useState([]);
    const [isQuestionAvailabe, setIsQuestionAvailabe] = useState(false);

    useEffect(() => {
        const unwrapParams = async () => {
          const resolvedParams = await params;
          setSessionId(resolvedParams.id);
        };
        unwrapParams();
      }, [params]);


    useEffect(() => {
        socket.on('questions', (data) => {
            console.log('Received questions:', data.questions);
            setQuestions(data.questions);
            setIsQuestionAvailabe(true);
          });
       

        return () => {
            socket.off('questions');
        };
    }, []);

    return (
        <>
            <div>
                { isQuestionAvailabe ? (<>Room Started</>) : (<h1>Waiting</h1>)}
            </div>
        </>
    );
};

export default InterviewRoomPage;
