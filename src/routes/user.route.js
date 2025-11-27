import { Router } from "express";
import { login, userRegister ,logout, getCurrentUser, refreshAccessToken, changePassword, forgotPassword, resetPassword} from "../controllers/user.controller.js";
import { verifyJWT } from "../middlewares/Auth.middleware.js";
const userRouter = Router();


userRouter.route("/register").post(userRegister)
userRouter.route("/login").post(login);
userRouter.route("/logout").post(verifyJWT,logout)
userRouter.route("/current-user").get(verifyJWT,getCurrentUser)
userRouter.route("/refresh-token").post(refreshAccessToken)
userRouter.route("/change-password").post(verifyJWT,changePassword)
userRouter.route("/forgot-password").post(forgotPassword)
userRouter.route("/reset-password").post(resetPassword)

export {userRouter}