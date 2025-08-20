const express=require("express")
const dotenv=require("dotenv")

const {connectDB}=require('./src/lib/db.js')

const app=express()

dotenv.config()


const port=5001
app.listen(port,()=>{
    console.log(`Server running on ${port}`);
    connectDB()
})