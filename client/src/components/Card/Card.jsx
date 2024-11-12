import React from 'react'
import styles from './Card.module.css'
import { useNavigate } from 'react-router-dom'
export const Card = ({room}) => {
  const navigate=useNavigate();

  return (
    <>
        <div onClick={()=>{
               // navigate.navigate("/roomloading", {room: room._id})

            navigate(`/room/${room._id}`,{state:{room:room, isOwner:false}});
          }}
         className={styles.card}>
          <div className={styles.title}>{room.title}</div>
          <div className={styles.imgContainer}>
            <img src={room.owner.avatar} className={styles.img}></img>
          </div>
          <div className={styles.owner}>{room.owner.username}</div>
        </div>
    </>
  )
}
