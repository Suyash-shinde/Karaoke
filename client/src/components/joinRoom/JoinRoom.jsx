import React, { useEffect, useState } from 'react'
import styles from './JoinRoom.module.css';
import { createRoom } from '../../utils/Api.post';
import {useSelector} from 'react-redux';
import {toast, ToastContainer} from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import { toastOptions } from '../../utils/ToastCss.js';
export const JoinRoom = ({onClose,onrefresh}) => {
    const [title,setTitle]=useState('');
    const user = useSelector((state) => state.auth.user);
    const validate=()=>{
        if(title===''){
            toast.error("Room Name should be more than 3 characters");
            return false;
        }
        return true;
    }
    const createNewRoom = async()=>{
        if(validate){
            const {data} = await createRoom({
                title,
                type,
                user,
            })
            if(data.status===true){
                toast(data.msg);
                onClose();
                onrefresh();
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
                            Enter Room Name
                </h3>
                <input className={styles.title}
                placeholder='Room Name'
                name='title'
                onChange={(e) => setTitle(e.target.value)}>
                </input>
            </div>
            <div className={styles.footer}>
                <div className={styles.submit}>
                    <button className={styles.submitButton} onClick={createNewRoom}>Create</button>
                </div>
            </div>
        </div>
        <ToastContainer/>
    </div>
  )
}
