import express from 'express';
import Post from '../models/Post.js';
import { verifyToken } from '../utils/verifytoken.js';
const router = express.Router();

router.post("/createpost", verifyToken, async (req,res)=>{
    const {title,body} = req.body.postDetails;
    try {
        if(!title || !body) {
            res.status(422).json({message:"please enter all fields"})
        }
        else{
            //req.user is created and the data regarding the user logged in is stored in it.
            //This is created in verifyToken middleware.
            const {password, ...other} = req.user._doc
            const newPost = new Post({
                title,
                body,
                photo : req.body.url,
                postedBy: {...other}
            })
            await newPost.save();
            res.status(200).json(newPost)
        }
    }catch (error) {
        res.json({message: error.message})
    }
})

router.get("/allpost",async (req,res)=>{
    try {
        const posts = await Post.find()
        .populate("postedBy","_id name")
        .populate("comments.postedBy","_id name")
        .sort("-createdAt")
        res.status(200).json(posts)
    } catch (error) {
        res.json({message: error.message})
    }
})

router.get("/myposts",verifyToken, async (req,res)=>{
    try {
        const posts = await Post.find({postedBy : req.user._id})
        res.status(200).json(posts)
    } catch (error) {
        res.json({message: error.message})
    }
})

router.put("/likes",verifyToken, async (req,res)=>{
    //find the required post and put the id of the user who liked the post in the likes array.
    try {
        const posts = await Post.findByIdAndUpdate(req.body.postId,{
            $push:{likes: req.user._id}
        },{new:true})
        //new:true is used because otherwise mongodb will return the old version of data without updating it. 
        res.status(200).json(posts)
    } catch (error) {
        res.json({message: error.message})  
    }
    
})

router.put("/unlikes",verifyToken, async (req,res)=>{
    //find the required post and put the id of the user who liked the post in the likes array.
    try {
        const posts = await Post.findByIdAndUpdate(req.body.postId,{
            $pull:{likes: req.user._id}
        },{new:true})
        //new:true is used because otherwise mongodb will return the old version of data without updating it. 
        res.status(200).json(posts)
    } catch (error) {
        res.json({message: error.message})  
    }
    
})

router.put("/comment",verifyToken, async (req,res)=>{
    const comment = {
        text: req.body.text,
        postedBy:req.user._id
    }
    try {
        const posts = await Post.findByIdAndUpdate(req.body.postId,{
            $push:{comments: comment}
        },{new:true})
        .populate("comments.postedBy","_id name")   
        res.status(200).json(posts)
    } catch (error) {
        res.json({message: error.message})  
    } 
})

router.delete("/deletepost/:postId",async(req,res)=>{
    try {
        const post = await Post.findByIdAndDelete(req.params.postId)
        res.status(200).json({message:"Successfully deleted"})
    } catch (error) {
        res.json({message: error.message})  
    }
})

// router.put("/deletecomment",async(req,res)=>{
//     try {
//         const post = await Post.findByIdAndUpdate(req.body.postId,{
//             $pull:{comments:req.body.commentId}
//         },{new:true})
//         // const comment = await post.comments.findByIdAndDelete(req.params.commentId)
//         res.status(200).json(post)
//     } catch (error) {
//         res.json({message: error.message})  
//     }
// })

export default router
