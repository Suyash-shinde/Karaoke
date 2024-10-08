import {mongoose , Schema} from "mongoose";


const roomSchema = new Schema({
    title:{
        type:String,
        required:true,
    },
    type:{
        type:String,
        required:true,
    },
    owner:{
        type: Schema.Types.ObjectId,
        ref:'User'
    },
    code:{
        type:Number,
        unique:true,
    }
},
{
    timestamps:true,
})

export const Rooms = mongoose.model('Rooms',roomSchema);