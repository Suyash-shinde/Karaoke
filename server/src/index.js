import "dotenv/config";
import express from "express";
import cors from "cors";
import connectdb from "./Db/index.js";
import authRoutes from "./routes/auth.js";
import cookieParser from "cookie-parser";
import { Server } from "socket.io";
import http from "http";
import { ACTIONS } from "./utils/ACTIONS.js";

const app = express();
const server = http.createServer(app);

const port = process.env.PORT;
app.use(cookieParser());
const io = new Server(server, {
    cors: {
        origin: "http://localhost:5173",
        methods: ["GET", "POST"],
    },
});
const corsOption = {
    credentials: true,
    origin: "http://localhost:5173",
};

app.use(cors(corsOption));
app.use(express.json());
connectdb();
app.use("/", authRoutes);

const socketUserMap = {};
const rooms = {};

io.on("connection", (socket) => {
    console.log("New connection", socket.id);
    socket.on(ACTIONS.JOIN, ({ roomId, user, isOwner }) => {
        socketUserMap[socket.id] = user;
        if (!rooms[roomId]) {
            rooms[roomId] = { owner: socket.id, clients: new Set() };
        }
        if (!isOwner) {
            rooms[roomId].clients.add(socket.id);
        } else {
            rooms[roomId].owner = socket.id;
        }

        const clients = Array.from(io.sockets.adapter.rooms.get(roomId) || []);
        clients.forEach((clientId) => {
            setTimeout(() => {
                console.log(clientId, "connects to", user);
                io.to(clientId).emit(ACTIONS.ADD_PEER, {
                    peerId: socket.id,
                    createOffer: false,
                    user,
                });
                socket.emit(ACTIONS.ADD_PEER, {
                    peerId: clientId,
                    createOffer: true,
                    user: socketUserMap[clientId],
                });
            }, 1000);
        });
        socket.join(roomId);
    });

    socket.on(ACTIONS.RELAY_ICE, ({ peerId, icecandidate }) => {
        io.to(peerId).emit(ACTIONS.ICE_CANDIDATE, {
            peerId: socket.id,
            icecandidate,
        });
    });

    socket.on(ACTIONS.RELAY_SDP, ({ peerId, sessionDescription }) => {
        io.to(peerId).emit(ACTIONS.SESSION_DESCRIPTION, {
            peerId: socket.id,
            sessionDescription,
        });
    });

    socket.on(ACTIONS.MUTE, ({ roomId, userId }) => {
        const clients = Array.from(io.sockets.adapter.rooms.get(roomId) || []);
        console.log("mute info");
        clients.forEach((clientId) => {
            io.to(clientId).emit(ACTIONS.MUTE, {
                peerId: socket.id,
                userId,
            });
        });
    });

    socket.on(ACTIONS.UNMUTE, ({ roomId, userId }) => {
        const clients = Array.from(io.sockets.adapter.rooms.get(roomId) || []);
        console.log("mute info");
        clients.forEach((clientId) => {
            io.to(clientId).emit(ACTIONS.UNMUTE, {
                peerId: socket.id,
                userId,
            });
        });
    });

    socket.on(ACTIONS.MUTE_INFO, ({ userId, roomId, isMute }) => {
        const clients = Array.from(io.sockets.adapter.rooms.get(roomId) || []);
        clients.forEach((clientId) => {
            if (clientId !== socket.id) {
                console.log("mute info");
                io.to(clientId).emit(ACTIONS.MUTE_INFO, {
                    userId,
                    isMute,
                });
            }
        });
    });

    const leaveRoom = () => {
        const { rooms: socketRooms } = socket;
        Array.from(socketRooms).forEach((roomId) => {
            const room = rooms[roomId];

            if (room) {
                // If the owner is leaving, notify all clients and delete the room
                if (room.owner === socket.id) {
                    io.to(roomId).emit(ACTIONS.FORCE_LEAVE);
                    Array.from(io.sockets.adapter.rooms.get(roomId) || []).forEach(
                        (clientId) => {
                            io.sockets.sockets.get(clientId)?.leave(roomId);
                        },
                    );

                    // Delete the room after owner leaves and clients are notified
                    delete rooms[roomId];
                } else {
                    // If a non-owner client is leaving, just remove them from the room
                    room.clients.delete(socket.id);

                    // Notify others in the room about the disconnection
                    const clients = Array.from(
                        io.sockets.adapter.rooms.get(roomId) || [],
                    );
                    clients.forEach((clientId) => {
                        io.to(clientId).emit(ACTIONS.REMOVE_PEER, {
                            peerId: socket.id,
                            userId: socketUserMap[socket.id]?.id,
                        });
                    });
                }
            }

            socket.leave(roomId);
        });

        // Clean up user data after leaving
        delete socketUserMap[socket.id];
    };

    socket.on(ACTIONS.LEAVE, leaveRoom);
    socket.on("disconnecting", leaveRoom);
});

server.listen(port, () => {
    console.log(`App is listening on port: http://localhost:${port}`);
});
