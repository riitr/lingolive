import React, { useEffect, useRef, useState } from "react";
import { io } from "socket.io-client";
import { getAuth, onAuthStateChanged, User } from "firebase/auth";
import firebaseApp from "../../firebaseConfig";

const SIGNALING_SERVER_URL = import.meta.env.VITE_SIGNALING_SERVER_URL;
const auth = getAuth(firebaseApp);

const WebRTC: React.FC = () => {
    const localVideoRef = useRef<HTMLVideoElement>(null);
    const remoteVideoRef = useRef<HTMLVideoElement>(null);
    const peerConnectionRef = useRef<RTCPeerConnection | null>(null);
    const socketRef = useRef<any>(null);
    const [user, setUser] = useState<User | null>(null);
    const [meetingId, setMeetingId] = useState<string>("");
    const [isCallActive, setIsCallActive] = useState(false);
    const [statusMessage, setStatusMessage] = useState<string>("");
    const [recipientSocketId, setRecipientSocketId] = useState<string | null>(null);
    const pendingCandidates = useRef<RTCIceCandidateInit[]>([]); // Store ICE candidates temporarily



    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
            setUser(currentUser);
        });
        return () => unsubscribe();
    }, []);

    useEffect(() => {
        if (!socketRef.current) {
            const newSocket = io(SIGNALING_SERVER_URL, { transports: ["websocket"] });
            socketRef.current = newSocket;

            newSocket.on("connect", () => {
                setStatusMessage("Connected to signaling server.");
            });

            newSocket.on("user-joined", (data: { userId: string; socketId: string }) => {
                console.log(`👤 User ${data.userId} (Socket: ${data.socketId}) joined.`);
                
                if (data.socketId !== socketRef.current.id) {
                  console.log(`✅ Setting recipient ID to ${data.socketId}`);
                  setRecipientSocketId(data.socketId);  // Store recipient’s socket ID
                }
              });

            newSocket.on("signal", async (data: any) => {
                console.log("🔽 Received Signal: ", data);
              
                if (!peerConnectionRef.current) return;
              
                if (data.sdp) {
                  console.log("✅ Remote SDP Set: ", data.sdp);
                  await peerConnectionRef.current.setRemoteDescription(new RTCSessionDescription(data.sdp));
              
                  // Process pending ICE candidates
                  pendingCandidates.current.forEach(async (candidate) => {
                    try {
                      await peerConnectionRef.current?.addIceCandidate(new RTCIceCandidate(candidate));
                      console.log("✅ Buffered ICE Candidate added:", candidate);
                    } catch (err) {
                      console.error("⚠️ Error adding buffered ICE candidate:", err);
                    }
                  });
                  pendingCandidates.current = []; // Clear the buffer
              
                  if (data.sdp.type === "offer") {
                    const answer = await peerConnectionRef.current.createAnswer();
                    await peerConnectionRef.current.setLocalDescription(answer);
                    socketRef.current.emit("signal", { sdp: answer, to: data.from, from: socketRef.current.id });
                  }
                } 
                else if (data.candidate) {
                  if (!peerConnectionRef.current.remoteDescription) {
                    console.warn("⚠️ ICE Candidate received before SDP. Storing...");
                    pendingCandidates.current.push(data.candidate); // Store ICE candidate
                  } else {
                    try {
                      await peerConnectionRef.current.addIceCandidate(new RTCIceCandidate(data.candidate));
                      console.log("✅ ICE Candidate added:", data.candidate);
                    } catch (err) {
                      console.error("⚠️ Error adding ICE candidate:", err);
                    }
                  }
                }
              });

        }
        return () => {
            if (socketRef.current) {
                socketRef.current.disconnect();
                socketRef.current = null;
            }
        };
    }, []);

    const startNewMeeting = () => {
        const newMeetingId = Math.random().toString(36).substring(2, 10);
        setMeetingId(newMeetingId);
        navigator.clipboard.writeText(newMeetingId);
        alert(`New Meeting ID: ${newMeetingId} copied to clipboard!`);
        if (socketRef.current) {
            socketRef.current.emit("join", { userId: user?.uid, meetingId: newMeetingId });
        }
    };

    const joinMeeting = () => {
        const enteredMeetingId = prompt("Enter Meeting ID to join:");
        if (enteredMeetingId) {
            setMeetingId(enteredMeetingId);
            if (socketRef.current) {
                socketRef.current.emit("join", { userId: user?.uid, meetingId: enteredMeetingId });
            }
        }
    };

    const startCall = async () => {
        if (!recipientSocketId) {
            alert("Waiting for another participant to join...");
            return;
        }
        
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });

            // ✅ Set Local Video Stream
            if (localVideoRef.current) {
                localVideoRef.current.srcObject = stream;
            }

            // ✅ Create RTCPeerConnection
            peerConnectionRef.current = new RTCPeerConnection({
                iceServers: [{ urls: "stun:stun.l.google.com:19302" }],
            });

            // ✅ Add Tracks from Local Stream
            stream.getTracks().forEach((track) => peerConnectionRef.current!.addTrack(track, stream));

            // ✅ Handle Remote Stream (Fix: Ensure track is received)
            peerConnectionRef.current.ontrack = (event) => {
                console.log("Received track event", event.streams);
                if (remoteVideoRef.current) {
                    remoteVideoRef.current.srcObject = event.streams[0];
                }
            };


            // ✅ Handle ICE Candidates
            peerConnectionRef.current.onicecandidate = (event) => {
                if (event.candidate && socketRef.current) {
                    console.log("Sending ICE Candidate: ", event.candidate);
                    socketRef.current.emit("signal", { candidate: event.candidate, to: recipientSocketId, from: socketRef.current.id });
                }
            };

            peerConnectionRef.current.oniceconnectionstatechange = () => {
                console.log("ICE Connection State:", peerConnectionRef.current?.iceConnectionState);
            };


            // ✅ Send Offer to Remote Peer
            const offer = await peerConnectionRef.current.createOffer();
            await peerConnectionRef.current.setLocalDescription(offer);
            socketRef.current?.emit("signal", { sdp: offer, to: recipientSocketId, from: socketRef.current.id });

            setIsCallActive(true);
        } catch (error) {
            alert("Error accessing camera/microphone.");
        }
    };

    return (
        <div className="flex flex-col items-center p-5 bg-gray-100 min-h-screen">
            <h1 className="text-2xl font-bold mb-4">LingoLive Video Chat</h1>
            <div className="mt-4 flex space-x-4">
                <button onClick={startNewMeeting} className="px-4 py-2 bg-green-500 text-white rounded-lg">Start New Meeting</button>
                <button onClick={joinMeeting} className="px-4 py-2 bg-yellow-500 text-white rounded-lg">Join Meeting</button>
                <button onClick={startCall} className="px-4 py-2 bg-blue-500 text-white rounded-lg">Start Call</button>
            </div>
            <div className="mt-4 flex space-x-4">
                <video ref={localVideoRef} autoPlay playsInline muted className="w-1/2 h-auto border rounded-lg" />
                <video ref={remoteVideoRef} autoPlay playsInline className="w-1/2 h-auto border rounded-lg" />
            </div>
            {statusMessage && <div className="mt-4 p-2 bg-gray-200 rounded-md text-sm">{statusMessage}</div>}
        </div>
    );
};

export default WebRTC;
