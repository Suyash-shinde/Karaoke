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

otpSchema.pre("save", async function(next){
    console.log("New document saved to the database");
    if (this.isNew) {
        await sendVerificationEmail(this.email, this.otp);
    }
    next();
});

export const Otp =mongoose.model("Otp", otpSchema);