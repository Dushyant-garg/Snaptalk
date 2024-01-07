import express from "express";
import User from "../models/User.js";
import { verifyToken } from '../utils/verifytoken.js';
import Post from "../models/Post.js";
const router = express.Router()

router.get("/:id",verifyToken, async (req, res) => {
    try {
        const user = await User.findOne({_id:req.params.id})
        .select("-password")
        const post = await Post.find({postedBy:req.params.id})
        .populate("postedBy","_id name")
        res.status(200).json({user,post})
    } catch (error) {
        res.json({ error: error})
    }
})

router.put("/follow",verifyToken, async (req, res) => {
    try {
        //first we will follow the user i.e. logged in user's id is shown in the follower part.
        const user = await User.findByIdAndUpdate(req.body.followId,{
            $push:{followers:req.user._id}
        },{new:true}).select("-password")

        //then we will be show it in user's following section.
        const user2 = await User.findByIdAndUpdate(req.user._id,{
            $push:{following:req.body.followId}
        },{new:true}).select("-password")

        res.json(user2)
    } catch (error) {
        res.json({ error: error})
    }
})

router.put("/unfollow",verifyToken, async (req, res) => {
    try {
        const user = await User.findByIdAndUpdate(req.body.unfollowId,{
            $pull:{followers:req.user._id}
        },{new:true})

        const user2 = await User.findByIdAndUpdate(req.user._id,{
            $pull:{following:req.body.unfollowId}
        },{new:true}).select("-password")

        res.json(user2)
    } catch (error) {
        res.json({ error: error})
    }
})

router.put("/updatepic",verifyToken,async(req,res)=>{
    try {
        const user = await User.findByIdAndUpdate(req.user._id,{
            $set:{pic:req.body.pic}
        },{new:true})
        res.json(user)
    } catch (error) {
        res.json({ error: error})
    }
})

export default router