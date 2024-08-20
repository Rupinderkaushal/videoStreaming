import React, { useState, useContext } from 'react';
import { SocketContext } from '../DummyContext';

const JoinRoomComponent = () => {
    const [roomId, setRoomId] = useState('');
    const { socket } = useContext(SocketContext);

    const joinRoom = () => {
        if (roomId) {
            socket.emit('createOrJoinRoom', roomId);
            // Optionally listen for confirmation or errors
            socket.on('roomCreated', (roomId) => {
                console.log('Room created and joined:', roomId);
            });
            socket.on('roomFull', (roomId) => {
                console.log('Room is full:', roomId);
            });
        }
    };

    return (
        <div>
            <input 
                type="text" 
                value={roomId} 
                onChange={(e) => setRoomId(e.target.value)} 
                placeholder="Enter Room ID"
            />
            <button onClick={joinRoom}>Join Room</button>
        </div>
    );
};

export default JoinRoomComponent;
