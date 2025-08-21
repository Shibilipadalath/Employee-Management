import express from "express"
import dotenv from "dotenv"
import cors from "cors"
import path from "path"


import {connectDB} from "./src/lib/db.js"
import departmentRoute from './src/routes/department.route.js'
import designationRoute from './src/routes/designation.route.js'
import employeeRoute from './src/routes/employee.route.js'

const app=express()
app.use(express.json())

dotenv.config()

app.use(cors())

app.use('/uploads', express.static(path.join(process.cwd(), 'uploads')));

connectDB()

app.use("/api/department",departmentRoute)
app.use("/api/designation",designationRoute)
app.use("/api/employee",employeeRoute)

const port=process.env.PORT
app.listen(port,()=>{
    console.log(`Server running on ${port}`);
})