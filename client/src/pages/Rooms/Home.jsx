import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom';
import axios from "axios";
import {logoutRoute} from "../../utils/APIroutes.js"
import {toast, ToastContainer} from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import { toastOptions } from '../../utils/ToastCss.js';
import { getAllRooms, logout } from '../../utils/Api.post.js';
import {Card} from '../../components/Card/Card.jsx';
import styles from './Home.module.css'
import { CreateRoom } from '../../components/createRoom/CreateRoom.jsx';
export const Home = () => {
  const [showCreate, setShowCreate] = useState(false);
  const [rooms,setRooms] = useState([]);
  
  const navigate=useNavigate();
  const fetchRooms = async()=>{
    const {data} = await getAllRooms();
    setRooms(data.rooms);
  }
  useEffect(()=>{
    fetchRooms();
  },[]);
  
  const onLogout = async()=>{
    const {data}= await logout();
    if(data.status===false){
      toast.error(data.msg,toastOptions);
      console.log(data.error);
    }
    else{
      toast(data.msg);
      navigate("/");
    }
  }
  const handleOnclick=()=>{
    setShowCreate(true);
    
  }
  return (
    <>
      <div className={styles.bg}>
      <button onClick={onLogout}>Logout</button>
      <button onClick={handleOnclick}>Create new Room</button>
      <div className={styles.roomList}>
      {rooms.map((room)=>(
        <Card key={room._id} room={room}></Card>
      ))}
      </div>
      <ToastContainer/>
   </div>
   {showCreate && <CreateRoom onrefresh={()=>fetchRooms()} onClose={()=>setShowCreate(false)}/>}
    </>
  )
}
