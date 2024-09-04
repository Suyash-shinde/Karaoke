import React from 'react'
import styles from './Navbar.module.css';

const Navbar = ({logout}) => {
  return (
    <>
    <nav className={styles.container}>
        <img src="/src/assets/karaless.png" className={styles.menu}></img>
        <div className={styles.logoutContainer}>
          <button className={styles.logout} onClick={logout}>logout</button>
        </div>
    </nav>
    </>
  )
}

export default Navbar