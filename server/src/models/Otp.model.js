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
        type:Number,
        required:true,
    },
    createdAt:{
        type:Date,
        default:Date.now,
        expires:60*5,
    },  
});


export const Otp =mongoose.model("Otp", otpSchema);