import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom';
import styles from './Register1.module.css';
import axios from "axios"; 
import { registerRoute } from '../../utils/APIroutes.js';


export const Register1 = () => {
    const [mail,setMail]=useState({
      email:"",
    })
    const Navigate=useNavigate();
    function handleClick(){
        Navigate("/auth");
    }
    const handleChange=(event)=>{
      setMail({...mail, [event.target.name]:event.target.value});
    }
    const validate=(mail)=>{
        var regex = /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/;
        return regex.test(mail.email);
    }
    const handleNext= async (event) =>{
      event.preventDefault();
      if(!validate(mail)){
        console.log("Invalid mail");
      }
      const email=mail.email;
      const {data} = await axios.post(registerRoute,{
        email,
      });
      if(data.status===false){
        console.log(data.msg);
      }
      if (data.status === true) {
        console.log("resgistered");
        sessionStorage.setItem("email",data.email);
        Navigate("/auth");
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
    </>
  )
}
