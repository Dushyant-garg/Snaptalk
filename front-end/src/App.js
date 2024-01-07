import { BrowserRouter, Route, Routes, useNavigate } from 'react-router-dom';
import './App.css';
import Home from './components/screens/Home';
import Signup from './components/screens/Signup';
import Profile from './components/screens/Profile';
import SignIn from './components/screens/SignIn';
import CreatePost from './components/screens/CreatePost';
import UserProfile from './components/screens/UserProfile';
import { useContext, useEffect, useReducer } from 'react';
import { INITIAL_STATE, UserContext, reducer } from './reducer/userReducer';

const Routing = ()=>{
  const {dispatch} = useContext(UserContext)
  const navigate = useNavigate()
  
  useEffect(()=>{
    const user = JSON.parse(localStorage.getItem("user"))
    if(user){
      dispatch({type:"USER",payload:user})
      // navigate("/")
    }
    else{
      navigate("/signin")
    }
  },[])

  return (
    <>
      <Routes>
        <Route path="/" element={<Home/>}/>
        <Route path="/profile" element={<Profile/>}/>
        <Route path="/signup" element={<Signup/>}/>
        <Route path="/signin" element={<SignIn/>}/>
        <Route path="/create" element={<CreatePost/>}/>
        <Route path="/profile/:userId" element={<UserProfile/>}/>
      </Routes>
    </>
  )
}

function App() {
  const [state,dispatch] = useReducer(reducer,INITIAL_STATE)
  return (
    <UserContext.Provider value={{state,dispatch}}>
      <BrowserRouter>
        <Routing/>
      </BrowserRouter>
    </UserContext.Provider>
  );
}

export default App;
