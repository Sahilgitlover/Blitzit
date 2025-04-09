import { Socket } from "socket.io";
import { redis, subscriber } from "../redis/redis.js";
import { ROOM } from "../database/ROOM.js";
/**
 * Description
 *
 * @function
 * @name connectMainTerminal
 * @kind variable
 * @param {Socket} skt
 * @returns {void}
 * @exports
 */
export const connectTerminals = (skt) => {
    skt.on("ConnectTerminals", async ({ roomId }, callback) => {
        try {
            if (!roomId) return;
            const room = await ROOM.findById(roomId);
            const {
                MainTerminalId,
                GetFileTreeTerminalId,
                DeleteEntityTerminalId,
                SaveFileTerminalId,
                ReadFileTerminalId,
                CreateEntityTerminalId,
                RenameEntityTerminalId,
                title,
                createdAt,
            } = room;

            const arr = [
                {
                    TERMINAL_ID: MainTerminalId,
                    INPUT_ENDPOINT: "RUN_MAIN_TERMINAL_COMMAND",
                    OUTPUT_ENDPOINT: "MAIN_TERMINAL_OUTPUT",
                },
                {
                    TERMINAL_ID: GetFileTreeTerminalId,
                    INPUT_ENDPOINT: "GET_FILE_TREE",
                    OUTPUT_ENDPOINT: "FILE_TREE_DATA",
                },
                {
                    TERMINAL_ID: DeleteEntityTerminalId,
                    INPUT_ENDPOINT: "DELETE_ENTITY",
                    OUTPUT_ENDPOINT: "ENTITY_DELETION_COMPLETE",
                },
                {
                    TERMINAL_ID: SaveFileTerminalId,
                    INPUT_ENDPOINT: "SAVE_FILE",
                    OUTPUT_ENDPOINT: "FILE_SAVE_COMPLETE",
                },
                {
                    TERMINAL_ID: ReadFileTerminalId,
                    INPUT_ENDPOINT: "READ_FILE",
                    OUTPUT_ENDPOINT: "FILE_READ_COMPLETE",
                },
                {
                    TERMINAL_ID: CreateEntityTerminalId,
                    INPUT_ENDPOINT: "CREATE_ENTITY",
                    OUTPUT_ENDPOINT: "ENTITY_CREATION_COMPLETE",
                },
                {
                    TERMINAL_ID: RenameEntityTerminalId,
                    INPUT_ENDPOINT: "RENAME_ENTITY",
                    OUTPUT_ENDPOINT: "ENTITY_RENAME_COMPLETE",
                },
            ];

            arr.forEach(
                async ({ TERMINAL_ID, INPUT_ENDPOINT, OUTPUT_ENDPOINT }) => {
                    // console.log({
                    //     INPUT_ENDPOINT: `${INPUT_ENDPOINT}:${TERMINAL_ID}`,
                    // });
                    skt.on(INPUT_ENDPOINT, (i) => {
                        console.log({
                            INPUT_ENDPOINT: `${INPUT_ENDPOINT}:${TERMINAL_ID}`,
                            i,
                        });

                        redis.PUBLISH(
                            `${INPUT_ENDPOINT}:${TERMINAL_ID}`,
                            i || ""
                        );
                    });
                    await subscriber.SUBSCRIBE(
                        `${OUTPUT_ENDPOINT}:${TERMINAL_ID}`,
                        (o) => skt.emit(OUTPUT_ENDPOINT, o)
                    );
                }
            );

            callback({ title, createdAt });
        } catch ({ message }) {
            console.error({ message });
        }
    });
};
