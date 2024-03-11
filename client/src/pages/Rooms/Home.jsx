import React from 'react'
import { Navigate } from 'react-router-dom';
import axios from "axios";
import {logoutRoute} from "../../utils/APIroutes.js"
import {toast, ToastContainer} from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import { toastOptions } from '../../utils/ToastCss.js';


export const Home = () => {
  const onLogout = async(e)=>{
    const {data}=await axios.post(logoutRoute,{},{withCredentials:true});
    if(data.status===false){
      toast.error(data.msg,toastOptions);
    }
    else{
      toast(data.msg);
      Navigate("/");
    }
  }
  return (
    <>
    <button onClick={(e)=>onLogout(e)}>Logout</button>
    <ToastContainer/>
    </>
  )
}
