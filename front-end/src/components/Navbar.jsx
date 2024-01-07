import React, { useContext } from 'react'
import {Link, useNavigate} from "react-router-dom"
import { UserContext } from '../reducer/userReducer'
const Navbar = () => {
    const navigate = useNavigate()
    const {state,dispatch} = useContext(UserContext)
    return (
        <nav>
            <div className="nav-wrapper white">
            <Link to={state?"/":"/signin"} className="brand-logo left">Snaptalk</Link>
            <ul id="nav-mobile" className="right">
                {state ? 
                    <>
                        <li><Link to="/profile">Profile</Link></li>
                        <li><Link to="/create">Create Post</Link></li>
                        <li>
                            <button 
                                className="btn #c62828 red darken-3"
                                onClick={()=>{  
                                    localStorage.clear()
                                    dispatch({type:"LOG_OUT"})
                                    // window.location.reload()
                                    navigate("/signin")
                                }}
                            >
                                Logout
                            </button>
                        </li>
                    </>:
                    <>
                        <li><Link to="/signin">Login</Link></li>
                        <li><Link to="/signup">Sign up</Link></li>
                    </>
                }
            </ul>
            </div>
        </nav>
    )
}

export default Navbar
