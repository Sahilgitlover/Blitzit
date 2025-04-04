import React, { useState, useEffect, useCallback } from 'react';
import { useRoom } from '../Providers/RoomProvider';
import { useSocket } from '../Providers/SocketProvider';
import {
    MdEdit,
    MdFileCopy,
    MdPlayArrow,
    MdSave,
    MdShare,
} from 'react-icons/md';
import { useOpenFiles } from '../Providers/OpenFilesProvider';

export const FileTreeNavbar = ({ setPosition }) => {
    const { room, roomId } = useRoom();
    const { setSaveFlag } = useOpenFiles();
    const { skt } = useSocket();

    const [commandToRun, setCommandToRun] = useState('python /app/script.py');

    const copyToClipboard = () => {
        if (!room) {
            console.error('Room details not available!');
            return;
        }
        const url = `${window.location.origin}/room/${roomId}`;
        navigator.clipboard
            .writeText(url)
            .then(() => {
                alert(`Url id copied, share it with other people`);
            })
            .catch((err) => console.error('Copy failed:', err));
    };

    const runCommand = () => {
        if (!skt) {
            console.error('Socket not available!');
            return;
        }
        skt.emit('connectMainTerminal -i1', {
            input: commandToRun + '\n',
            isDirectlyCalled: true,
        });
    };

    const editCommand = () => {
        const newCommand = window.prompt('Edit Command:', commandToRun);
        if (newCommand !== null) {
            setCommandToRun(newCommand);
        }
    };

    const openOrCloseFileTree = useCallback(() => {
        setPosition((prevPosition) => (prevPosition === 0 ? 250 : 0));
    }, [setPosition]);

    useEffect(() => {
        const handleKeyPress = (event) => {
            if (event.ctrlKey && event.key.toLowerCase() === 'b') {
                event.preventDefault();
                openOrCloseFileTree();
            }
        };

        window.addEventListener('keydown', handleKeyPress);
        return () => {
            window.removeEventListener('keydown', handleKeyPress);
        };
    }, [openOrCloseFileTree]);

    return (
        <div className="h-screen flex flex-col py-3 gap-5 items-center [&>*]:w-full [&>*]:cursor-pointer">
            <MdFileCopy size={25} onClick={openOrCloseFileTree} />
            <div className="flex flex-col items-center justify-center gap-4 py-2 bg-neutral-700">
                <MdPlayArrow
                    title="Run project"
                    onClick={runCommand}
                    size={30}
                />
                <MdEdit
                    title="Edit command to run"
                    onClick={editCommand}
                    size={30}
                />
            </div>
            <MdShare onClick={copyToClipboard} size={30} />
            <MdSave
                title="Save currently opened file"
                onClick={() => setSaveFlag((prev) => !prev)}
                size={30}
            />
        </div>
    );
};
