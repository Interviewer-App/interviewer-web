"use client";

import React, { useState, useRef, useEffect } from 'react';

const AdvancedConversationalAgent = ({ 
  onConversationUpdate, 
  initialPrompt = "Hello! I'm your AI interview assistant. How can I help you prepare for your interview today?",
  theme = "light" 
}) => {
  const [isListening, setIsListening] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [messages, setMessages] = useState([]);
  const [selectedVoice, setSelectedVoice] = useState("21m00Tcm4TlvDq8ikWAM");
  const [error, setError] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [isInitialized, setIsInitialized] = useState(false);
  const [settings, setSettings] = useState({
    autoSpeak: true,
    showTranscript: true,
    saveHistory: true,
    interruptionEnabled: true
  });
  
  const recognitionRef = useRef(null);
  const audioElementRef = useRef(null);
  const messageEndRef = useRef(null);

  const voices = [
    { id: "21m00Tcm4TlvDq8ikWAM", name: "Rachel", gender: "Female", accent: "American" },
    { id: "ErXwobaYiN019PkySvjV", name: "Domi", gender: "Female", accent: "American" },
    { id: "EXAVITQu4vr4xnSDxMaL", name: "Antoni", gender: "Male", accent: "American" },
    { id: "pNInz6obpgDQGcFmaJgB", name: "Adam", gender: "Male", accent: "American" },
    { id: "ThT5KcBeYPX3keUQqHPh", name: "Arnold", gender: "Male", accent: "American" },
    { id: "IKne3meq5aSn9XLyUdCD", name: "Charlie", gender: "Male", accent: "Australian" },
    { id: "TxGEqnHWrfWFTfGW9XjX", name: "Dorothy", gender: "Female", accent: "British" },
    { id: "CYw3kZ02Hs0563khs1Fj", name: "Josh", gender: "Male", accent: "American" },
  ];

  // Initialize speech recognition
  useEffect(() => {
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      const recognition = new SpeechRecognition();
      
      recognition.continuous = true;
      recognition.interimResults = true;
      recognition.lang = 'en-US';
      recognition.maxAlternatives = 1;
      
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
        
        if (finalTranscript.trim()) {
          handleUserInput(finalTranscript.trim());
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

  // Initialize with welcome message
  useEffect(() => {
    if (!isInitialized && initialPrompt) {
      initializeConversation();
    }
  }, [isInitialized, initialPrompt]);

  // Auto-scroll to bottom
  useEffect(() => {
    messageEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Update parent component
  useEffect(() => {
    if (onConversationUpdate) {
      onConversationUpdate(messages);
    }
  }, [messages, onConversationUpdate]);

  const initializeConversation = async () => {
    const welcomeMessage = {
      type: 'agent',
      content: initialPrompt,
      timestamp: new Date()
    };
    
    setMessages([welcomeMessage]);
    setIsInitialized(true);
    
    if (settings.autoSpeak) {
      await speakResponse(initialPrompt);
    }
  };

  const startListening = () => {
    if (recognitionRef.current) {
      // Stop current audio if playing
      if (isPlaying && settings.interruptionEnabled) {
        stopAudio();
      }
      
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
      // Process the conversation
      const response = await processConversation(text);
      
      // Add agent response to conversation
      const agentMessage = {
        type: 'agent',
        content: response,
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, agentMessage]);
      
      // Convert response to speech if auto-speak is enabled
      if (settings.autoSpeak) {
        await speakResponse(response);
      }
      
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
    setIsInitialized(false);
    if (isListening) {
      stopListening();
    }
    if (isPlaying) {
      stopAudio();
    }
  };

  const sendTextMessage = async (text) => {
    if (!text.trim()) return;
    await handleUserInput(text);
  };

  const exportConversation = () => {
    const conversation = {
      messages,
      timestamp: new Date().toISOString(),
      voice: selectedVoice,
      settings
    };
    
    const blob = new Blob([JSON.stringify(conversation, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `conversation-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const selectedVoiceInfo = voices.find(v => v.id === selectedVoice);

  return (
    <div className={`advanced-conversational-agent-container max-w-4xl mx-auto p-6 rounded-lg shadow-lg ${
      theme === 'dark' ? 'bg-gray-900 text-white' : 'bg-white text-gray-900'
    }`}>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">AI Interview Assistant</h2>
        <div className="flex gap-2">
          <button
            onClick={exportConversation}
            disabled={messages.length === 0}
            className="px-3 py-1 text-sm bg-gray-500 text-white rounded hover:bg-gray-600 disabled:opacity-50"
          >
            Export
          </button>
          <button
            onClick={clearConversation}
            className="px-3 py-1 text-sm bg-red-500 text-white rounded hover:bg-red-600"
          >
            Clear
          </button>
        </div>
      </div>

      {/* Voice and Settings */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <div>
          <label className="block text-sm font-medium mb-2">Voice Assistant:</label>
          <select
            value={selectedVoice}
            onChange={(e) => setSelectedVoice(e.target.value)}
            disabled={isListening || isPlaying}
            className="w-full p-2 border rounded-md text-black"
          >
            {voices.map((voice) => (
              <option key={voice.id} value={voice.id}>
                {voice.name} ({voice.gender}, {voice.accent})
              </option>
            ))}
          </select>
        </div>
        
        <div>
          <label className="block text-sm font-medium mb-2">Settings:</label>
          <div className="flex flex-wrap gap-2">
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={settings.autoSpeak}
                onChange={(e) => setSettings({...settings, autoSpeak: e.target.checked})}
                className="mr-1"
              />
              <span className="text-sm">Auto-speak</span>
            </label>
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={settings.showTranscript}
                onChange={(e) => setSettings({...settings, showTranscript: e.target.checked})}
                className="mr-1"
              />
              <span className="text-sm">Show transcript</span>
            </label>
          </div>
        </div>
      </div>

      {/* Error Display */}
      {error && (
        <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded text-sm">
          {error}
        </div>
      )}

      {/* Controls */}
      <div className="mb-6">
        <div className="flex gap-3 items-center flex-wrap">
          <button
            onClick={isListening ? stopListening : startListening}
            disabled={isProcessing}
            className={`px-4 py-2 rounded-lg text-white font-medium ${
              isListening 
                ? 'bg-red-500 hover:bg-red-600' 
                : 'bg-green-500 hover:bg-green-600'
            } ${isProcessing ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            {isListening ? '🔴 Stop Listening' : '🎤 Start Voice Chat'}
          </button>
          
          {isPlaying && (
            <button
              onClick={stopAudio}
              className="px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600"
            >
              ⏹️ Stop Audio
            </button>
          )}
          
          {!isInitialized && (
            <button
              onClick={initializeConversation}
              className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
            >
              🚀 Start Interview
            </button>
          )}
        </div>
        
        {/* Status Indicators */}
        <div className="flex gap-4 mt-2 text-sm">
          {isListening && (
            <span className="flex items-center text-red-500">
              <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse mr-2"></div>
              Listening...
            </span>
          )}
          {isProcessing && (
            <span className="flex items-center text-blue-500">
              <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse mr-2"></div>
              Processing...
            </span>
          )}
          {isPlaying && (
            <span className="flex items-center text-green-500">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse mr-2"></div>
              Speaking...
            </span>
          )}
        </div>
      </div>

      {/* Live Transcript */}
      {transcript && settings.showTranscript && (
        <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
          <h4 className="text-sm font-medium text-blue-800 mb-1">Live Transcript:</h4>
          <p className="text-blue-700 text-sm">{transcript}</p>
        </div>
      )}

      {/* Text Input */}
      <div className="mb-6">
        <div className="flex gap-2">
          <input
            type="text"
            placeholder="Type a message or use voice..."
            disabled={isProcessing || isPlaying}
            className="flex-1 p-3 border rounded-md text-black"
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
            className={`px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 ${
              (isProcessing || isPlaying) ? 'opacity-50 cursor-not-allowed' : ''
            }`}
          >
            📨 Send
          </button>
        </div>
      </div>

      {/* Conversation History */}
      <div className="mb-6">
        <h3 className="text-lg font-semibold mb-3">Conversation</h3>
        <div className={`rounded-lg p-4 max-h-96 overflow-y-auto ${
          theme === 'dark' ? 'bg-gray-800' : 'bg-gray-50'
        }`}>
          {messages.length === 0 ? (
            <p className="text-gray-500 text-center py-4">
              No messages yet. Start a conversation!
            </p>
          ) : (
            messages.map((message, index) => (
              <div key={index} className={`mb-3 ${message.type === 'user' ? 'text-right' : 'text-left'}`}>
                <div className={`inline-block p-3 rounded-lg max-w-xs ${
                  message.type === 'user' 
                    ? 'bg-blue-500 text-white' 
                    : theme === 'dark' 
                      ? 'bg-gray-700 text-white border border-gray-600' 
                      : 'bg-white text-gray-800 border'
                }`}>
                  <p className="text-sm">{message.content}</p>
                  <p className="text-xs opacity-75 mt-1">
                    {message.timestamp.toLocaleTimeString()}
                  </p>
                </div>
              </div>
            ))
          )}
          <div ref={messageEndRef} />
        </div>
      </div>

      {/* Usage Tips */}
      <div className={`rounded-lg p-4 ${
        theme === 'dark' ? 'bg-gray-800' : 'bg-gray-100'
      }`}>
        <h4 className="text-sm font-medium mb-2">💡 Tips for best results:</h4>
        <ul className="text-sm space-y-1 opacity-75">
          <li>• Speak clearly and at a normal pace</li>
          <li>• Use the microphone in a quiet environment</li>
          <li>• Allow microphone permissions when prompted</li>
          <li>• Try different voices to find your preference</li>
          <li>• Use text input if voice recognition isn't working</li>
        </ul>
      </div>
    </div>
  );
};

export default AdvancedConversationalAgent;
