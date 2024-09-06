import React, { useEffect, useState } from 'react'
import styles from './CreateRoom.module.css';
import { createRoom } from '../../utils/Api.post';
import {useSelector} from 'react-redux';
import {toast, ToastContainer} from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import { toastOptions } from '../../utils/ToastCss.js';
import { useNavigate } from 'react-router-dom';
export const CreateRoom = ({onClose,onrefresh}) => {
    const [type,setType]=useState('open');
    const [title,setTitle]=useState('');
    const user = useSelector((state) => state.auth.user);
    const Navigate = useNavigate();
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
                Navigate(`/room/${data.room._id}`);
            }
            else{
                toast(data.msg);
            }
        }
    }
  return (
    <div className={styles.mask}>
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
                <h4> Room Type</h4>
                <div className={styles.type}>
                    <div 
                        onClick={()=>setType('open')}
                        className={`${styles.typeBox} ${
                            type==='open' ? styles.active : ''
                        }`}>
                        <span>Open</span>
                    </div>
                    <div 
                        onClick={()=>setType('private')}
                        className={`${styles.typeBox} ${
                            type==='private' ? styles.active : ''
                        }`}>
                        <span>Private</span>
                    </div>
                </div>
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
