import otpGenerator from "otp-generator";
import { Otp } from '../models/Otp.model';
import {MailerSend, EmailParams, Sender, Recipient } from "mailersend";
export const generate= async(req,res,next)=>{
    try{
        const otp=otpGenerator.generate(6,{
            upperCaseAlphabets:false,
            lowerCaseAlphabets:false,
            specialChars:false,
        });
        const { email }=req.body;
        const result=await Otp.findOne({email});
        if(result){
            return res.json({msg:"User already exists", status:false})
        }
        const mailerSend= new MailerSend({
            apiKey:123,
        })
        const sender=new Sender("","");
        const reciever= [new Recipient(email, "")];

        const emailParams=new EmailParams()
        .setFrom(sender)
        .setTo(reciever)
        .setSubject("Otp verification")
        .setHtml("<div> This is div element </div>")
        .setText("This is text")

        const send = await mailerSend.email.send(emailParams);


    }
    catch(error){
        next(error);
    }
}