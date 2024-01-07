import React, { useContext, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import Navbar from '../Navbar'
import M from "materialize-css"
import axios from 'axios'
import { UserContext } from '../../reducer/userReducer'

const SignIn = () => {
    const {dispatch} = useContext(UserContext)

    const [credentials, setCredentials] = useState({
        name:"",
        password:""
    })
    const handleChange = (e)=>{
        setCredentials((prev)=>({...prev, [e.target.name] : e.target.value}))
    }
    const navigate = useNavigate()

    const postData = async ()=>{
        try {

            const res = await axios.post("/auth/signin",credentials)

            localStorage.setItem("jwt",res.data.token)
            localStorage.setItem("user",JSON.stringify(res.data.existUser) )

            dispatch({type:"USER",payload:res.data.existUser})

            M.toast({html:"Logged in successfully",classes:"#43a047 green darken-1"})
            navigate("/")

        } catch (error) {
            M.toast({html:error.message, classes:"#c62828 red darken-2"})
            console.log(error)
        }
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
                    type="password"
                    placeholder="password"
                    name="password"
                    onChange={handleChange}
                />
                <button 
                    className="btn waves-effect waves-light #64b5f6 blue darken-1"
                    onClick={() => postData()}
                >
                    Login
                </button>
                <h5>
                    <Link to="/signup">Dont have an account ?</Link>
                </h5>
                {/* <h6>
                    <Link to="/reset">Forgot password ?</Link>
                </h6> */}

            </div>
        </div>
    )
}

export default SignIn
