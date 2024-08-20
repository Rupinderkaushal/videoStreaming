import React, { createContext, useState, useRef, useEffect } from 'react';
import { io } from 'socket.io-client';

const SocketContext = createContext();

const SocketProvider = ({ children }) => {
    const [socket] = useState(() => io('http://localhost:8080')); // Adjust the URL as needed
    const [stream, setStream] = useState(null);
    const [peers, setPeers] = useState([]);
    const myVideo = useRef();
    const videoRefs = useRef({});

    useEffect(() => {
        socket.on('me', (id) => console.log('My socket ID:', id));

        socket.on('userJoined', (id) => {
            console.log('New user joined:', id);
            // Handle new user joining, e.g., by initiating a WebRTC connection
        });

        socket.on('receiveStream', ({ streamData, from }) => {
            if (!videoRefs.current[from]) {
                videoRefs.current[from] = React.createRef();
            }
            videoRefs.current[from].current.srcObject = streamData;
        });

        return () => {
            socket.disconnect();
        };
    }, [socket]);

    return (
        <SocketContext.Provider value={{ socket, stream, setStream, myVideo, peers, videoRefs }}>
            {children}
        </SocketContext.Provider>
    );
};

export { SocketContext, SocketProvider };
