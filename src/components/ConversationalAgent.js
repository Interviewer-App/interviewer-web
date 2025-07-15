"use client";

import React, { useState, useRef, useEffect } from 'react';

const ConversationalAgent = () => {
  const [isListening, setIsListening] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [messages, setMessages] = useState([]);
  const [selectedVoice, setSelectedVoice] = useState("21m00Tcm4TlvDq8ikWAM");
  const [error, setError] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [transcript, setTranscript] = useState('');
  
  const recognitionRef = useRef(null);
  const audioElementRef = useRef(null);

  const voices = [
    { id: "21m00Tcm4TlvDq8ikWAM", name: "Rachel" },
    { id: "ErXwobaYiN019PkySvjV", name: "Domi" },
    { id: "EXAVITQu4vr4xnSDxMaL", name: "Antoni" },
    { id: "pNInz6obpgDQGcFmaJgB", name: "Adam" },
    { id: "ThT5KcBeYPX3keUQqHPh", name: "Arnold" },
    { id: "IKne3meq5aSn9XLyUdCD", name: "Charlie" },
    { id: "TxGEqnHWrfWFTfGW9XjX", name: "Dorothy" },
    { id: "CYw3kZ02Hs0563khs1Fj", name: "Josh" },
  ];

  // Initialize Speech Recognition
  useEffect(() => {
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      const recognition = new SpeechRecognition();
      
      recognition.continuous = true;
      recognition.interimResults = true;
      recognition.lang = 'en-US';
      
      recognition.onresult = (event) => {
        let finalTranscript = '';
        let interimTranscript = '';
        
        for (let i = event.resultIndex; i < event.results.length; i++) {
          const transcript = event.results[i][0].transcript;
          if (event.results[i].isFinal) {
            finalTranscript += transcript;
          } else {
            interimTranscript += transcript;
          }
        }
        
        setTranscript(finalTranscript + interimTranscript);
        
        if (finalTranscript) {
          handleUserInput(finalTranscript);
        }
      };
      
      recognition.onerror = (event) => {
        console.error('Speech recognition error:', event.error);
        setError(`Speech recognition error: ${event.error}`);
        setIsListening(false);
      };
      
      recognition.onend = () => {
        setIsListening(false);
      };
      
      recognitionRef.current = recognition;
    } else {
      setError('Speech recognition not supported in this browser');
    }
  }, []);

  const startListening = () => {
    if (recognitionRef.current) {
      setError(null);
      setTranscript('');
      recognitionRef.current.start();
      setIsListening(true);
    }
  };

  const stopListening = () => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
      setIsListening(false);
    }
  };

  const handleUserInput = async (text) => {
    if (!text.trim()) return;

    // Add user message to conversation
    const userMessage = {
      type: 'user',
      content: text,
      timestamp: new Date()
    };
    
    setMessages(prev => [...prev, userMessage]);
    setIsProcessing(true);

    try {
      // Process the conversation (you can add your own conversation logic here)
      // For now, we'll just echo the input and convert to speech
      const response = await processConversation(text);
      
      // Add agent response to conversation
      const agentMessage = {
        type: 'agent',
        content: response,
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, agentMessage]);
      
      // Convert response to speech
      await speakResponse(response);
      
    } catch (err) {
      console.error('Error processing conversation:', err);
      setError('Failed to process conversation');
    } finally {
      setIsProcessing(false);
    }
  };

  const processConversation = async (userInput) => {
    try {
      const response = await fetch('/api/conversation/process', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: userInput,
          conversationHistory: messages
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to process conversation');
      }

      const data = await response.json();
      return data.response;
    } catch (error) {
      console.error('Error processing conversation:', error);
      // Fallback response
      return "I'm having trouble processing your message right now. Could you please try again?";
    }
  };

  const speakResponse = async (text) => {
    try {
      setIsPlaying(true);
      
      const response = await fetch("/api/text-to-speech", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ text, voice: selectedVoice }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to generate audio");
      }

      const audio = new Audio(`data:audio/mpeg;base64,${data.audio}`);
      audioElementRef.current = audio;

      audio.onended = () => {
        setIsPlaying(false);
      };
      
      audio.onerror = () => {
        setIsPlaying(false);
        setError('Error playing audio response');
      };
      
      await audio.play();
    } catch (err) {
      console.error('Error generating speech:', err);
      setError('Failed to generate speech response');
      setIsPlaying(false);
    }
  };

  const sendTextMessage = async (text) => {
    if (!text.trim()) return;
    await handleUserInput(text);
  };

  const stopAudio = () => {
    if (audioElementRef.current) {
      audioElementRef.current.pause();
      audioElementRef.current.currentTime = 0;
      setIsPlaying(false);
    }
  };

  const clearConversation = () => {
    setMessages([]);
    setTranscript('');
    setError(null);
    if (isListening) {
      stopListening();
    }
    if (isPlaying) {
      stopAudio();
    }
  };

  return (
    <div className="conversational-agent-container max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold mb-6 text-gray-800">ElevenLabs Conversational Agent</h2>
      
      {/* Voice Selection */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Select Voice:
        </label>
        <select
          value={selectedVoice}
          onChange={(e) => setSelectedVoice(e.target.value)}
          disabled={isListening || isPlaying}
          className="w-full p-3 border border-gray-300 rounded-md text-black"
        >
          {voices.map((voice) => (
            <option key={voice.id} value={voice.id}>
              {voice.name}
            </option>
          ))}
        </select>
      </div>

      {/* Error Display */}
      {error && (
        <div className="mb-6 p-4 bg-red-100 border border-red-400 text-red-700 rounded">
          {error}
        </div>
      )}

      {/* Voice Control */}
      <div className="mb-6">
        <div className="flex gap-4 items-center">
          <button
            onClick={isListening ? stopListening : startListening}
            disabled={isProcessing || isPlaying}
            className={`px-6 py-3 rounded-lg text-white font-medium ${
              isListening 
                ? 'bg-red-500 hover:bg-red-600' 
                : 'bg-green-500 hover:bg-green-600'
            } ${(isProcessing || isPlaying) ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            {isListening ? 'Stop Listening' : 'Start Voice Chat'}
          </button>
          
          {isPlaying && (
            <button
              onClick={stopAudio}
              className="px-6 py-3 bg-orange-500 text-white rounded-lg hover:bg-orange-600"
            >
              Stop Audio
            </button>
          )}
          
          <button
            onClick={clearConversation}
            className="px-6 py-3 bg-gray-500 text-white rounded-lg hover:bg-gray-600"
          >
            Clear Chat
          </button>
        </div>
        
        {/* Status Indicators */}
        <div className="flex gap-4 mt-3">
          {isListening && (
            <div className="flex items-center">
              <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse mr-2"></div>
              <span className="text-red-500 text-sm">Listening...</span>
            </div>
          )}
          
          {isProcessing && (
            <div className="flex items-center">
              <div className="w-3 h-3 bg-blue-500 rounded-full animate-pulse mr-2"></div>
              <span className="text-blue-500 text-sm">Processing...</span>
            </div>
          )}
          
          {isPlaying && (
            <div className="flex items-center">
              <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse mr-2"></div>
              <span className="text-green-500 text-sm">Speaking...</span>
            </div>
          )}
        </div>
      </div>

      {/* Live Transcript */}
      {transcript && (
        <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <h4 className="text-sm font-medium text-blue-800 mb-2">Live Transcript:</h4>
          <p className="text-blue-700">{transcript}</p>
        </div>
      )}

      {/* Text Input */}
      <div className="mb-6">
        <div className="flex gap-2">
          <input
            type="text"
            placeholder="Type a message..."
            disabled={isProcessing || isPlaying}
            className="flex-1 p-3 border border-gray-300 rounded-md text-black"
            onKeyPress={(e) => {
              if (e.key === 'Enter' && e.target.value.trim() && !isProcessing && !isPlaying) {
                sendTextMessage(e.target.value.trim());
                e.target.value = '';
              }
            }}
          />
          <button
            onClick={(e) => {
              const input = e.target.previousElementSibling;
              if (input.value.trim() && !isProcessing && !isPlaying) {
                sendTextMessage(input.value.trim());
                input.value = '';
              }
            }}
            disabled={isProcessing || isPlaying}
            className={`px-6 py-3 bg-blue-500 text-white rounded-md hover:bg-blue-600 ${
              (isProcessing || isPlaying) ? 'opacity-50 cursor-not-allowed' : ''
            }`}
          >
            Send
          </button>
        </div>
      </div>

      {/* Conversation History */}
      {messages.length > 0 && (
        <div className="mb-6">
          <h3 className="text-lg font-semibold mb-4 text-gray-800">Conversation History</h3>
          <div className="bg-gray-50 rounded-lg p-4 max-h-96 overflow-y-auto">
            {messages.map((message, index) => (
              <div key={index} className={`mb-3 ${message.type === 'user' ? 'text-right' : 'text-left'}`}>
                <div className={`inline-block p-3 rounded-lg max-w-xs ${
                  message.type === 'user' 
                    ? 'bg-blue-500 text-white' 
                    : 'bg-white text-gray-800 border'
                }`}>
                  <p className="text-sm">{message.content}</p>
                  <p className="text-xs opacity-75 mt-1">
                    {message.timestamp.toLocaleTimeString()}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Usage Instructions */}
      <div className="bg-gray-100 rounded-lg p-4">
        <h4 className="text-sm font-medium text-gray-800 mb-2">How to use:</h4>
        <ul className="text-sm text-gray-600 space-y-1">
          <li>• Click &quot;Start Voice Chat&quot; to begin voice conversation</li>
          <li>• Speak naturally - the agent will listen and respond</li>
          <li>• You can also type messages in the text input</li>
          <li>• Select different voices for varied conversation experiences</li>
          <li>• Use &quot;Stop Audio&quot; to interrupt the agent&apos;s response</li>
        </ul>
      </div>
    </div>
  );
};

export default ConversationalAgent;
