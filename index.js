import express from 'express';
import mongoose from 'mongoose';
import dotenv from "dotenv";
import cors from "cors";
import authRoute from './routes/authRoute.js'
import postRoute from './routes/postRoute.js'
import userRoute from './routes/userRoute.js'
import path from 'path'

const __dirname = path.resolve()

const app = express();
dotenv.config()

const connect = async()=>{
    try{
      await mongoose.connect(process.env.MONGO)
      console.log("connected to mongodb")
    }catch(err){
      throw err
    }
}

mongoose.connection.on("disconnected",()=>{
    console.log("mongodb disconnected") 
})
app.use(cors())
app.use(express.json())
app.use(express.static(path.join(__dirname,'./front-end/build')))

app.use("/auth",authRoute)
app.use("/post",postRoute)
app.use("/user",userRoute)

app.use('*',function(req, res){ 
  res.sendFile(path.join(__dirname,'./front-end/build/index.html'))
})

const PORT = process.env.PORT || 8000

app.listen(PORT,()=>{
    connect()
    console.log("server started")
})