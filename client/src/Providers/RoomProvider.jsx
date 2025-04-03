import { createContext, useContext, useEffect, useState } from 'react';
import { useSocket } from './SocketProvider';
import { useParams } from 'react-router-dom';

const context = createContext();

export const RoomProvider = ({ children }) => {
    const { roomId } = useParams();
    
    const { skt } = useSocket();

    const [terminalsConnected, setTerminalsConnected] = useState(false);
    const [room, setRoom] = useState(null); 

    function callForTree() {
        skt.emit('connectFileTreeTerminal -i1', { input: 'find /app -type d' });
        setTimeout(() => {
            skt.emit('connectFileTreeTerminal -i1', {
                input: 'find /app -type f',
            });
        }, 400);
    }

    useEffect(() => {
        if (terminalsConnected || !roomId) return;

        skt.emit('getRoomDetails', { roomId }, (roomData) => {
            if (!roomData) {
                console.error('Room details not received');
                return;
            }

            console.log('Room details:', roomData);

            setRoom(roomData); 

            skt.emit('connectEditorTerminal', {
                editorTerminalId: roomData.editorTerminalId,
            });
            skt.emit('connectMainTerminal', {
                mainTerminalId: roomData.mainTerminalId,
            });
            skt.emit('connectFileTreeTerminal', {
                fileTreeTerminalId: roomData.fileTreeTerminalId,
            });

            setTerminalsConnected(true);
        });
    }, [roomId, skt, terminalsConnected]);

    if (!terminalsConnected) return <>Getting all the terminal IDs....</>;

    return (
        <context.Provider
            value={{
                callForTree,
                roomId,
                room, 
            }}
        >
            {children}
        </context.Provider>
    );
};

export const useRoom = () => useContext(context);
