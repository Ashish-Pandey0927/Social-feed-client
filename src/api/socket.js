import { io } from "socket.io-client";

const socket = io(import.meta.env.VITE_SERVER_URL || "https://social-feed-server-xw5r.onrender.com", {
  transports: ["websocket"],
});


export default socket;
