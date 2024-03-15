import jwt from "jsonwebtoken"
import { User } from "../models/User.model.js";

export const verifyJwt=async(req, res, next)=>{
    try {
        const token = req.cookies?.accessToken || 
        req.header("Authorizaton")?.replace("Bearer ", "");
        if(!token){
            return res
            .status(401)
            .json({msg:"Unauthorised Request", status:false});
        }
        const decodedToken= jwt.verify(token,process.env.ACCESS_TOKEN_SECRET);
        const user = await User.findById(decodedToken?._id).select("-password -refreshToken")
        if(!user){
            return res
            .status(401)
            .json({msg:"Invalid Access Token", status:false});
        }
        req.user=user;
        next();

    } catch (error) {
        res.status(405).json({msg:"Invalid Token"});
    }
}