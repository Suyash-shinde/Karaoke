import React from 'react';
import styles from './Register2.module.css';

export const Register2 = () => {
  return (
    <>
    <div className={styles.bg}>
      <img src="/src/assets/bg.jpg" className={styles.img}></img>
      <div className={styles.formWrapper}>
        <img src="/src/assets/karaless.png" className={styles.logo}></img>
        <div className={styles.username}></div>
        <div className={styles.password}></div>
        <div className={styles.password}></div>
        <div className={styles.phoneNumber}></div>
      </div>
    </div>
    </>
  )
}
