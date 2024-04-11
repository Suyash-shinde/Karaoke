import { Rooms } from "../models/Rooms.model.js";
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
        const newRoom = await Rooms.create({
            title,
            owner:user._id,
            type,
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