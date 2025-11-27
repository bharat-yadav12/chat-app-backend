import 'dotenv/config'
import { app } from "./app.js";
import { db } from "./src/config/db.js";
import { userRegister } from './src/controllers/user.controller.js';
import { login } from './src/controllers/user.controller.js';
import { requestOtp, verifyOtp } from './src/controllers/otp.controller.js';

db().then(()=>{
    app.listen(process.env.PORT,()=>{
        console.log(`server is running at port ${process.env.PORT}`)
    })
}).catch((err)=>{
    console.log("database connection is failed and error is ",err);
})

app.get("/",(req,res,next)=>{
    res.send("hello backend")
})

// app.post("/api/auth/register",userRegister);
// app.post("/api/auth/login",login);
// app.post("/requestotp",requestOtp);
// app.post("/verifyOtp",verifyOtp);