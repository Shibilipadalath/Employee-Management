import mongoose from "mongoose"

export const connectDB=async()=>{
    try{
        const connect=await mongoose.connect(process.env.MONGODB_URi)
        console.log("MongoDB connected successfully");
    }catch(error){
        console.error(`MongoDB connection error:${error.message}`);
    }
}