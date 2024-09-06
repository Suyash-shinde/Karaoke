import { Rooms } from "../models/Rooms.model.js";
import otpGenerator from "otp-generator"
export const addRoom = async(req,res,next)=>{
    try {
        const {title,type,user} = req.body;
        if (!title || !type) {
            return res
                .json({
                     msg: 'All fields are required!',
                     status:false,
                    });
        }
        var code;
        while(true){
            code=await otpGenerator.generate(6,{
                upperCaseAlphabets:false,
                lowerCaseAlphabets:false,
                specialChars:false,
            });
            const findCode=await Rooms.findOne({code});
            if(!findCode){
                break;
            }
        }
        const newRoom = await Rooms.create({
            title,
            owner:user.id,
            type,
            code,
        })
        if(!newRoom){
            return res.json({msg:"Error creating a room", status:false});
        }
        return res.json({
            msg:"New Room Created",
            status:true,
            room:newRoom,
        });
    } catch (error) {
        next(error);
    }
}
export const getAllRooms=async(req,res,next)=>{
    try {
        const rooms= await Rooms.find({type:{$in:['open']}}).populate('owner').exec();
    if(!rooms){
        return res.json({msg:"Error in fetching data", status:false});
    }
    return res.json({
        msg:"Fetched Data sucessfully",
        status:true,
        rooms,
    })
    } catch (error) {
        next(error);
    }
}

export const fetchData=async(req,res,next)=>{
    try {
        const room = await Rooms.findById(req.params.roomId);
        const send_room={
            id:room._id,
            title:room.title,
            type:room.type,
            owner:room.owner,

        }
        return res.json(send_room);
    } catch (error) {
        next(error);
    }
}

export const joinRoom = async(req,res,next)=>{
    const {code} = req.body;
    if(!code){
        return res.json({
            msg:"Enter Code",
            status:false,
        })
    }
    const findRoom = await Rooms.findOne({code});
    if(!findRoom){
        return res.json({
            msg:"No active rooms with this code",
            status:false,
        })
    }
    return res.json({
        msg:"Room found successfully",
        status:true,
        room:findRoom,
    })
}