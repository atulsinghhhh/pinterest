import {Board} from "../models/boards.models.js"
import { ApiError } from "../utilis/ApiError.js";
import {User} from "../models/boards.models.js"
import { ApiResponse } from "../utilis/ApiResponse.js";
import { asyncHandler } from "../utilis/asyncHandler.js";

const createBoard=asyncHandler(async()=>{

    const {name,description}=req.body;
    if(!name || !description ){
        throw new ApiError(400,"name and description are required");
    }
    const userId=await User?._id;
    if(!userId){
        throw new ApiError(401,"Unauthorized - User ID missing");
    }
    const board=await Board.create({
        name,
        description,
        createdBy:userId
    })
    

    res.status(201).json(
        ApiResponse(
            201,
            board,
            "Board created successfully"
        )
    )
})



export{
    createBoard
}