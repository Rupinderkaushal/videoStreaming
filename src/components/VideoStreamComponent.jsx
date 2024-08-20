import React, { useRef, useEffect, useContext } from 'react';
import { SocketContext } from '../DummyContext';

const VideoStreamComponent = () => {
    const { stream, myVideo, socket, roomId, setStream } = useContext(SocketContext);

    useEffect(() => {
        navigator.mediaDevices.getUserMedia({ video: true, audio: true })
            .then((currentStream) => {
                setStream(currentStream);
                myVideo.current.srcObject = currentStream;

                // Emit stream data to the room
                socket.emit('sendStream', { streamData: currentStream, roomId });
            });

        // Optionally handle clean-up when component unmounts
        return () => {
            if (stream) {
                stream.getTracks().forEach(track => track.stop());
            }
        };
    }, [socket, roomId, setStream]);

    return (
        <div>
            <video ref={myVideo} autoPlay muted />
        </div>
    );
};

export default VideoStreamComponent;
