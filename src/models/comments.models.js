import mongoose,{Schema} from "mongoose";

const commentSchema=new Schema({
    Pins:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Pin"
    },
    user:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
    },
    text:{
        type:String,
        required:true
    }
},{timestamps:true})

export const comments=mongoose.model("comments",commentSchema)