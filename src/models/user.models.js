import mongoose,{Schema} from "mongoose";

const userSchema=new Schema({
    username:{
        type:String,
        required:true,
        unique:true
    },
    fullname:{
        type:String,
        required:true,
    },
    email:{
        type:String,
        required:true,
        unique:true
    },
    password:{
        type:String,
        required:true,
    },
    profileImage:{
        type:String,
    },
    bios:{
        type:String,
    },
    savedPins:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Pin"
    }],
    boards:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Board"
    }],
    refreshToken:{
        type:String,
    }
},{timestamps:true});

export const User=mongoose.model("User",userSchema);