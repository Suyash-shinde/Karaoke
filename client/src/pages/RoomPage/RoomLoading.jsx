import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom';
import { getRoom } from '../../utils/Api.post';

const RoomLoading = ({route}) => {
    const navigate= useNavigate();
    useEffect(()=>{
        setTimeout(()=>{
            navigate("/home");
        },1000)
    },[])
     return (
    <div>Leaving</div>
  )
}

export default RoomLoading
