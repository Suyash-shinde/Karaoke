import React, { useEffect, useState } from 'react'
import styles from './JoinRoom.module.css';
import { createRoom, joinRoomPost } from '../../utils/Api.post';
import {useSelector} from 'react-redux';
import {toast, ToastContainer} from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import { toastOptions } from '../../utils/ToastCss.js';
import { useNavigate } from 'react-router-dom';
export const JoinRoom = ({onClose,onrefresh}) => {
    const [title,setTitle]=useState('');
    const user = useSelector((state) => state.auth.user);
    const Navigate = useNavigate();
    const validate=()=>{
        if(title.length()<6){
            toast.error("Room Code should be 6 characters");
            return false;
        }
        return true;
    }
    const joinNewRoom = async()=>{
        if(validate){
            const {data} = await joinRoomPost({
                code:title
            });
            if(data.status===true){
                toast(data.msg);
                onClose();

                Navigate(`/room/${data.room._id}`,{state:{isOwner:false,room:data.room}});
            }
            else{
                toast(data.msg);
            }
        }
    }
  return (
    <div className={styles.mask} >
        <div className={styles.body}>
            <div className={styles.close}>
                <button className={styles.closeButton} onClick={onClose}>X</button>
            </div>
            <div className={styles.header}>
                <h3 className={styles.heading}>
                            Enter Room Code
                </h3>
                <input className={styles.title}
                placeholder='Room Name'
                name='title'
                onChange={(e) => setTitle(e.target.value)}>
                </input>
            </div>
            <div className={styles.footer}>
                <div className={styles.submit}>
                    <button className={styles.submitButton} onClick={joinNewRoom}>Create</button>
                </div>
            </div>
        </div>
        <ToastContainer/>
    </div>
  )
}
