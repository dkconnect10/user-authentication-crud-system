import { Router } from "express";
import { createUser, loginUser,updateProfile,logoutUser ,getUser,forgotPassword ,verifyOtp,resetPassword} from "../controller/user.controller.js";
import { isAuthenticated, isAuthorized } from "../middlware/auth.middlware.js";

const router = Router();

router.route("/create").post(createUser);
router.route("/login").post(loginUser);
router.route("/update").patch(isAuthenticated,isAuthorized(["user","admin"]),updateProfile)
router.route("/logout").post(isAuthenticated,isAuthorized(["user"]),logoutUser)
router.route("/getUserProfile").get(isAuthenticated , getUser)
router.route("/forgot-password").post(forgotPassword);
router.route("/verify-otp").post(verifyOtp);
router.route("/reset-password").post(resetPassword);


export default router;
