'use client'

import { useState, useEffect , useRef } from "react";

export const useSpeechRecognition = (options) => {
    const [isListening, setIsListening] = useState(false);
    const [transcript, setTranscript] = useState("");
    const [recordingComplete, setRecordingComplete] = useState(false);

    const recognitionRef = useRef(null);

    useEffect(() => {
        if(!("webkitSpeechRecognition" in window)){
            alert("Speech Recognition is not supported on your browser");
            return;
        }

        recognitionRef.current = new window.webkitSpeechRecognition();
        const recognition = recognitionRef.current;
        recognition.interimResults = options.interimResults || true;
        recognition.lang = options.lang || "en-US";
        recognition.continuous = options.continuous || false;

        if("webkitSpeechGrammarList" in window){
            const grammar = "#JSGF V1.0; grammar punctuation; public <punc> = . | , | ! | ; | ? | : ;";
            const speechRecognitionList = new window.webkitSpeechGrammarList();
            speechRecognitionList.addFromString(grammar, 1);
            recognition.grammars = speechRecognitionList;

        }

        recognition.onresult = (event) => {
            let text = "";
            for (let i = 0; i < event.results.length; i++){
                text += event.results[i][0].transcript;
            }
            setTranscript(text);
        }

        recognition.onerror = (event) => {
            console.log("Error occurred in recognition: " + event.error);
        }

        recognition.onend = () => {
            setIsListening(false);
            setTranscript("");
        }

        return () =>{
            recognition.stop();
        }

    }, []);

    const startListening = () => {
        if(recognitionRef.current && !isListening){
            recognitionRef.current.start();
            setIsListening(true);
        }
    }

    const stopListening = () => {
        debugger
        if(recognitionRef.current && isListening){
            recognitionRef.current.stop();
            setIsListening(false);
            setRecordingComplete(true);
        }
    }
    return {
        isListening,
        transcript,
        recordingComplete,
        startListening,
        stopListening
    }
}

export default useSpeechRecognition;