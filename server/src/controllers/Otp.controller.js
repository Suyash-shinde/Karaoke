import otpGenerator from "otp-generator";
import {User} from '../models/User.model.js'
import { Otp } from '../models/Otp.model.js';
import nodemailer from "nodemailer";
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
        const transporter = nodemailer.createTransport({
            service:"gmail",
            host: "smtp.gmail.email",
            port: 587,
            secure: false, // Use `true` for port 465, `false` for all other ports
            auth: {
              user: process.env.SENDER_MAIL,
              pass: process.env.MAIL_PASS,
            },
          });
        const mailOptions={
            from:{
                name:'Karaless',
                address:process.env.SENDER_MAIL,
            },
            to:email,
            subject: "Otp verification via modemailer", 
            text: "Hello world?",
            html: "<b>Hello world?</b>",

        }  
        const sendMail= async(transporter,mailOptions)=>{
            try{
                await transporter.sendMail(mailOptions);
                console.log("Mail has been sent sucessfully");
            }
            catch(error){
                console.log(error);
            }
        }
        
        sendMail(transporter,mailOptions);
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
        const { ans, email } = req.body;
        const otp = await Otp.findOne({email});
        if(ans!==otp){
            return res.json({msg:"Invalid Otp", status:false});

        }
        return res.json({msg:"Account Createeed sucessfully", status:true});
    } catch (error) {
        next(error);
    }
}