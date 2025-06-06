import mongoose,{Schema} from "mongoose";

const pinSchema=new Schema({
    title:{
        type:String,
        required:true,
    },
    description:{
        type:String,
        required:true,
    },
    imageUrl:{
        type:String,
        required:true,
    },
    link:{
        type:String
    },  
    createdBy:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
        
    },
    boards:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Board",
        required:true,
    }],
    tags:[
        String
    ],
    likes:[{
        type: mongoose.Schema.Types.ObjectId, 
        ref: "User"
    }]
},{timestamps:true});

export const Pin=mongoose.model("Pin",pinSchema);