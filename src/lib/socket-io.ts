import { io, type Socket } from "socket.io-client";
import { env } from "~/env";
import { type AllEventMap } from "~/events";

export const socket: Socket<AllEventMap> = io(env.NEXT_PUBLIC_WS_URL);
