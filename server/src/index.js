import 'dotenv/config'
import express from "express"
import cors from 'cors';
import connectdb from './Db/index.js';
import authRoutes from "./routes/auth.js";
import cookieParser from "cookie-parser";
import {Server} from 'socket.io';
import http from 'http';
import  {ACTIONS}  from './utils/ACTIONS.js';

const app=express();
const server=http.createServer(app);

const port=process.env.PORT;
app.use(cookieParser());
const io = new Server(server, {cors:{
    origin:'http://localhost:5173',
    methods:['GET','POST'],
    },
})
const corsOption = {
    credentials: true,
    origin:"http://localhost:5173",
};

app.use(cors(corsOption));
app.use(express.json());
connectdb();
app.use("/", authRoutes);

const socketUserMap={};
io.on('connection',(socket)=>{
    console.log('New Connection',socket.id);
    socket.on(ACTIONS.JOIN,({roomId,user})=>{
        socketUserMap[socket.id]=user;
        
        const clients= Array.from(io.sockets.adapter.rooms.get(roomId) || []);
        clients.forEach((clientId)=>{
            io.to(clientId).emit(ACTIONS.ADD_PEER,{});
        })
        socket.emit(ACTIONS.ADD_PEER,{});
        socket.join(roomId);

    })

})

server.listen(port,()=>{
    console.log(`App is listening on port: http://localhost:${port}`);
})