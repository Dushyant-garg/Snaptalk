import React, { useEffect, useState, useContext } from 'react'
import Navbar from "../Navbar"
import axios from 'axios';
import { UserContext } from '../../reducer/userReducer';
import { Link } from 'react-router-dom';

const Home = () => {

    const {state} = useContext(UserContext)
    const [data,setData] = useState([]);
    const [isLike,setIsLike] = useState();
    
    useEffect(()=>{
        const fetchData = async ()=>{
            const res = await axios.get("/post/allpost")
            setData(res.data)
        }
        fetchData()
    },[isLike])

    const likePost = async (id)=>{
        const res = await axios.put("/post/likes",{postId:id},{headers:{"Authorization":"Bearer "+localStorage.getItem("jwt")}})
        setIsLike(!isLike)
    }
    const unlikePost = async (id)=>{
        const res = await axios.put("/post/unlikes",{postId:id},{headers:{"Authorization":"Bearer "+localStorage.getItem("jwt")}})
        setIsLike(!isLike)
    }

    const makeComment = async (text,postId)=>{
        const res = await axios.put("/post/comment",{text,postId},{headers:{"Authorization":"Bearer "+localStorage.getItem("jwt")}})
        setIsLike(!isLike)
    }

    const deletePost = async (postId)=>{
        const res = await axios.delete(`/post/deletepost/${postId}`)
    }

    // const deleteComment = async (commentId,postId)=>{
    //     const res = await axios.put(`http://localhost:8000/post/deletecomment`,{commentId,postId})
    //     console.log(res.data)
    // }


    return (
        <div className="home">
            <Navbar />
            {
                data.map(item => {
                    return (
                        <div className="card home-card" key={item._id} >
                            <h5 style={{ padding: "5px" }}>
                                {/* Navigating to other users profiles */}
                                {<Link to={item.postedBy?._id !== state._id ? "/profile/" + item.postedBy?._id : "/profile"}>
                                    {item.postedBy.name}
                                </Link> }
                                {/* deleting a post */}
                                {item.postedBy._id === state._id
                                &&
                                <i className="material-icons" 
                                    style={{float: "right"}}
                                    onClick={() => deletePost(item._id)}
                                >delete</i>
                                }
                            </h5>
                            <div className="card-image">
                                <img style={{ padding: "5px" }} 
                                    src={item.photo} alt="post" />
                            </div>
                            <div className="card-content">
                                {item.likes.includes(state._id)
                                ? 
                                    <i className="material-icons" style={{ color: "red" }}
                                        onClick={() => unlikePost(item._id)}
                                    >favorite</i>
                                : 
                                    <i className="material-icons" style={{ color: "red" }}
                                        onClick={() => likePost(item._id) }
                                    >favorite_border</i>
                                }


                                <h6>{item.likes?.length} likes</h6>
                                <h6>{item.title}</h6>
                                <p>{item.body}</p>
                                {
                                    item.comments.map(record => {
                                        return (
                                                <h6 key={record._id}><span style={{ fontWeight: "500" }}>{record.postedBy?.name}</span> {record.text}</h6>
                                                // {/* {record.postedBy._id === state._id
                                                // &&
                                                // <i className="material-icons" 
                                                //     style={{float: "right"}}
                                                //     onClick={() => deleteComment(record._id,item._id)}
                                                // >delete</i>
                                                // } */}  
                                        )
                                    })
                                }
                                <form onSubmit={(e) => {
                                    e.preventDefault()
                                    makeComment(e.target[0].value, item._id)
                                }}>
                                    <input type="text" placeholder="add a comment" />
                                </form>

                            </div>
                        </div>
                    )
                })
            }


        </div>
    )
}

export default Home
