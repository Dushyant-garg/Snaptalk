import axios from 'axios'
import React, { useEffect, useState } from 'react'
import Navbar from '../Navbar'
import M from "materialize-css"
import { useNavigate } from 'react-router-dom'

const CreatePost = () => {
    const [postDetails,setPostDetails] = useState({
        title:"",
        body:"",
    })
    const [url,setUrl] = useState("");
    const [image,setImage] = useState("");
    const navigate = useNavigate()

    const handleChange = (e) => {
        const {name,value} = e.target
        setPostDetails((prev)=>({ ...prev, [name] : value}))
    }
    //We are using useEffect because it takes some time for the image to be uploaded to
    //cloudinary and generating the url.
    //In that time, other details are sent to the /createpost route due to which a post is
    //created with no url.
    //That's why we used useEffect with parameter url so that it executes as soon as url is
    //generated.
    useEffect(()=>{
        const fetchData = async ()=>{
            if(url){
                try {
                    const res = await axios.post("/post/createpost",{postDetails,url},{ headers: { 'Authorization': 'Bearer '+localStorage.getItem('jwt') } })
                    console.log(res.data)
                    M.toast({html:"Post created successfully",classes:"#43a047 green darken-1"})
                    navigate("/")
                } catch (error) {
                    console.log(error)
                }
            } 
        }
        fetchData()
    },[url])

    const handleClick = async ()=>{
        //Image is being uploaded first to cloudinary. There a url for the image uploaded is 
        //generated and that url is provided to the photo field of POST Model.
        const data = new FormData()
        data.append("file",image)
        data.append("upload_preset","Snaptalk")
        data.append("cloud_name","delnk8kz2")
        try {
            const res = await axios.post(`https://api.cloudinary.com/v1_1/delnk8kz2/image/upload`,data)
            setUrl(res.data.url)
        } catch (error) {
            console.log(error)
        }
    }
    return (
        <div className="mycard">
            <Navbar/>
            <div className="card input-filed" style={{ margin: "30px auto", maxWidth: "500px", padding: "20px", textAlign: "center"}} >
                <input
                    type="text"
                    placeholder="title"
                    name="title"
                    onChange={handleChange}
                />
                <input
                    type="text"
                    placeholder="body"
                    name = "body"
                    onChange={handleChange}
                />
                <div className="file-field input-field">
                    <div className="btn #64b5f6 blue darken-1">
                        <span>Upload Image</span>
                        <input type="file" name="image" onChange={(e)=>setImage(e.target.files[0])} />
                    </div>

                    <div className="file-path-wrapper">
                        <input className="file-path validate" type="text" />
                    </div>
                </div>

                <button 
                    className="btn waves-effect waves-light #64b5f6 blue darken-1"
                    onClick={handleClick}
                >
                    Submit post
                </button>
                
            </div>
        </div>
    )
}

export default CreatePost
