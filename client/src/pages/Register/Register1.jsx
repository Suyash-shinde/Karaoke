import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom';
import styles from './Register1.module.css';
import axios from "axios"; 
import { registerRoute } from '../../utils/APIroutes.js';
import {toast, ToastContainer} from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import { toastOptions } from '../../utils/ToastCss.js';

export const Register1 = () => {
    const [mail,setMail]=useState({
      email:"",
    })
    const Navigate=useNavigate();
    const handleChange=(event)=>{
      setMail({...mail, [event.target.name]:event.target.value});
    }
    const validate=(mail)=>{
        var regex = /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/;
        return regex.test(mail.email);
    }
    const handleValidation=(mail)=>{
      if(!validate(mail)){
        toast.error("Invalid Email", toastOptions);
        return false;
      }
      else if (mail.email === "") {
        toast.error("Email is required.", toastOptions);
        return false;
      }
      return true;
    }
    const handleNext= async (event) =>{
      event.preventDefault();
      if(handleValidation(mail)){
        const email=mail.email;
      const {data} = await axios.post(registerRoute,{
        email,
      });
      if(data.status===false){
        toast.error(data.msg, toastOptions);
      }
      if (data.status === true) {
        toast("regitered")
        sessionStorage.setItem("email",data.email);
        Navigate("/auth");
      }
      }
      
    }
  return (
    <>
     <div className={styles.bg}>
      <img src="/src/assets/bg.jpg" className={styles.img}></img>
      <div className={styles.formWrapper}>
        <img src="/src/assets/karaless.png" className={styles.logo}></img>
        <div className={styles.inputField}>
            Enter Your Email Address.
            <input className={styles.input}
            type='text'
            placeholder='Email Address'
            name='email'
            onChange={(e)=>handleChange(e)}
            ></input>
            Already have an account?<Link  to="/">Login.</Link>
        </div>
        <div className={styles.submit}>
            <button className={styles.button} onClick={(event)=> handleNext(event)}>Next</button>
        </div>
      </div>
    </div>
    <ToastContainer/>
    </>
  )
}
