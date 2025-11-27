import mongoose from "mongoose";

const OtpSchema = new mongoose.Schema({
    email:{
        type:String,
        required:true,
        lowercase:true,
        trim:true
    },
    otp:{
        type:String,
        require:true
    },
    attempts:{
        type:Number,
        default:0
    },
    expiresAt:{
        type:Date,
        default:Date.now,
        expires:300
    }
},{timestamps:true});

const Otp = new mongoose.model("Otp",OtpSchema);

export {Otp}