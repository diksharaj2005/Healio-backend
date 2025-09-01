import express from 'express'
import path from 'path'
import cors from 'cors'
import 'dotenv/config'
import connectDB from '../config/mongodb.js'
import connectCloudinary from '../config/cloudinary.js'
import adminRouter from '../routes/adminRoute.js'
import doctorRouter from '../routes/doctorRoute.js'
import userRouter from '../routes/userRoute.js'


// app config
const app = express()
const port = process.env.PORT || 4000
connectDB()
connectCloudinary()

// middlewares
app.use(express.json())
app.use(cors())

// api endPoints
app.use('/api/admin',adminRouter)
// localhost:4000/api/admin/add_doctor


// api endpoint for doctorRouter
app.use('/api/doctor',doctorRouter)


// api for userRouter
app.use('/api/user',userRouter)

app.get("/",(req,res)=>{
res.send('API WORKING Great')
})

app.listen(port,()=>console.log("Server is started",port))