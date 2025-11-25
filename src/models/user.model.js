import mongoose from "mongoose";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
const userSchema = new mongoose.Schema({
    username:{
        type:String,
        required:true,
        trime:true,
        unique:true,
        lowercase:true
    },
    firstName:{
        type:String,
        required:true,
        trim:true
    },
    lastName:{
        type:String,
        required:true,
        trim:true
    },
    email:{
        type:String,
        required:true,
        unique: true,        // No two users can have same email
        lowercase: true,     // Always stored in lowercase
        trim:true
    },
    password:{
        type:String,
        required:true,
        minlength:6
    },
    refreshToken: {
        type: String,
        default: null,        // ← Not required
        select: false,        // Never send in responses
    },
    mobileNumber:{
        type: String,        // Better as String because numbers like "0987..." lose leading 0  
        required: true,
        match: /^[0-9]{10}$/ // basic validation
    },
    bio: {
        type: String,
        maxlength: 160,
        default: "Hey there! I'm using this chat app.",
    },

    profileImage: {
        type: String,   // URL to image
        default: "",
    },

    isOnline: {
        type: Boolean,
        default: false,
    },

    lastSeen: {
        type: Date,
        default: Date.now,
    },

    isVerified: {
        type: Boolean,
        default: false,
    }
},{
    timestamps:true
})

userSchema.pre("save",async function(next) {
    if(!this.isModified('password')) return next();
    try {
       const salt = await bcrypt.genSalt(10);
       this.password = await bcrypt.hash(this.password,salt);
       next();
    } catch (error) {
        next(error);
    }
})
userSchema.methods.comparePassword = async function(password){
    const result = await bcrypt.compare(password,this.password)
    return result;
}

userSchema.methods.generateAccessToken = function(){
    return jwt.sign(
    {
       _id:this._id,
       email:this.email,
       username:this.username
    },
    process.env.ACCESS_TOKEN_SECRET,
    {
        expiresIn:process.env.ACCESS_TOKEN_EXPIRY
    }
)
}
userSchema.methods.generateRefreshToken = function(){
    return jwt.sign(
        {
            _id:this._id
        },
        process.env.REFRESH_TOKEN_SECRET,
        {
            expiresIn:process.env.REFRESH_TOKEN_EXPIRY
        }
    )
}

const User = new mongoose.model("User",userSchema);

export {User}