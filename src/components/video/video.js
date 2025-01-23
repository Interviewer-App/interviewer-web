'use client'
import React, { useState, useEffect, useRef } from 'react';
import Peer from 'peerjs';
import io from 'socket.io-client';
// import { Button, Card, Tabs } from 'antd';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import socket from '@/lib/utils/socket';
const VideoCall = ({ sessionId, role, userId }) => {
  const [localStream, setLocalStream] = useState(null);
  const [remoteStreams, setRemoteStreams] = useState({});
  const [answers, setAnswers] = useState({});
  const [questions, setQuestions] = useState([]);
  const localVideoRef = useRef();
  const peers = useRef({});
  // const socket = io(process.env.NEXT_PUBLIC_WS_URL);

  useEffect(() => {
    const initMedia = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true })
        if (localVideoRef.current) {
          localVideoRef.current.srcObject = stream
        }

        // Join video session
        socket.emit('joinVideoSession', {
          sessionId,
          userId: role.toLowerCase(),
          role
        })

        // WebRTC Handlers
        socket.on(role === 'CANDIDATE' ? 'existingParticipant' : 'newParticipant', handleNewParticipant)
        socket.on('signal', handleSignal)
        socket.on('participantLeft', handleParticipantLeft)

      } catch (error) {
        console.error('Error accessing media devices:', error)
      }
    }

    const handleNewParticipant = (data) => {
      const peer = new Peer({
        initiator: role === 'CANDIDATE',
        stream: localVideoRef.current?.srcObject
      })

      peer.on('signal', signal => {
        socket.emit('signal', {
          to: data.userId,
          sessionId,
          signal: JSON.stringify(signal)
        })
      })

      peer.on('stream', remoteStream => {
        setRemoteStreams(prev => ({
          ...prev,
          [data.userId]: remoteStream
        }))
      })

      peers.current[data.userId] = peer
    }

    const handleSignal = ({ from, signal }) => {
      if (peers.current[from]) {
        peers.current[from].signal(JSON.parse(signal))
      }
    }

    const handleParticipantLeft = (userId) => {
      if (peers.current[userId]) {
        peers.current[userId].destroy()
        delete peers.current[userId]
        setRemoteStreams(prev => {
          const newStreams = { ...prev }
          delete newStreams[userId]
          return newStreams
        })
      }
    }

    initMedia()

    return () => {
      Object.values(peers.current).forEach(peer => peer.destroy())
      if (localVideoRef.current?.srcObject) {
        (localVideoRef.current.srcObject).getTracks().forEach(track => track.stop())
      }
      socket.disconnect()
    }
  }, [sessionId, role])

  return (
<div className=" p-4">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-2xl font-bold mb-4">
          {role === 'CANDIDATE' ? 'Candidate' : 'Company'} Video Session
        </h1>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Local Video */}
          <div className="bg-black rounded-lg overflow-hidden">
            <video
              ref={localVideoRef}
              autoPlay
              muted
              className="w-full h-64 object-cover"
            />
          </div>

          {/* Remote Videos */}
          {Object.entries(remoteStreams).map(([userId, stream]) => (
            <div key={userId} className="bg-black rounded-lg overflow-hidden">
              <video
                autoPlay
                className="w-full h-64 object-cover"
                ref={ref => {
                  if (ref && stream) ref.srcObject = stream
                }}
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default VideoCall;