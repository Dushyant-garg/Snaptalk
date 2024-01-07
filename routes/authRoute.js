import express from 'express';
import User from '../models/User.js';
import bcrypt from "bcryptjs"
import jwt from "jsonwebtoken"
import { verifyToken } from '../utils/verifytoken.js';
const router = express.Router();

router.post("/signup", async (req,res)=>{
    const {name, email, password} = req.body.credentials
    console.log(name, email, password)

    try{
        if(!name || !email || !password){
            res.status(422).json("please enter all fields")
        }
        else{
            const salt = bcrypt.genSaltSync(10);
            const hash = bcrypt.hashSync(password, salt);

            const newUser = new User({
                name,
                email,
                password:hash,
                pic:req.body.url
            })
            await newUser.save();
            res.json("user has been successfully created");
        }
    }catch(err){
        res.send(err)
    }
})

router.post("/signin",async (req,res)=>{
    const {name, password} = req.body
    try {
        if(!name || !password){
            res.status(422).json("please enter all fields")
        }
        else{
            const existUser = await User.findOne({name:name})
            if(!existUser){
                return res.status(400).json("Wrong username or password entered")  
            }
            const isPasswordCorrect = await bcrypt.compare(
                password,existUser.password
            );
            if (!isPasswordCorrect){
                return res.status(400).json("Wrong username or password entered");
            }
            const token = jwt.sign({id:existUser._id},process.env.JWT);

            res.status(200).json({token,existUser})
        }
    } catch (error) {
        return res.status(422).json(error);
    }
})

export default router