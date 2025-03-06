import React, { useEffect, useRef, useState } from "react";
import { io } from "socket.io-client";
import { getAuth, onAuthStateChanged, User } from "firebase/auth";
import firebaseApp from "../../firebaseConfig";

const SIGNALING_SERVER_URL = import.meta.env.VITE_SIGNALING_SERVER_URL; // Replace with your backend IP
const auth = getAuth(firebaseApp);

const WebRTC: React.FC = () => {
  const localVideoRef = useRef<HTMLVideoElement>(null);
  const remoteVideoRef = useRef<HTMLVideoElement>(null);
  const peerConnectionRef = useRef<RTCPeerConnection | null>(null);
  const [socket, setSocket] = useState<any>(null);
  const [user, setUser] = useState<User | null>(null);
  const [meetingId, setMeetingId] = useState<string>("");
  const [isMuted, setIsMuted] = useState(false);
  const [isCameraOn, setIsCameraOn] = useState(true);
  const [isCallActive, setIsCallActive] = useState(false);
  const [statusMessage, setStatusMessage] = useState<string>("");

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (currentUser) {
        setUser(currentUser);
      }
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (!user || !meetingId) return;

    const newSocket = io(SIGNALING_SERVER_URL);
    setSocket(newSocket);

    newSocket.on("connect", () => {
      newSocket.emit("join", { userId: user.uid, meetingId });
      setStatusMessage(`Connected to meeting: ${meetingId}`);
    });

    newSocket.on("user-joined", (data: any) => {
      setStatusMessage(`User ${data.userId} joined the meeting.`);
    });

    newSocket.on("signal", async (data: any) => {
      if (!peerConnectionRef.current) return;
      if (data.sdp) {
        await peerConnectionRef.current.setRemoteDescription(new RTCSessionDescription(data.sdp));
        if (data.sdp.type === "offer") {
          const answer = await peerConnectionRef.current.createAnswer();
          await peerConnectionRef.current.setLocalDescription(answer);
          newSocket.emit("signal", { sdp: answer, to: data.from, from: user.uid });
        }
      } else if (data.candidate) {
        await peerConnectionRef.current.addIceCandidate(new RTCIceCandidate(data.candidate));
      }
    });

    return () => {
      newSocket.disconnect();
    };
  }, [user, meetingId]);

  const startNewMeeting = () => {
    const newMeetingId = Math.random().toString(36).substring(2, 10);
    setMeetingId(newMeetingId);
    alert(`New Meeting ID: ${newMeetingId}\nShare this ID to invite others.`);
  };

  const startCall = async () => {
    if (!user) {
      alert("You must be logged in to start a call.");
      return;
    }

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });

      if (localVideoRef.current) {
        localVideoRef.current.srcObject = stream;
        localVideoRef.current.play();
      }

      peerConnectionRef.current = new RTCPeerConnection({
        iceServers: [{ urls: "stun:stun.l.google.com:19302" }]
      });

      peerConnectionRef.current.onicecandidate = (event) => {
        if (event.candidate) {
          socket.emit("signal", { candidate: event.candidate, to: meetingId, from: user.uid });
        }
      };

      peerConnectionRef.current.ontrack = (event) => {
        if (remoteVideoRef.current) {
          remoteVideoRef.current.srcObject = event.streams[0];
        }
      };

      stream.getTracks().forEach((track) => peerConnectionRef.current!.addTrack(track, stream));

      const offer = await peerConnectionRef.current.createOffer();
      await peerConnectionRef.current.setLocalDescription(offer);
      socket.emit("signal", { sdp: offer, to: meetingId, from: user.uid });

      setIsCallActive(true);
      setStatusMessage("Call started. Waiting for participant...");
    } catch (error) {
      alert("Error accessing camera/microphone. Please check your browser settings.");
    }
  };

  const endCall = () => {
    if (peerConnectionRef.current) {
      peerConnectionRef.current.close();
      peerConnectionRef.current = null;
    }
    setIsCallActive(false);
    setStatusMessage("Call ended.");
  };

  const toggleMute = () => {
    if (localVideoRef.current) {
      const audioTracks = (localVideoRef.current.srcObject as MediaStream)?.getAudioTracks();
      if (audioTracks.length > 0) {
        audioTracks[0].enabled = !audioTracks[0].enabled;
        setIsMuted(!isMuted);
      }
    }
  };

  const toggleCamera = () => {
    if (localVideoRef.current) {
      const videoTracks = (localVideoRef.current.srcObject as MediaStream)?.getVideoTracks();
      if (videoTracks.length > 0) {
        videoTracks[0].enabled = !videoTracks[0].enabled;
        setIsCameraOn(videoTracks[0].enabled);
      }
    }
  };

  return (
    <div className="flex flex-col items-center p-5 bg-gray-100 min-h-screen">
      <h1 className="text-2xl font-bold mb-4">LingoLive Video Chat</h1>

      {user && (
        <div className="mb-4 flex items-center space-x-3">
          <img src={user.photoURL || ""} alt="User Avatar" className="w-12 h-12 rounded-full" />
          <span className="text-lg font-semibold">{user.displayName}</span>
        </div>
      )}

      <div className="flex justify-center space-x-4">
        <video ref={localVideoRef} autoPlay playsInline muted className="w-1/2 h-auto border rounded-lg" />
        <video ref={remoteVideoRef} autoPlay playsInline className="w-1/2 h-auto border rounded-lg" />
      </div>

      <div className="mt-4">
        <button className="px-4 py-2 bg-green-500 text-white rounded-lg mr-2" onClick={startNewMeeting}>
          Start New Meeting
        </button>
      </div>

      <div className="mt-4 flex items-center space-x-3">
        <button className="px-4 py-2 bg-blue-500 text-white rounded-lg" onClick={startCall}>
          Join Meeting
        </button>
        <button className="px-4 py-2 bg-red-500 text-white rounded-lg" onClick={endCall}>
          End Call
        </button>
      </div>

      <div className="mt-4 flex space-x-4">
        <button className="px-4 py-2 bg-gray-500 text-white rounded-lg" onClick={toggleMute}>
          {isMuted ? "Unmute" : "Mute"}
        </button>
        <button className="px-4 py-2 bg-gray-500 text-white rounded-lg" onClick={toggleCamera}>
          {isCameraOn ? "Disable Camera" : "Enable Camera"}
        </button>
      </div>

      {statusMessage && (
        <div className="mt-4 p-2 bg-gray-200 rounded-md text-sm">
          {statusMessage}
        </div>
      )}
    </div>
  );
};

export default WebRTC;
