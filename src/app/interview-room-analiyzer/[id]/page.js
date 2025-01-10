"use client";


//MUI
import { useToast } from "@/hooks/use-toast";
import { ToastAction } from "@/components/ui/toast";
import { getSession } from "next-auth/react";
import  socket  from '../../../lib/utils/socket';
import {
    ResizableHandle,
    ResizablePanel,
    ResizablePanelGroup,
} from "@/components/ui/resizable"

import { useEffect, useState } from "react";

const InterviewRoomAnalizerPage = () => {
    // const { socket } = useSocket();

    const { toast } = useToast();

    useEffect(() => {
        socket.on('interviewStarted', ({ firstQuestion }) => {
            router.push(`/interview/${sessionId}/question`);
          });

          return () => {
            socket.off('interviewStarted');
          };
    }, []);

    return (
        <>
            <ResizablePanelGroup
                direction="horizontal"
                className="max-w-md rounded-lg md:min-w-full"
            >
                <ResizablePanel defaultSize={150}>
                    <div className="flex h-[200px] items-center justify-center p-6">
                        <span className="font-semibold">One</span>
                    </div>
                </ResizablePanel>
                <ResizableHandle />
                <ResizablePanel defaultSize={150}>
                    <ResizablePanelGroup direction="vertical">
                        <ResizablePanel defaultSize={25}>
                            <div className="flex h-full items-center justify-center p-6">
                                <span className="font-semibold">Two</span>
                            </div>
                        </ResizablePanel>
                        <ResizableHandle />
                        <ResizablePanel defaultSize={75}>
                            <div className="flex h-full items-center justify-center p-6">
                                <span className="font-semibold">Three</span>
                            </div>
                        </ResizablePanel>
                    </ResizablePanelGroup>
                </ResizablePanel>
            </ResizablePanelGroup>
        </>
    );
};

export default InterviewRoomAnalizerPage;
