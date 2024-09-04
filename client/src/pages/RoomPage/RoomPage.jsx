import React, { useEffect, useState } from 'react'
import {useParams, useNavigate} from 'react-router-dom';
import { getRoom } from '../../utils/Api.post';
import { useSelector } from 'react-redux';
import { useWebRTC } from '../../hooks/useWebRTC';
export const RoomPage = () => {
    const{id:roomId} = useParams();
    const user = useSelector((state)=>state.auth.user);
    const [room, setRoom]=useState(null);
    const navigate= useNavigate();

    const {clients, provideRef}=useWebRTC(roomId,user);
  
    useEffect(()=>{
      const fetchRoom=async()=>{
        const {data} = await getRoom(roomId);
        console.log(data);
        setRoom((prev)=>data);
      };
      fetchRoom();
    },[roomId])
  return (
    <div>
      <div>
        {clients?.map((client)=>{
          return(
            <div key={client.id}>
              <audio 
                ref={(instance)=>provideRef(instance,client.id)}
                controls
                autoPlay></audio>
                <h4>{client.username}</h4>
            </div>
          )
          
        })}
      </div>
      <button >Leave</button>
    </div>
  )
}
