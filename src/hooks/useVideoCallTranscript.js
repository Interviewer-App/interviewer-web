'use client'

import { useState, useEffect, useRef, useCallback } from "react";
import useSpeechRecognition from "./useSpeechRecognition";

export const useVideoCallTranscript = (isActive, role, sessionId) => {
    const [videoCallTranscript, setVideoCallTranscript] = useState([]);
    const [isTranscriptRecording, setIsTranscriptRecording] = useState(true);
    
    // Separate speech recognition for transcript (different from other TTS functionalities)
    const {
        isListening: isTranscriptListening,
        transcript: currentTranscript,
        startListening: startTranscriptListening,
        stopListening: stopTranscriptListening,
        setTranscript: setCurrentTranscript
    } = useSpeechRecognition({ 
        continuous: true, 
        interimResults: true,
        lang: "en-US"
    });

    const lastTranscriptRef = useRef("");
    const transcriptTimeoutRef = useRef(null);
    const silenceTimeoutRef = useRef(null);

    // Add transcript entry to the conversation
    const addTranscriptEntry = useCallback((text, speakerType = role) => {
        if (!text.trim()) return;
        
        const entry = {
            type: speakerType === 'COMPANY' ? 'interviewer' : 'candidate',
            text: text.trim(),
            timestamp: new Date().toISOString(),
            sessionId: sessionId
        };

        setVideoCallTranscript(prev => [...prev, entry]);
    }, [role, sessionId]);

    // Process speech when it stops or changes significantly
    useEffect(() => {
        if (!isTranscriptRecording || !isActive) return;

        const processTranscript = () => {
            const finalTranscript = currentTranscript.trim();
            
            if (finalTranscript && finalTranscript !== lastTranscriptRef.current) {
                // Clear any existing timeouts
                if (transcriptTimeoutRef.current) {
                    clearTimeout(transcriptTimeoutRef.current);
                }
                
                // Set a timeout to capture the speech after a pause
                transcriptTimeoutRef.current = setTimeout(() => {
                    if (finalTranscript.length > lastTranscriptRef.current.length) {
                        const newText = finalTranscript.slice(lastTranscriptRef.current.length);
                        if (newText.trim()) {
                            addTranscriptEntry(newText);
                            lastTranscriptRef.current = finalTranscript;
                        }
                    }
                }, 2000); // Wait 2 seconds after speech stops
            }
        };

        if (currentTranscript) {
            processTranscript();
        }

        // Handle silence detection
        if (silenceTimeoutRef.current) {
            clearTimeout(silenceTimeoutRef.current);
        }

        silenceTimeoutRef.current = setTimeout(() => {
            if (currentTranscript.trim() && currentTranscript !== lastTranscriptRef.current) {
                addTranscriptEntry(currentTranscript);
                lastTranscriptRef.current = currentTranscript;
                setCurrentTranscript(""); // Clear for next speech
            }
        }, 3000); // 3 seconds of silence

    }, [currentTranscript, isTranscriptRecording, isActive, addTranscriptEntry, setCurrentTranscript]);

    // Start transcript recording
    const startTranscriptRecording = useCallback(() => {
        if (!isActive) return;
        
        setIsTranscriptRecording(true);
        startTranscriptListening();
        lastTranscriptRef.current = "";
        setCurrentTranscript("");
    }, [isActive, startTranscriptListening, setCurrentTranscript]);

    // Stop transcript recording
    const stopTranscriptRecording = useCallback(() => {
        setIsTranscriptRecording(false);
        stopTranscriptListening();
        
        // Process any remaining transcript
        if (currentTranscript.trim() && currentTranscript !== lastTranscriptRef.current) {
            addTranscriptEntry(currentTranscript);
        }
        
        // Clear timeouts
        if (transcriptTimeoutRef.current) {
            clearTimeout(transcriptTimeoutRef.current);
        }
        if (silenceTimeoutRef.current) {
            clearTimeout(silenceTimeoutRef.current);
        }
        
        setCurrentTranscript("");
        lastTranscriptRef.current = "";
    }, [currentTranscript, addTranscriptEntry, stopTranscriptListening, setCurrentTranscript]);

    // Toggle transcript recording
    const toggleTranscriptRecording = useCallback(() => {
        if (isTranscriptRecording) {
            stopTranscriptRecording();
        } else {
            startTranscriptRecording();
        }
    }, [isTranscriptRecording, startTranscriptRecording, stopTranscriptRecording]);

    // Clear transcript
    const clearTranscript = useCallback(() => {
        setVideoCallTranscript([]);
        lastTranscriptRef.current = "";
        setCurrentTranscript("");
    }, [setCurrentTranscript]);

    // Export transcript as JSON
    const exportTranscript = useCallback(() => {
        return JSON.stringify(videoCallTranscript, null, 2);
    }, [videoCallTranscript]);

    // Get transcript summary
    const getTranscriptSummary = useCallback(() => {
        const totalEntries = videoCallTranscript.length;
        const interviewerEntries = videoCallTranscript.filter(entry => entry.type === 'interviewer').length;
        const candidateEntries = videoCallTranscript.filter(entry => entry.type === 'candidate').length;
        
        return {
            totalEntries,
            interviewerEntries,
            candidateEntries,
            duration: videoCallTranscript.length > 0 ? 
                new Date(videoCallTranscript[videoCallTranscript.length - 1].timestamp) - 
                new Date(videoCallTranscript[0].timestamp) : 0
        };
    }, [videoCallTranscript]);

    // Cleanup on unmount
    useEffect(() => {
        return () => {
            if (transcriptTimeoutRef.current) {
                clearTimeout(transcriptTimeoutRef.current);
            }
            if (silenceTimeoutRef.current) {
                clearTimeout(silenceTimeoutRef.current);
            }
        };
    }, []);

    return {
        videoCallTranscript,
        isTranscriptRecording,
        isTranscriptListening,
        currentTranscript,
        startTranscriptRecording,
        stopTranscriptRecording,
        toggleTranscriptRecording,
        clearTranscript,
        exportTranscript,
        getTranscriptSummary,
        addTranscriptEntry
    };
};

export default useVideoCallTranscript;
