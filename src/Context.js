// import { createContext, useState, useRef, useEffect } from 'react';
// import { io } from 'socket.io-client';
// import Peer from 'simple-peer';

// const SocketContext = createContext();
// const socket = io('http://localhost:8080');
// const ContextProvider = ({ children }) => {
//     const [callAccepted, setCallAccepted] = useState(false);
//     const [callEnded, setCallEnded] = useState(false);
//     const [stream, setStream] = useState();
//     const [name, setName] = useState('');
//     const [call, setCall] = useState({});
//     const [me, setMe] = useState('');
//     const myVideo = useRef();
//     const userVideo = useRef();
//     const connectionRef = useRef();

//     useEffect(() => {
//         navigator.mediaDevices.getUserMedia({ video: true, audio: true })
//         .then((currentStream) => {
//             setStream(currentStream);
//             myVideo.current.srcObject = currentStream;
//         });

//         socket.on('me', (id) => setMe(id));
//         socket.on('callUser', ({ from, name: callerName, signal }) => {
//             setCall({ isReceivingCall: true, from, name: callerName, signal });
//         });
//     }, []);

//     const answerCall = () => {
//         setCallAccepted(true);
//         const peer = new Peer({ initiator: false, trickle: false, stream });
//         peer.on('signal', (data) => {
//             socket.emit('answerCall', { signal: data, to: call.from });
//         });
//         peer.on('stream', (currentStream) => {
//             userVideo.current.srcObject = currentStream;
//         });
//         peer.signal(call.signal);
//         connectionRef.current = peer;
//     };

//     const callUser = (id) => {
//         const peer = new Peer({ initiator: true, trickle: false, stream });
//         peer.on('signal', (data) => {
//                 socket.emit('callUser', { userToCall: id, signalData: data, from: me, name });
//         });
//         peer.on('stream', (currentStream) => {
//             userVideo.current.srcObject = currentStream;
//         });
//         socket.on('callAccepted', (signal) => {
//             setCallAccepted(true);
//             peer.signal(signal);
//         });
//         connectionRef.current = peer;
//     };

//     const leaveCall = () => {
//         setCallEnded(true);
//         connectionRef.current.destroy();
//         window.location.reload();
//     };

//     return (
//         <SocketContext.Provider value={{
//             call,
//             callAccepted,
//             myVideo,
//             userVideo,
//             stream,
//             name,
//             setName,
//             callEnded,
//             me,
//             callUser,
//             leaveCall,
//             answerCall,
//         }}
//         >
//             {children}
//         </SocketContext.Provider>
//     );
// };
// export { ContextProvider, SocketContext };

//
import { createContext, useState, useRef, useEffect, React } from "react";
import { io } from "socket.io-client";
import Peer from "simple-peer";

const SocketContext = createContext();
const socket = io("http://localhost:8080");

const ContextProvider = ({ children }) => {
  const [callAccepted, setCallAccepted] = useState(false);
  const [callEnded, setCallEnded] = useState(false);
  const [stream, setStream] = useState();
  const [name, setName] = useState("");
  const [call, setCall] = useState({});
  const [me, setMe] = useState("");
  const [peers, setPeers] = useState([]);
  const [roomId, setRoomId] = useState("");
  const myVideo = useRef();
  const videoRefs = useRef({}); // To store multiple video references for group members
  const connectionRefs = useRef([]); // To store multiple peer connections

  useEffect(() => {
    navigator.mediaDevices
      .getUserMedia({ video: true, audio: true })
      .then((currentStream) => {
        setStream(currentStream);
        myVideo.current.srcObject = currentStream;
        socket.emit("sendStream", { streamData: currentStream, roomId });
      })
      .catch((e) => console.error(e))
      .finally(() => console.log("devices function completed"));

    socket.on("me", (id) => setMe(id));
    // socket.on("userJoined", (userId) => handleUserJoined(userId));

    socket.on("callUser", ({ from, name: callerName, signal }) => {
      setCall({ isReceivingCall: true, from, name: callerName, signal });
    });
    socket.on("receiveStream", ({ streamData, from }) => {
      handleReceiveStream(streamData, from);
    });
  }, []);

  useEffect(() => {
    if (roomId) {
        console.log("Current roomId:", roomId);

        socket.emit("joinRoom", roomId);

        socket.on("userJoined", (userId) => {
            console.log("User joined room:", roomId, "User ID:", userId);
            handleUserJoined(userId);
        });

        return () => {
            console.log("Cleaning up socket listener for userJoined");
            socket.off("userJoined");
        };
    }
}, [roomId]);


  const handleUserJoined = (userId) => {
    // When a new user joins, create a new peer connection
    console.log("new--user--joined--context");
    const peer = createPeer(userId, socket.id);
    connectionRefs.current.push({ userId, peer });
  };

  const createPeer = (userToSignal, callerID) => {
    const peer = new Peer({ initiator: true, trickle: false, stream });

    peer.on("signal", (signal) => {
      socket.emit("callUser", {
        userToCall: userToSignal,
        signalData: signal,
        from: callerID,
        name,
      });
    });

    peer.on("stream", (currentStream) => {
      addVideoStream(currentStream, userToSignal);
    });

    return peer;
  };

  const addVideoStream = (stream, userId) => {
    if (!videoRefs.current[userId]) {
      videoRefs.current[userId] = document.createElement("video");
      videoRefs.current[userId].srcObject = stream;
      videoRefs.current[userId].playsInline = true;
      videoRefs.current[userId].autoPlay = true;
    }
    setPeers((prevPeers) => [...prevPeers, { id: userId, stream }]);
  };

  const handleReceiveStream = (streamData, from) => {
    const peer = new Peer({ initiator: false, trickle: false });
    peer.signal(streamData);

    peer.on("stream", (currentStream) => {
      addVideoStream(currentStream, from);
    });

    connectionRefs.current.push({ userId: from, peer });
  };

  const answerCall = () => {
    setCallAccepted(true);
    const peer = new Peer({ initiator: false, trickle: false, stream });
    peer.on("signal", (data) => {
      socket.emit("answerCall", { signal: data, to: call.from });
    });
    peer.on("stream", (currentStream) => {
      addVideoStream(currentStream, call.from);
    });
    peer.signal(call.signal);
    connectionRefs.current.push({ userId: call.from, peer });
  };

  const callUser = (id) => {
    const peer = createPeer(id, me);
    console.log("peers----", peer);
    connectionRefs.current.push({ userId: id, peer });

    socket.on("callAccepted", (signal) => {
      setCallAccepted(true);
      peer.signal(signal);
    });
  };

  const leaveCall = () => {
    setCallEnded(true);
    connectionRefs.current.forEach(({ peer }) => peer.destroy());
    connectionRefs.current = [];
    window.location.reload();
  };

  const addPeer = (peer, stream) => {
    const newPeer = { id: peer.id, name: peer.name };
    setPeers((prevPeers) => [...prevPeers, newPeer]);
    videoRefs.current[peer.id] = React.createRef(); // Create ref for the new peer's video
  };

  return (
    <SocketContext.Provider
      value={{
        call,
        callAccepted,
        myVideo,
        videoRefs, // Provides references for all videos in the group
        stream,
        name,
        setName,
        callEnded,
        me,
        callUser,
        leaveCall,
        answerCall,
        peers, // Array of all connected peers and their streams
        addPeer,
        setStream,
        socket,
      }}
    >
      {children}
    </SocketContext.Provider>
  );
};

export { ContextProvider, SocketContext };
