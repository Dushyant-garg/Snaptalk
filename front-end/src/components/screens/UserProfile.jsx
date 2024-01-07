import axios from 'axios'
import React, { useEffect, useState, useContext } from 'react'
import { UserContext } from '../../reducer/userReducer';
import Navbar from '../Navbar';
import { useParams } from 'react-router-dom';

const Profile = () => {
    const {userId} = useParams()
    const [userProfile,setUserProfile] = useState(null);
    const [isFollow,setIsFollow] = useState();
    const {state,dispatch} = useContext(UserContext)

    useEffect(()=>{
        const fetchData = async ()=>{
            const res = await axios.get(`/user/${userId}`,{ headers: { 'Authorization': 'Bearer '+localStorage.getItem('jwt') } })
            setUserProfile(res.data)
        }
        fetchData()
    },[isFollow])

    const followUser = async ()=>{
        try{
            const res = await axios.put("/user/follow",{followId:userId},{ headers: { 'Authorization': 'Bearer '+localStorage.getItem('jwt') } })
            dispatch({type:"UPDATE", payload:{following:res.data.following,followers:res.data.followers}})
            localStorage.setItem("user",JSON.stringify(res.data))
            setIsFollow(true);
        }
        catch(err) {
            console.log(err)
        }
    }

    const unfollowUser = async ()=>{
        try {
            const res = await axios.put("/user/unfollow",{unfollowId:userId},{ headers: { 'Authorization': 'Bearer '+localStorage.getItem('jwt') } })
            dispatch({type:"UPDATE", payload:{following:res.data?.following,followers:res.data?.followers}})
            localStorage.setItem("user",JSON.stringify(res.data))
            setIsFollow(false)
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
                            src={userProfile?.user?.pic}
                        />

                    </div>

                    <div>
                        <h4>{userProfile?.user.name}</h4>
                        <h5>{userProfile?.user.email}</h5>
                        <div style={{ display: "flex", justifyContent: "space-between", width: "108%" }}>
                            <h6>{userProfile?.post.length} posts</h6>
                            <h6>{userProfile?.user?.followers?.length } followers</h6>
                            <h6>{userProfile?.user?.following?.length } following</h6>
                        </div>
                        {!userProfile?.user?.followers?.includes(state._id) ?
                        <button 
                            style={{margin:"10px"}}
                            className="btn waves-effect waves-light #64b5f6 blue darken-1"
                            onClick={() => followUser()}
                        >
                        Follow
                        </button>
                        :
                        <button 
                            style={{margin:"10px"}}
                            className="btn waves-effect waves-light #64b5f6 blue darken-1"
                            onClick={() => unfollowUser()}
                        >
                        Unfollow
                        </button>
                        }
                    </div>
                </div>

            </div>
            <div className="gallery">
                {
                    userProfile?.post.map(item => {
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
