import { createContext } from "react";

export const UserContext = createContext();

export const INITIAL_STATE = null

export const reducer = (state,action)=>{
    switch(action.type){
        case "USER":
            return action.payload

        case "LOG_OUT":
            return null

        case "UPDATE":
            return {
                ...state,
                followers: action.payload.followers,
                following: action.payload.following,
            }
        
        case "UPDATE_PIC":
            return {
                ...state,
                pic: action.payload
            }
        default:
            return state 
    }
}