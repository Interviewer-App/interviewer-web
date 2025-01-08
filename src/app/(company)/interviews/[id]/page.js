'use client'
import { getInterviewById } from "@/lib/api/interview";
import { useState,useEffect } from "react";
export default function InterviewPreviewPage({ params }) {
    const [interviewDetail, setInterviewDetail] = useState();
    const [interviewId, setInterviewId] = useState(null);

    useEffect(() => {
        const unwrapParams = async () => {
            const resolvedParams = await params;
            setInterviewId(resolvedParams.id);
        };
        unwrapParams();
    }, [params]);

    useEffect(() => {
        if (interviewId) {
            const fetchInterview = async () => {
                try {
                    const response = await getInterviewById(interviewId);
                    setInterviewDetail(response.data);
                } catch (error) {
                    console.log("Error fetching interviews:", error);
                }
            };
            fetchInterview();
        }
    }, [interviewId]);
    

    return(
        <></>
    )

}