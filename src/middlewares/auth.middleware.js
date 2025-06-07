// import { asyncHandler } from "../utilis/asyncHandler.js";
// import { ApiError } from "../utilis/ApiError.js";
// import { User } from "../models/user.models.js";
// import jwt from "jsonwebtoken"

// export const verifyjwt=asyncHandler(async(req,res,next)=>{
//     try {
//         const token=req.cookies?.token || req.header("Authorization")?.replace("Bearer ","");
//         console.log("Cookies:", req.cookies);
//         console.log("Authorization Header:", req.header("Authorization"));

//         console.log(token);

//         if(!token){
//             throw new ApiError(409,"UnAuthoized Token");
//         }
//         const decoded=jwt.verify(token,process.env.TOKEN_SECERT);
//         const user=await User.findById(decoded?._id).select("-password");
//         console.log("Decoded: ",decoded);
//         console.log("users: ",user);


//         if(!user){
//             throw new ApiError(401,"Invalid token");
//         }
//         req.user=user;
//         next();

//     } catch (error) {
//         console.error("JWT verification failed:", error.message);
//         throw new ApiError(401,"Invalid access token");
//     }
// })

import jwt from "jsonwebtoken";
import { asyncHandler } from "../utilis/asyncHandler.js";
import { ApiError } from "../utilis/ApiError.js";
import { User } from "../models/user.models.js";

export const verifyjwt = asyncHandler(async (req, res, next) => {
    try {
        const token =
            req.cookies?.token || req.header("Authorization")?.replace("Bearer ", "");

        console.log(token);
        if (!token) {
            throw new ApiError(401, "Unauthorized - Token missing");
        }

        const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECERT);

        // Optional: Fetch user and attach to request
        const user = await User.findById(decoded?._id).select("-password -refreshToken");
        if (!user) {
            throw new ApiError(401, "User not found");
        }

        req.user = user; // attach user info to req
        next();
    } catch (error) {
        console.log("Auth error:", error);
        return res
            .status(401)
            .json({ success: false, message: "Unauthorized", error: error.message });
    }
});
