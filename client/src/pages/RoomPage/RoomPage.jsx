import React, { useEffect, useState } from 'react'
import {useParams, useNavigate} from 'react-router-dom';
import { getRoom } from '../../utils/Api.post';
export const RoomPage = () => {
    const{id:roomId} = useParams();
    const [room, setRoom]=useState(null);
    const navigate= useNavigate();
    useEffect(()=>{
      const fetchRoom=async()=>{
        console.log(roomId);
        const {data} = await getRoom(roomId);
        console.log(data);
        setRoom((prev)=>data);
      };
      fetchRoom();
    },[roomId])
  return (
    <div>RoomPage</div>
  )
}
