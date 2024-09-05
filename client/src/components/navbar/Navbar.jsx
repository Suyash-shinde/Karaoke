import React from 'react'
import styles from './Navbar.module.css';
import { useSelector } from 'react-redux';
const Navbar = ({logout}) => {
  const user = useSelector((state)=>state.auth.user);
  const img=user.avatar;
  console.log(user);
  return (
    <>
    <nav className={styles.container}>
        <img src="/src/assets/karaless.png" className={styles.menu}></img>
        <img src={img} className={styles.pfp}></img>
        <div className={styles.logoutContainer}>
          <button className={styles.logout} onClick={logout}>logout</button>
        </div>
    </nav>
    </>
  )
}

export default Navbar