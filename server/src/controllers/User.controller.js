import bcrypt from "bcrypt";
import {User} from "../models/User.model.js"
import jwt from "jsonwebtoken"

const generateAccessAndRefereshTokens = async(userId) =>{
    try {
        const user = await User.findById(userId)
        const accessToken = user.generateAccessToken()
        const refreshToken = user.generateRefreshToken()

        user.refreshToken = refreshToken
        await user.save({ validateBeforeSave: false })

        return {accessToken, refreshToken}


    } catch (error) {
        throw new ApiError(500, "Something went wrong while generating referesh and access token")
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
export const refreshAccessToken=async (req,res,next)=>{
    const incomingRefreshToken=req.cookie.refreshToken ||  req.body.refreshToken;
    if(!incomingRefreshToken){
        return res.json({msg:"Unauthorized Request", status:false});
    }
    try{
        const decodedToken = jwt.verify(
            incomingRefreshToken,
            process.env.REFRESH_TOKEN_SECRET
            )
        const findUser=await User.findById(decodedToken?._id);
        if(!findUser){
            return res.json({msg:"Invalid Refresh Token", status:false})
        }

        if(incomingRefreshToken!==findUser.refreshToken){
            return res.json({msg:"Refresh token is expired or used", status:false})
        }
        const options = {
            httpOnly: true,
            secure: true
        }
        const {accessToken, newRefreshToken} = await generateAccessAndRefereshTokens(user._id);
        return res
        .cookie("accessToken",accessToken,options)
        .cookie("refreshToken",newRefreshToken,options)
        .json(
            {
                msg:"Access Token Refreshed",
                accessToken,
                refreshToken: newRefreshToken,
                status:false,
            }
        )

    }catch(error){
        next(error);
    }
}