import React from 'react'
import { useNavigate } from 'react-router-dom';
import axios from "axios";
import {logoutRoute} from "../../utils/APIroutes.js"
import {toast, ToastContainer} from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import { toastOptions } from '../../utils/ToastCss.js';
import { logout } from '../../utils/Api.post.js';


export const Home = () => {
  const navigate=useNavigate();
  const onLogout = async()=>{
    const {data}= await logout();
    if(data.status===false){
      toast.error(data.msg,toastOptions);
      console.log(data.error);
    }
    else{
      toast(data.msg);
      navigate("/");
    }
  }
  return (
    <>
    <button onClick={onLogout}>Logout</button>
    <ToastContainer/>
    </>
  )
}
