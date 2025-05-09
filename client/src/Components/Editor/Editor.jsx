import MonacoEditor from '@monaco-editor/react';
import { UseFiles } from '../../Providers/FilesProvider';
import { UseRoom } from '../../Providers/RoomProvider';
import { getYText, useYjsBinding } from './YjsBinding.js';
import { getLanguageFromFilePath } from '../../Utils/getLanguageFromFilePath';

export const Editor = ({ editorIndex }) => {
    const { pathToContent, setPathToContent, editors, markFileUnsaved } =
        UseFiles();
    const { roomId } = UseRoom();

    const { focusedPath } = editors[editorIndex];

    // Sync to Yjs
    const content = pathToContent[focusedPath];
    useYjsBinding(
        focusedPath,
        roomId,
        setPathToContent,
        content,
        markFileUnsaved
    );

    return (
        <div className="button h-full">
            <MonacoEditor
                theme="vs-dark"
                path={focusedPath}
                value={content}
                options={{
                    semanticHighlighting: true,
                    dragAndDrop: true,
                    minimap: true,
                    wordWrap: 'on',
                    fontSize: 20,
                    codeLens: true,
                    wordBasedSuggestions: true,
                    autoClosingQuotes: true,
                }}
                language={getLanguageFromFilePath(focusedPath)}
                onChange={(content) => {
                    setPathToContent((prev) => ({
                        ...prev,
                        [focusedPath]: content,
                    }));
                    markFileUnsaved();

                    const yText = getYText(focusedPath, roomId);
                    if (yText && content !== yText.toString()) {
                        // Prevent echo loop
                        yText.delete(0, yText.length);
                        yText.insert(0, content);
                    }
                }}
                loading={<>Loading {focusedPath}...</>}
            />
        </div>
    );
};
