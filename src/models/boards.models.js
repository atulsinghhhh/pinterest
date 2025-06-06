import mongoose,{Schema} from "mongoose";

const boardSchema=new Schema({
    name:{
        type:String,
        required:true
    },
    description:{
        type:String,
        required:true
    },
    createdBy:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
        required: true
    },
    Pins:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Pin",
    }],
    isPrivate:{
        type:Boolean,
        default:false
    }
},{timestamps:true});

export const Board=mongoose.model("Board",boardSchema);