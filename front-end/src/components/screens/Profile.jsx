import axios from 'axios'
import React, { useEffect, useState, useContext } from 'react'
import { UserContext } from '../../reducer/userReducer';
import Navbar from '../Navbar';

const Profile = () => {
    const [myPics,setMyPics] = useState([]);
    const [url,setUrl] = useState(""); 
    const {state,dispatch} = useContext(UserContext)

    //Fetching all posts created by the user
    useEffect(()=>{
        const fetchData = async ()=>{
            // we have to pass headers because we used verifytoken in /myposts route.
            const res = await axios.get("/post/myposts",{ headers: { 'Authorization': 'Bearer '+localStorage.getItem('jwt') } })
            setMyPics(res.data)
        }
        fetchData()
    },[])
    //Updating the image by sending request to backend.
    useEffect(()=>{
        if(url){
            const fetchData = async ()=>{
                const res = await axios.put("/user/updatepic",{pic:url},{ headers: { 'Authorization': 'Bearer '+localStorage.getItem('jwt') } })
    //changing state and updating localstorage because when the page is reloaded, the user present
    //localstorage is used. hence it is important to update it or else pic will not update.
                dispatch({type:"UPDATE_PIC", payload:res.data.pic})
                localStorage.setItem("user", JSON.stringify({...state,pic:res.data.pic}))
            }
            fetchData()
        }
    },[url])
    //creating the url for the image
    const updatePhoto = async (image)=>{
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
    <>
        <Navbar/>
        <div style={{ maxWidth: "550px", margin: "0px auto" }}>
            <div style={{ margin: "18px 0px", borderBottom: "1px solid grey" }}>
                <div style={{ display: "flex", justifyContent: "space-around" }}>

                    <div>
                        <img style={{ width: "160px", height: "160px", borderRadius: "80px" }}
                            src={state ? state.pic : "loading"} alt="profile"
                        />
                        
                    </div>

                    <div>
                        <h4>{state ? state.name : "loading"}</h4>
                        <h5>{state ? state.email : "loading"}</h5>
                        <div style={{ display: "flex", justifyContent: "space-between", width: "108%" }}>
                            <h6>{myPics?.length} posts</h6>
                            <h6>{state?.followers?.length} followers</h6>
                            <h6>{state?.following?.length} following</h6> 
                        </div>
                    </div>
                </div>

                <div className="file-field input-field" style={{ margin: "10px" }}>
                    <div className="btn #64b5f6 blue darken-1">
                        <span>Update pic</span>
                        <input type="file" onChange={(e) => updatePhoto(e.target.files[0])} />
                    </div>
                    <div className="file-path-wrapper">
                        <input className="file-path validate" type="text" />
                    </div>
                </div>
            </div>
            <div className="gallery">
                {
                    myPics.map(item => {
                        return (
                            <img key={item._id} className="item" src={item.photo} alt={item.title} />
                        )
                    })
                }
            </div>
        </div>
    </>
    )
}

export default Profile
