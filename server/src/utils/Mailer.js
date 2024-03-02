import nodemailer from "nodemailer";

const sendMailer=async(email,otp)=>{
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
        subject: "Otp verification via Nodemailer", 
        text: "Hello world?",
        html:`<b>Your Verification code is: ${otp}</b>`,
    
    }  
    sendMail(transporter,mailOptions);
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

export default sendMailer;