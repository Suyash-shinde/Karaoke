import React from 'react'
import styles from './Login.module.css'
import {Link} from "react-router-dom"

export const Login = () => {
  return (
    <>
    <div className={styles.contain}>
    <span className={styles.img}>
        <img src="/src/assets/bg.jpg" alt="bg" className={styles.image}/>
        <img src="/src/assets/karaless.png" className={styles.logoImage}></img>
        <div className={styles.card}>
          <h1>
          "Where Every Voice Finds Its Stage!"
          </h1>
          <p className={styles.intro}>
        Sing your heart out and unleash your inner superstar with Karaless! 
        Get ready to hit the high notes, belt out your favorite tunes, and create unforgettable
         memories with friends and family. Whether you're a seasoned performer or a first-time crooner,
          our extensive library of songs has something for everyone. Join our vibrant community, 
          ignite the stage, and let the music be your guide. Welcome to the ultimate karaoke experience!
          </p>
        </div>
    </span>
    <span className={styles.form}>
        <div className={styles.formWrapper}>
        <img src="/src/assets/karaless.png" className={styles.logoImage2}></img>
             <div className={styles.wrapper}>
             
              <div className={styles.loginText}>
                  LOGIN
              </div>
              <div className={styles.inputField1}>
                  <input className={styles.input}
                  type='text'
                  placeholder='Username'
                  name='userName'
                  />
                <input className={styles.input}
                    type='text'
                    placeholder='Password'
                    name='Password'
                    />
              </div>
             </div>
             <div className={styles.lastline}>
                <div className={styles.lastButton}>
                <button className={styles.loginButton}>Login</button>
                </div>
                <div className={styles.lastText}>
                Don't have an account? <Link to="/register">Register here.</Link>
                </div>
             </div>
        </div>
    </span>
    </div>
    </>
  )
}
