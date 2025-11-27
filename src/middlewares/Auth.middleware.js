import { User } from "../models/User.model.js";
import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import jwt from "jsonwebtoken";


const verifyJWT = asyncHandler(async(req,res,next)=>{
    console.log("verify jwt is called:before logout route ------> ");
    console.log(req.cookies?.accessToken);

    const accessToken = req?.cookies?.accessToken;
    if(!accessToken){
        throw new ApiError(401,"Unathorised access");
    }
    const decodedToken = jwt.verify(accessToken,process.env.ACCESS_TOKEN_SECRET)
    console.log(decodedToken);
    console.log(decodedToken._id);
     
    const user = await User.findById(decodedToken._id).select("-password -refreshToken");

    if(!user){
        throw new ApiError(401,"unathorized access");
    }

    console.log(user);
    req.user = user;
    
    next();
})

export {verifyJWT}