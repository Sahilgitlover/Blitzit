import { Terminal } from '../Components/Terminal';
import { FileTree } from '../Components/FileTree';
import { Editor } from '../Components/Editor';
import { FileTreeNavbar } from '../Components/FileTreeNavbar';
import { OpenFilesProvider } from '../Providers/OpenFilesProvider';
import { RoomProvider } from '../Providers/RoomProvider';
import { useResizable } from 'react-resizable-layout';

export const Room = () => {
    return (
        <OpenFilesProvider>
            <RoomProvider>
                <Component />
            </RoomProvider>
        </OpenFilesProvider>
    );
};

function XYZ() {
    const { position, separatorProps } = useResizable({
        axis: 'y',
        initial: 400,
    });

    return (
        <div
            style={{
                display: 'flex',
                flexDirection: 'column',
                height: '100vh',
                width: '100%',
            }}
        >
            <div
                style={{
                    height: position,
                    width: '100%',
                }}
            >
                <Editor />
            </div>
            <div
                {...separatorProps}
                style={{
                    height: '5px',
                    cursor: 'col-resize',
                    backgroundColor: 'white',
                }}
            />
            <div
                style={{
                    height: `calc(100vh - ${position}px)`,
                    width: '100%',
                }}
            >
                <Terminal />
            </div>
        </div>
    );
}

export default function Component() {
    const { position, separatorProps } = useResizable({
        axis: 'x',
        initial: 250,
        min: 50,
    });

    const sideBarWidth = '70px';

    return (
        <div style={{ display: 'flex', height: '100vh', width: '100vw' }}>
            <div style={{ width: sideBarWidth, borderRight: 'solid white 1px' }}>
                <FileTreeNavbar />
            </div>
            <div
                style={{
                    width: position, // 10
                    padding: '10px',
                }}
            >
                <FileTree />
            </div>
            <div
                {...separatorProps}
                style={{
                    width: '5px',
                    cursor: 'col-resize',
                    backgroundColor: 'white',
                }}
            />
            <div
                id="YE WALA"
                style={{
                    width: `calc(100vw -${sideBarWidth} - ${position}px)`,
                    flex: 1,
                }}
            >
                <XYZ />
            </div>
        </div>
    );
}
