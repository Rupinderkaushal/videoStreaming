import React, { useContext, useEffect } from 'react';
import { SocketContext } from '../DummyContext';

const VideoDisplayComponent = () => {
    const { videoRefs, peers } = useContext(SocketContext);

    useEffect(() => {
        peers.forEach(peer => {
            const video = videoRefs.current[peer.id];
            if (video) {
                video.srcObject = peer.stream;
            }
        });
    }, [peers]);

    return (
        <div>
            {Object.keys(videoRefs.current).map((key) => (
                <video key={key} ref={videoRefs.current[key]} autoPlay />
            ))}
        </div>
    );
};

export default VideoDisplayComponent;
