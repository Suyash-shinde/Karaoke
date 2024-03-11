import 'dotenv/config'
import express from "express"
import cors from 'cors';
import connectdb from './Db/index.js';
import authRoutes from "./routes/auth.js";
import cookieParser from "cookie-parser";

const app=express();
const port=process.env.PORT;
app.use(cookieParser());
app.use(cors());
app.use(express.json());
connectdb();
app.use("/", authRoutes);
app.listen(port,()=>{
    console.log(`App is listening on port: http://localhost:${port}`);
})