import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom';
import styles from './Register1.module.css';
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
    const handleNext= async (event) =>{
      event.preventDefault();
      console.log(mail);
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
