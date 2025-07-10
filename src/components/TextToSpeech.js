"use client";

import { useState, useEffect, useRef } from "react";

export default function TextToSpeech() {
  const [loading, setLoading] = useState(false);
  const [text, setText] = useState("");
  const [inputText, setInputText] = useState("");
  const [voices, setVoices] = useState([]);
  const [selectedVoice, setSelectedVoice] = useState("");
  const [isSpeaking, setIsSpeaking] = useState(false);
  const speechAnimationRef = useRef(null);

  useEffect(() => {
    const loadVoices = () => {
      const availableVoices = speechSynthesis.getVoices();
      setVoices(availableVoices);

      // Set default voice (prefer female voice)
      const defaultVoice =
        availableVoices.find(
          (voice) =>
            voice.name.toLowerCase().includes("female") ||
            voice.name.toLowerCase().includes("zira") ||
            voice.name.toLowerCase().includes("susan")
        ) || availableVoices[0];

      setSelectedVoice(defaultVoice?.name || "");
    };

    loadVoices();
    speechSynthesis.onvoiceschanged = loadVoices;
  }, []);

  useEffect(() => {
    // Reset text and speaking state when inputText changes
    if (inputText.trim()) {
      setText("");
      setIsSpeaking(false);
      setLoading(false);
      handleClick();
    } else {
      setText("");
      setIsSpeaking(false);
      setLoading(false);
    }
  }, [inputText]);

  const handleClick = async () => {
    if (!inputText.trim()) {
      alert("Please enter some text to convert to speech");
      return;
    }

    setLoading(true);
    setText("");

    try {
      // Use Web Speech API directly for text-to-speech
      const utterance = new SpeechSynthesisUtterance(inputText);
      utterance.rate = 1;
      utterance.pitch = 1;
      utterance.volume = 1;

      // Use selected voice
      const voice = voices.find((v) => v.name === selectedVoice);
      if (voice) {
        utterance.voice = voice;
      }

      // Add event listeners for speech events
      utterance.onstart = () => {
        setIsSpeaking(true);
        setLoading(false);
        // Start the animation
        if (
          speechAnimationRef.current &&
          speechAnimationRef.current.handlePlay
        ) {
          speechAnimationRef.current.handlePlay();
        }
      };

      utterance.onend = () => {
        setIsSpeaking(false);
        // Stop the animation
        if (
          speechAnimationRef.current &&
          speechAnimationRef.current.handleStop
        ) {
          speechAnimationRef.current.handleStop();
        }
      };

      utterance.onerror = () => {
        setIsSpeaking(false);
        setLoading(false);
        // Stop the animation on error
        if (
          speechAnimationRef.current &&
          speechAnimationRef.current.handleStop
        ) {
          speechAnimationRef.current.handleStop();
        }
      };

      speechSynthesis.speak(utterance);
      setText(inputText);
    } catch (error) {
      console.error("Error generating audio:", error);
      setLoading(false);
    }
  };

  const handleStop = () => {
    speechSynthesis.cancel();
    setIsSpeaking(false);
    setLoading(false);
    // Stop the animation
    if (speechAnimationRef.current && speechAnimationRef.current.handleStop) {
      speechAnimationRef.current.handleStop();
    }
  };

  return (
    <div>
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Enter text to convert to speech:
        </label>
        <textarea
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          placeholder="Type your text here..."
          className="w-full p-3 border border-gray-300 rounded-md text-black resize-vertical"
          rows={4}
        />
      </div>

      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Select Voice:
        </label>
        <select
          value={selectedVoice}
          onChange={(e) => setSelectedVoice(e.target.value)}
          className="w-full p-2 border border-gray-300 rounded-md text-black"
        >
          {voices.map((voice) => (
            <option key={voice.name} value={voice.name}>
              {voice.name} ({voice.lang}) - {voice.gender || "Unknown"}
            </option>
          ))}
        </select>
      </div>

      <div className="flex gap-4 mb-4">
        <button
          onClick={handleClick}
          disabled={loading || !inputText.trim() || isSpeaking}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:bg-gray-400"
        >
          {loading
            ? "Starting..."
            : isSpeaking
            ? "Speaking..."
            : "Convert to Speech"}
        </button>

        {isSpeaking && (
          <button
            onClick={handleStop}
            className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
          >
            Stop
          </button>
        )}
      </div>

      {/* Speech Animation */}
      {/* <div className="mb-4">
        <SpeechAnimation ref={speechAnimationRef} />
      </div> */}

      {/* {text && (
        <div className="mt-4 p-4 bg-gray-100 rounded">
          <h3 className="font-semibold text-black mb-2">Text being spoken:</h3>
          <p className="text-black">{text}</p>
        </div>
      )} */}
    </div>
  );
}

// "use client";

// import React, { useState } from "react";

// const TextToSpeech = ({ text }) => {
//   const [isGenerating, setIsGenerating] = useState(false);
//   const [isPlaying, setIsPlaying] = useState(false);
//   const [selectedVoice, setSelectedVoice] = useState("21m00Tcm4TlvDq8ikWAM");
//   const [audioElement, setAudioElement] = useState(null);
//   const [error, setError] = useState(null);

//   const voices = [
//     { id: "21m00Tcm4TlvDq8ikWAM", name: "Rachel" },
//     { id: "ErXwobaYiN019PkySvjV", name: "Domi" },
//     { id: "EXAVITQu4vr4xnSDxMaL", name: "Antoni" },
//     { id: "pNInz6obpgDQGcFmaJgB", name: "Adam" },
//     { id: "ThT5KcBeYPX3keUQqHPh", name: "Arnold" },
//     { id: "IKne3meq5aSn9XLyUdCD", name: "Charlie" },
//     { id: "TxGEqnHWrfWFTfGW9XjX", name: "Dorothy" },
//     { id: "CYw3kZ02Hs0563khs1Fj", name: "Josh" },
//   ];

//   const handleGenerateAudio = async () => {
//     if (!text.trim()) return;

//     setIsGenerating(true);
//     setError(null);

//     try {
//       const response = await fetch("/api/text-to-speech", {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify({ text, voice: selectedVoice }),
//       });

//       const data = await response.json();

//       if (!response.ok) {
//         throw new Error(data.error || "Failed to generate audio");
//       }

//       const audio = new Audio(`data:audio/mpeg;base64,${data.audio}`);
//       setAudioElement(audio);

//       audio.onended = () => {
//         setIsPlaying(false);
//       };
//       audio.play();
//       setIsPlaying(true);
//     } catch (err) {
//       console.error("Error generating audio:", err);
//       setError(err.message || "Failed to generate audio. Please try again.");
//       setIsGenerating(false);
//     } finally {
//       setIsGenerating(false);
//     }
//   };

//   const handlePlayPause = () => {
//     if (audioElement) {
//       if (isPlaying) {
//         audioElement.pause();
//       } else {
//         audioElement.play();
//       }
//       setIsPlaying(!isPlaying);
//     }
//   };

//   return (
//     <div className="text-to-speech-container">
//         <div className=" hidden">
//           <div>
//             <label className="block text-sm font-medium text-gray-700 mb-2">
//               Select Voice:
//             </label>
//             <select
//               value={selectedVoice}
//               onChange={(e) => setSelectedVoice(e.target.value)}
//               className="w-full p-2 border border-gray-300 rounded-md text-black mb-4"
//             >
//               {voices.map((voice) => (
//                 <option key={voice.id} value={voice.id}>
//                   {voice.name}
//                 </option>
//               ))}
//             </select>
//           </div>

//           {text && (
//             <div className="mb-4">
//               <label className="block text-sm font-medium text-gray-700 mb-2">
//                 Text to Convert:
//               </label>
//               <div className="w-full p-3 border border-gray-300 rounded-md bg-gray-50 text-black">
//                 {text}
//               </div>
//             </div>
//           )}

//           {error && (
//             <div className="mb-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded">
//               {error}
//             </div>
//           )}

//           <div className="flex gap-4 mb-4">
//             <button
//               onClick={handleGenerateAudio}
//               disabled={isGenerating || !text?.trim()}
//               className={`px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 ${
//                 isGenerating || !text?.trim() ? "opacity-50 cursor-not-allowed" : ""
//               }`}
//             >
//               {isGenerating ? "Generating..." : "Generate Audio"}
//             </button>

//             {audioElement && (
//               <button
//                 onClick={handlePlayPause}
//                 className={`px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 ${
//                   isPlaying ? "bg-red-500 hover:bg-red-600" : ""
//                 }`}
//               >
//                 {isPlaying ? "Pause" : "Play"}
//               </button>
//             )}
//           </div>
//         </div>
//     </div>
//   );
// };

// export default TextToSpeech;
