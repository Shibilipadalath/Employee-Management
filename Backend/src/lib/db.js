const mongoose=require("mongoose")

export const conneceDB=async()=>{
    try{
        const connect=await mongoose.connect(process.env.MONGODB_URi)
    }catch(error){
        console.error(`MongoDB connection error:${error.message}`);
    }
}