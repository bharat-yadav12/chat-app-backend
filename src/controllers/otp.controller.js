import { asyncHandler } from "../utils/asyncHandler.js";
import { Otp } from "../models/otp.model.js";
import { ApiError } from "../utils/ApiError.js";
import { generateOtp } from "../utils/generateOtp.js";
import { ApiResponse } from "../utils/ApiResponse.js";


const requestOtp = asyncHandler(async(req,res,next)=>{
    const {email} = req.body;
    if(!email){
        throw new ApiError(400,"Email is required")
    }
    let otp = generateOtp();

    await Otp.create({email,otp})

    // await sentEamil();

    return res.json(new ApiResponse(200,null,"Otp sent successfully!"));

})

const verifyOtp = asyncHandler(async(req,res)=>{
     const {email,otp} = req.body;
     if(!email){
        throw new ApiError(400,"email is required");
     }

     if(!otp){
        throw new ApiError(400,"otp is required!");
     }

     const otpRecord = await Otp.findOne({email,otp});

     if(!otpRecord){
        throw new ApiError(400,"invalid request");
     }
     if(otpRecord.otp != otp){
        throw new ApiError(400,"otp not matched");
     }

     return res.json(new ApiResponse(200,"otp verfied successfully"))
})

export {requestOtp,verifyOtp};