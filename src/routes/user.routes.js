import { Router } from "express";
import { verifyjwt } from "../middlewares/auth.middleware.js";
import { userSignup,userLogin,userLogout,getUserProfile,updateUserProfile,changeCurrentPassword,getUserBoards } from "../controllers/users.controllers.js";

const router=Router();

router.post("/signup",userSignup)
router.post("/login",userLogin)
router.post("/logout",verifyjwt,userLogout)
router.post("/change-password",verifyjwt,changeCurrentPassword)
router.get("/profile/:username",getUserProfile)
router.put("/update-profile",verifyjwt,updateUserProfile)
router.get("/my-boards", verifyjwt, getUserBoards);


export default router;