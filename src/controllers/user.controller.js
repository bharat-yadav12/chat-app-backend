import { User } from "../models/user.model.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { ApiError } from "../utils/ApiError.js";


/**
 * Cookie options for refresh token. In production you want secure: true and sameSite strict/lax.
 */
const Option = {
  httpOnly: true,
   secure: true,
 // secure: process.env.NODE_ENV === "production", // only send over https in prod
//   sameSite: "lax",
//   // maxAge optionally align with your REFRESH_TOKEN_EXPIRY (ms)
//   // Example: 7 days -> 7 * 24 * 60 * 60 * 1000
//   maxAge: process.env.REFRESH_TOKEN_COOKIE_MAX_AGE
//     ? Number(process.env.REFRESH_TOKEN_COOKIE_MAX_AGE)
//     : 7 * 24 * 60 * 60 * 1000,
};

const userRegister = asyncHandler(async (req, res) => {
  console.log("req.body is ", req.body);
  const { username, firstName, lastName, email, password, mobileNumber } = req.body;

  // basic required field checks
  if (!username || !email || !password || !mobileNumber) {
    throw new ApiError(400, "username, email, password and mobileNumber are required");
  }

  // check duplicates (username or email)
  const existing = await User.findOne({
    $or: [{ email: email.toLowerCase() }, { username: username.toLowerCase() }],
  });
  if (existing) {
    throw new ApiError(400, "User with that email or username already exists");
  }

  const user = await User.create({
    username,
    firstName,
    lastName,
    email,
    password,
    mobileNumber,
  });

  // remove sensitive data before sending (mongoose toObject can be used)
  const safeUser = {
    _id: user._id,
    username: user.username,
    firstName: user.firstName,
    lastName: user.lastName,
    email: user.email,
    mobileNumber: user.mobileNumber,
    profileImage: user.profileImage,
    isOnline: user.isOnline,
    isVerified: user.isVerified,
    createdAt: user.createdAt,
    updatedAt: user.updatedAt,
  };

  // Use your ApiResponse shape: (statusCode, data, message)
  const apiResponse = new ApiResponse(201, { user: safeUser }, "User registered successfully");
  return res.status(apiResponse.statusCode).json(apiResponse);
});

const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    throw new ApiError(400, "email and password are required");
  }

  // need password for compare, schema has password hashed and selected by default false?
  // If password field is not selected by default, use .select("+password")
  const foundUser = await User.findOne({ email: email.toLowerCase() }).select("+password +refreshToken");
  if (!foundUser) {
    throw new ApiError(404, "User not found");
  }

  const isMatched = await foundUser.comparePassword(password);
  if (!isMatched) {
    throw new ApiError(401, "Invalid credentials");
  }

  // generate tokens from model methods
  const accessToken = foundUser.generateAccessToken();
  const refreshToken = foundUser.generateRefreshToken();

  // persist refresh token (consider hashing refresh tokens before storing in DB)
  foundUser.refreshToken = refreshToken;
  await foundUser.save();

  // set refresh token as HttpOnly cookie
  res.cookie("accessToken",accessToken,Option);
  res.cookie("refreshToken", refreshToken, Option);

  // prepare safe user object to return
  const safeUser = {
    _id: foundUser._id,
    username: foundUser.username,
    email: foundUser.email,
    firstName: foundUser.firstName,
    lastName: foundUser.lastName,
    mobileNumber: foundUser.mobileNumber,
  };

  const apiResponse = new ApiResponse(200, { accessToken, user: safeUser }, "User logged in successfully");
  return res.status(apiResponse.statusCode).json(apiResponse);
});

export { userRegister, login };





// const userRegister = async (req,res) => {
//     console.log('res.boyd is ',req.body);
//     const {username,firstName,lastName,email,password, mobileNumber} = req.body;
//     try {
//         const user = await User.create({username,firstName,lastName,email,password,mobileNumber})
//         if(user){
//             res.status(200).json(user);
//         }
//         else{
//            res.status(400).json({
//            message:"issue while calling an api"
//           })
//         }
//     } catch(error){
//         console.log("Error callign an api",error);
//     }
// }

// const login = async (req,res,next)=>{
//     try {
//         const {email,password} = req.body;
//         if(!email && !password){
//             throw new Error("email and passwrod are requreid!");
//         }
//         const foundUser = await User.findOne({email});
//         console.log("founduser is ",foundUser)
//         if(!foundUser){
//             throw new Error("user not found!");
//         }
//         const isPasswordMatched = await foundUser.comparePassword(password);
//         if(!isPasswordMatched){
//             throw new Error("password are incorrect");
//         }
//         const accessToken = foundUser.generateAccessToken();
//         const refreshToken = foundUser.generateRefreshToken();

//         console.log("accesstoke is ",accessToken);
//          console.log("refresh tokes is ",refreshToken);

//         const Option = {
//             httpOnly:true,
//             secure:true
//         }
//         foundUser.refreshToken = refreshToken;
//         await foundUser.save()

//         res.status(200).json({
//             message:"user logged in succesfuly",
//             accessToken
//         });


        
        
//     } catch (error) {
//         console.log("the error is ",error);
//         next();
//     }
// }

// export {userRegister,login}