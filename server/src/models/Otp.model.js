import mongoose, { Schema } from "mongoose"

const otpSchema=new Schema({
    email:{
        type: String,
        unique: true,
        lowercase: true,
        required: true,
        trim: true,
        index: true,
    },
    otp:{
        type:String,
        trim: true,
        index: true,
    },
      
});


export const Otp =mongoose.model("Otp", otpSchema);