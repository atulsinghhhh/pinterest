import {User} from "../models/user.models.js";
import { asyncHandler } from "../utilis/asyncHandler.js";
import { ApiError } from "../utilis/ApiError.js";
import { ApiResponse } from "../utilis/ApiResponse.js";
import bcrypt from "bcryptjs"
import jwt from "jsonwebtoken"

const userSignup = asyncHandler(async (req, res) => {
    const { username, email, fullname, password } = req.body;
    if (!username || !email || !fullname || !password) {
        throw new ApiError(400, "All fields are required");
    }

    const existingUser = await User.findOne({
        $or: [
            { email },
            { username }
        ]
    });
    if (existingUser) {
        throw new ApiError(409, "User already exists with this email or username");
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // TODO: Handle image upload if required

    const userDetails = await User.create({
        username,
        email,
        fullname,
        password: hashedPassword
    });

    return res.status(201).json(
        new ApiResponse(
            201,
            userDetails,
            "User signup successful"
        )
    );
});


const userLogin=asyncHandler(async(req,res)=>{
    const {email,password}=req.body;
    if(!email || !password){
        throw new ApiError(400,"email and password are required !!");
    }
    const user=await User.findOne({email});
    if(!user){
        throw new ApiError(409,"User is missing!!");
    }
    const validatePassword=await bcrypt.compare(password,user.password);
    if(!validatePassword){
        throw new ApiError(409,"You enter incorrect Password");
    }
    const tokenPayload={
        _id:user._id,
        email:user.email,
        username:user.username,
    }

    const accessToken=await jwt.sign(tokenPayload,process.env.ACCESS_TOKEN_SECERT,
        {expiresIn:'1h'}
    )

    const refreshToken=await jwt.sign(tokenPayload,process.env.REFERSH_TOKEN_SECERT,
        {expiresIn:'7d'}
    )
    user.refreshToken = refreshToken;
    await user.save({validateBeforeSave:false});


    const userDetails=await User.findById(user._id).select("-password -refreshToken");

    res.cookie("token", accessToken, {
        httpOnly: true,
        maxAge: 60 * 60 * 1000, // 1 hour
    });

    res.cookie("refreshToken", refreshToken, {
        httpOnly: true,
        maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });
    // const options={
    //     httpOnly: true,
    //     maxAge: 60 * 60,
    // }
    return res.status(200)
    // .cookie("token",token,options)
    .json(
        new ApiResponse(
            200,
            userDetails,
            "User Login Successfully"
        )
    )
})
const userLogout = asyncHandler(async (req, res) => {
    res.clearCookie("accessToken", {
        httpOnly: true,
        sameSite: "strict",
        secure: true, // Only use in HTTPS environments (set false in dev if needed)
    });

    res.clearCookie("refreshToken", {
        httpOnly: true,
        sameSite: "strict",
        secure: true,
    });

    return res.status(200).json(
        new ApiResponse(200, null, "User logged out successfully")
    );
});

const changeCurrentPassword=asyncHandler(async(req,res)=>{
    const {oldpassword,newpassword}=req.body;

    if(!oldpassword || !newpassword){
        throw new ApiError(400,"Both current and new passwords are required")
    }
    const user=await User.findById(req.user._id);
    if(!user){
        throw new ApiError(409,"User is missing");
    }
    const checkpassword=await bcrypt.compare(oldpassword,user.password);
    if(!checkpassword){
        throw new ApiError(400,"You current password is incorrect");
    }

    const hashedNewPassword=await bcrypt.hash(newpassword,10);

    user.password = hashedNewPassword;
    await user.save();

    return res.status(200).json(
        new ApiResponse(
            200,
            null,
            "You password Changed successfully"
        )
    )
})

const getUserProfile=asyncHandler(async(req,res)=>{
    const {username}=req.params;
    if(!username){
        throw new ApiError(400, "Username is required");
    }
    console.log("Requested username:", username)
    // console.log(username);
    const user=await User.findOne({username}).select("-password");
    // console.log("Username from param:", username);
    // console.log("All users in DB:", await User.find({}));

    if(!user){
        throw new ApiError(404, "User not found");
    }
    console.log("Found user:", user);
    return res.status(200).json(
        new ApiResponse(
            200,
            user,
            "User profile fetched successfully"
        )
    )
})

const updateUserProfile=asyncHandler(async(req,res)=>{
    const {username,email,bios,fullname}=req.body;
    if(!username || !email || !bios || !fullname){
        throw new ApiError(400, "all required are required");
    }
    const user=await User.findById(req.user._id);
    if(!user){
        throw new ApiError(404, "User not found");
    }

    if(username) user.username=username;
    if(email) user.email=email;
    if(bios) user.bios=bios;
    if(fullname) user.fullname=fullname

    const userDetails=await User.findById(user._id).select("-password");

    return res.status(200).json(
        new ApiResponse(
            200,
            userDetails,
            "User updated successfully"
        )
    )

})
export {
    userSignup,
    userLogin,
    userLogout,
    changeCurrentPassword,
    getUserProfile,
    updateUserProfile
}