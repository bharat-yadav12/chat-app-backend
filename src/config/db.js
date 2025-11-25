import mongoose from "mongoose";
import { DB_NAME } from "../../constant.js";

const db = async () => {
    try {
       const connectionInstance  =  await mongoose.connect(`${process.env.MONGODB_URI}/${DB_NAME}`);

       if(connectionInstance){
         console.log("databae is connected successfully and host is ",connectionInstance.connection.host);
       }
        // Optional: attach listeners for runtime events
      mongoose.connection.on('disconnected', () => {
        console.warn('MongoDB disconnected');
      });
      mongoose.connection.on('reconnected', () => {
        console.log('MongoDB reconnected');
      });
      mongoose.connection.on('error', (err) => {
        console.error('MongoDB error:', err);
      });
    } catch (error) {
        console.log("Error while connecting to DB ",error);
        throw new Error("DB connection is failed");
    }
}

export {db}