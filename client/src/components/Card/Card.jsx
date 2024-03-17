import React from 'react'
import styles from './Card.module.css'
import { useNavigate } from 'react-router-dom'
export const Card = ({room}) => {
  const navigate=useNavigate();

  return (
    <>
        <div onClick={()=>{
            navigate(`/room/${room._id}`)
          }}
         className={styles.card}>
          <div className={styles.title}>{room.title}</div>
          <div className={styles.owner}>{room.owner.username}</div>
        </div>
    </>
  )
}
