import bcrypt from "bcrypt";
import {User} from "../models/User.model.js"
import jwt from "jsonwebtoken"

const generateAccessAndRefereshTokens = async(userId) =>{
    try {
        const user = await User.findById(userId)
        const accessToken = user.genereateAccessTokens()
        const refreshToken = user.genereateRefreshTokens()

        user.refreshToken = refreshToken
        await user.save({ validateBeforeSave: false })

        return {accessToken, refreshToken}


    } catch (error) {
        console.log(error);
        return error;
    }
}

export const register= async (req,res,next)=>{
    try {
        const {username,email,password} = req.body;
        const findUser = await User.findOne({username});
        if(findUser){
            return res.json({
                msg:"Username already exists, please choose another username",
                status:false
            });
        }
        const hashedPassword = bcrypt.hashSync(password,10);
        const newUser = await User.create({
            username,
            email,
            password:hashedPassword,
        })
        if(!newUser){
            return res.json({
                msg:"Error creating new user, please try again.",
                status:false
            })
        }
        delete newUser.password;

        return res.json({msg: "New User Created", status: true});

    } catch (error) {
        next(error);
    }
};

export const login=async(req,res,next)=>{
    try {
        const{username,password}=req.body;
        const findUser= await User.findOne({username});
        
        if(!findUser){
            return res.json({
                msg:"User not found",
                status:false,
            })
        }
        const checkPassword= bcrypt.compareSync(password,findUser.password);
        if(!checkPassword){
            return res.json({
                msg:"Invaid Username or password",
                status:false,
            })
        }
        const {accessToken,refreshToken}=generateAccessAndRefereshTokens(findUser._id);
        const options={
            httpOnly:true,
            secure:true,
        }
        delete findUser.password;
        const loggedInUser = await User.findById(findUser._id).select("-password -refreshToken")
        return res
        .cookie("accessToken",accessToken,options)
        .cookie("refreshToken", refreshToken, options)
        .json(
            {
                msg:"User Logged In",
                user: loggedInUser, accessToken, refreshToken,
                status:true,
            }
        )
    } catch (error) {
        next(error);
    }
};
export const logout=async(req,res,next)=>{
    const incomingAccessToken=req.cookies?.accessToken;
    const decodedToken= await jwt.verify(incomingAccessToken,process.env.ACCESS_TOKEN_SECRET);
    const user= await findById(decodedToken?._id).select("-password -refreshToken");
    if(!user){
        return res.json({
            msg:"Unauthorised request",
            status:false,
        })
    }
    user.refreshToken="";
    await user.save({ validateBeforeSave: false });
    
    return res
    .status(true)
    .clearCookie("accessToken")
    .clearCookie("refreshToken")
    .json({
        msg:"User Logged Out",
        status:true,
        user:req.user,
    })

}
