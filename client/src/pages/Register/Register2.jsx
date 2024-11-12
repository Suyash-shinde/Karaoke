      import React, { useState } from 'react';
import styles from './Register2.module.css';
import {toast, ToastContainer} from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import { toastOptions } from '../../utils/ToastCss.js';
import {detailsRoute} from '../../utils/APIroutes.js';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

export const Register2 = () => {
  const [user,setUser]=useState({
    username:"",
    email:"",
    password:"",
    confimPassword:""
  })
  const Navigate = useNavigate();
  const handleChange=(event)=>{
    setUser({...user, [event.target.name]:event.target.value});
  }
  const validate=()=>{
    const{ username, password, confirmPassword }=user;
    if(password!==confirmPassword){
      toast.error("Password and confirm Password Should be same",toastOptions);
      return false;
    }
    else if(username.length<3){
      toast.error("Username Should be atleast 3 characters long",toastOptions);
      return false;
    }
    else if(password===""){
      toast.error("Password should be atleast 8 characters long",toastOptions);
      return false;
    }
    return true;
  }
  const handleSubmit=async(event)=>{
    event.preventDefault();
    if(validate()){
      const{username,password}=user;
      const {data}= await axios.post(detailsRoute, {
        username,
        password,
        email:sessionStorage.getItem("email"),
      })
      if(data.status===false){
        toast.error(data.msg);
      }
      if(data.status===true){
        toast(data.msg);
        sessionStorage.clear();
        Navigate("/home",{state:{leaving:false}})
      }
    }
  }
  return (
    <>
    <div className={styles.bg}>
      <img src="/src/assets/bg.jpg" className={styles.img}></img>
      <div className={styles.formWrapper}>
        <img src="/src/assets/karaless.png" className={styles.logo}></img>
        <div className={styles.input}>
          <input className={styles.inp}
          type='text'
          name='username'
          placeholder='Username'
          onChange={(e)=> handleChange(e)}/>

          <input className={styles.inp}
          type="password"
          name='password'
          placeholder='Password'
          onChange={(e)=> handleChange(e)}/>

          <input className={styles.inp}
          type="password"
          name='confirmPassword'
          placeholder='Confirm Password'
          onChange={(e)=> handleChange(e)}/>

        </div>
        <div className={styles.submit}>
          <button className={styles.button} onClick={(e)=>handleSubmit(e)} >submit</button>
        </div>
      </div>
    </div>
    <ToastContainer/>
    </>
  )
}
