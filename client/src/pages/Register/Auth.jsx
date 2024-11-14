import React, { useState, useRef} from 'react'
import { Link, useNavigate } from 'react-router-dom';
import styles from './Auth.module.css';
import axios from "axios"; 
import { authRoute } from '../../utils/APIroutes';
import {toast, ToastContainer} from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import { toastOptions } from '../../utils/ToastCss.js';

import bg from "../../assets/bg.jpg";
import logo from "../../assets/karaless.png";
export const Auth = () => {
  const [otp,setOtp]=useState(new Array(6).fill(''));
  const Navigate=useNavigate();  const otpInputs = useRef([]);
  for (var i = 0; i < 6; i++) {
    otpInputs.current[i] = useRef(null);
  }
  const handleOtpChange = (e, index) => {
    const newOtp = [...otp];
    newOtp[index] = e.target.value;
    setOtp(newOtp);
  
  
    if (e.target.value !== '' && index < otp.length - 1 && otpInputs.current[index + 1].current) {
      otpInputs.current[index + 1].current.focus();
    }
  };
  const handleKeyDown = (e, index) => {
    if (e.key === 'Backspace' && index > 0) {
      otpInputs.current[index - 1].current.focus();
    }
  };
  const handleVerify= async(event)=>{
    event.preventDefault();
    var response="";
    for(var i =0;i<6;i++){
      response+=otp[i];
    }
    const {data}= await axios.post(authRoute,{
      email:sessionStorage.getItem("email"),
      response,
    })
    if(data.status===false){
      toast.error(data.msg, toastOptions);
    }
    if (data.status === true) {
      toast("registered")
      
      Navigate("/details");
    }

  }
  return (
    <>
     <div className={styles.bg}>
      <img src={bg} className={styles.img}></img>
      <div className={styles.formWrapper}>
        <img src={logo} className={styles.logo}></img>
        <div  className={styles.text}> Enter the One Time Password </div>
        <form id="otp-form" className={styles.otpInput}>
          {otp.map((char, index)=>(
            <input className={styles.inp}
            type='text'
            maxLength={1}
            key={index}
            ref={otpInputs.current[index]}
            value={char}
            onChange={(e)=>{ handleOtpChange(e, index)}}
            onKeyDown={(e) => handleKeyDown(e, index)}/>
          ))}
        </form>
        <div className={styles.submit}>
            <button className={styles.button} onClick={(event)=> handleVerify(event)}>Next</button>
        </div>
      </div>
    </div>
    <ToastContainer/>
    </>
  )
}
