import otpGenerator from "otp-generator";
import {User} from '../models/User.model.js'
import { Otp } from '../models/Otp.model.js';
import sendMailer from "../utils/Mailer.js";
export const generate= async(req,res,next)=>{
    try{
        const otp= await otpGenerator.generate(6,{
            upperCaseAlphabets:false,
            lowerCaseAlphabets:false,
            specialChars:false,
        });
        const { email }=req.body;
        const result= await Otp.findOne({email});
        const result2= await User.findOne({email});
        if(result && result2){
            return res.json({msg:"User already exists", status:false});
        }
       sendMailer(email,otp);   
        const otpCreate= await Otp.create({
            email,
            otp,
        });
        if(!otpCreate){
            return res.json({msg:"Error in generating otp", status:false});
        }
        
        res.json({msg:"Mail sent sucessfully", email: email, status:true});
    }
    catch(error){
        next(error);
    }
}

export const verify = async (req,res,next)=>{
    try {
        const { response, email } = req.body;
        const getotp = await Otp.find({email});
        const {otp}=getotp[0];  
        if(response!=otp){
            return res.json({msg:"Invalid Otp", status:false});
        }
        const updated = await Otp.findOneAndUpdate({email},{otp:""});
        if(!updated){
            return res.json({msg:"Error updating the document", status:false});
        }
        return res.json({msg:"Account Createeed sucessfully", status:true});
    } catch (error) {
        next(error);
    }
}