import React, { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import M from "materialize-css"
import axios from "axios"
import Navbar from "../Navbar"
const Signup = () => {

    const [credentials,setCredentials] = useState({
        name:"",
        email:"",
        password:""
    })
    const [image,setImage] = useState("")
    const [url,setUrl] = useState("")

    const handleChange = (e)=>{
        setCredentials((prev)=>({...prev,[e.target.name]:e.target.value}))
    }
    const navigate = useNavigate()

    useEffect(()=>{
        const fetchData = async ()=>{
            if(url){
                try {
                    const res = await axios.post("/auth/signup",{credentials,url});
                    console.log(res.data)
                    M.toast({html:res.data,classes:"#43a047 green darken-1"})
                    navigate("/signin")
                } catch (error) {
                    M.toast({html:error.response.data, classes:"#c62828 red darken-2"})
                }
            } 
        }
        fetchData()
    },[url])

    const uploadImage = async () => {
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
    const postData = async ()=>{
        await uploadImage()
        
    }

    return (
        <div className="mycard">
            <Navbar />
            <div className="card auth-card input-field">
                <h2>Snaptalk</h2>
                <input
                    type="text"
                    placeholder="name"
                    name="name"
                    onChange={handleChange}
                />
                <input
                    type="text"
                    placeholder="email"
                    name="email"
                    onChange={handleChange}
                />
                <input
                    type="password"
                    placeholder="password"
                    name="password"
                    onChange={handleChange}
                />
                <div className="file-field input-field">
                    <div className="btn #64b5f6 blue darken-1">
                        <span>Upload pic</span>
                        <input type="file" onChange={(e) => setImage(e.target.files[0])} />
                    </div>
                    <div className="file-path-wrapper">
                        <input className="file-path validate" type="text" />
                    </div>
                </div>

                <button 
                    className="btn waves-effect waves-light #64b5f6 blue darken-1"
                    onClick={() => postData()}
                >
                    SignUp
                </button>
                <h5>
                    <Link to="/signin">Already have an account ?</Link>
                </h5>
            </div>
        </div>
    )
}

export default Signup
