import { Socket } from "socket.io";
import { docker } from "../../main.js";

/**
 * Description
 *
 * @function
 * @name createMainTerminal
 * @kind variable
 * @param {Socket} skt
 * @returns {void}
 * @exports
 */

export const createMainTerminal = (skt) => {
    skt.on("createMainTerminal", async ({ containerId }) => {
        try {
            const container = docker.getContainer(containerId);
            const exec = await container.exec({
                AttachStdout: true,
                AttachStderr: true,
                AttachStdin: true,
                // Tty: true,
                Cmd: ["/bin/sh"],
            });

            skt.emit("createMainTerminal -o1", { execId: exec.id });
        } catch ({ message }) {
            console.error({ message });
        }
    });
};
