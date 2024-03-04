import jwt from "jsonwebtoken"
import { User } from "../models/User.model";

const veriftjwt=async(req, res, next)=>{
    try {
        const token = req.cookies?.accessToken || 
        req.header("Authorizaton")?.replace("Bearer ", "");
        if(!token){
            throw new Error();
        }
        const decodedToken= jwt.verify(token,process.env.ACCESS_TOKEN_SECRET);
        const user = await User.findById(decodedToken?._id).select("-password -refreshToken")
        if(!user){
            throw new Error();
        }
        req.user=user;
        next();

    } catch (error) {
        res.status(false).json({msg:"Invalid Token"});
    }
}