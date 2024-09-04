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
import {useDispatch} from 'react-redux';
import {unsetAuth} from '../../store/authSlice.js'
import Navbar from '../../components/navbar/Navbar.jsx';
import { JoinRoom } from '../../components/joinRoom/JoinRoom.jsx';
export const Home = () => {
  const [showCreate, setShowCreate] = useState(false);
  const [showJoin, setShowJoin] = useState(false);
  const [rooms,setRooms] = useState([]);
  const dispatch = useDispatch();
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
      dispatch(unsetAuth());
      navigate("/");
    }
  }
  const handleCreateOnclick=()=>{
    setShowCreate(true);
    
  }
  const handleJoinOnclick=()=>{
    setShowJoin(true);
    
  }
  return (
    <>
    <Navbar logout={onLogout}></Navbar>
    
      <div className={styles.bg}>
        <div className={styles.topContainer}>
          <div className={styles.searchBox}>
            <input className={styles.search}
            placeholder='Search'
            name='search'>
            </input>
            <img src='/src/assets/search.png' className={styles.searchSubmit}></img>
          </div>
          <div className={styles.buttons}>
          <button className={styles.create} onClick={handleCreateOnclick}>Create new Room </button>
          <button className={styles.join} onClick={handleJoinOnclick}>Join Private Room</button>
          </div>
        </div>
      <div className={styles.roomList}>
      {rooms.map((room)=>(
        <Card key={room._id} room={room}></Card>
      ))}
      </div>
      <ToastContainer/>
   </div>
   {showCreate && <CreateRoom onrefresh={()=>fetchRooms()} onClose={()=>setShowCreate(false)}/>}
    {showJoin && <JoinRoom onrefresh={()=>fetchRooms()} onClose={()=>setShowJoin(false)}/>}
    </>
  )
}
