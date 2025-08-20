import express from "express"
import dotenv from "dotenv"


import {connectDB} from "./src/lib/db.js"
// import departmentRoute from './src/routes/department.route.js'
// import designationRoute from './src/routes/designation.route.js'
// import employeeRoute from './src/routes/employee.route.js'

const app=express()

dotenv.config()

app.get('/',(req,res)=>{
    res.send("working")
})


// app.use("/api/department",departmentRoute)
// app.use("/api/designation",designationRoute)
// app.use("/api/employee",employeeRoute)

const port=process.env.PORT
app.listen(port,()=>{
    console.log(`Server running on ${port}`);
    connectDB()
})