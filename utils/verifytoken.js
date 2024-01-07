import jwt from "jsonwebtoken"
import User from "../models/User.js"

export const verifyToken = (req, res, next) =>{
    //authorization is a paramater in req.headers which contains the token value.
    const {authorization} = req.headers

    if(!authorization){
        res.status(401).json({message:"you must be logged in"})
    }
    const token = authorization.replace("Bearer ", "")
    jwt.verify(token, process.env.JWT, async (err,payload)=>{
        if(err){
            res.status(401).json({message:"you must be logged in"})
        }
        const {id} = payload
        const user = await User.findById(id)
        req.user = user
        next()
    })
}